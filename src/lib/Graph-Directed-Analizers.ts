import { formatNumber } from "./Utils";
import { BaseAnalizer, BaseEdgeAnalizer, BaseComponentAnalizer } from "./Graph-Analizers";
import { EdgeVisitEnum, ISearchTask } from "./Graph";

export abstract class DirectedBaseAnalizer extends BaseAnalizer {

	public get directed(): boolean { return true }

}

export class DirectedEdgeAnalizer extends BaseEdgeAnalizer {

	public get directed(): boolean { return true }

	constructor(public showStack?: boolean, public showInternals?: boolean, public showTreeEnd?: boolean) {
		super("Directed Edge Analizer", showStack, showInternals, showTreeEnd);
	}

	public report() {
		super.report();
		if (this.showInternals) {
			console.log(`post: ${this.dfs.post.map(n => formatNumber(n, this.maxLabelWidth)).join('  ')}`);
		}
	}

}

export class DirectedComponentAnalizer extends BaseComponentAnalizer {

	public get directed(): boolean { return true }
	
	constructor() {
		super("Directed Component Analizer");
	}
}

//works with DFS only
export class ToposortAnalizer extends DirectedBaseAnalizer {

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