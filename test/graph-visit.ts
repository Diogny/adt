import { expect } from 'chai';
import { LabeledGraph, EdgeVisitEnum } from '../src/lib/Graph';
import { EdgeAnalizer, CyclesAnalizer } from '../src/lib/Graph-Analizers';
import { dfsAnalysis, dfs } from "../src/lib/Graph-Search";

//run as Task launch.json
//or	node node_modules/mocha/bin/_mocha --require ts-node/register test/graph-visit.ts

const g = new LabeledGraph('my labeled graph');
g.addNode("A");		// 0
g.addNode("B");		// 1
g.addNode("C");		// 2
g.addNode("D");		// 3
g.addNode("E");		// 4
g.addNode("F");		// 5
g.addNode("G");		// 6
g.connect(0, 1);	// A
g.connect(0, 2);
g.connect(0, 4);
g.connect(1, 3);	// B
g.connect(1, 5);
g.connect(2, 6);	// C
g.connect(4, 5);	// E

describe('Graph Visits', () => {
	it('g.edgeCount() = 14', () => {
		expect(g.edgeCount()).to.equal(14);
	});
	it('Depth First Search', () => {
		let
			start = 0,
			analizers = [
				new EdgeAnalizer(true, true, true),
				new CyclesAnalizer()
			];
		dfsAnalysis(g, start, analizers);
		expect(1).to.equal(1);
	});
	it('g dfs', () => {
		let
			array = [];
		for (let edge of dfs(g, 0, true)) {
			if (edge.e == EdgeVisitEnum.tree)
				array.push(g.nodeLabel(edge.w));
		}
		console.log('dfs: ' + array.join(', '));
		expect(1).to.equal(1);
	});
	it('g dfs search node', () => {
		let
			array = [],
			node = "E",
			found = false,
			iterations = 0;
		for (let edge of dfs(g, 0, true, true)) {
			let
				labelNode = g.nodeLabel(edge.w);
			iterations++;
			array.push(labelNode);
			if (labelNode == node) {
				found = true;
				break;
			}
		}
		if (found)
			console.log(`[${node}] found, iterations: ${iterations}, path: ${array.join(' > ')}`);
		else
			console.log(`${node} not found!`)
		expect(1).to.equal(1);
	});
	it('g dfs search node looking all edges', () => {
		let
			array = [],
			node = "E",
			found = false,
			iterations = 0;
		for (let edge of dfs(g, 0, true, false)) {
			iterations++;
			if (edge.e == EdgeVisitEnum.tree) {
				let
					labelNode = g.nodeLabel(edge.w);
				array.push(labelNode);
				if (labelNode == node) {
					found = true;
					break;
				}
			}
		}
		if (found)
			console.log(`[${node}] found, iterations: ${iterations}, path: ${array.join(' > ')}`);
		else
			console.log(`${node} not found!`)
		expect(1).to.equal(1);
	});
});
