import { BaseGraph, WeightedEdge, Edge } from '../src/ts/Graph';
import { EdgeAnalizer, BridgeAnalizer } from '../src/ts/Graph-Analizers';

//independent run
//	node --require ts-node/register --trace-uncaught test/graph-create.ts
//or
//in this case it's itself in Run Task as "Graph create"
//remember to change the name in launch.json

const g = BaseGraph.fromJSON({
	name: "bridges and articulation points",
	directed: false,
	weighted: false,
	nodes: 13,
	edges: [
		{ from: 0, to: 5 },
		{ from: 0, to: 1 },
		{ from: 0, to: 6 },

		{ from: 5, to: 4 },
		{ from: 5, to: 3 },

		{ from: 4, to: 3 },
		{ from: 4, to: 9 },
		{ from: 4, to: 11 },

		{ from: 9, to: 11 },
		{ from: 11, to: 12 },
		{ from: 1, to: 2 },
		{ from: 2, to: 6 },
		{ from: 6, to: 7 },

		{ from: 7, to: 10 },
		{ from: 7, to: 8 },

		{ from: 10, to: 8 }
	]
});

console.log('name: ', g.name);
console.log('nodes: ', g.size);
console.log('g.node(12)', g.node(12));
console.log('g.edgeCount: ', g.edgeCount());
console.log('Edges');
g.nodeList().forEach(n => {
	(g.edges(n.id) as Edge[]).forEach(e => {
		console.log(`(${e.v}-${e.w}${g.weighted ? ` @${(e as WeightedEdge).weight}` : ''})`)
	})
});

let
	start = 0,
	analizers = [
		new EdgeAnalizer(true, true, true),
		new BridgeAnalizer(),
	];
g.dfsAnalysis(start, analizers, true);