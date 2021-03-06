import { WeightedEdge, Edge, GraphNode } from '../src/lib/Graph';
import { EdgeAnalizer, BridgeAnalizer } from '../src/lib/Graph-Analizers';
import { fromJSON } from "../src/lib/Graph-Utils";
import { dfsAnalysis } from "../src/lib/Graph-Search";

//independent run
//	node --require ts-node/register --trace-uncaught test/graph-create-labeled.ts
//or
//in this case it's itself in Run Task as "Graph create"
//remember to change the name in launch.json

const g = fromJSON({
	name: "A graph map of United States of America",
	directed: false,
	weighted: false,
	labeled: true,
	labels: [
		"Alabama", "Arizona", "Arkansas",
		"California", "Colorado", "Connecticut",
		"Delaware",
		"Florida",
		"Georgia",
		"Idaho", "Illinois", "Indiana", "Iowa",
		"Kansas", "Kentucky",
		"Louisiana",
		"Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana",
		"Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota",
		"Ohio", "Oklahoma", "Oregon",
		"Pennsylvania",
		"Rhode Island",
		"South Carolina", "South Dakota",
		"Tennessee", "Texas",
		"Utah",
		"Vermont", "Virginia",
		"Washington", "West Virginia", "Wisconsin", "Wyoming"],
	edges: [
		{ from: "Florida", to: "Georgia" },
		{ from: "Florida", to: "Alabama" },
		{ from: "Alabama", to: "Georgia" },
		{ from: "Alabama", to: "Mississippi" },
		{ from: "Alabama", to: "Tennessee" },
		{ from: "Georgia", to: "South Carolina" },
		{ from: "Georgia", to: "Tennessee" },
		{ from: "Georgia", to: "North Carolina" },
		{ from: "South Carolina", to: "North Carolina" },
		{ from: "Mississippi", to: "Tennessee" },
		{ from: "Mississippi", to: "Arkansas" },
		{ from: "Mississippi", to: "Louisiana" },
		{ from: "North Carolina", to: "Virginia" },
		{ from: "North Carolina", to: "Tennessee" },
		{ from: "Virginia", to: "West Virginia" },
		{ from: "Virginia", to: "Kentucky" },
		{ from: "Virginia", to: "Tennessee" },
		{ from: "Virginia", to: "Delaware" },
		{ from: "West Virginia", to: "Kentucky" },
		{ from: "West Virginia", to: "Ohio" },
		{ from: "West Virginia", to: "Delaware" },
		{ from: "West Virginia", to: "Pennsylvania" },
		{ from: "Ohio", to: "Kentucky" },
		{ from: "Ohio", to: "Indiana" },
		{ from: "Ohio", to: "Pennsylvania" },
		{ from: "Ohio", to: "Michigan" },
		{ from: "Delaware", to: "Pennsylvania" },
		{ from: "Delaware", to: "Maryland" },
		{ from: "Maryland", to: "Pennsylvania" },
		{ from: "Maryland", to: "New Jersey" },
		{ from: "New Jersey", to: "Pennsylvania" },
		{ from: "New Jersey", to: "New York" },
		{ from: "New Jersey", to: "Connecticut" },
		{ from: "New York", to: "Pennsylvania" },
		{ from: "New York", to: "Connecticut" },
		{ from: "New York", to: "Massachusetts" },
		{ from: "New York", to: "Vermont" },
		{ from: "Connecticut", to: "Massachusetts" },
		{ from: "Connecticut", to: "Rhode Island" },
		{ from: "Massachusetts", to: "Rhode Island" },
		{ from: "Massachusetts", to: "Vermont" },
		{ from: "Massachusetts", to: "New Hampshire" },
		{ from: "Vermont", to: "New Hampshire" },
		{ from: "Vermont", to: "Maine" },
		{ from: "New Hampshire", to: "Maine" },
		{ from: "Michigan", to: "Wisconsin" },
		{ from: "Michigan", to: "Minnesota" },
		{ from: "Wisconsin", to: "Minnesota" },
		{ from: "Wisconsin", to: "Iowa" },
		{ from: "Wisconsin", to: "Illinois" },
		{ from: "Indiana", to: "Illinois" },
		{ from: "Indiana", to: "Kentucky" },
		{ from: "Louisiana", to: "Arkansas" },
		{ from: "Louisiana", to: "Texas" },
		{ from: "Arkansas", to: "Texas" },
		{ from: "Arkansas", to: "Oklahoma" },
		{ from: "Arkansas", to: "Missouri" },
		{ from: "Missouri", to: "Kansas" },
		{ from: "Missouri", to: "Iowa" },
		{ from: "Iowa", to: "Illinois" },
		{ from: "Iowa", to: "Minnesota" },
		{ from: "Iowa", to: "Nebraska" },
		{ from: "Iowa", to: "South Dakota" },
		{ from: "Minnesota", to: "North Dakota" },
		{ from: "Minnesota", to: "South Dakota" },
		{ from: "North Dakota", to: "Montana" },
		{ from: "South Dakota", to: "North Dakota" },
		{ from: "South Dakota", to: "Montana" },
		{ from: "South Dakota", to: "Wyoming" },
		{ from: "Montana", to: "Wyoming" },
		{ from: "Montana", to: "Idaho" },
		{ from: "Idaho", to: "Wyoming" },
		{ from: "Idaho", to: "Washington" },
		{ from: "Idaho", to: "Oregon" },
		{ from: "Idaho", to: "Nevada" },
		{ from: "Idaho", to: "Utah" },
		{ from: "Wyoming", to: "Nebraska" },
		{ from: "Wyoming", to: "Colorado" },
		{ from: "Wyoming", to: "Utah" },
		{ from: "Washington", to: "Oregon" },
		{ from: "Oregon", to: "California" },
		{ from: "Oregon", to: "Nevada" },
		{ from: "Nevada", to: "Utah" },
		{ from: "Nevada", to: "California" },
		{ from: "Nevada", to: "Arizona" },
		{ from: "Oklahoma", to: "Texas" },
		{ from: "Texas", to: "New Mexico" },
		{ from: "California", to: "Arizona" },
		{ from: "Utah", to: "Colorado" },
		{ from: "Utah", to: "Arizona" },
		{ from: "Colorado", to: "Nebraska" },
		{ from: "Colorado", to: "Kansas" },
		{ from: "Colorado", to: "Arizona" },
		{ from: "Colorado", to: "New Mexico" },
		{ from: "Kentucky", to: "Tennessee" },
		{ from: "Tennessee", to: "Illinois" },
		{ from: "Arkansas", to: "Tennessee" },
		{ from: "Kentucky", to: "Indiana" },
		{ from: "Kentucky", to: "Illinois" },
		{ from: "Indiana", to: "Michigan" },
		{ from: "Iowa", to: "Kansas" },
		{ from: "Illinois", to: "Missouri" },
		{ from: "Oklahoma", to: "Missouri" },
		{ from: "Oklahoma", to: "Arkansas" },
		{ from: "Oklahoma", to: "New Mexico" },
		{ from: "Kansas", to: "Nebraska" },
		{ from: "Kansas", to: "Oklahoma" },
		{ from: "Nebraska", to: "South Dakota" },
		{ from: "Arizona", to: "New Mexico" },
	]
});

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
let
	start = 0,
	analizers = [
		new EdgeAnalizer(false, true, true),
		new BridgeAnalizer(),
	];
dfsAnalysis(g, start, analizers);