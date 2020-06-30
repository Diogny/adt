import { expect } from 'chai';
import { Graph, WeightedGraph, WeightedEdge, LabeledGraph } from '../src/ts/Graph';

describe('Graph', () => {
	it('create Graph', () => {
		const g = new Graph("my graph");
		expect(g.name).to.equal("my graph");
	});
	it('g.addNode().id = 1', () => {
		const g = new Graph("my graph");
		const n = g.addNode();
		expect(n.id).to.equal(1);
	});
	it('g.node(1).label() = "1"', () => {
		const g = new Graph("my graph");
		g.addNode();
		const n = g.node(1);
		expect(n?.label()).to.equal("1");
	});
	it('g.connect(1, 2) = true', () => {
		const g = new Graph("my graph");
		g.addNode();
		g.addNode();
		expect(g.connect(1, 2)).to.equal(true);
	});
	it('g.adjacent(1, 2) = true', () => {
		const g = new Graph("my graph");
		g.addNode();
		g.addNode();
		g.connect(1, 2);
		expect(g.adjacent(1, 2)).to.equal(true);
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
	it('g.connect(1, 2, 12.5) = true', () => {
		const g = new WeightedGraph('my weighted graph');
		g.addNode();
		g.addNode();
		expect(g.connect(1, 2, 12.5)).to.equal(true);
	});
	it('g.edge(1, 2).weight = 12.5', () => {
		const g = new WeightedGraph('my weighted graph');
		g.addNode();
		g.addNode();
		g.connect(1, 2, 12.5);
		const edge = g.edge(1, 2) as WeightedEdge;
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
	it('g.connect(1, 2, 12.5) = true', () => {
		const g = new WeightedGraph('my weighted graph');
		g.addNode();
		g.addNode();
		expect(g.connect(1, 2, 12.5)).to.equal(true);
	});
	it('g.edge(1, 2).weight = 12.5', () => {
		const g = new WeightedGraph('my weighted graph');
		g.addNode();
		g.addNode();
		g.connect(1, 2, 12.5);
		const edge = g.edge(1, 2) as WeightedEdge;
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
