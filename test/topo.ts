import { Edge, WeightedEdge } from "../src/lib/Graph";
import { displayMatrix, toMatrix, transposeMatrix, fromJSON } from "../src/lib/Graph-Utils";
import { dfsAnalysis } from "../src/lib/Graph-Search";
import { DirectedEdgeAnalizer, ToposortAnalizer, DirectedComponentAnalizer } from "../src/lib/Graph-Directed-Analizers";

//independent run
//	node --require ts-node/register --trace-uncaught test/topo.ts
//or
//in this case it's itself in Run Task as "Graph create"
//remember to change the name in launch.json

const g = fromJSON({
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
	console.log((g.nodeEdges(n.id) as Edge[]).map(e => {
		return `(${e.v}>${e.w}${g.weighted ? ` @${(e as WeightedEdge).weight}` : ''})`
	}).join(' '))
});

let
	start = 0,
	analizers = [
		new DirectedEdgeAnalizer(true, true, true),
		new ToposortAnalizer(),
		new DirectedComponentAnalizer(),
	];
console.log('Degree or Source');
console.log(g.degrees().join(" "));
console.log('InDegree or Sink');
console.log(g.indegrees().join(" "));

dfsAnalysis(g, start, analizers);

console.log('Matrix');
displayMatrix(toMatrix(g));

console.log('Transpose');
displayMatrix(transposeMatrix(g));