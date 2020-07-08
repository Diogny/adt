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

export enum DFSVisitEdge {
	tree,
	parent,
	back,
	down,
	cross
}

export interface EdgeCallback {
	(v: number, w: number): void;
}

export interface EdgeSearchCallback {
	(v: number, w: number, e: DFSVisitEdge): void;
}

export interface ISearchTask {
	g: BaseGraph;
	pre: number[];
	st: number[];
	post: number[];
	nodes: number;
	edgePipe(): { v: number, w: number }[];
	next(): boolean;
	current(): number;
	timing(): number;
	run: (start: number, edgeCallback: EdgeSearchCallback, treeEndCallback: EdgeCallback) => void;
}

export interface IDFSAnalizer {
	name: string;
	directed: boolean;
	startTree(node: number): void;
	visit(v: number, w: number, e: DFSVisitEdge): void;
	endTree(v: number, w: number): void;
	report(): void;
	register(dfs: ISearchTask): void;
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

	public dfs(start: number, edgeCallback: EdgeSearchCallback, treeStartCallback: (n: number) => void, treeEndCallback: EdgeCallback): number {
		return graphSearch.call(this, start, dfsEngine.call(this, start, 0) as ISearchTask,
			edgeCallback, treeStartCallback, treeEndCallback)
	}

	public dfsAnalysis(start: number, analizers: IDFSAnalizer[]): number {
		return graphAnalysis.call(this, start, dfsEngine.call(this, start, 0) as ISearchTask,
			analizers, this.directed)
	}

	public bfs(start: number, edgeCallback: EdgeSearchCallback, treeStartCallback: (n: number) => void, treeEndCallback: EdgeCallback): number {
		return graphSearch.call(this, start, bfsEngine.call(this, start, 0) as ISearchTask,
			edgeCallback, treeStartCallback, treeEndCallback)
	}

	public bfsAnalysis(start: number, analizers: IDFSAnalizer[]): number {
		return graphAnalysis.call(this, start, bfsEngine.call(this, start, 0) as ISearchTask,
			analizers, this.directed)
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

function graphSearch(start: number, engine: ISearchTask, edgeCallback: EdgeSearchCallback,
	treeStartCallback: (n: number) => void, treeEndCallback: EdgeCallback): number {
	let
		count = 0;
	while (engine.next()) {
		treeStartCallback(start = engine.current());
		count++;
		engine.run(start, edgeCallback, treeEndCallback);
	}
	return count
}

function graphAnalysis(start: number, engine: ISearchTask, analizers: IDFSAnalizer[], directed: boolean): number {
	let
		edgeCallback = (v: number, w: number, e: DFSVisitEdge) =>
			analizers.forEach(a => a.visit(v, w, e)),
		endTreeCallback = (v: number, w: number) =>
			analizers.forEach(a => a.endTree(v, w)),
		count = 0;
	analizers.forEach(a => {
		if (directed != a.directed)
			throw `edge analizer direction does not match graph`
		a.register(engine)
	});
	while (engine.next()) {
		count++;
		analizers.forEach(a => a.startTree(start = engine.current()));
		engine.run(start, edgeCallback, endTreeCallback);
	}
	analizers.forEach(a => a.report());
	return count
}

function bfsEngine(entryNode: number, startTiming: number): ISearchTask {
	let
		g = (this as BaseGraph),
		nodes = g.size,
		pre = new Array<number>(nodes).fill(-1),
		st = new Array<number>(nodes).fill(-1),
		post: number[] = <any>void 0,
		timing = startTiming,
		postTiming = startTiming,
		discovered = (node: number) => pre[node] >= 0,
		enumerator = enumConditional(entryNode, nodes - 1, discovered),
		queue = new Queue<{ v: number, w: number }>(),
		bfsFindAdjacents = (v: number, edgeCallback: EdgeSearchCallback, processEdge: (v: number, w: number, edgeCallback: EdgeSearchCallback) => void) => {
			let
				empty = true;
			for (let array = g.adjacentEdges(v), i = 0, count = array.length; i < count; i++) {
				let
					w = array[i];
				if (discovered(w))
					processEdge(v, w, edgeCallback);
				else {
					queue.enqueue({ v: v, w: w });
					empty = false;
				}
			}
			empty && (console.log(`leaf: ${v}`))
		},
		bfsProcessNonTreeEdge = (v: number, w: number, edgeCallback: EdgeSearchCallback) => {
			if (st[v] == w)
				edgeCallback(v, w, DFSVisitEdge.parent)
			else {
				if (pre[w] < pre[v]) {
					edgeCallback(v, w, DFSVisitEdge.back)
				}
				else if (pre[w] > pre[v])
					edgeCallback(v, w, DFSVisitEdge.down)
				else
					console.log(v, w, 'Ooopsie!');
			}
		},
		bfsProcessNonTreeDirectedEdge = (v: number, w: number, edgeCallback: EdgeSearchCallback) => {
		},
		bfs = (startNode: number, edgeCallback: EdgeSearchCallback, treeEndCallback: EdgeCallback) => {
			st[startNode] = startNode;
			pre[startNode] = timing++;
			bfsFindAdjacents(startNode, edgeCallback, bfsProcessNonTreeEdge);
			while (!queue.empty) {
				let
					edge = queue.dequeue() as { v: number, w: number };

				if (discovered(edge.w)) {
					bfsProcessNonTreeEdge(edge.v, edge.w, edgeCallback);
				} else {
					pre[edge.w] = timing++;
					st[edge.w] = edge.v;
					edgeCallback(edge.v, edge.w, DFSVisitEdge.tree);
					bfsFindAdjacents(edge.w, edgeCallback, bfsProcessNonTreeEdge);
				}
			}
			treeEndCallback(startNode, startNode);
		},
		bfsDirected = (startNode: number, edgeCallback: EdgeSearchCallback, treeEndCallback: EdgeCallback) => {
			st[startNode] = startNode;
			pre[startNode] = timing++;
			//
			post[startNode] = postTiming++;
			treeEndCallback(startNode, startNode);
		};

	g.directed && (post = new Array<number>(nodes).fill(-1));
	return {
		g: g,
		nodes: nodes,
		pre: pre,
		st: st,
		post: post,
		timing: () => timing,
		next: () => enumerator.next(),
		current: () => enumerator.current(),
		edgePipe: () => queue.items,
		run: g.directed ? bfsDirected : bfs
	}
}

function dfsEngine(entryNode: number, startTiming: number): ISearchTask {
	let
		g = (this as BaseGraph),
		nodes = g.size,
		pre = new Array<number>(nodes).fill(-1),
		st = new Array<number>(nodes).fill(-1),
		post: number[] = <any>void 0,
		timing = startTiming,
		postTiming = startTiming,
		discovered = (node: number) => pre[node] >= 0,
		enumerator = enumConditional(entryNode, nodes - 1, discovered),
		stack = new Stack<{ v: number, w: number, t: boolean }>(),
		dfsFindAdjacents = (v: number, edgeCallback: EdgeSearchCallback, processEdge: (v: number, w: number, edgeCallback: EdgeSearchCallback) => void) => {
			for (let array = g.adjacentEdges(v), i = array.length - 1; i >= 0; i--) {
				let
					w = array[i];
				if (discovered(w))
					processEdge(v, w, edgeCallback);
				else {
					stack.push({ v: v, w: w, t: false });
				}
			}
		},
		dfsProcessNonTreeEdge = (v: number, w: number, edgeCallback: EdgeSearchCallback) => {
			if (st[v] == w)
				edgeCallback(v, w, DFSVisitEdge.parent)
			else {
				if (pre[w] < pre[v]) {
					edgeCallback(v, w, DFSVisitEdge.back)
				}
				else if (pre[w] > pre[v])
					edgeCallback(v, w, DFSVisitEdge.down)
				else
					console.log(v, w, 'Ooopsie!');
			}
		},
		dfsProcessNonTreeDirectedEdge = (v: number, w: number, edgeCallback: EdgeSearchCallback) => {
			if (pre[v] < pre[w])
				edgeCallback(v, w, DFSVisitEdge.down)
			else if (post[v] == -1 && post[w] == -1)
				edgeCallback(v, w, DFSVisitEdge.back)
			else
				edgeCallback(v, w, DFSVisitEdge.cross)
		},
		dfs = (startNode: number, edgeCallback: EdgeSearchCallback, treeEndCallback: EdgeCallback) => {
			st[startNode] = startNode;
			pre[startNode] = timing++;
			dfsFindAdjacents(startNode, edgeCallback, dfsProcessNonTreeEdge);
			while (!stack.empty) {
				let
					edge = stack.peek() as { v: number, w: number, t: boolean };
				if (edge.t) {
					treeEndCallback(edge.v, edge.w);
					stack.pop();
				} else {
					if (discovered(edge.w)) {
						dfsProcessNonTreeEdge(edge.v, edge.w, edgeCallback);
						stack.pop();
					} else {
						edge.t = true;
						pre[edge.w] = timing++;
						st[edge.w] = edge.v;
						edgeCallback(edge.v, edge.w, DFSVisitEdge.tree);
						dfsFindAdjacents(edge.w, edgeCallback, dfsProcessNonTreeEdge);
					}
				}
			}
			treeEndCallback(startNode, startNode);
		},
		dfsDirected = (startNode: number, edgeCallback: EdgeSearchCallback, treeEndCallback: EdgeCallback) => {
			st[startNode] = startNode;
			pre[startNode] = timing++;
			dfsFindAdjacents(startNode, edgeCallback, dfsProcessNonTreeDirectedEdge);
			while (!stack.empty) {
				let
					edge = stack.peek() as { v: number, w: number, t: boolean };
				if (edge.t) {
					post[edge.w] = postTiming++;
					treeEndCallback(edge.v, edge.w);
					stack.pop();
				} else {
					if (discovered(edge.w)) {
						dfsProcessNonTreeDirectedEdge(edge.v, edge.w, edgeCallback);
						stack.pop();
					} else {
						edge.t = true;
						pre[edge.w] = timing++;
						st[edge.w] = edge.v;
						edgeCallback(edge.v, edge.w, DFSVisitEdge.tree);
						dfsFindAdjacents(edge.w, edgeCallback, dfsProcessNonTreeDirectedEdge);
					}
				}
			}
			post[startNode] = postTiming++;
			treeEndCallback(startNode, startNode);
		};
	g.directed && (post = new Array<number>(nodes).fill(-1));
	return {
		g: g,
		nodes: nodes,
		pre: pre,
		st: st,
		post: post,
		timing: () => timing,
		next: () => enumerator.next(),
		current: () => enumerator.current(),
		edgePipe: () => stack.items,
		run: g.directed ? dfsDirected : dfs
	}
}

function enumConditional(start: number, max: number, discovered: (ndx: number) => boolean) {
	var
		nextNdx = (ndx: number) => ndx >= max ? 0 : ++ndx,
		curr = start < 0 || start > max ? -1 : start,
		first = true;

	return {
		current: () => curr,
		next: () => {
			if (curr < 0)
				return false;
			if (first) {
				return first = false, true
			} else {
				while (!((curr = nextNdx(curr)) == start || !discovered(curr)));
				return curr != start;
			}
		}
	}
}
