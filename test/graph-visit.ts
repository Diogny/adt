import { expect } from 'chai';
import { LabeledGraph, GraphVisitEdge } from '../src/ts/Graph';

const g = new LabeledGraph('my labeled graph');
g.addNode("A");		// 1
g.addNode("B");		// 2
g.addNode("C");		// 3
g.addNode("D");		// 4
g.addNode("E");		// 5
g.addNode("F");		// 6
g.addNode("G");		// 7
g.connect(1, 2);	// A
g.connect(1, 3);
g.connect(1, 5);
g.connect(2, 4);	// B
g.connect(2, 6);
g.connect(3, 7);	// C
g.connect(5, 6);	// E

describe('Graph Visits', () => {
	it('g.edgeCount() = 14', () => {
		expect(g.edgeCount()).to.equal(14);
	});
	it('Depth First Search', () => {
		g.depthFirstSearch(1, (v, w, t, e) => {
			const
				vn = g.node(v)?.label(),
				wn = g.node(w)?.label();
			console.log(`(${vn}>${wn}) t:${t} ${GraphVisitEdge[e]}`)
		});
		expect(1).to.equal(1);
	});
	it('Breath First Search', () => {
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
	});
});
