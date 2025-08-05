"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopoSortAnalyzer = exports.DirectedComponentAnalyzer = exports.DirectedEdgeAnalyzer = exports.DirectedBaseAnalizer = void 0;
var tslib_1 = require("tslib");
var Utils_1 = require("./Utils");
var Graph_Analizers_1 = require("./Graph-Analizers");
var Graph_1 = require("./Graph");
var DirectedBaseAnalizer = /** @class */ (function (_super) {
    tslib_1.__extends(DirectedBaseAnalizer, _super);
    function DirectedBaseAnalizer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(DirectedBaseAnalizer.prototype, "directed", {
        get: function () { return true; },
        enumerable: false,
        configurable: true
    });
    return DirectedBaseAnalizer;
}(Graph_Analizers_1.BaseAnalyzer));
exports.DirectedBaseAnalizer = DirectedBaseAnalizer;
var DirectedEdgeAnalyzer = /** @class */ (function (_super) {
    tslib_1.__extends(DirectedEdgeAnalyzer, _super);
    function DirectedEdgeAnalyzer(showStack, showInternals, showTreeEnd) {
        var _this = _super.call(this, "Directed Edge Analizer", showStack, showInternals, showTreeEnd) || this;
        _this.showStack = showStack;
        _this.showInternals = showInternals;
        _this.showTreeEnd = showTreeEnd;
        return _this;
    }
    Object.defineProperty(DirectedEdgeAnalyzer.prototype, "directed", {
        get: function () { return true; },
        enumerable: false,
        configurable: true
    });
    DirectedEdgeAnalyzer.prototype.report = function () {
        var _this = this;
        _super.prototype.report.call(this);
        if (this.showInternals) {
            console.log("post: ".concat(this.dfs.post.map(function (n) { return (0, Utils_1.formatNumber)(n, _this.maxLabelWidth); }).join('  ')));
        }
    };
    return DirectedEdgeAnalyzer;
}(Graph_Analizers_1.BaseEdgeAnalizer));
exports.DirectedEdgeAnalyzer = DirectedEdgeAnalyzer;
var DirectedComponentAnalyzer = /** @class */ (function (_super) {
    tslib_1.__extends(DirectedComponentAnalyzer, _super);
    function DirectedComponentAnalyzer() {
        return _super.call(this, "Directed Component Analizer") || this;
    }
    Object.defineProperty(DirectedComponentAnalyzer.prototype, "directed", {
        get: function () { return true; },
        enumerable: false,
        configurable: true
    });
    return DirectedComponentAnalyzer;
}(Graph_Analizers_1.BaseComponentAnalizer));
exports.DirectedComponentAnalyzer = DirectedComponentAnalyzer;
//works with DFS only
var TopoSortAnalyzer = /** @class */ (function (_super) {
    tslib_1.__extends(TopoSortAnalyzer, _super);
    function TopoSortAnalyzer() {
        return _super.call(this, "Topological sort") || this;
    }
    TopoSortAnalyzer.prototype.register = function (dfs) {
        _super.prototype.register.call(this, dfs);
        this.order = new Array(this.dfs.nodes).fill(-1);
        this.index = 0;
        this.isDAG = true;
    };
    TopoSortAnalyzer.prototype.visit = function (v, w, e) {
        if (e == Graph_1.EdgeVisitEnum.back)
            this.isDAG = false;
    };
    TopoSortAnalyzer.prototype.endTree = function (v, w) {
        _super.prototype.endTree.call(this, v, w);
        this.isDAG && (this.order[this.index++] = w);
    };
    TopoSortAnalyzer.prototype.report = function () {
        _super.prototype.report.call(this);
        if (!this.isDAG) {
            console.log("Directed Graph is not a DAG, it has cycles");
        }
        else {
            var w_1 = Math.max.apply(null, this.dfs.g.nodeList().map(function (n) { return n.label().length; })) + 1;
            console.log("order:   ".concat(this.order.map(function (n) { return (0, Utils_1.formatNumber)(n, w_1); }).join(' > ')));
        }
    };
    return TopoSortAnalyzer;
}(DirectedBaseAnalizer));
exports.TopoSortAnalyzer = TopoSortAnalyzer;
