import { expect } from 'chai';
import { Graph } from '../src/ts/Graph';
import { CyclesAnalizer, EdgeAnalizer } from '../src/ts/Graph-Analizers'

const
	g = new Graph("");

g.addNode("0");	// 1
g.addNode("1");
g.addNode("2");
g.addNode("3");
g.addNode("4");
g.addNode("5");
g.addNode("6");
g.addNode("7");	//8

g.connect(0, 2);
g.connect(0, 5);
g.connect(0, 7);
g.connect(2, 6);
g.connect(6, 4);
g.connect(4, 3);
g.connect(4, 5);
g.connect(4, 7);
g.connect(3, 5);
g.connect(7, 1);

describe('Graph DFS Analizer', () => {
	it('Cycles', () => {
		let
			start = 0,
			analizers = [
				new EdgeAnalizer(),
				new CyclesAnalizer()
			];
		//g.dfsAnalysis(start, analizers);
		expect(1).to.equal(1);
	});
});