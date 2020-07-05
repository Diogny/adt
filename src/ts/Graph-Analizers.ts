import { IDFSAnalizer, IDFSTask, DFSVisitEdge } from "./Graph";

const padStr = (ch: string, len: number) => new Array(len).join(ch);
const pad = (s: string, width: number) => new Array(width - s.length).join(' ') + s;
export const range = (s: number, e: number) => Array.from('x'.repeat(e - s), (_, i) => s + i);

export abstract class BaseAnalizer implements IDFSAnalizer {
	dfs: IDFSTask;

	constructor(public name: string) {
	}

	public register(dfs: IDFSTask): void {
		this.dfs = dfs;
	}

	abstract start(node: number): void;

	abstract visit(v: number, w: number, e: DFSVisitEdge): void;

	public end() {
		console.log(this.name)
	}


}

export class EdgeAnalizer extends BaseAnalizer {

	edgeList: string[];
	stackTrace: string[];
	tabs = 4;
	colSpaces: number[];
	spaces = 0;
	components = 0;

	constructor(public showStack?: boolean, public showInternals?: boolean, public showTreeEnd?: boolean) {
		super("Edge Analizer");
		this.edgeList = [];
		this.stackTrace = [];
	}

	public register(dfs: IDFSTask): void {
		super.register(dfs);
		this.colSpaces = new Array(this.dfs.g.size).fill(-1);
	}

	public start(node: number) {
		this.edgeList.push(`component: ${this.components = this.dfs.cc()}, start: ${node}`);
		this.showStack
			&& this.stackTrace.push('');
	}

	public visit(v: number, w: number, e: DFSVisitEdge) {
		if (e == DFSVisitEdge.treeEnd) {
			if (this.showTreeEnd) {
				let
					s = this.colSpaces[w] * this.tabs;
				this.edgeList.push(`${padStr(' ', s)}[${w}] tree analized`);
				this.showStack
					&& this.stackTrace.push('');
			}
			return;
		}

		if (this.colSpaces[v] < 0)
			this.colSpaces[v] = 0;
		if (e == DFSVisitEdge.tree) {
			this.colSpaces[w] = this.colSpaces[v] + 1;
		}
		this.spaces = this.colSpaces[v] * this.tabs;
		this.edgeList.push(`${padStr(' ', this.spaces)}${v}-${w} ${DFSVisitEdge[e]}`);
		if (this.showStack) {
			this.stackTrace.push(`[${this.dfs.stack.items.map(e => `${e.v}-${e.w}`).join(', ')}]`)
		}
	}

	public end() {
		super.end();
		let
			w = this.showStack ? Math.max.apply(null, this.edgeList.map(s => s.length)) : 0;
		this.edgeList.map((s, ndx) => {
			if (!this.showStack)
				return s;
			return s + pad(' ', w - s.length + 5) + this.stackTrace[ndx]
		})
			.forEach(s => console.log(s))
		if (this.showInternals) {
			let
				s = pad("0", 2),
				formatNumber = (n: number) => pad(n + "", biggest),
				biggest = Math.max.apply(null, this.dfs.g.nodeList().map(n => n.label().length)) + 1,
				header = `node: ${range(0, this.dfs.nodes).map(formatNumber).join('  ')}`;

			console.log(header);
			console.log(padStr('-', header.length + 1));
			console.log(`pre:  ${this.dfs.pre.map(formatNumber).join('  ')}`);
			console.log(`st:   ${this.dfs.st.map(formatNumber).join('  ')}`);
		}
	}
}

export class BridgeAnalizer extends BaseAnalizer {

	low: number[];
	edgeList: string[];

	constructor() {
		super("Bridge Analizer");
		this.edgeList = [];
	}

	public register(dfs: IDFSTask): void {
		super.register(dfs);
		this.low = new Array<number>(this.dfs.nodes).fill(-1)
	}

	public visit(v: number, w: number, e: DFSVisitEdge) {
		switch (e) {
			case DFSVisitEdge.tree:
				this.low[w] = this.dfs.pre[w];
				break;
			case DFSVisitEdge.treeEnd:
				if (this.low[v] > this.low[w])
					this.low[v] = this.low[w];

				if (v != w && this.low[w] == this.dfs.pre[w]) {
					this.edgeList.push(`${v}-${w}`);
				}
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

	public start(node: number) {
		this.low[node] = this.dfs.timing();
	}

	public end() {
		super.end();
		this.edgeList.forEach(s => console.log(s));
		let
			biggest = Math.max.apply(null, this.dfs.g.nodeList().map(n => n.label().length)) + 1,
			formatNumber = (n: number) => pad(n + "", biggest),
			header = `node: ${range(0, this.dfs.nodes).map(formatNumber).join('  ')}`;
		console.log(header);
		console.log(padStr('-', header.length + 1));
		console.log(`low:  ${this.low.map(formatNumber).join('  ')}`)
	}
}

//bug for DiGraphs
export class CyclesAnalizer extends BaseAnalizer {

	cycles: number[][];

	get count(): number { return this.cycles.length }

	constructor() {
		super("Cycles Analizer");
		this.cycles = new Array()
	}

	public start(node: number) {

	}

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

	public end() {
		super.end();
		console.log(` cycle(s): ${this.count}`);
		this.cycles.forEach(c => {
			console.log('  ' + c.join('-'));
		})
	}

}