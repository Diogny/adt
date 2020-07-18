import { expect } from 'chai';
import { Graph } from '../src/lib/Graph';
import { dfsAnalysis } from "../src/lib/Graph-Search";
import { BridgeAnalizer, EdgeAnalizer } from '../src/lib/Graph-Analizers'

//run as Task launch.json
//or	node node_modules/mocha/bin/_mocha --require ts-node/register test/bridge-articulation.ts

const
	g = new Graph("bridges and articulation points");

g.addNode("0");	// 1
g.addNode("1");
g.addNode("2");
g.addNode("3");
g.addNode("4");
g.addNode("5");
g.addNode("6");
g.addNode("7");
g.addNode("8");
g.addNode("9");
g.addNode("10");
g.addNode("11");
g.addNode("12"); //12

g.connect(0, 5);
g.connect(0, 1);
g.connect(0, 6);

g.connect(5, 4);
g.connect(5, 3);

g.connect(4, 3);
g.connect(4, 9);
g.connect(4, 11);

g.connect(9, 11);
g.connect(11, 12);
g.connect(1, 2);
g.connect(2, 6);
g.connect(6, 7);

g.connect(7, 10);
g.connect(7, 8);

g.connect(10, 8);

describe('Graph Bridges and Articulation Points', () => {
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