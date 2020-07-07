import { formatNumber } from "./Utils";
import { BaseAnalizer, BaseEdgeAnalizer } from "./Graph-Analizers";

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