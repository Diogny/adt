import { selectMany } from "dabbjs/dist/lib/generics";
export class GraphNode {
    constructor(id) {
        this.id = id;
    }
    label() { return String(this.id); }
}
export class LabeledNode extends GraphNode {
    constructor(id, __label) {
        super(id);
        this.__label = __label;
        if (!__label)
            throw new Error(`empty node label`);
    }
    label() { return this.__label; }
}
export class Edge {
    label() { return `(${this.v}>${this.w})`; }
    constructor(v, w) {
        this.v = v;
        this.w = w;
    }
}
export class WeightedEdge extends Edge {
    constructor(v, w, weight) {
        super(v, w);
        this.weight = weight;
        if (Number.isNaN(weight))
            throw new Error(`invalid edge weight`);
    }
    label() { return `(${this.v}>${this.w})::${this.weight}`; }
}
export var EdgeVisitEnum;
(function (EdgeVisitEnum) {
    EdgeVisitEnum[EdgeVisitEnum["tree"] = 0] = "tree";
    EdgeVisitEnum[EdgeVisitEnum["parent"] = 1] = "parent";
    EdgeVisitEnum[EdgeVisitEnum["back"] = 2] = "back";
    EdgeVisitEnum[EdgeVisitEnum["down"] = 3] = "down";
    EdgeVisitEnum[EdgeVisitEnum["cross"] = 4] = "cross";
})(EdgeVisitEnum || (EdgeVisitEnum = {}));
export class BaseGraph {
    label() { return this.name; }
    get size() { return this.__nodes.size; }
    get nextNodeId() { return this.size; }
    node(id) { var _a; return (_a = this.__nodes.get(id)) === null || _a === void 0 ? void 0 : _a.node; }
    nodeLabel(id) { var _a; return ((_a = this.node(id)) === null || _a === void 0 ? void 0 : _a.label()) || ""; }
    hasNode(id) { return !!this.node(id); }
    nodeList() { return Array.from(this.__nodes.values()).map(n => n.node); }
    nodeEdges(id) { var _a; return (_a = this.__nodes.get(id)) === null || _a === void 0 ? void 0 : _a.edges; }
    edges() { return selectMany(Array.from(this.__nodes.values()), (n) => n.edges); }
    constructor(name, directed, weighted, labeled) {
        this.name = name;
        this.directed = directed;
        this.weighted = weighted;
        this.labeled = labeled;
        this.__nodes = new Map();
        this.modified = false;
    }
    nodeDegree(node) { var _a; return ((_a = this.nodeEdges(node)) === null || _a === void 0 ? void 0 : _a.length) || 0; }
    degrees() { return Array.from({ length: this.size }, (n, ndx) => this.nodeDegree(ndx)); }
    indegrees() {
        let array = new Array(this.size).fill(0);
        this.edges().forEach(edge => array[edge.w]++);
        return array;
    }
    validNode(node) { return node >= 0 && node < this.size; }
    addNode(label) {
        let node = this.labeled ?
            new LabeledNode(this.nextNodeId, label) :
            new GraphNode(this.nextNodeId);
        this.__nodes.set(node.id, {
            node: node,
            edges: new Array()
        });
        this.modified = true;
        return node;
    }
    connect(v, w, weight) {
        let startNode = this.__nodes.get(v), endNode = this.__nodes.get(w), createEdge = (nv, nw) => this.weighted ?
            new WeightedEdge(nv, nw, weight) :
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
    disconnect(v, w) {
        let e = getInternalEdge.call(this, v, w);
        if (!e || e.index < 0)
            return false;
        e.edges.splice(e.index, 1);
        this.modified = true;
        if (!this.directed) {
            e = getInternalEdge.call(this, w, v);
            e.edges.splice(e.index, 1);
        }
        return true;
    }
    adjacent(v, w) {
        let vNode = this.__nodes.get(v);
        return !!(vNode === null || vNode === void 0 ? void 0 : vNode.edges.some(n => n.w == w));
    }
    adjacentEdges(node) {
        let vNode = this.__nodes.get(node);
        return (vNode === null || vNode === void 0 ? void 0 : vNode.edges.map(e => e.w)) || [];
    }
    edge(v, w) {
        let e = getInternalEdge.call(this, v, w);
        return e === null || e === void 0 ? void 0 : e.edges[e.index];
    }
    edgeCount() {
        return Array.from(this.__nodes.values()).reduce((sum, item) => sum + item.edges.length, 0);
    }
    // max. number of edges = ½ * |V| * ( |V| - 1 ). 
    //For undirected simple graphs, the graph density is defined as: 
    //D =     2|E|
    //    -----------
    //     |V|(|V| - 1)
    density() {
        return 2 * this.edgeCount() / (this.size * (this.size - 1));
    }
    static create(name, directed, weighted, labeled) {
        if (labeled) {
            if (weighted)
                throw new Error(`weighted labeled graph not supported yet!`);
            else
                return directed ? new LabeledDiGraph(name) : new LabeledGraph(name);
        }
        else if (weighted)
            return directed ? new WeightedDiGraph(name) : new WeightedGraph(name);
        else
            return directed ? new DiGraph(name) : new Graph(name);
    }
}
export class Graph extends BaseGraph {
    constructor(name) {
        super(name, false, false, false);
    }
}
export class DiGraph extends BaseGraph {
    constructor(name) {
        super(name, true, false, false);
    }
}
class BaseWeightedGraph extends BaseGraph {
    nodeEdges(id) { return super.nodeEdges(id); }
    constructor(name, directed) {
        super(name, directed, true, false);
    }
}
export class WeightedGraph extends BaseWeightedGraph {
    constructor(name) {
        super(name, false);
    }
}
export class WeightedDiGraph extends BaseWeightedGraph {
    constructor(name) {
        super(name, true);
    }
}
class BaseLabeledGraph extends BaseGraph {
    node(id) { return super.node(id); }
    constructor(name, directed, weighted) {
        super(name, directed, weighted, true);
    }
}
export class LabeledGraph extends BaseLabeledGraph {
    constructor(name) {
        super(name, false, false);
    }
}
export class LabeledDiGraph extends BaseLabeledGraph {
    constructor(name) {
        super(name, true, false);
    }
}
class BaseLabeledWeightedGraph extends BaseLabeledGraph {
    nodeEdges(id) { return super.nodeEdges(id); }
    constructor(name, directed) {
        super(name, directed, true);
    }
}
function getInternalEdge(v, w) {
    let n = this.nodes.get(v);
    return n ?
        { node: n.node, edges: n.edges, index: n.edges.findIndex(e => e.w == w) }
        : undefined;
}
