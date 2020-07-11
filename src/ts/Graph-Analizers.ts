import { IDFSAnalizer, ISearchTask, DFSVisitEdge } from "./Graph";
import { fillChar, padStr, range, formatNumber } from "./Utils";

export abstract class BaseAnalizer implements IDFSAnalizer {

	protected dfs: ISearchTask;

	abstract directed: boolean;

	constructor(public name: string) { }

	public register(dfs: ISearchTask): void {
		this.dfs = dfs;
	}

	abstract startTree(node: number): void;

	public endTree(v: number, w: number) { }

	abstract visit(v: number, w: number, e: DFSVisitEdge): void;

	public report() {
		console.log(this.name)
	}

}

export abstract class UndirectedBaseAnalizer extends BaseAnalizer {

	public get directed(): boolean { return false }

	constructor(name: string) {
		super(name);
	}
}

export class BridgeAnalizer extends UndirectedBaseAnalizer {

	low: number[];
	edgeList: string[];

	constructor() {
		super("Bridge Analizer");
		this.edgeList = [];
	}

	public register(dfs: ISearchTask): void {
		super.register(dfs);
		this.low = new Array<number>(this.dfs.nodes).fill(-1)
	}

	public startTree(node: number) {
		this.low[node] = this.dfs.timing();
	}

	public endTree(v: number, w: number) {
		super.endTree(v, w);
		if (this.low[v] > this.low[w])
			this.low[v] = this.low[w];

		if (v != w && this.low[w] == this.dfs.pre[w]) {
			this.edgeList.push(`${v}-${w}`);
		}
	}

	public visit(v: number, w: number, e: DFSVisitEdge) {
		switch (e) {
			case DFSVisitEdge.tree:
				this.low[w] = this.dfs.pre[w];
				break;
			case DFSVisitEdge.parent:
			case DFSVisitEdge.down:
				break;
			case DFSVisitEdge.back:
				if (this.low[v] > this.dfs.pre[w])
					this.low[v] = this.dfs.pre[w];
				break;
		}
	}

	public report() {
		super.report();
		this.edgeList.forEach(s => console.log(s));
		let
			biggest = Math.max.apply(null, this.dfs.g.nodeList().map(n => n.label().length)) + 1,
			header = `node: ${range(0, this.dfs.nodes).map(n => formatNumber(n, biggest)).join('  ')}`;
		console.log(header);
		console.log(fillChar('-', header.length + 1));
		console.log(`low:  ${this.low.map(n => formatNumber(n, biggest)).join('  ')}`)
	}
}

export class CyclesAnalizer extends UndirectedBaseAnalizer {

	cycles: number[][];

	get count(): number { return this.cycles.length }

	constructor() {
		super("Cycles Analizer");
		this.cycles = new Array()
	}

	public startTree(node: number) { }

	public visit(v: number, w: number, e: DFSVisitEdge) {
		if (e == DFSVisitEdge.back) {
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

//multi-analizer
export abstract class BaseEdgeAnalizer extends BaseAnalizer {

	edgeList: string[];
	stackTrace: string[];
	tabs = 4;
	colSpaces: number[];
	spaces = 0;
	components = 0;
	maxLabelWidth = 0;

	constructor(name: string, public showStack?: boolean, public showInternals?: boolean, public showTreeEnd?: boolean) {
		super(name);
		this.edgeList = [];
		this.stackTrace = [];
	}

	public register(dfs: ISearchTask): void {
		super.register(dfs);
		this.colSpaces = new Array(this.dfs.g.size).fill(-1);
	}

	protected appendLine(edgeStr: string, stackStr: string) {
		this.edgeList.push(edgeStr);
		this.showStack
			&& this.stackTrace.push(stackStr);
	}

	public startTree(node: number) {
		this.appendLine(`component: ${++this.components}`, '');
		this.appendLine(`[${node}] start tree`, '');
	}

	public endTree(v: number, w: number) {
		super.endTree(v, w);
		if (this.showTreeEnd) {
			let
				s = this.colSpaces[w] * this.tabs;
			this.appendLine(`${fillChar(' ', s)}[${w}] tree analized as:(${v}-${w})`, '');
		}
	}

	public visit(v: number, w: number, e: DFSVisitEdge) {
		if (this.colSpaces[v] < 0)
			this.colSpaces[v] = 0;
		if (e == DFSVisitEdge.tree) {
			this.colSpaces[w] = this.colSpaces[v] + 1;
		}
		this.spaces = this.colSpaces[v] * this.tabs;
		let
			nv = this.dfs.g.nodeLabel(v),
			nw = this.dfs.g.nodeLabel(w);
		this.appendLine(`${fillChar(' ', this.spaces)}(${nv}-${nw}) ${DFSVisitEdge[e]}`,
			this.showStack ? `[${this.dfs.edgePipe().map(e => `${e.v}-${e.w}`).join(', ')}]` : '');
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
			console.log(header);
			console.log(fillChar('-', header.length + 1));
			console.log(`pre:  ${this.dfs.pre.map(n => formatNumber(n, this.maxLabelWidth)).join('  ')}`);
			console.log(`st:   ${this.dfs.st.map(n => formatNumber(n, this.maxLabelWidth)).join('  ')}`);
		}
	}

}

export class EdgeAnalizer extends BaseEdgeAnalizer {

	public get directed(): boolean { return false }

	constructor(public showStack?: boolean, public showInternals?: boolean, public showTreeEnd?: boolean) {
		super("Edge Analizer", showStack, showInternals, showTreeEnd);
	}

}
