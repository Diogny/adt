"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabeledDiGraph = exports.LabeledGraph = exports.WeightedDiGraph = exports.WeightedGraph = exports.DiGraph = exports.Graph = exports.BaseGraph = exports.DFSVisitEdge = exports.WeightedEdge = exports.Edge = exports.LabeledNode = exports.GraphNode = void 0;
const Utils_1 = require("./Utils");
class GraphNode {
    constructor(id) {
        this.id = id;
    }
    label() { return String(this.id); }
}
exports.GraphNode = GraphNode;
class LabeledNode extends GraphNode {
    constructor(id, __label) {
        super(id);
        this.__label = __label;
        if (!__label)
            throw `empty node label`;
    }
    label() { return this.__label; }
}
exports.LabeledNode = LabeledNode;
class Edge {
    constructor(v, w) {
        this.v = v;
        this.w = w;
    }
    label() { return `(${this.v}>${this.w})`; }
}
exports.Edge = Edge;
class WeightedEdge extends Edge {
    constructor(v, w, weight) {
        super(v, w);
        this.weight = weight;
        if (Number.isNaN(weight))
            throw `invalid edge weight`;
    }
    label() { return `(${this.v}>${this.w})::${this.weight}`; }
}
exports.WeightedEdge = WeightedEdge;
var DFSVisitEdge;
(function (DFSVisitEdge) {
    DFSVisitEdge[DFSVisitEdge["tree"] = 0] = "tree";
    DFSVisitEdge[DFSVisitEdge["parent"] = 1] = "parent";
    DFSVisitEdge[DFSVisitEdge["back"] = 2] = "back";
    DFSVisitEdge[DFSVisitEdge["down"] = 3] = "down";
    DFSVisitEdge[DFSVisitEdge["cross"] = 4] = "cross";
})(DFSVisitEdge = exports.DFSVisitEdge || (exports.DFSVisitEdge = {}));
class BaseGraph {
    constructor(name, directed, weighted, labeled) {
        this.name = name;
        this.directed = directed;
        this.weighted = weighted;
        this.labeled = labeled;
        this.nodes = new Map();
        this.modified = false;
    }
    label() { return this.name; }
    get size() { return this.nodes.size; }
    get nextNodeId() { return this.size; }
    node(id) { var _a; return (_a = this.nodes.get(id)) === null || _a === void 0 ? void 0 : _a.node; }
    nodeLabel(id) { var _a; return ((_a = this.node(id)) === null || _a === void 0 ? void 0 : _a.label()) || ""; }
    hasNode(id) { var _a; return !!((_a = this.nodes.get(id)) === null || _a === void 0 ? void 0 : _a.node); }
    nodeList() { return Array.from(this.nodes.values()).map(n => n.node); }
    nodeEdges(id) { var _a; return (_a = this.nodes.get(id)) === null || _a === void 0 ? void 0 : _a.edges; }
    edges() { return Utils_1.selectMany(Array.from(this.nodes.values()), (n) => n.edges); }
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
        this.nodes.set(node.id, {
            node: node,
            edges: new Array()
        });
        this.modified = true;
        return node;
    }
    connect(v, w, weight) {
        let startNode = this.nodes.get(v), endNode = this.nodes.get(w), createEdge = (nv, nw) => this.weighted ?
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
        let vNode = this.nodes.get(v);
        return !!(vNode === null || vNode === void 0 ? void 0 : vNode.edges.some(n => n.w == w));
    }
    adjacentEdges(node) {
        let vNode = this.nodes.get(node);
        return (vNode === null || vNode === void 0 ? void 0 : vNode.edges.map(e => e.w)) || [];
    }
    edge(v, w) {
        let e = getInternalEdge.call(this, v, w);
        return e === null || e === void 0 ? void 0 : e.edges[e.index];
    }
    edgeCount() {
        return Array.from(this.nodes.values()).reduce((sum, item) => sum + item.edges.length, 0);
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
                throw `weighted labeled graph not supported yet!`;
            else
                return directed ? new LabeledDiGraph(name) : new LabeledGraph(name);
        }
        else {
            if (weighted)
                return directed ? new WeightedDiGraph(name) : new WeightedGraph(name);
            else
                return directed ? new DiGraph(name) : new Graph(name);
        }
    }
}
exports.BaseGraph = BaseGraph;
class Graph extends BaseGraph {
    constructor(name) {
        super(name, false, false, false);
    }
}
exports.Graph = Graph;
class DiGraph extends BaseGraph {
    constructor(name) {
        super(name, true, false, false);
    }
}
exports.DiGraph = DiGraph;
class BaseWeightedGraph extends BaseGraph {
    nodeEdges(id) { var _a; return (_a = this.nodes.get(id)) === null || _a === void 0 ? void 0 : _a.edges; }
    constructor(name, directed) {
        super(name, directed, true, false);
    }
}
class WeightedGraph extends BaseWeightedGraph {
    constructor(name) {
        super(name, false);
    }
}
exports.WeightedGraph = WeightedGraph;
class WeightedDiGraph extends BaseWeightedGraph {
    constructor(name) {
        super(name, true);
    }
}
exports.WeightedDiGraph = WeightedDiGraph;
class BaseLabeledGraph extends BaseGraph {
    node(id) { var _a; return (_a = this.nodes.get(id)) === null || _a === void 0 ? void 0 : _a.node; }
    constructor(name, directed, weighted) {
        super(name, directed, weighted, true);
    }
}
class LabeledGraph extends BaseLabeledGraph {
    constructor(name) {
        super(name, false, false);
    }
}
exports.LabeledGraph = LabeledGraph;
class LabeledDiGraph extends BaseLabeledGraph {
    constructor(name) {
        super(name, true, false);
    }
}
exports.LabeledDiGraph = LabeledDiGraph;
class BaseLabeledWeightedGraph extends BaseLabeledGraph {
    nodeEdges(id) { var _a; return (_a = this.nodes.get(id)) === null || _a === void 0 ? void 0 : _a.edges; }
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
