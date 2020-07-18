import { expect } from 'chai';
import { dfsAnalysis } from "../src/lib/Graph-Search";
import { BridgeAnalizer, EdgeAnalizer } from '../src/lib/Graph-Analizers'
import { fromJSON } from '../src/lib/Graph-Utils';
import { Edge, GraphNode, WeightedEdge } from '../src/lib/Graph';

//run as Task launch.json
//or	node node_modules/mocha/bin/_mocha --require ts-node/register test/bridge-articulation2.ts

const g = fromJSON({
	name: "bridges and articulation points 2",
	directed: false,
	weighted: false,
	labeled: true,
	labels: ["A", "B", "C", "D", "E", "F", "G"],
	edges: [
		{ from: "A", to: "B" },
		{ from: "A", to: "D" },
		{ from: "B", to: "C" },
		{ from: "C", to: "D" },
		{ from: "C", to: "G" },
		{ from: "D", to: "E" },
		{ from: "D", to: "F" },
		{ from: "E", to: "F" }
	]
});

describe('Graph Bridges and Articulation Points 2', () => {
	it('Information', () => {
		console.log('name: ', g.name);
		console.log('nodes: ', g.size);
		console.log('g.node(12)', g.node(12));
		console.log('g.edgeCount: ', g.edgeCount());
		console.log('Edges');
		g.nodeList().forEach(n => {
			console.log((g.nodeEdges(n.id) as Edge[]).map(e => {
				let
					nv = g.node(e.v) as GraphNode,
					nw = g.node(e.w) as GraphNode;
				return `(${nv.label()}-${nw.label()}${g.weighted ? ` @${(e as WeightedEdge).weight}` : ''})`
			}).join(' '))
		});
		expect(1).to.equal(1);
	})
	it('Analizers', () => {
		let
			start = 0,
			analizers = [
				new EdgeAnalizer(true, true, true),
				new BridgeAnalizer(),
			];
		dfsAnalysis(g, start, analizers);
		expect(1).to.equal(1);
	});
});