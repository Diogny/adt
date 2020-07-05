import { expect } from 'chai';
import { LabeledGraph, GraphVisitEdge } from '../src/ts/Graph';
import { EdgeAnalizer, CyclesAnalizer } from '../src/ts/Graph-Analizers';

const g = new LabeledGraph('my labeled graph');
g.addNode("A");		// 0
g.addNode("B");		// 1
g.addNode("C");		// 2
g.addNode("D");		// 3
g.addNode("E");		// 4
g.addNode("F");		// 5
g.addNode("G");		// 6
g.connect(0, 1);	// A
g.connect(0, 2);
g.connect(0, 4);
g.connect(1, 3);	// B
g.connect(1, 5);
g.connect(2, 6);	// C
g.connect(4, 5);	// E

describe('Graph Visits', () => {
	it('g.edgeCount() = 14', () => {
		expect(g.edgeCount()).to.equal(14);
	});
	it('Depth First Search', () => {
		let
			start = 0,
			analizers = [
				new EdgeAnalizer(),
				new CyclesAnalizer()
			];
		//g.dfsAnalysis(start, analizers);
		expect(1).to.equal(1);
	});
	/*it('Breath First Search', () => {
		g.breadthFirstSearch(1, (v, e, wd) => {
			const
				vn = g.node(v)?.label();
			switch (e) {
				case GraphVisitEdge.TreeNode:
				case GraphVisitEdge.BackNode:
					console.log(`[${vn}] d:${wd} ${GraphVisitEdge[e]}`)
					break;
				case GraphVisitEdge.ForwardEdge:
				case GraphVisitEdge.BackEdge:
					const wdn = g.node(wd)?.label();
					console.log(`(${vn}>${wdn}) ${GraphVisitEdge[e]}`)
					break;
			}
		});
		expect(1).to.equal(1);
	});*/
});
