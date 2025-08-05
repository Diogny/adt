"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentAnalyzer = exports.BaseComponentAnalizer = exports.EdgeAnalyzer = exports.BaseEdgeAnalizer = exports.CyclesAnalyzer = exports.BridgeAnalyzer = exports.UndirectedBaseAnalizer = exports.BaseAnalyzer = void 0;
var tslib_1 = require("tslib");
var Graph_1 = require("./Graph");
var Utils_1 = require("./Utils");
var BaseAnalyzer = /** @class */ (function () {
    function BaseAnalyzer(name) {
        this.name = name;
    }
    BaseAnalyzer.prototype.register = function (dfs) {
        this.dfs = dfs;
    };
    BaseAnalyzer.prototype.endTree = function (v, w) { };
    BaseAnalyzer.prototype.report = function () {
        console.log();
        console.log(this.name);
    };
    return BaseAnalyzer;
}());
exports.BaseAnalyzer = BaseAnalyzer;
var UndirectedBaseAnalizer = /** @class */ (function (_super) {
    tslib_1.__extends(UndirectedBaseAnalizer, _super);
    function UndirectedBaseAnalizer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(UndirectedBaseAnalizer.prototype, "directed", {
        get: function () { return false; },
        enumerable: false,
        configurable: true
    });
    return UndirectedBaseAnalizer;
}(BaseAnalyzer));
exports.UndirectedBaseAnalizer = UndirectedBaseAnalizer;
var BridgeAnalyzer = /** @class */ (function (_super) {
    tslib_1.__extends(BridgeAnalyzer, _super);
    function BridgeAnalyzer() {
        return _super.call(this, "Bridge Analyzer") || this;
    }
    BridgeAnalyzer.prototype.register = function (dfs) {
        _super.prototype.register.call(this, dfs);
        this.bridges = [];
        this.articulationPoints = [];
        this.low = new Array(this.dfs.nodes).fill(-1);
    };
    BridgeAnalyzer.prototype.endTree = function (v, w) {
        _super.prototype.endTree.call(this, v, w);
        if (this.low[v] > this.low[w])
            this.low[v] = this.low[w];
        if (v != w) {
            if (this.low[w] > this.dfs.pre[v]) {
                this.articulationPoints.push(w);
                this.articulationPoints.push(v);
            }
            else if (this.low[w] == this.dfs.pre[v] && this.low[v] != this.low[w]) {
                this.articulationPoints.push(v);
            }
            if (this.low[w] == this.dfs.pre[w]) {
                this.bridges.push({ v: v, w: w });
            }
        }
    };
    BridgeAnalyzer.prototype.visit = function (v, w, e) {
        switch (e) {
            case Graph_1.EdgeVisitEnum.tree:
                this.low[w] = this.dfs.pre[w];
                break;
            case Graph_1.EdgeVisitEnum.parent:
            case Graph_1.EdgeVisitEnum.down:
                break;
            case Graph_1.EdgeVisitEnum.back:
                if (this.low[v] > this.dfs.pre[w])
                    this.low[v] = this.dfs.pre[w];
                break;
        }
    };
    BridgeAnalyzer.prototype.report = function () {
        var _this = this;
        _super.prototype.report.call(this);
        var label = function (node) { return _this.dfs.g.nodeLabel(node); }, biggest = Math.max.apply(null, this.dfs.g.nodeList().map(function (n) { return n.label().length; })) + 1, header = "node: ".concat(this.dfs.g.nodeList().map(function (n) { return (0, Utils_1.padStr)(n.label(), biggest); }).join('  '));
        console.log(this.bridges.length ? "".concat(this.bridges.length, " bridge(s)") : 'no bridges');
        this.bridges
            .forEach(function (e) { return console.log("".concat(label(e.v), "-").concat(label(e.w))); });
        console.log(this.articulationPoints.length ? "".concat(this.articulationPoints.length, " articulation point(s)") : 'no articulation points');
        console.log(this.articulationPoints
            .map(function (node) { return label(node); })
            .join(', '));
        console.log(header);
        console.log((0, Utils_1.fillChar)('-', header.length + 1));
        console.log("low:  ".concat(this.low.map(function (n) { return (0, Utils_1.formatNumber)(n, biggest); }).join('  ')));
        if (this.dfs.g.labeled)
            console.log("      ".concat(this.low.map(function (n) { return (0, Utils_1.padStr)(_this.dfs.g.nodeLabel(n), biggest); }).join('  ')));
    };
    return BridgeAnalyzer;
}(UndirectedBaseAnalizer));
exports.BridgeAnalyzer = BridgeAnalyzer;
var CyclesAnalyzer = /** @class */ (function (_super) {
    tslib_1.__extends(CyclesAnalyzer, _super);
    function CyclesAnalyzer() {
        return _super.call(this, "Cycles Analizer") || this;
    }
    Object.defineProperty(CyclesAnalyzer.prototype, "count", {
        get: function () { return this.cycles.length; },
        enumerable: false,
        configurable: true
    });
    CyclesAnalyzer.prototype.register = function (dfs) {
        _super.prototype.register.call(this, dfs);
        this.cycles = new Array();
    };
    CyclesAnalyzer.prototype.visit = function (v, w, e) {
        if (e == Graph_1.EdgeVisitEnum.back) {
            var array = [v, w], p = v;
            while ((p = this.dfs.st[p]) != w)
                array.unshift(p);
            array.unshift(w);
            this.cycles.push(array);
        }
    };
    CyclesAnalyzer.prototype.report = function () {
        _super.prototype.report.call(this);
        console.log(" cycle(s): ".concat(this.count));
        this.cycles.forEach(function (c) {
            console.log('  ' + c.join('-'));
        });
    };
    return CyclesAnalyzer;
}(UndirectedBaseAnalizer));
exports.CyclesAnalyzer = CyclesAnalyzer;
//multi-analizers
var BaseEdgeAnalizer = /** @class */ (function (_super) {
    tslib_1.__extends(BaseEdgeAnalizer, _super);
    function BaseEdgeAnalizer(name, showStack, showInternals, showTreeEnd) {
        var _this = _super.call(this, name) || this;
        _this.showStack = showStack;
        _this.showInternals = showInternals;
        _this.showTreeEnd = showTreeEnd;
        _this.tabs = 4;
        _this.spaces = 0;
        _this.components = 0;
        _this.maxLabelWidth = 0;
        return _this;
    }
    BaseEdgeAnalizer.prototype.register = function (dfs) {
        _super.prototype.register.call(this, dfs);
        this.colSpaces = new Array(this.dfs.g.size).fill(-1);
        this.edgeList = [];
        this.stackTrace = [];
        this.spaces = 0;
    };
    BaseEdgeAnalizer.prototype.appendLine = function (edgeStr, stackStr) {
        this.edgeList.push(edgeStr);
        this.showStack
            && this.stackTrace.push(stackStr);
    };
    BaseEdgeAnalizer.prototype.endTree = function (v, w) {
        _super.prototype.endTree.call(this, v, w);
        if (this.showTreeEnd) {
            var s = this.colSpaces[w] * this.tabs, nv = this.dfs.g.nodeLabel(v), nw = this.dfs.g.nodeLabel(w);
            this.appendLine("".concat((0, Utils_1.fillChar)(' ', s), "[").concat(nw, "] tree analized as:(").concat(nv, "-").concat(nw, ")"), '');
        }
    };
    BaseEdgeAnalizer.prototype.visit = function (v, w, e) {
        var nv = this.dfs.g.nodeLabel(v), nw = this.dfs.g.nodeLabel(w), isRoot = false;
        if (this.colSpaces[v] < 0)
            this.colSpaces[v] = 0;
        if (e == Graph_1.EdgeVisitEnum.tree) {
            this.colSpaces[w] = this.colSpaces[v] + 1;
            if (v == w) {
                isRoot = true;
                this.appendLine("component: ".concat(++this.components), '');
                this.appendLine("[".concat(w, "] start tree"), '');
            }
        }
        this.spaces = this.colSpaces[v] * this.tabs;
        this.appendLine("".concat((0, Utils_1.fillChar)(' ', isRoot ? 0 : this.spaces), "(").concat(nv, "-").concat(nw, ") ").concat(Graph_1.EdgeVisitEnum[e]), this.showStack ? "[".concat(this.dfs.edges().map(function (e) { return "".concat(e.v, "-").concat(e.w); }).join(', '), "]") : '');
    };
    BaseEdgeAnalizer.prototype.report = function () {
        var _this = this;
        _super.prototype.report.call(this);
        var w = this.showStack ? Math.max.apply(null, this.edgeList.map(function (s) { return s.length; })) : 0;
        this.edgeList.map(function (s, ndx) {
            if (!_this.showStack)
                return s;
            return s + (0, Utils_1.padStr)(' ', w - s.length + 5) + _this.stackTrace[ndx];
        })
            .forEach(function (s) { return console.log(s); });
        if (this.showInternals) {
            this.maxLabelWidth = Math.max.apply(null, this.dfs.g.nodeList().map(function (n) { return n.label().length; })) + 1;
            var header = "node: ".concat((0, Utils_1.range)(0, this.dfs.nodes).map(function (n) { return (0, Utils_1.formatNumber)(n, _this.maxLabelWidth); }).join('  '));
            console.log();
            console.log(header);
            console.log((0, Utils_1.fillChar)('-', header.length + 1));
            console.log("pre:  ".concat(this.dfs.pre.map(function (n) { return (0, Utils_1.formatNumber)(n, _this.maxLabelWidth); }).join('  ')));
            console.log("st:   ".concat(this.dfs.st.map(function (n) { return (0, Utils_1.formatNumber)(n, _this.maxLabelWidth); }).join('  ')));
        }
    };
    return BaseEdgeAnalizer;
}(BaseAnalyzer));
exports.BaseEdgeAnalizer = BaseEdgeAnalizer;
var EdgeAnalyzer = /** @class */ (function (_super) {
    tslib_1.__extends(EdgeAnalyzer, _super);
    function EdgeAnalyzer(showStack, showInternals, showTreeEnd) {
        var _this = _super.call(this, "Edge Analizer", showStack, showInternals, showTreeEnd) || this;
        _this.showStack = showStack;
        _this.showInternals = showInternals;
        _this.showTreeEnd = showTreeEnd;
        return _this;
    }
    Object.defineProperty(EdgeAnalyzer.prototype, "directed", {
        get: function () { return false; },
        enumerable: false,
        configurable: true
    });
    return EdgeAnalyzer;
}(BaseEdgeAnalizer));
exports.EdgeAnalyzer = EdgeAnalyzer;
var BaseComponentAnalizer = /** @class */ (function (_super) {
    tslib_1.__extends(BaseComponentAnalizer, _super);
    function BaseComponentAnalizer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseComponentAnalizer.prototype.register = function (dfs) {
        _super.prototype.register.call(this, dfs);
        this.count = 0;
        this.components = new Array(this.dfs.g.size).fill(-1);
    };
    BaseComponentAnalizer.prototype.visit = function (v, w, e) {
        if (e == Graph_1.EdgeVisitEnum.tree) {
            if (v == w)
                this.count++;
            this.components[w] = this.count;
        }
    };
    BaseComponentAnalizer.prototype.report = function () {
        _super.prototype.report.call(this);
        var maxLabelWidth = String(this.dfs.nodes).length + 1, header = "node: ".concat((0, Utils_1.range)(0, this.dfs.nodes).map(function (n) { return (0, Utils_1.formatNumber)(n, maxLabelWidth); }).join('  '));
        console.log("component(s): ".concat(this.count));
        console.log(header);
        console.log((0, Utils_1.fillChar)('-', header.length + 1));
        console.log("comp:  ".concat(this.components.map(function (n) { return (0, Utils_1.formatNumber)(n, maxLabelWidth); }).join('  ')));
    };
    return BaseComponentAnalizer;
}(BaseAnalyzer));
exports.BaseComponentAnalizer = BaseComponentAnalizer;
var ComponentAnalyzer = /** @class */ (function (_super) {
    tslib_1.__extends(ComponentAnalyzer, _super);
    function ComponentAnalyzer() {
        return _super.call(this, "Component Analizer") || this;
    }
    Object.defineProperty(ComponentAnalyzer.prototype, "directed", {
        get: function () { return false; },
        enumerable: false,
        configurable: true
    });
    return ComponentAnalyzer;
}(BaseComponentAnalizer));
exports.ComponentAnalyzer = ComponentAnalyzer;
