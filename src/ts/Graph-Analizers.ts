import { IDFSAnalizer, IDFSTask, DFSVisitEdge } from "./Graph";

const padStr = (ch: string, len: number) => new Array(len).join(ch);

export class EdgeAnalizer implements IDFSAnalizer {

	dfs: IDFSTask;
	edgeList: string[];
	tabs = 4;
	colSpaces: number[];
	spaces = 0;
	components = 0;

	constructor() {
		this.edgeList = [];
	}

	public register(dfs: IDFSTask): void {
		this.dfs = dfs;
		this.colSpaces = new Array(this.dfs.g.size).fill(-1)
	}

	public visit(v: number, w: number, e: DFSVisitEdge) {
		if (this.components != this.dfs.cc()) {
			this.edgeList.push(`component: ${this.components = this.dfs.cc()}, start: ${v}`)
		}
		if (this.colSpaces[v] < 0)
			this.colSpaces[v] = 0;
		if (e == DFSVisitEdge.tree) {
			this.colSpaces[w] = this.colSpaces[v] + 1;
		}
		this.spaces = this.colSpaces[v] * this.tabs;
		this.edgeList.push(`${padStr(' ', this.spaces)}${v}-${w} ${DFSVisitEdge[e]}`)
	}

	public report() {
		console.log('EDGE Analizer');
		this.edgeList.forEach(s => console.log(s))
	}
}

//bug for DiGraphs
export class CyclesAnalizer implements IDFSAnalizer {

	dfs: IDFSTask;
	cycles: number[][];

	get count(): number { return this.cycles.length }

	constructor() {
		this.cycles = new Array()
	}

	public register(dfs: IDFSTask): void {
		this.dfs = dfs
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

	public report() {
		console.log('CYCLES Analizer:');
		console.log(` cycle(s): ${this.count}`);
		this.cycles.forEach(c => {
			console.log('  ' + c.join('-'));
		})
	}

}