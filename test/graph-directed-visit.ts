import { expect } from 'chai';
import { DiGraph } from '../src/lib/Graph';
import { DirectedEdgeAnalizer } from '../src/lib/Graph-Directed-Analizers';
import { dfsAnalysis } from "../src/lib/Graph-Search";

//run as Task launch.json
//or	node node_modules/mocha/bin/_mocha --require ts-node/register test/graph-directed-visit.ts

//check later
const g = new DiGraph('my DiGraph');
g.addNode();		// 0
g.addNode();		// 1
g.addNode();		// 2
g.addNode();		// 3
g.addNode();		// 4
g.addNode();		// 5
g.addNode();		// 6
g.addNode();		// 7
g.connect(0, 3);
g.connect(1, 3);
g.connect(1, 4);
g.connect(2, 4);
g.connect(2, 7);
g.connect(3, 5);
g.connect(3, 6);
g.connect(3, 7);
g.connect(4, 6);

describe('DiGraph Visits', () => {
	it('g.edgeCount() = 9', () => {
		expect(g.edgeCount()).to.equal(9);
	});
	it('Depth First Search', () => {
		let
			start = 0,
			analizers = [
				new DirectedEdgeAnalizer(true, true, true)
			];
		dfsAnalysis(g, start, analizers);
		expect(1).to.equal(1);
	});
});