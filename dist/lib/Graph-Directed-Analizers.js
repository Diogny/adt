"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToposortAnalizer = exports.DirectedComponentAnalizer = exports.DirectedEdgeAnalizer = exports.DirectedBaseAnalizer = void 0;
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
}(Graph_Analizers_1.BaseAnalizer));
exports.DirectedBaseAnalizer = DirectedBaseAnalizer;
var DirectedEdgeAnalizer = /** @class */ (function (_super) {
    tslib_1.__extends(DirectedEdgeAnalizer, _super);
    function DirectedEdgeAnalizer(showStack, showInternals, showTreeEnd) {
        var _this = _super.call(this, "Directed Edge Analizer", showStack, showInternals, showTreeEnd) || this;
        _this.showStack = showStack;
        _this.showInternals = showInternals;
        _this.showTreeEnd = showTreeEnd;
        return _this;
    }
    Object.defineProperty(DirectedEdgeAnalizer.prototype, "directed", {
        get: function () { return true; },
        enumerable: false,
        configurable: true
    });
    DirectedEdgeAnalizer.prototype.report = function () {
        var _this = this;
        _super.prototype.report.call(this);
        if (this.showInternals) {
            console.log("post: " + this.dfs.post.map(function (n) { return Utils_1.formatNumber(n, _this.maxLabelWidth); }).join('  '));
        }
    };
    return DirectedEdgeAnalizer;
}(Graph_Analizers_1.BaseEdgeAnalizer));
exports.DirectedEdgeAnalizer = DirectedEdgeAnalizer;
var DirectedComponentAnalizer = /** @class */ (function (_super) {
    tslib_1.__extends(DirectedComponentAnalizer, _super);
    function DirectedComponentAnalizer() {
        return _super.call(this, "Directed Component Analizer") || this;
    }
    Object.defineProperty(DirectedComponentAnalizer.prototype, "directed", {
        get: function () { return true; },
        enumerable: false,
        configurable: true
    });
    return DirectedComponentAnalizer;
}(Graph_Analizers_1.BaseComponentAnalizer));
exports.DirectedComponentAnalizer = DirectedComponentAnalizer;
//works with DFS only
var ToposortAnalizer = /** @class */ (function (_super) {
    tslib_1.__extends(ToposortAnalizer, _super);
    function ToposortAnalizer() {
        return _super.call(this, "Topological sort") || this;
    }
    ToposortAnalizer.prototype.register = function (dfs) {
        _super.prototype.register.call(this, dfs);
        this.order = new Array(this.dfs.nodes).fill(-1);
        this.index = 0;
        this.isDAG = true;
    };
    ToposortAnalizer.prototype.visit = function (v, w, e) {
        if (e == Graph_1.EdgeVisitEnum.back)
            this.isDAG = false;
    };
    ToposortAnalizer.prototype.endTree = function (v, w) {
        _super.prototype.endTree.call(this, v, w);
        this.isDAG && (this.order[this.index++] = w);
    };
    ToposortAnalizer.prototype.report = function () {
        _super.prototype.report.call(this);
        if (!this.isDAG) {
            console.log("Directed Graph is not a DAG, it has cycles");
        }
        else {
            var w_1 = Math.max.apply(null, this.dfs.g.nodeList().map(function (n) { return n.label().length; })) + 1;
            console.log("order:   " + this.order.map(function (n) { return Utils_1.formatNumber(n, w_1); }).join(' > '));
        }
    };
    return ToposortAnalizer;
}(DirectedBaseAnalizer));
exports.ToposortAnalizer = ToposortAnalizer;
//# sourceMappingURL=Graph-Directed-Analizers.js.map