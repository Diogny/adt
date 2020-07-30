"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabeledDiGraph = exports.LabeledGraph = exports.WeightedDiGraph = exports.WeightedGraph = exports.DiGraph = exports.Graph = exports.BaseGraph = exports.EdgeVisitEnum = exports.WeightedEdge = exports.Edge = exports.LabeledNode = exports.GraphNode = void 0;
var tslib_1 = require("tslib");
var Utils_1 = require("./Utils");
var GraphNode = /** @class */ (function () {
    function GraphNode(id) {
        this.id = id;
    }
    GraphNode.prototype.label = function () { return String(this.id); };
    return GraphNode;
}());
exports.GraphNode = GraphNode;
var LabeledNode = /** @class */ (function (_super) {
    tslib_1.__extends(LabeledNode, _super);
    function LabeledNode(id, __label) {
        var _this = _super.call(this, id) || this;
        _this.__label = __label;
        if (!__label)
            throw "empty node label";
        return _this;
    }
    LabeledNode.prototype.label = function () { return this.__label; };
    return LabeledNode;
}(GraphNode));
exports.LabeledNode = LabeledNode;
var Edge = /** @class */ (function () {
    function Edge(v, w) {
        this.v = v;
        this.w = w;
    }
    Edge.prototype.label = function () { return "(" + this.v + ">" + this.w + ")"; };
    return Edge;
}());
exports.Edge = Edge;
var WeightedEdge = /** @class */ (function (_super) {
    tslib_1.__extends(WeightedEdge, _super);
    function WeightedEdge(v, w, weight) {
        var _this = _super.call(this, v, w) || this;
        _this.weight = weight;
        if (Number.isNaN(weight))
            throw "invalid edge weight";
        return _this;
    }
    WeightedEdge.prototype.label = function () { return "(" + this.v + ">" + this.w + ")::" + this.weight; };
    return WeightedEdge;
}(Edge));
exports.WeightedEdge = WeightedEdge;
var EdgeVisitEnum;
(function (EdgeVisitEnum) {
    EdgeVisitEnum[EdgeVisitEnum["tree"] = 0] = "tree";
    EdgeVisitEnum[EdgeVisitEnum["parent"] = 1] = "parent";
    EdgeVisitEnum[EdgeVisitEnum["back"] = 2] = "back";
    EdgeVisitEnum[EdgeVisitEnum["down"] = 3] = "down";
    EdgeVisitEnum[EdgeVisitEnum["cross"] = 4] = "cross";
})(EdgeVisitEnum = exports.EdgeVisitEnum || (exports.EdgeVisitEnum = {}));
var BaseGraph = /** @class */ (function () {
    function BaseGraph(name, directed, weighted, labeled) {
        this.name = name;
        this.directed = directed;
        this.weighted = weighted;
        this.labeled = labeled;
        this.__nodes = new Map();
        this.modified = false;
    }
    BaseGraph.prototype.label = function () { return this.name; };
    Object.defineProperty(BaseGraph.prototype, "size", {
        get: function () { return this.__nodes.size; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseGraph.prototype, "nextNodeId", {
        get: function () { return this.size; },
        enumerable: false,
        configurable: true
    });
    BaseGraph.prototype.node = function (id) { var _a; return (_a = this.__nodes.get(id)) === null || _a === void 0 ? void 0 : _a.node; };
    BaseGraph.prototype.nodeLabel = function (id) { var _a; return ((_a = this.node(id)) === null || _a === void 0 ? void 0 : _a.label()) || ""; };
    BaseGraph.prototype.hasNode = function (id) { return !!this.node(id); };
    BaseGraph.prototype.nodeList = function () { return Array.from(this.__nodes.values()).map(function (n) { return n.node; }); };
    BaseGraph.prototype.nodeEdges = function (id) { var _a; return (_a = this.__nodes.get(id)) === null || _a === void 0 ? void 0 : _a.edges; };
    BaseGraph.prototype.edges = function () { return Utils_1.selectMany(Array.from(this.__nodes.values()), function (n) { return n.edges; }); };
    BaseGraph.prototype.nodeDegree = function (node) { var _a; return ((_a = this.nodeEdges(node)) === null || _a === void 0 ? void 0 : _a.length) || 0; };
    BaseGraph.prototype.degrees = function () {
        var _this = this;
        return Array.from({ length: this.size }, function (n, ndx) { return _this.nodeDegree(ndx); });
    };
    BaseGraph.prototype.indegrees = function () {
        var array = new Array(this.size).fill(0);
        this.edges().forEach(function (edge) { return array[edge.w]++; });
        return array;
    };
    BaseGraph.prototype.validNode = function (node) { return node >= 0 && node < this.size; };
    BaseGraph.prototype.addNode = function (label) {
        var node = this.labeled ?
            new LabeledNode(this.nextNodeId, label) :
            new GraphNode(this.nextNodeId);
        this.__nodes.set(node.id, {
            node: node,
            edges: new Array()
        });
        this.modified = true;
        return node;
    };
    BaseGraph.prototype.connect = function (v, w, weight) {
        var _this = this;
        var startNode = this.__nodes.get(v), endNode = this.__nodes.get(w), createEdge = function (nv, nw) {
            return _this.weighted ?
                new WeightedEdge(nv, nw, weight) :
                new Edge(nv, nw);
        };
        if (!startNode || !endNode)
            return false;
        if (startNode.edges.some(function (e) { return e.w == w; }))
            return false;
        startNode.edges.push(createEdge(v, w));
        this.modified = true;
        !this.directed
            && endNode.edges.push(createEdge(w, v));
        return true;
    };
    BaseGraph.prototype.disconnect = function (v, w) {
        var e = getInternalEdge.call(this, v, w);
        if (!e || e.index < 0)
            return false;
        e.edges.splice(e.index, 1);
        this.modified = true;
        if (!this.directed) {
            e = getInternalEdge.call(this, w, v);
            e.edges.splice(e.index, 1);
        }
        return true;
    };
    BaseGraph.prototype.adjacent = function (v, w) {
        var vNode = this.__nodes.get(v);
        return !!(vNode === null || vNode === void 0 ? void 0 : vNode.edges.some(function (n) { return n.w == w; }));
    };
    BaseGraph.prototype.adjacentEdges = function (node) {
        var vNode = this.__nodes.get(node);
        return (vNode === null || vNode === void 0 ? void 0 : vNode.edges.map(function (e) { return e.w; })) || [];
    };
    BaseGraph.prototype.edge = function (v, w) {
        var e = getInternalEdge.call(this, v, w);
        return e === null || e === void 0 ? void 0 : e.edges[e.index];
    };
    BaseGraph.prototype.edgeCount = function () {
        return Array.from(this.__nodes.values()).reduce(function (sum, item) { return sum + item.edges.length; }, 0);
    };
    // max. number of edges = ½ * |V| * ( |V| - 1 ). 
    //For undirected simple graphs, the graph density is defined as: 
    //D =     2|E|
    //    -----------
    //     |V|(|V| - 1)
    BaseGraph.prototype.density = function () {
        return 2 * this.edgeCount() / (this.size * (this.size - 1));
    };
    BaseGraph.create = function (name, directed, weighted, labeled) {
        if (labeled) {
            if (weighted)
                throw "weighted labeled graph not supported yet!";
            else
                return directed ? new LabeledDiGraph(name) : new LabeledGraph(name);
        }
        else {
            if (weighted)
                return directed ? new WeightedDiGraph(name) : new WeightedGraph(name);
            else
                return directed ? new DiGraph(name) : new Graph(name);
        }
    };
    return BaseGraph;
}());
exports.BaseGraph = BaseGraph;
var Graph = /** @class */ (function (_super) {
    tslib_1.__extends(Graph, _super);
    function Graph(name) {
        return _super.call(this, name, false, false, false) || this;
    }
    return Graph;
}(BaseGraph));
exports.Graph = Graph;
var DiGraph = /** @class */ (function (_super) {
    tslib_1.__extends(DiGraph, _super);
    function DiGraph(name) {
        return _super.call(this, name, true, false, false) || this;
    }
    return DiGraph;
}(BaseGraph));
exports.DiGraph = DiGraph;
var BaseWeightedGraph = /** @class */ (function (_super) {
    tslib_1.__extends(BaseWeightedGraph, _super);
    function BaseWeightedGraph(name, directed) {
        return _super.call(this, name, directed, true, false) || this;
    }
    BaseWeightedGraph.prototype.nodeEdges = function (id) { return _super.prototype.nodeEdges.call(this, id); };
    return BaseWeightedGraph;
}(BaseGraph));
var WeightedGraph = /** @class */ (function (_super) {
    tslib_1.__extends(WeightedGraph, _super);
    function WeightedGraph(name) {
        return _super.call(this, name, false) || this;
    }
    return WeightedGraph;
}(BaseWeightedGraph));
exports.WeightedGraph = WeightedGraph;
var WeightedDiGraph = /** @class */ (function (_super) {
    tslib_1.__extends(WeightedDiGraph, _super);
    function WeightedDiGraph(name) {
        return _super.call(this, name, true) || this;
    }
    return WeightedDiGraph;
}(BaseWeightedGraph));
exports.WeightedDiGraph = WeightedDiGraph;
var BaseLabeledGraph = /** @class */ (function (_super) {
    tslib_1.__extends(BaseLabeledGraph, _super);
    function BaseLabeledGraph(name, directed, weighted) {
        return _super.call(this, name, directed, weighted, true) || this;
    }
    BaseLabeledGraph.prototype.node = function (id) { return _super.prototype.node.call(this, id); };
    return BaseLabeledGraph;
}(BaseGraph));
var LabeledGraph = /** @class */ (function (_super) {
    tslib_1.__extends(LabeledGraph, _super);
    function LabeledGraph(name) {
        return _super.call(this, name, false, false) || this;
    }
    return LabeledGraph;
}(BaseLabeledGraph));
exports.LabeledGraph = LabeledGraph;
var LabeledDiGraph = /** @class */ (function (_super) {
    tslib_1.__extends(LabeledDiGraph, _super);
    function LabeledDiGraph(name) {
        return _super.call(this, name, true, false) || this;
    }
    return LabeledDiGraph;
}(BaseLabeledGraph));
exports.LabeledDiGraph = LabeledDiGraph;
var BaseLabeledWeightedGraph = /** @class */ (function (_super) {
    tslib_1.__extends(BaseLabeledWeightedGraph, _super);
    function BaseLabeledWeightedGraph(name, directed) {
        return _super.call(this, name, directed, true) || this;
    }
    BaseLabeledWeightedGraph.prototype.nodeEdges = function (id) { return _super.prototype.nodeEdges.call(this, id); };
    return BaseLabeledWeightedGraph;
}(BaseLabeledGraph));
function getInternalEdge(v, w) {
    var n = this.nodes.get(v);
    return n ?
        { node: n.node, edges: n.edges, index: n.edges.findIndex(function (e) { return e.w == w; }) }
        : undefined;
}
