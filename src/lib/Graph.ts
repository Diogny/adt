import { selectMany } from "./Utils";

interface ILabel {
	label(): string;
}

export class GraphNode implements ILabel {

	constructor(public id: number) { }

	public label(): string { return String(this.id) }
}

export class LabeledNode extends GraphNode {

	constructor(id: number, public __label: string) {
		super(id);
		if (!__label)
			throw `empty node label`
	}

	public label(): string { return this.__label }
}

export interface IEdge {
	v: number;
	w: number;
}

export class Edge implements ILabel, IEdge {

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

export enum EdgeVisitEnum {
	tree,
	parent,
	back,
	down,
	cross
}

export interface EdgeCallback {
	(v: number, w: number): void;
}

export interface IEdgeSearch extends IEdge {
	e: EdgeVisitEnum;
}

export interface EdgeSearchCallback {
	(v: number, w: number, e: EdgeVisitEnum): void;
}

export interface ISearchTask {
	g: BaseGraph;
	pre: number[];
	st: number[];
	post: number[];
	nodes: number;
	initial(): number;
	edges(): { v: number, w: number }[];
	next(): boolean;
	current(): number;
	timing(): number;
	search: (start: number) => Generator<IEdgeSearch, number>;
}

export interface IDFSAnalizer {
	name: string;
	directed: boolean;
	visit(v: number, w: number, e: EdgeVisitEnum): void;
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
	node: GraphNode,
	edges: Edge[]
}

interface NodeInternalIndex extends NodeInternal {
	index: number;
}

export abstract class BaseGraph implements IGraph, ILabel {

	public label(): string { return this.name }

	modified: boolean;

	protected __nodes: Map<number, NodeInternal>;

	public get size(): number { return this.__nodes.size }

	public get nextNodeId(): number { return this.size }

	public node(id: number): GraphNode | undefined { return this.__nodes.get(id)?.node }

	public nodeLabel(id: number): string { return this.node(id)?.label() || "" }

	public hasNode(id: number): boolean { return !!this.node(id) }

	public nodeList(): GraphNode[] { return Array.from(this.__nodes.values()).map(n => n.node) }

	public nodeEdges(id: number): Edge[] | undefined { return this.__nodes.get(id)?.edges }

	public edges(): Edge[] { return selectMany<NodeInternal, Edge>(Array.from(this.__nodes.values()), (n) => n.edges) }

	constructor(public name: string, public directed: boolean, public weighted: boolean, public labeled: boolean) {
		this.__nodes = new Map();
		this.modified = false;
	}

	public nodeDegree(node: number): number { return this.nodeEdges(node)?.length || 0 }

	public degrees(): number[] { return Array.from({ length: this.size }, (n, ndx) => this.nodeDegree(ndx)) }

	public indegrees(): number[] {
		let
			array = new Array(this.size).fill(0);
		this.edges().forEach(edge => array[edge.w]++)
		return array
	}

	public validNode(node: number) { return node >= 0 && node < this.size }

	public addNode(label?: string): GraphNode {
		let
			node = this.labeled ?
				new LabeledNode(this.nextNodeId, <string>label) :
				new GraphNode(this.nextNodeId);
		this.__nodes.set(node.id, <NodeInternal>{
			node: node,
			edges: new Array()
		});
		this.modified = true;
		return node;
	}

	public connect(v: number, w: number, weight?: number): boolean {
		let
			startNode = this.__nodes.get(v),
			endNode = this.__nodes.get(w),
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
			e = getInternalEdge.call(this, v, w) as NodeInternalIndex;
		if (!e || e.index < 0)
			return false;
		e.edges.splice(e.index, 1);
		this.modified = true;
		if (!this.directed) {
			e = <NodeInternalIndex>getInternalEdge.call(this, w, v);
			e.edges.splice(e.index, 1);
		}
		return true;
	}

	public adjacent(v: number, w: number): boolean {
		let
			vNode = this.__nodes.get(v);
		return !!vNode?.edges.some(n => n.w == w)
	}

	public adjacentEdges(node: number): number[] {
		let
			vNode = this.__nodes.get(node);
		return vNode?.edges.map(e => e.w) || []
	}

	public edge(v: number, w: number): Edge | undefined {
		let
			e = getInternalEdge.call(this, v, w) as { node: GraphNode, edges: Edge[], index: number } | undefined;
		return e?.edges[e.index]
	}

	public edgeCount(): number {
		return Array.from(this.__nodes.values()).reduce((sum, item) => sum + item.edges.length, 0)
	}

	// max. number of edges = ½ * |V| * ( |V| - 1 ). 
	//For undirected simple graphs, the graph density is defined as: 
	//D =     2|E|
	//    -----------
	//     |V|(|V| - 1)
	public density(): number {
		return 2 * this.edgeCount() / (this.size * (this.size - 1))
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

	public nodeEdges(id: number): WeightedEdge[] | undefined { return super.nodeEdges(id) as WeightedEdge[] }

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

	public node(id: number): LabeledNode | undefined { return super.node(id) as LabeledNode }

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

	public nodeEdges(id: number): WeightedEdge[] | undefined { return super.nodeEdges(id) as WeightedEdge[] }

	constructor(name: string, directed: boolean) {
		super(name, directed, true)
	}
}

function getInternalEdge(v: number, w: number): NodeInternalIndex | undefined {
	let
		n = this.nodes.get(v) as NodeInternal | undefined;
	return n ?
		{ node: n.node, edges: n.edges, index: n.edges.findIndex(e => e.w == w) }
		: undefined
}
