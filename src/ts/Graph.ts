import Stack from "./Stack";
import Queue from "./Queue";

interface ILabel {
	label(): string;
}

export class Node implements ILabel {

	public label(): string { return String(this.id) }

	constructor(public id: number) { }
}

export class LabeledNode extends Node {

	public label(): string { return this.__label }

	constructor(id: number, public __label: string) {
		super(id);
		if (!__label)
			throw `empty node label`
	}
}

export class Edge implements ILabel {

	public label(): string { return `(${this.v}>${this.w})` }

	constructor(public v: number, public w: number) {
	}
}

export class WeightedEdge extends Edge {

	public label(): string { return `(${this.v}>${this.w})::${this.weight}` }

	constructor(v: number, w: number, public weight: number) {
		super(v, w);
		if (Number.isNaN(weight))
			throw `invalid edge weight`
	}

}

export enum GraphVisitEdge {
	TreeNode = 1,
	BackNode = 2,
	ForwardEdge = 3,
	BackEdge = 4
}

export interface IGraph {
	name: string;
	directed: boolean;
	weighted: boolean;
}

abstract class BaseGraph implements IGraph, ILabel {

	public label(): string { return this.name }

	protected nodes: Map<number, {
		node: Node,
		edges: Edge[]
	}>;

	public get size(): number { return this.nodes.size }

	public get nextNodeId(): number { return this.size + 1 }

	public node(id: number): Node | undefined { return this.nodes.get(id)?.node }

	public edges(id: number): Edge[] | undefined { return this.nodes.get(id)?.edges }

	constructor(public name: string, public directed: boolean, public weighted: boolean) {
		this.nodes = new Map();
	}

	public isNode(node: number) { return node > 0 && node <= this.size }

	protected createNode(label?: string): Node {
		return new Node(this.nextNodeId)
	}

	public addNode(label?: string): Node {
		let
			node = this.createNode(label);
		if (node.id <= 0)
			throw 'invalid node index';
		this.nodes.set(node.id, {
			node: node,
			edges: new Array()
		});
		return node;
	}

	protected createEdge(v: number, w: number, weight?: number): Edge {
		return new Edge(v, w)
	}

	public connect(v: number, w: number, weight?: number): boolean {
		let
			startNode = this.nodes.get(v),
			endNode = this.nodes.get(w);
		if (!startNode || !endNode)
			return false;
		if (startNode.edges.some(e => e.w == w))
			return false;
		startNode.edges.push(this.createEdge(v, w, weight));
		!this.directed
			&& endNode.edges.push(this.createEdge(w, v, weight));
		return true;
	}

	public adjacent(v: number, w: number): boolean {
		let
			vNode = this.nodes.get(v);
		return !!vNode?.edges.some(n => n.w == w)
	}

	public degree(node: number): number {
		let
			vNode = this.nodes.get(node);
		return <any>vNode?.edges.length || 0
	}

	public adjacentEdges(node: number): number[] {
		let
			vNode = this.nodes.get(node);
		return vNode?.edges.map(e => e.w) || []
	}

	public edge(v: number, w: number): Edge | undefined {
		let
			vNode = this.nodes.get(v);
		return vNode?.edges.find(e => e.w == w)
	}

	public edgeCount(): number {
		return Array.from(this.nodes.values()).reduce((sum, item) => sum + item.edges.length, 0)
	}

	// max. number of edges = ½ * |V| * ( |V| - 1 ). 
	//For undirected simple graphs, the graph density is defined as: 
	//D =     2|E|
	//    -----------
	//     |V|(|V| - 1)
	public density(): number {
		return 2 * this.edgeCount() / (this.size * (this.size - 1))
	}

	public depthFirstSearch(start: number, callback: (v: number, w: number, t: number, e: GraphVisitEdge) => void, verbose?: boolean) {
		let
			currentTiming = -1,
			timings = new Map<number, number>(),
			discovered = (node: number) => timings.has(node),
			stack = new Stack<number>();
		if (!this.isNode(start))
			return;
		stack.push(start);
		while (!stack.empty) {
			let
				v = <number>stack.pop();
			if (!discovered(v)) {
				timings.set(v, ++currentTiming);
				//node
				callback(v, v, currentTiming, GraphVisitEdge.TreeNode);
				//for all edges from v to w in G.adjacentEdges(v) do 
				for (let array = this.adjacentEdges(v), i = array.length - 1; i >= 0; i--) {
					let
						w = array[i];
					if (discovered(w)) {
						//back-edge for directed graph or verbose
						if (this.directed || verbose)
							callback(v, w, currentTiming, GraphVisitEdge.BackEdge);
					} else {
						//forward-edge
						callback(v, w, currentTiming, GraphVisitEdge.ForwardEdge);
						stack.push(w)
					}
				}
			} else if (this.directed || verbose) {
				//back-node for directed graphs or verbose
				callback(v, v, currentTiming, GraphVisitEdge.BackNode);
			}
		}
	}

	public breadthFirstSearch(start: number, callback: (v: number, e: GraphVisitEdge, wd: number) => void, verbose?: boolean) {
		let
			timings = new Map<number, number>(),
			discovered = (node: number) => timings.has(node),
			getTiming = (node: number) => timings.get(node) || 0,
			queue = new Queue<number>();
		if (!this.isNode(start))
			return;
		queue.enqueue(start);
		timings.set(start, 0);
		while (!queue.empty) {
			let
				v = <number>queue.dequeue(),
				d = getTiming(v);
			callback(v, GraphVisitEdge.TreeNode, d);

			this.adjacentEdges(v).forEach(w => {
				if (discovered(w)) {
					//back-edge for directed graph or verbose
					if (this.directed || verbose)
						callback(v, GraphVisitEdge.BackEdge, w);
				} else {
					timings.set(w, d + 1);
					queue.enqueue(w);
					//w.parent := v
					callback(v, GraphVisitEdge.ForwardEdge, w);
				}
			})
		}
	}
}

export class Graph extends BaseGraph {
	constructor(name: string) {
		super(name, false, false)
	}
}

export class DiGraph extends BaseGraph {
	constructor(name: string) {
		super(name, true, false)
	}
}

abstract class BaseWeightedGraph extends BaseGraph {

	public edges(id: number): WeightedEdge[] | undefined { return this.nodes.get(id)?.edges as WeightedEdge[] }

	constructor(name: string, directed: boolean) {
		super(name, directed, true)
	}

	protected createEdge(v: number, w: number, weight?: number): WeightedEdge {
		return new WeightedEdge(v, w, <any>weight)
	}
}

export class WeightedGraph extends BaseWeightedGraph {
	constructor(name: string) {
		super(name, false)
	}
}

export class WeightedDiGraph extends BaseWeightedGraph {
	constructor(name: string) {
		super(name, true)
	}
}

abstract class BaseLabeledGraph extends BaseGraph {

	public node(id: number): LabeledNode | undefined { return this.nodes.get(id)?.node as LabeledNode }

	protected createNode(label?: string): LabeledNode {
		return new LabeledNode(this.nextNodeId, <any>label)
	}

	constructor(name: string, directed: boolean, weighted: boolean) {
		super(name, directed, weighted)
	}
}

export class LabeledGraph extends BaseLabeledGraph {
	constructor(name: string) {
		super(name, false, false)
	}
}

export class LabeledDiGraph extends BaseLabeledGraph {
	constructor(name: string) {
		super(name, true, false)
	}
}

class BaseLabeledWeightedGraph extends BaseLabeledGraph {

	public edges(id: number): WeightedEdge[] | undefined { return this.nodes.get(id)?.edges as WeightedEdge[] }

	constructor(name: string, directed: boolean) {
		super(name, directed, true)
	}

	protected createEdge(v: number, w: number, weight?: number): WeightedEdge {
		return new WeightedEdge(v, w, <any>weight)
	}

}
