import { BaseGraph, Edge, WeightedEdge } from "../src/ts/Graph";
import { DirectedEdgeAnalizer, ToposortAnalizer } from "../src/ts/Graph-Directed-Analizers";

//independent run
//	node --require ts-node/register --trace-uncaught test/topo.ts
//or
//in this case it's itself in Run Task as "Graph create"
//remember to change the name in launch.json

const g = BaseGraph.fromJSON({
	name: "Topological Sort of a DiGraph",
	directed: true,
	weighted: false,
	nodes: 13,
	edges: [
		{ from: 0, to: 5 },
		{ from: 0, to: 6 },
		{ from: 0, to: 2 },
		{ from: 0, to: 3 },
		{ from: 0, to: 1 },

		{ from: 2, to: 3 },

		{ from: 3, to: 5 },
		{ from: 3, to: 4 },

		{ from: 4, to: 9 },

		{ from: 6, to: 9 },
		{ from: 6, to: 4 },

		{ from: 7, to: 6 },

		{ from: 8, to: 7 },

		{ from: 9, to: 11 },
		{ from: 9, to: 10 },
		{ from: 9, to: 12 },

		{ from: 11, to: 12 },

	]
});

console.log('name: ', g.name);
console.log('nodes: ', g.size);
console.log('g.directed: ', g.directed);
console.log('g.edgeCount: ', g.edgeCount());
console.log('Edges');
g.nodeList().forEach(n => {
	console.log((g.edges(n.id) as Edge[]).map(e => {
		return `(${e.v}>${e.w}${g.weighted ? ` @${(e as WeightedEdge).weight}` : ''})`
	}).join(' '))
});

let
	start = 0,
	analizers = [
		new DirectedEdgeAnalizer(true, true, true),
		new ToposortAnalizer(),
	];
g.dfsAnalysis(start, analizers);