import { IDFSAnalyzer, ISearchTask, EdgeVisitEnum, IEdge } from "./Graph";
import { range } from "dabbjs/dist/lib/misc";
import { fillChar, formatNumber, padStr } from "dabbjs/dist/lib/strings";

export abstract class BaseAnalyzer implements IDFSAnalyzer {

	protected dfs: ISearchTask;

	abstract directed: boolean;

	constructor(public name: string) { }

	public register(dfs: ISearchTask): void {
		this.dfs = dfs;
	}

	public endTree(v: number, w: number) { /* */ }

	abstract visit(v: number, w: number, e: EdgeVisitEnum): void;

	public report() {
		console.log();
		console.log(this.name)
	}

}

export abstract class UndirectedBaseAnalyzer extends BaseAnalyzer {

	public get directed(): boolean { return false }

}

export class BridgeAnalyzer extends UndirectedBaseAnalyzer {

	low: number[];
	bridges: IEdge[];
	articulationPoints: number[];

	constructor() {
		super("Bridge Analyzer");
	}

	public register(dfs: ISearchTask): void {
		super.register(dfs);
		this.bridges = [];
		this.articulationPoints = [];
		this.low = new Array<number>(this.dfs.nodes).fill(-1)
	}

	public endTree(v: number, w: number) {
		super.endTree(v, w);

		if (this.low[v] > this.low[w])
			this.low[v] = this.low[w];

		if (v != w) {
			if (this.low[w] > this.dfs.pre[v]) {
				this.articulationPoints.push(w);
				this.articulationPoints.push(v);
			} else if (this.low[w] == this.dfs.pre[v] && this.low[v] != this.low[w]) {
				this.articulationPoints.push(v);
			}

			if (this.low[w] == this.dfs.pre[w]) {
				this.bridges.push({ v: v, w: w });
			}
		}

	}

	public visit(v: number, w: number, e: EdgeVisitEnum) {
		switch (e) {
			case EdgeVisitEnum.tree:
				this.low[w] = this.dfs.pre[w];
				break;
			case EdgeVisitEnum.parent:
			case EdgeVisitEnum.down:
				break;
			case EdgeVisitEnum.back:
				if (this.low[v] > this.dfs.pre[w])
					this.low[v] = this.dfs.pre[w];
				break;
		}
	}

	public report() {
		super.report();
		let
			label = (node: number): string => this.dfs.g.nodeLabel(node),
			biggest = Math.max.apply(null, this.dfs.g.nodeList().map(n => n.label().length)) + 1,
			header = `node: ${this.dfs.g.nodeList().map(n => padStr(n.label(), biggest)).join('  ')}`;
		console.log(this.bridges.length ? `${this.bridges.length} bridge(s)` : 'no bridges');
		this.bridges
			.forEach(e => console.log(`${label(e.v)}-${label(e.w)}`));
		console.log(this.articulationPoints.length ? `${this.articulationPoints.length} articulation point(s)` : 'no articulation points');
		console.log(this.articulationPoints
			.map(node => label(node))
			.join(', '));
		console.log(header);
		console.log(fillChar('-', header.length + 1));
		console.log(`low:  ${this.low.map(n => formatNumber(n, biggest)).join('  ')}`);
		if (this.dfs.g.labeled)
			console.log(`      ${this.low.map(n => padStr(this.dfs.g.nodeLabel(n), biggest)).join('  ')}`)
	}
}

export class CyclesAnalyzer extends UndirectedBaseAnalyzer {

	cycles: number[][];

	get count(): number { return this.cycles.length }

	constructor() {
		super("Cycles Analyzer");
	}

	public register(dfs: ISearchTask): void {
		super.register(dfs);
		this.cycles = new Array()
	}

	public visit(v: number, w: number, e: EdgeVisitEnum) {
		if (e == EdgeVisitEnum.back) {
			let
				array: number[] = [v, w],
				p = v;
			while ((p = this.dfs.st[p]) != w)
				array.unshift(p);
			array.unshift(w);
			this.cycles.push(array)
		}
	}

	public report() {
		super.report();
		console.log(` cycle(s): ${this.count}`);
		this.cycles.forEach(c => {
			console.log('  ' + c.join('-'));
		})
	}

}

//multi-analyzers
export abstract class BaseEdgeAnalyzer extends BaseAnalyzer {

	colSpaces: number[];
	edgeList: string[];
	stackTrace: string[];

	tabs = 4;
	spaces = 0;
	components = 0;
	maxLabelWidth = 0;

	constructor(name: string, public showStack?: boolean, public showInternals?: boolean, public showTreeEnd?: boolean) {
		super(name);
	}

	public register(dfs: ISearchTask): void {
		super.register(dfs);
		this.colSpaces = new Array(this.dfs.g.size).fill(-1);
		this.edgeList = [];
		this.stackTrace = [];
		this.spaces = 0;
	}

	protected appendLine(edgeStr: string, stackStr: string) {
		this.edgeList.push(edgeStr);
		this.showStack
			&& this.stackTrace.push(stackStr);
	}

	public endTree(v: number, w: number) {
		super.endTree(v, w);
		if (this.showTreeEnd) {
			let
				s = this.colSpaces[w] * this.tabs,
				nv = this.dfs.g.nodeLabel(v),
				nw = this.dfs.g.nodeLabel(w);
			this.appendLine(`${fillChar(' ', s)}[${nw}] tree analized as:(${nv}-${nw})`, '');
		}
	}

	public visit(v: number, w: number, e: EdgeVisitEnum) {
		let
			nv = this.dfs.g.nodeLabel(v),
			nw = this.dfs.g.nodeLabel(w),
			isRoot = false;
		if (this.colSpaces[v] < 0)
			this.colSpaces[v] = 0;
		if (e == EdgeVisitEnum.tree) {
			this.colSpaces[w] = this.colSpaces[v] + 1;
			if (v == w) {
				isRoot = true;
				this.appendLine(`component: ${++this.components}`, '');
				this.appendLine(`[${w}] start tree`, '');
			}
		}
		this.spaces = this.colSpaces[v] * this.tabs;
		this.appendLine(`${fillChar(' ', isRoot ? 0 : this.spaces)}(${nv}-${nw}) ${EdgeVisitEnum[e]}`,
			this.showStack ? `[${this.dfs.edges().map(e => `${e.v}-${e.w}`).join(', ')}]` : '');
	}

	public report() {
		super.report();
		let
			w = this.showStack ? Math.max.apply(null, this.edgeList.map(s => s.length)) : 0;
		this.edgeList.map((s, ndx) => {
			if (!this.showStack)
				return s;
			return s + padStr(' ', w - s.length + 5) + this.stackTrace[ndx]
		})
			.forEach(s => console.log(s))
		if (this.showInternals) {
			this.maxLabelWidth = Math.max.apply(null, this.dfs.g.nodeList().map(n => n.label().length)) + 1;
			let
				header = `node: ${range(0, this.dfs.nodes).map(n => formatNumber(n, this.maxLabelWidth)).join('  ')}`;
			console.log();
			console.log(header);
			console.log(fillChar('-', header.length + 1));
			console.log(`pre:  ${this.dfs.pre.map(n => formatNumber(n, this.maxLabelWidth)).join('  ')}`);
			console.log(`st:   ${this.dfs.st.map(n => formatNumber(n, this.maxLabelWidth)).join('  ')}`);
		}
	}

}

export class EdgeAnalyzer extends BaseEdgeAnalyzer {

	public get directed(): boolean { return false }

	constructor(public showStack?: boolean, public showInternals?: boolean, public showTreeEnd?: boolean) {
		super("Edge Analyzer", showStack, showInternals, showTreeEnd);
	}

}

export abstract class BaseComponentAnalyzer extends BaseAnalyzer {

	count: number;
	components: number[];

	public register(dfs: ISearchTask): void {
		super.register(dfs);
		this.count = 0;
		this.components = new Array(this.dfs.g.size).fill(-1);
	}

	public visit(v: number, w: number, e: EdgeVisitEnum) {
		if (e == EdgeVisitEnum.tree) {
			if (v == w)
				this.count++;
			this.components[w] = this.count
		}
	}

	public report() {
		super.report();
		let
			maxLabelWidth = String(this.dfs.nodes).length + 1,
			header = `node: ${range(0, this.dfs.nodes).map(n => formatNumber(n, maxLabelWidth)).join('  ')}`;
		console.log(`component(s): ${this.count}`);
		console.log(header);
		console.log(fillChar('-', header.length + 1));
		console.log(`comp:  ${this.components.map(n => formatNumber(n, maxLabelWidth)).join('  ')}`);
	}
}

export class ComponentAnalyzer extends BaseComponentAnalyzer {

	public get directed(): boolean { return false }

	constructor() {
		super("Component Analyzer");
	}
}