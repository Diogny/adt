import { DFSVisitEdge, ISearchTaskDirected } from "./Graph";
import { padStr, pad, range } from "./Utils";
import { BaseAnalizer } from "./Graph-Analizers";

export abstract class DirectedBaseAnalizer extends BaseAnalizer {

	protected dfs: ISearchTaskDirected;

	public get directed(): boolean { return true }

	public register(dfs: ISearchTaskDirected): void {
		this.dfs = dfs;
	}

}

export class DirectedEdgeAnalizer extends DirectedBaseAnalizer {
	edgeList: string[];
	stackTrace: string[];
	tabs = 4;
	colSpaces: number[];
	spaces = 0;
	components = 0;

	constructor(public showStack?: boolean, public showInternals?: boolean, public showTreeEnd?: boolean) {
		super("Directed Edge Analizer");
		this.edgeList = [];
		this.stackTrace = [];
	}

	public register(dfs: ISearchTaskDirected): void {
		super.register(dfs);
		this.colSpaces = new Array(this.dfs.g.size).fill(-1);
	}

	start(node: number): void {
		this.edgeList.push(`component: ${this.components = this.dfs.cc()}, start: ${node}`);
		this.showStack
			&& this.stackTrace.push('');
	}

	visit(v: number, w: number, e: DFSVisitEdge): void {
		if (e == DFSVisitEdge.treeEnd) {
			if (this.showTreeEnd) {
				let
					s = this.colSpaces[w] * this.tabs;
				this.edgeList.push(`${padStr(' ', s)}[${w}] tree analized as:(${v}-${w})`);
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
		let
			labeled = this.dfs.g.labeled,
			g = this.dfs.g,
			nv = labeled ? g.node(v)?.label() : v,
			nw = labeled ? g.node(w)?.label() : w;
		this.edgeList.push(`${padStr(' ', this.spaces)}(${nv}-${nw}) ${DFSVisitEdge[e]}`);
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
			console.log(`post: ${this.dfs.post.map(formatNumber).join('  ')}`);
			console.log(`st:   ${this.dfs.st.map(formatNumber).join('  ')}`);
		}
	}

}