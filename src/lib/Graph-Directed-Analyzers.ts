import { formatNumber } from "dabbjs/dist/lib/strings";
import { BaseAnalyzer, BaseEdgeAnalyzer, BaseComponentAnalyzer } from "./Graph-Analyzers";
import { EdgeVisitEnum, ISearchTask } from "./Graph";

export abstract class DirectedBaseAnalyzer extends BaseAnalyzer {

	public get directed(): boolean { return true }

}

export class DirectedEdgeAnalyzer extends BaseEdgeAnalyzer {

	public get directed(): boolean { return true }

	constructor(public showStack?: boolean, public showInternals?: boolean, public showTreeEnd?: boolean) {
		super("Directed Edge Analyzer", showStack, showInternals, showTreeEnd);
	}

	public report() {
		super.report();
		if (this.showInternals) {
			console.log(`post: ${this.dfs.post.map(n => formatNumber(n, this.maxLabelWidth)).join('  ')}`);
		}
	}

}

export class DirectedComponentAnalyzer extends BaseComponentAnalyzer {

	public get directed(): boolean { return true }

	constructor() {
		super("Directed Component Analyzer");
	}
}

//works with DFS only
export class TopoSortAnalyzer extends DirectedBaseAnalyzer {

	order: number[];
	index: number;
	isDAG: boolean;

	constructor() {
		super("Topological sort")
	}

	public register(dfs: ISearchTask): void {
		super.register(dfs);
		this.order = new Array<number>(this.dfs.nodes).fill(-1);
		this.index = 0;
		this.isDAG = true;
	}

	visit(v: number, w: number, e: EdgeVisitEnum): void {
		if (e == EdgeVisitEnum.back)
			this.isDAG = false;
	}

	public endTree(v: number, w: number) {
		super.endTree(v, w);
		this.isDAG && (this.order[this.index++] = w)
	}

	public report() {
		super.report();
		if (!this.isDAG) {
			console.log("Directed Graph is not a DAG, it has cycles")
		} else {
			let
				w = Math.max.apply(null, this.dfs.g.nodeList().map(n => n.label().length)) + 1;
			console.log(`order:   ${this.order.map(n => formatNumber(n, w)).join(' > ')}`);
		}
	}

}