interface ILabel {
    label(): string;
}
export declare class GraphNode implements ILabel {
    id: number;
    constructor(id: number);
    label(): string;
}
export declare class LabeledNode extends GraphNode {
    __label: string;
    constructor(id: number, __label: string);
    label(): string;
}
export interface IEdge {
    v: number;
    w: number;
}
export declare class Edge implements ILabel, IEdge {
    v: number;
    w: number;
    label(): string;
    constructor(v: number, w: number);
}
export declare class WeightedEdge extends Edge {
    weight: number;
    constructor(v: number, w: number, weight: number);
    label(): string;
}
export declare enum EdgeVisitEnum {
    tree = 0,
    parent = 1,
    back = 2,
    down = 3,
    cross = 4
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
    edges(): {
        v: number;
        w: number;
    }[];
    next(): boolean;
    current(): number;
    timing(): number;
    search: (start: number) => Generator<IEdgeSearch, number>;
}
export interface IDFSAnalyzer {
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
    node: GraphNode;
    edges: Edge[];
}
export declare abstract class BaseGraph implements IGraph, ILabel {
    name: string;
    directed: boolean;
    weighted: boolean;
    labeled: boolean;
    label(): string;
    modified: boolean;
    protected __nodes: Map<number, NodeInternal>;
    get size(): number;
    get nextNodeId(): number;
    node(id: number): GraphNode | undefined;
    nodeLabel(id: number): string;
    hasNode(id: number): boolean;
    nodeList(): GraphNode[];
    nodeEdges(id: number): Edge[] | undefined;
    edges(): Edge[];
    constructor(name: string, directed: boolean, weighted: boolean, labeled: boolean);
    nodeDegree(node: number): number;
    degrees(): number[];
    indegrees(): number[];
    validNode(node: number): boolean;
    addNode(label?: string): GraphNode;
    connect(v: number, w: number, weight?: number): boolean;
    disconnect(v: number, w: number): boolean;
    adjacent(v: number, w: number): boolean;
    adjacentEdges(node: number): number[];
    edge(v: number, w: number): Edge | undefined;
    edgeCount(): number;
    density(): number;
    static create(name: string, directed: boolean, weighted: boolean, labeled: boolean): BaseGraph;
}
export declare class Graph extends BaseGraph {
    constructor(name: string);
}
export declare class DiGraph extends BaseGraph {
    constructor(name: string);
}
declare abstract class BaseWeightedGraph extends BaseGraph {
    nodeEdges(id: number): WeightedEdge[] | undefined;
    constructor(name: string, directed: boolean);
}
export declare class WeightedGraph extends BaseWeightedGraph {
    constructor(name: string);
}
export declare class WeightedDiGraph extends BaseWeightedGraph {
    constructor(name: string);
}
declare abstract class BaseLabeledGraph extends BaseGraph {
    node(id: number): LabeledNode | undefined;
    constructor(name: string, directed: boolean, weighted: boolean);
}
export declare class LabeledGraph extends BaseLabeledGraph {
    constructor(name: string);
}
export declare class LabeledDiGraph extends BaseLabeledGraph {
    constructor(name: string);
}
export {};
