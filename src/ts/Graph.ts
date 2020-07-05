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

	get isNode(): boolean { return this.v == this.w }

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

//[Obsolete]
export enum GraphVisitEdge {
	TreeNode = 1,
	BackNode = 2,
	ForwardEdge = 3,
	BackEdge = 4
}

export enum DFSVisitEdge {
	tree,
	parent,
	back,
	down,
	treeEnd
}

export interface IDFSTask {
	g: BaseGraph;
	pre: number[];
	st: number[];
	stack: Stack<{ v: number, w: number }>;
	nodes: number;
	getStart(): number;
	cc(): number;
	timing(): number;
	run: (start: number, callback: (v: number, w: number, e: DFSVisitEdge) => void) => void;
}

export interface IDFSAnalizer {
	name: string;
	register(dfs: IDFSTask): void;
	start(node: number): void;
	visit(v: number, w: number, e: DFSVisitEdge): void;
	end(): void;
}

export interface IGraph {
	name: string;
	directed: boolean;
	weighted: boolean;
	modified: boolean;
}

abstract class BaseGraph implements IGraph, ILabel {

	public label(): string { return this.name }

	modified: boolean;

	protected nodes: Map<number, {
		node: Node,
		edges: Edge[]
	}>;

	public get size(): number { return this.nodes.size }

	public get nextNodeId(): number { return this.size }

	public node(id: number): Node | undefined { return this.nodes.get(id)?.node }

	public nodeList(): Node[] { return Array.from(this.nodes.values()).map(n => n.node) }

	public edges(id: number): Edge[] | undefined { return this.nodes.get(id)?.edges }

	constructor(public name: string, public directed: boolean, public weighted: boolean) {
		this.nodes = new Map();
		this.modified = false;
	}

	public validNode(node: number) { return node >= 0 && node < this.size }

	protected createNode(label?: string): Node {
		return new Node(this.nextNodeId)
	}

	public addNode(label?: string): Node {
		let
			node = this.createNode(label);
		if (node.id < 0)
			throw 'invalid node index';
		this.nodes.set(node.id, {
			node: node,
			edges: new Array()
		});
		this.modified = true;
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
		this.modified = true;
		!this.directed
			&& endNode.edges.push(this.createEdge(w, v, weight));
		return true;
	}

	public disconnect(v: number, w: number): boolean {
		let
			e = edge.call(this, v, w) as { node: Node, edges: Edge[], index: number };
		if (!e || e.index < 0)
			return false;
		e.edges.splice(e.index, 1);
		this.modified = true;
		if (!this.directed) {
			e = edge.call(this, w, v);
			e.edges.splice(e.index, 1);
		}
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
			e = edge.call(this, v, w) as { node: Node, edges: Edge[], index: number } | undefined;
		return e?.edges[e.index]
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

	public dfs(start: number, callback: (v: number, w: number, e: DFSVisitEdge) => void, full?: boolean) {
		let
			dfs = dfsAnalysis.call(this, start, 0, full) as IDFSTask;
		while ((start = dfs.getStart()) != -1) {
			dfs.run(start, callback);
		}
	}

	public dfsAnalysis(start: number, analizers: IDFSAnalizer[], full?: boolean) {
		let
			callback = (v: number, w: number, e: DFSVisitEdge) => {
				analizers
					.forEach(a => a.visit(v, w, e))
			},
			dfs = dfsAnalysis.call(this, start, 0, full) as IDFSTask;
		analizers
			.forEach(a => a.register(dfs));
		while ((start = dfs.getStart()) != -1) {
			analizers.forEach(a => a.start(start));
			dfs.run(start, callback);
		}
		analizers.forEach(a => a.end());
	}

	public breadthFirstSearch(start: number, callback: (v: number, e: GraphVisitEdge, wd: number) => void, verbose?: boolean) {
		let
			timings = new Map<number, number>(),
			discovered = (node: number) => timings.has(node),
			getTiming = (node: number) => timings.get(node) || 0,
			queue = new Queue<number>();
		if (!this.validNode(start))
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

	public static create(name: string, content: string): BaseGraph {
		let
			regex = /(?:\()([^\>\-])([\>\-])([^\)])(?:\))/g,
			match: RegExpMatchArray,
			dic = {},
			edgeDirection: string = <any>void 0,
			labelIsNumber: true,
			selfLoops = false,
			multipleEdges = false,
			processVertex = function (label: string) {
				var entry = dic[label];
				if (entry == null) {
					entry = {
						label: label,
						vertex: undefined,
						neighbors: []
					}
					dic[label] = entry;
				}
				return entry;
			};
		while ((match = <RegExpMatchArray>regex.exec(content)) !== null) {
			var direction = match[2];
			if (!edgeDirection)
				edgeDirection = direction;
			else if (edgeDirection != direction)
				throw 'Graph contains mixed edge directions';

			var tail = processVertex(match[1]),
				head = processVertex(match[3]);

			if (selfLoops = selfLoops || (tail.label === head.label))
				throw `self-loops not supported: ${match[0]}`

		}
		return new Graph(name)
	}
}

function edge(v: number, w: number): { node: Node, edges: Edge[], index: number } | undefined {
	let
		vNode = this.nodes.get(v) as {
			node: Node,
			edges: Edge[]
		} | undefined;
	return vNode ? { node: vNode.node, edges: vNode.edges, index: vNode.edges.findIndex(e => e.w == w) }
		: undefined
}

function dfsAnalysis(entryNode: number, startTiming: number, full?: boolean): IDFSTask {
	let
		nodes = (this as BaseGraph).size,
		currentNode = -1,
		ranges: number[] = [],
		pre = new Array<number>((this as BaseGraph).size).fill(-1),
		st = new Array<number>((this as BaseGraph).size).fill(-1),
		component = 0,
		timing = 0,
		discovered = (node: number) => pre[node] >= 0,
		stack = new Stack<{ v: number, w: number, t: boolean }>(),
		findAdjacents = (v: number, callback: (v: number, w: number, e: DFSVisitEdge) => void) => {
			for (let array = (this as BaseGraph).adjacentEdges(v), i = array.length - 1; i >= 0; i--) {
				let
					w = array[i];
				if (discovered(w))
					processNonTreeEdge(v, w, callback);
				else {
					stack.push({ v: v, w: w, t: false });
				}
			}
		},
		processNonTreeEdge = (v: number, w: number, callback: (v: number, w: number, e: DFSVisitEdge) => void) => {
			if (st[v] == w)
				callback(v, w, DFSVisitEdge.parent)
			else {
				if (pre[w] < pre[v]) {
					callback(v, w, DFSVisitEdge.back)
				}
				else if (pre[w] > pre[v])
					callback(v, w, DFSVisitEdge.down)
				else
					console.log(v, w, 'Ooopsie!');
			}
		};



	return {
		g: (this as BaseGraph),
		pre: pre,
		st: st,
		nodes: nodes,
		stack: stack,
		cc: () => component,
		timing: () => timing,
		getStart: () => {
			if (currentNode == -1) {
				if (full && (entryNode - 1) >= 0)
					ranges.push(entryNode - 1);
				ranges.push(this.size - 1);
				return currentNode = entryNode;
			}
			if (!full)
				return currentNode = -1;
			while (++currentNode <= ranges[ranges.length - 1] && pre[currentNode] >= 0);
			if (currentNode > ranges[ranges.length - 1]) {
				ranges.pop();
				currentNode = ranges.length ? 0 : -1;
			}
			return currentNode
		},
		run: (startNode: number, callback: (v: number, w: number, e: DFSVisitEdge) => void) => {
			if (!(this as BaseGraph).validNode(startNode))
				return;
			timing = startTiming;
			++component;
			st[startNode] = startNode;
			pre[startNode] = timing++;
			findAdjacents(startNode, callback);
			while (!stack.empty) {
				let
					edge = stack.peek() as { v: number, w: number, t: boolean };
				if (edge.t) {
					callback(edge.v, edge.w, DFSVisitEdge.treeEnd);
					stack.pop();
				} else {
					if (discovered(edge.w)) {
						processNonTreeEdge(edge.v, edge.w, callback);
						stack.pop();
					} else {
						edge.t = true;
						pre[edge.w] = timing++;
						st[edge.w] = edge.v;
						callback(edge.v, edge.w, DFSVisitEdge.tree);
						findAdjacents(edge.w, callback);
					}
				}
			}
			callback(startNode, startNode, DFSVisitEdge.treeEnd);
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
