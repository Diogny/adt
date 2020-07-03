import { expect } from 'chai';
import { Graph, WeightedGraph, WeightedEdge, LabeledGraph } from '../src/ts/Graph';

describe('Graph', () => {
	it('create Graph', () => {
		const g = new Graph("my graph");
		expect(g.name).to.equal("my graph");
	});
	it('g.addNode().id = 0', () => {
		const g = new Graph("my graph");
		const n = g.addNode();
		expect(n.id).to.equal(0);
	});
	it('g.node(0).label() = "0"', () => {
		const g = new Graph("my graph");
		g.addNode();
		const n = g.node(0);
		expect(n?.label()).to.equal("0");
	});
	it('g connect, adjacent, disconnect', () => {
		const g = new Graph("my graph");
		g.addNode();
		g.addNode();
		expect(g.connect(0, 1)).to.equal(true);
		let count = g.edgeCount();
		expect(count).to.equal(2);
		expect(g.adjacent(0, 1)).to.equal(true);
		expect(g.disconnect(0, 1)).to.equal(true);
		count = g.edgeCount();
		expect(count).to.equal(0);
	});
});

describe('Weighted Graph', () => {
	it('create Graph', () => {
		const g = new WeightedGraph('my weighted graph');
		expect(g.name).to.equal("my weighted graph");
	});
	it('g.weighted = true', () => {
		const g = new WeightedGraph('my weighted graph');
		expect(g.weighted).to.equal(true);
	});
	it('g.connect(0, 1, 12.5) = true', () => {
		const g = new WeightedGraph('my weighted graph');
		g.addNode();
		g.addNode();
		expect(g.connect(0, 1, 12.5)).to.equal(true);
	});
	it('g.edge(0, 1).weight = 12.5', () => {
		const g = new WeightedGraph('my weighted graph');
		g.addNode();
		g.addNode();
		g.connect(0, 1, 12.5);
		const edge = g.edge(0, 1) as WeightedEdge;
		expect(edge.weight).to.equal(12.5);
	});
});

describe('Weighted Graph', () => {
	it('create Graph', () => {
		const g = new WeightedGraph('my weighted graph');
		expect(g.name).to.equal("my weighted graph");
	});
	it('g.weighted = true', () => {
		const g = new WeightedGraph('my weighted graph');
		expect(g.weighted).to.equal(true);
	});
	it('g.connect(0, 1, 12.5) = true', () => {
		const g = new WeightedGraph('my weighted graph');
		g.addNode();
		g.addNode();
		expect(g.connect(0, 1, 12.5)).to.equal(true);
	});
	it('g.edge(0, 1).weight = 12.5', () => {
		const g = new WeightedGraph('my weighted graph');
		g.addNode();
		g.addNode();
		g.connect(0, 1, 12.5);
		const edge = g.edge(0, 1) as WeightedEdge;
		expect(edge.weight).to.equal(12.5);
	});
});

describe('Labeled Graph', () => {
	it('create Graph', () => {
		const g = new LabeledGraph('my labeled graph');
		expect(g.name).to.equal("my labeled graph");
	});
	it('g.addNode("Actions").label() = "Actions"', () => {
		const g = new LabeledGraph('my labeled graph');
		const n = g.addNode("Actions");
		expect(n.label()).to.equal("Actions");
	});
});
