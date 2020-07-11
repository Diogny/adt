import { Edge, WeightedEdge } from "../src/ts/Graph";
import { DirectedEdgeAnalizer } from "../src/ts/Graph-Directed-Analizers";
import { fromJSON } from "../src/ts/Graph-Utils";
import { dfsAnalysis } from "../src/ts/Graph-Search";

//independent run
//	node --require ts-node/register --trace-uncaught test/graph-directed-create.ts
//or
//in this case it's itself in Run Task as "Graph create"
//remember to change the name in launch.json

const g = fromJSON({
	name: "DiGraph",
	directed: true,
	weighted: false,
	nodes: 13,
	edges: [
		{ from: 0, to: 5 },
		{ from: 0, to: 1 },
		{ from: 0, to: 6 },

		{ from: 2, to: 0 },
		{ from: 2, to: 3 },

		{ from: 3, to: 2 },
		{ from: 3, to: 5 },

		{ from: 4, to: 3 },
		{ from: 4, to: 11 },
		{ from: 4, to: 2 },

		{ from: 5, to: 4 },

		{ from: 6, to: 4 },
		{ from: 6, to: 9 },

		{ from: 7, to: 6 },
		{ from: 7, to: 8 },

		{ from: 8, to: 7 },
		{ from: 8, to: 9 },

		{ from: 9, to: 10 },
		{ from: 9, to: 11 },

		{ from: 10, to: 12 },

		{ from: 11, to: 12 },

		{ from: 12, to: 9 },

	]
});

console.log('name: ', g.name);
console.log('nodes: ', g.size);
console.log('g.directed: ', g.directed);
console.log('g.edgeCount: ', g.edgeCount());
console.log('Edges');
g.nodeList().forEach(n => {
	console.log((g.nodeEdges(n.id) as Edge[]).map(e => {
		return `(${e.v}>${e.w}${g.weighted ? ` @${(e as WeightedEdge).weight}` : ''})`
	}).join(' '))
});

let
	start = 0,
	analizers = [
		new DirectedEdgeAnalizer(true, true, true),
	];
dfsAnalysis(g, start, analizers);