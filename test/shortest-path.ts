import { WeightedEdge, Edge } from '../src/lib/Graph';
import { fromJSON } from "../src/lib/Graph-Utils";
import { bfs } from "../src/lib/Graph-Search";

//independent run
//	node --require ts-node/register --trace-uncaught test/shortest-path.ts
//or
//in this case it's itself in Run Task as "Graph create"
//remember to change the name in launch.json

const g = fromJSON({
	name: "shortest path",
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
console.log('g.edgeCount: ', g.edgeCount());
console.log('Edges');
g.nodeList().forEach(n => {
	console.log((g.nodeEdges(n.id) as Edge[]).map(e => {
		return `(${e.v}-${e.w}${g.weighted ? ` @${(e as WeightedEdge).weight}` : ''})`
	}).join(' '))
});

let
	array = [],
	found = false,
	node = 11;
for (let edge of bfs(g, 0, true, true)) {
	array.push(edge.w);
	if (edge.w == node) {
		found = true;
		break;
	}
}
if (found)
	console.log(`[${node}] found, path: ${array.join(' > ')}`);
else
	console.log(`${node} not found!`)