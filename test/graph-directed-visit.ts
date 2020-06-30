import { expect } from 'chai';
import { DiGraph, GraphVisitEdge } from '../src/ts/Graph';

const g = new DiGraph('my DiGraph');
g.addNode();		// 1
g.addNode();		// 2
g.addNode();		// 3
g.addNode();		// 4
g.addNode();		// 5
g.addNode();		// 6
g.addNode();		// 7
g.addNode();		// 8
g.connect(1, 4);
g.connect(2, 4);
g.connect(2, 5);
g.connect(3, 5);
g.connect(3, 8);
g.connect(4, 6);
g.connect(4, 7);
g.connect(4, 8);
g.connect(5, 7);

describe('DiGraph Visits', () => {
	it('g.edgeCount() = 9', () => {
		expect(g.edgeCount()).to.equal(9);
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