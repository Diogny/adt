import { WeightedEdge, Edge } from '../src/ts/Graph';
import { fromJSON } from "../src/ts/Graph-Utils";
import { bfsAnalysis } from "../src/ts/Graph-Search";
import { EdgeAnalizer } from '../src/ts/Graph-Analizers';

//independent run
//	node --require ts-node/register --trace-uncaught test/bfs-analizer.ts
//or
//in this case it's itself in Run Task as "Graph create"
//remember to change the name in launch.json

const g = fromJSON({
	name: "breadth first search graph",
	directed: false,
	weighted: false,
	nodes: 8,
	edges: [
		{ from: 0, to: 2 },
		{ from: 0, to: 5 },
		{ from: 0, to: 7 },

		{ from: 2, to: 6 },

		{ from: 3, to: 4 },

		{ from: 4, to: 6 },

		{ from: 5, to: 3 },
		{ from: 5, to: 4 },

		{ from: 7, to: 1 },
		{ from: 7, to: 4 }
	]
});

console.log('name: ', g.name);
console.log('nodes: ', g.size);
console.log('g.node(7)', g.node(7));
console.log('g.edgeCount: ', g.edgeCount());
console.log('Edges');
g.nodeList().forEach(n => {
	console.log((g.nodeEdges(n.id) as Edge[]).map(e => {
		return `(${e.v}-${e.w}${g.weighted ? ` @${(e as WeightedEdge).weight}` : ''})`
	}).join(' '))
});

let
	start = 0,
	analizers = [
		new EdgeAnalizer(true, true, true),
	];
bfsAnalysis(g, start, analizers);