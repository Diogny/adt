import Stack from "./Stack";
import Queue from "./Queue";
import { toBool, range } from "./Utils";

interface ILabel {
	label(): string;
}

export class Node implements ILabel {

	constructor(public id: number) { }

	public label(): string { return String(this.id) }

}

export class LabeledNode extends Node {

	constructor(id: number, public __label: string) {
		super(id);
		if (!__label)
			throw `empty node label`
	}

	public label(): string { return this.__label }

}

export class Edge implements ILabel {

	public label(): string { return `(${this.v}>${this.w})` }

	constructor(public v: number, public w: number) { }

}

export class WeightedEdge extends Edge {

	constructor(v: number, w: number, public weight: number) {
		super(v, w);
		if (Number.isNaN(weight))
			throw `invalid edge weight`
	}

	public label(): string { return `(${this.v}>${this.w})::${this.weight}` }

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
	treeEnd,
	parent,
	back,
	down,
	//DiGraphs DAGs
	cross
}

export interface SearchCallback {
	(v: number, w: number, e: DFSVisitEdge): void;
}

export interface ISearchTask {
	g: BaseGraph;
	pre: number[];
	st: number[];
	post: number[];
	stack: Stack<{ v: number, w: number }>;
	nodes: number;
	getStart(): number;
	cc(): number;
	timing(): number;
	run: (start: number, callback: SearchCallback) => void;
}

export interface IDFSAnalizer {
	name: string;
	directed: boolean;
	register(dfs: ISearchTask): void;
	start(node: number): void;
	visit(v: number, w: number, e: DFSVisitEdge): void;
	end(): void;
}

export interface IPoint2D {
	x: number;
	y: number;
}

export interface IGraphStructureEdge {
	from: string;
	to: string;
	w?: number;
}

export interface IGraphStructure {
	name: string;
	directed: boolean;
	weighted: boolean;
	labeled: boolean;
	nodes: (number | string)[];
	edges: IGraphStructureEdge[];
	layout: Map<number, IPoint2D>;
}

export interface IGraph {
	name: string;
	directed: boolean;
	weighted: boolean;
	labeled: boolean;
	modified: boolean;
}

interface NodeInternal {
	node: Node,
	edges: Edge[]
}

interface NodeInternalIndex extends NodeInternal {
	index: number;
}

export abstract class BaseGraph implements IGraph, ILabel {

	public label(): string { return this.name }

	modified: boolean;

	protected nodes: Map<number, NodeInternal>;

	public get size(): number { return this.nodes.size }

	public get nextNodeId(): number { return this.size }

	public node(id: number): Node | undefined { return this.nodes.get(id)?.node }

	public nodeLabel(id: number): string { return this.node(id)?.label() || "" }

	public hasNode(id: number): boolean { return !!this.nodes.get(id)?.node }

	public nodeList(): Node[] { return Array.from(this.nodes.values()).map(n => n.node) }

	public edges(id: number): Edge[] | undefined { return this.nodes.get(id)?.edges }

	constructor(public name: string, public directed: boolean, public weighted: boolean, public labeled: boolean) {
		this.nodes = new Map();
		this.modified = false;
	}

	public validNode(node: number) { return node >= 0 && node < this.size }

	public addNode(label?: string): Node {
		let
			node = this.labeled ?
				new LabeledNode(this.nextNodeId, <string>label) :
				new Node(this.nextNodeId);
		this.nodes.set(node.id, <NodeInternal>{
			node: node,
			edges: new Array()
		});
		this.modified = true;
		return node;
	}

	public connect(v: number, w: number, weight?: number): boolean {
		let
			startNode = this.nodes.get(v),
			endNode = this.nodes.get(w),
			createEdge = (nv: number, nw: number): Edge =>
				this.weighted ?
					new WeightedEdge(nv, nw, <any>weight) :
					new Edge(nv, nw);
		if (!startNode || !endNode)
			return false;
		if (startNode.edges.some(e => e.w == w))
			return false;
		startNode.edges.push(createEdge(v, w));
		this.modified = true;
		!this.directed
			&& endNode.edges.push(createEdge(w, v));
		return true;
	}

	public disconnect(v: number, w: number): boolean {
		let
			e = edge.call(this, v, w) as NodeInternalIndex;
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

	public dfs(start: number, callback: SearchCallback, full?: boolean) {
		let
			dfs = dfsEngine//(this.directed ? depthFirstSearchDirected : depthFirstSearch)
				.call(this, start, 0, full) as ISearchTask;
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
			dfs = dfsEngine//(this.directed ? depthFirstSearchDirected : depthFirstSearch)
				.call(this, start, 0, full) as ISearchTask;
		analizers.forEach(a => {
			if (this.directed != a.directed)
				throw `edge analizer direction does not match the graph`
			a.register(dfs)
		});
		while ((start = dfs.getStart()) != -1) {
			analizers.forEach(a => a.start(start));
			dfs.run(start, callback);
		}
		analizers.forEach(a => a.end());
	}

	//[Obsolete]
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

	public static create(name: string, directed: boolean, weighted: boolean, labeled: boolean): BaseGraph {
		if (labeled) {
			if (weighted)
				throw `weighted labeled graph not supported yet!`
			else
				return directed ? new LabeledDiGraph(name) : new LabeledGraph(name);
		} else {
			if (weighted)
				return directed ? new WeightedDiGraph(name) : new WeightedGraph(name);
			else
				return directed ? new DiGraph(name) : new Graph(name);
		}
	}

	public static fromJSON(content: { [x: string]: any }): BaseGraph {
		let
			name = content["name"],
			directed = toBool(content["directed"]),
			weighted = toBool(content["weighted"]),
			labeled = !!content["labels"],
			labels = (labeled ? Array.from(content["labels"]) : undefined) as string[],
			labelMap = new Map<string, number>(),
			nodes = labeled ? 0 : parseInt(content["nodes"]),
			edges = Array.from(content["edges"]) as { from: number | string, to: number | string, w?: number }[],
			getNode = (nodeOrLabel: number | string): { node: number, label?: string } => {
				if (labeled) {
					let
						n = labelMap.get(<string>nodeOrLabel);
					return {
						node: n != undefined ? <number>n : -1,
						label: <string>nodeOrLabel
					}
				} else
					return { node: g.hasNode(<number>nodeOrLabel) ? <number>nodeOrLabel : -1 }
			},
			getEdge = (e: { from: number | string, to: number | string, w?: number }): {
				v: { node: number, label?: string },
				w: { node: number, label?: string },
				weight?: number
			} => ({
				v: getNode(e.from),
				w: getNode(e.to),
				weight: e.w
			}),
			g = BaseGraph.create(name, directed, weighted, labeled);

		if (labeled) {
			if (!labels)
				throw `invalid graph labels`
			labels.forEach((label: string, node: number) => {
				g.addNode(label);
				labelMap.set(label, node)
			})
		} else {
			range(0, nodes).forEach(n => g.addNode())
		}

		if (!edges)
			throw `invalid edges`;
		edges.forEach((e) => {
			let
				edge = getEdge(e);
			if (edge.v.node == -1 || edge.w.node == -1)
				throw `invalid edge: ${e}`;
			if (weighted) {
				!edge.weight && (edge.weight = 0);
				g.connect(edge.v.node, edge.w.node, edge.weight)
			} else
				g.connect(edge.v.node, edge.w.node)
		});
		return g
	}
}

export class Graph extends BaseGraph {
	constructor(name: string) {
		super(name, false, false, false)
	}
}

export class DiGraph extends BaseGraph {
	constructor(name: string) {
		super(name, true, false, false)
	}
}

abstract class BaseWeightedGraph extends BaseGraph {

	public edges(id: number): WeightedEdge[] | undefined { return this.nodes.get(id)?.edges as WeightedEdge[] }

	constructor(name: string, directed: boolean) {
		super(name, directed, true, false)
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

	constructor(name: string, directed: boolean, weighted: boolean) {
		super(name, directed, weighted, true)
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
}

function edge(v: number, w: number): NodeInternalIndex | undefined {
	let
		n = this.nodes.get(v) as NodeInternal | undefined;
	return n ?
		{ node: n.node, edges: n.edges, index: n.edges.findIndex(e => e.w == w) }
		: undefined
}

function dfsEngine(entryNode: number, startTiming: number, full?: boolean): ISearchTask {
	let
		g = (this as BaseGraph),
		nodes = g.size,
		currentNode = -1,
		ranges: number[] = [],
		pre = new Array<number>(nodes).fill(-1),
		post: number[] = <any>void 0,
		st = new Array<number>(nodes).fill(-1),
		component = 0,
		timing = startTiming,
		postTiming = startTiming,
		discovered = (node: number) => pre[node] >= 0,
		stack = new Stack<{ v: number, w: number, t: boolean }>(),
		findAdjacents = (v: number, callback: SearchCallback, processEdge: (v: number, w: number, callback: SearchCallback) => void) => {
			for (let array = g.adjacentEdges(v), i = array.length - 1; i >= 0; i--) {
				let
					w = array[i];
				if (discovered(w))
					processEdge(v, w, callback);
				else {
					stack.push({ v: v, w: w, t: false });
				}
			}
		},
		processNonTreeEdge = (v: number, w: number, callback: SearchCallback) => {
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
		},
		processNonTreeDirectedEdge = (v: number, w: number, callback: SearchCallback) => {
			if (pre[v] < pre[w])
				callback(v, w, DFSVisitEdge.down)
			else if (post[v] == -1 && post[w] == -1)
				callback(v, w, DFSVisitEdge.back)
			else
				callback(v, w, DFSVisitEdge.cross)
		},
		dfs = (startNode: number, callback: SearchCallback) => {
			++component;
			st[startNode] = startNode;
			pre[startNode] = timing++;
			findAdjacents(startNode, callback, processNonTreeEdge);
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
						findAdjacents(edge.w, callback, processNonTreeEdge);
					}
				}
			}
			callback(startNode, startNode, DFSVisitEdge.treeEnd);
		},
		dfsDirected = (startNode: number, callback: SearchCallback) => {
			++component;
			st[startNode] = startNode;
			pre[startNode] = timing++;
			findAdjacents(startNode, callback, processNonTreeDirectedEdge);
			while (!stack.empty) {
				let
					edge = stack.peek() as { v: number, w: number, t: boolean };
				if (edge.t) {
					post[edge.w] = postTiming++;
					callback(edge.v, edge.w, DFSVisitEdge.treeEnd);
					stack.pop();
				} else {
					if (discovered(edge.w)) {
						processNonTreeDirectedEdge(edge.v, edge.w, callback);
						stack.pop();
					} else {
						edge.t = true;
						pre[edge.w] = timing++;
						st[edge.w] = edge.v;
						callback(edge.v, edge.w, DFSVisitEdge.tree);
						findAdjacents(edge.w, callback, processNonTreeDirectedEdge);
					}
				}
			}
			post[startNode] = postTiming++;
			callback(startNode, startNode, DFSVisitEdge.treeEnd);
		};
	g.directed && (post = new Array<number>(nodes).fill(-1));
	return {
		g: g,
		pre: pre,
		post: post,
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
		run: g.directed ? dfsDirected : dfs
	}
}
