"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bfsEngine = exports.bfsAnalysis = exports.bfs = exports.dfsEngine = exports.dfsAnalysis = exports.dfs = exports.searchGraph = void 0;
var tslib_1 = require("tslib");
var Graph_1 = require("./Graph");
var Stack_1 = tslib_1.__importDefault(require("./Stack"));
var Queue_1 = tslib_1.__importDefault(require("./Queue"));
var Utils_1 = require("./Utils");
function searchGraph(engine, start, full) {
    var components, _a, _b, edge, e_1_1;
    var e_1, _c;
    return tslib_1.__generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                components = 0;
                if (!engine.next()) return [3 /*break*/, 10];
                _d.label = 1;
            case 1:
                components++;
                start = engine.current();
                _d.label = 2;
            case 2:
                _d.trys.push([2, 7, 8, 9]);
                _a = (e_1 = void 0, tslib_1.__values(engine.search(start))), _b = _a.next();
                _d.label = 3;
            case 3:
                if (!!_b.done) return [3 /*break*/, 6];
                edge = _b.value;
                return [4 /*yield*/, edge];
            case 4:
                _d.sent();
                _d.label = 5;
            case 5:
                _b = _a.next();
                return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 9];
            case 7:
                e_1_1 = _d.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 9];
            case 8:
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_1) throw e_1.error; }
                return [7 /*endfinally*/];
            case 9:
                if (full && engine.next()) return [3 /*break*/, 1];
                _d.label = 10;
            case 10: return [2 /*return*/, components];
        }
    });
}
exports.searchGraph = searchGraph;
function dfs(g, start, full, treeEdgesOnly, searchTreeEdgeEndCallback) {
    var _a;
    var enumerator = searchGraph(dfsEngine(g, start, treeEdgesOnly, searchTreeEdgeEndCallback), start, full), iterator = (_a = {
            next: function () {
                return enumerator.next();
            }
        },
        _a[Symbol.iterator] = function () {
            return iterator;
        },
        _a);
    return iterator;
}
exports.dfs = dfs;
function bfs(g, start, full, treeEdgesOnly, searchTreeEdgeEndCallback) {
    var _a;
    var enumerator = searchGraph(bfsEngine(g, start, treeEdgesOnly, searchTreeEdgeEndCallback), start, full), iterator = (_a = {
            next: function () {
                return enumerator.next();
            }
        },
        _a[Symbol.iterator] = function () {
            return iterator;
        },
        _a);
    return iterator;
}
exports.bfs = bfs;
function searchGraphAnalysis(engine, start, analizers) {
    var enumerator = searchGraph(engine, start, true), result;
    analizers.forEach(function (a) {
        if (engine.g.directed != a.directed)
            throw "edge analizer direction does not match graph";
        a.register(engine);
    });
    var _loop_1 = function () {
        var edge = result.value;
        analizers.forEach(function (a) { return a.visit(edge.v, edge.w, edge.e); });
    };
    while (!(result = enumerator.next()).done) {
        _loop_1();
    }
    analizers.forEach(function (a) { return a.report(); });
    return result.value;
}
function dfsAnalysis(g, start, analizers) {
    var endTreeEdgeCallback = function (v, w) {
        analizers.forEach(function (a) { return a.endTree(v, w); });
    }, engine = dfsEngine(g, start, false, endTreeEdgeCallback);
    return searchGraphAnalysis(engine, start, analizers);
}
exports.dfsAnalysis = dfsAnalysis;
function bfsAnalysis(g, start, analizers) {
    var endTreeEdgeCallback = function (v, w) {
        analizers.forEach(function (a) { return a.endTree(v, w); });
    }, engine = bfsEngine(g, start, false, endTreeEdgeCallback);
    return searchGraphAnalysis(engine, start, analizers);
}
exports.bfsAnalysis = bfsAnalysis;
function dfsEngine(g, start, treeEdgesOnly, searchEndCallback) {
    var nodes = g.size, pre = new Array(nodes).fill(-1), st = new Array(nodes).fill(-1), post = void 0, startTiming = 0, timing = startTiming, postTiming = startTiming, discovered = function (node) { return pre[node] >= 0; }, enumerator = Utils_1.enumConditional(start, nodes - 1, discovered), stack = new Stack_1.default(), dfsFindAdjacents = function (v, processEdge) {
        var result = [];
        for (var adjacents = g.adjacentEdges(v), i = adjacents.length - 1; i >= 0; i--) {
            var w = adjacents[i];
            if (discovered(w)) {
                !treeEdgesOnly && result.push(processEdge(v, w));
            }
            else
                stack.push({ v: v, w: w, t: false });
        }
        return result;
    }, dfsProcessNonTreeEdge = function (v, w) {
        var edgeKind = function () {
            if (st[v] == w)
                return Graph_1.EdgeVisitEnum.parent;
            else if (pre[w] < pre[v])
                return Graph_1.EdgeVisitEnum.back;
            else
                return Graph_1.EdgeVisitEnum.down;
        };
        return { v: v, w: w, e: edgeKind() };
    }, dfsProcessNonTreeDirectedEdge = function (v, w) {
        var edgeKind = function () {
            if (pre[v] < pre[w])
                return Graph_1.EdgeVisitEnum.down;
            else if (post[v] == -1 && post[w] == -1)
                return Graph_1.EdgeVisitEnum.back;
            else
                return Graph_1.EdgeVisitEnum.cross;
        };
        return { v: v, w: w, e: edgeKind() };
    }, dfs = function (startNode) {
        var count, nonTreeEdges, i, edge, i;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (discovered(startNode))
                        return [2 /*return*/, 0];
                    count = 1;
                    st[startNode] = startNode;
                    pre[startNode] = timing++;
                    return [4 /*yield*/, { v: startNode, w: startNode, e: Graph_1.EdgeVisitEnum.tree }];
                case 1:
                    _a.sent();
                    nonTreeEdges = dfsFindAdjacents(startNode, dfsProcessNonTreeEdge);
                    if (!!treeEdgesOnly) return [3 /*break*/, 5];
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < nonTreeEdges.length)) return [3 /*break*/, 5];
                    return [4 /*yield*/, nonTreeEdges[i]];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5:
                    if (!!stack.empty) return [3 /*break*/, 15];
                    edge = stack.peek();
                    if (!edge.t) return [3 /*break*/, 6];
                    searchEndCallback && searchEndCallback(edge.v, edge.w);
                    stack.pop();
                    return [3 /*break*/, 14];
                case 6:
                    if (!discovered(edge.w)) return [3 /*break*/, 9];
                    if (!!treeEdgesOnly) return [3 /*break*/, 8];
                    return [4 /*yield*/, dfsProcessNonTreeEdge(edge.v, edge.w)];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8:
                    stack.pop();
                    return [3 /*break*/, 14];
                case 9:
                    edge.t = true;
                    pre[edge.w] = timing++;
                    st[edge.w] = edge.v;
                    count++;
                    return [4 /*yield*/, { v: edge.v, w: edge.w, e: Graph_1.EdgeVisitEnum.tree }];
                case 10:
                    _a.sent();
                    nonTreeEdges = dfsFindAdjacents(edge.w, dfsProcessNonTreeEdge);
                    if (!!treeEdgesOnly) return [3 /*break*/, 14];
                    i = 0;
                    _a.label = 11;
                case 11:
                    if (!(i < nonTreeEdges.length)) return [3 /*break*/, 14];
                    return [4 /*yield*/, nonTreeEdges[i]];
                case 12:
                    _a.sent();
                    _a.label = 13;
                case 13:
                    i++;
                    return [3 /*break*/, 11];
                case 14: return [3 /*break*/, 5];
                case 15:
                    searchEndCallback && searchEndCallback(startNode, startNode);
                    return [2 /*return*/, count];
            }
        });
    }, dfsDirected = function (startNode) {
        var count, nonTreeEdges, i, edge, i;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (discovered(startNode))
                        return [2 /*return*/, 0];
                    count = 1;
                    st[startNode] = startNode;
                    pre[startNode] = timing++;
                    return [4 /*yield*/, { v: startNode, w: startNode, e: Graph_1.EdgeVisitEnum.tree }];
                case 1:
                    _a.sent();
                    nonTreeEdges = dfsFindAdjacents(startNode, dfsProcessNonTreeDirectedEdge);
                    if (!!treeEdgesOnly) return [3 /*break*/, 5];
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < nonTreeEdges.length)) return [3 /*break*/, 5];
                    return [4 /*yield*/, nonTreeEdges[i]];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5:
                    if (!!stack.empty) return [3 /*break*/, 15];
                    edge = stack.peek();
                    if (!edge.t) return [3 /*break*/, 6];
                    post[edge.w] = postTiming++;
                    searchEndCallback && searchEndCallback(edge.v, edge.w);
                    stack.pop();
                    return [3 /*break*/, 14];
                case 6:
                    if (!discovered(edge.w)) return [3 /*break*/, 9];
                    if (!!treeEdgesOnly) return [3 /*break*/, 8];
                    return [4 /*yield*/, dfsProcessNonTreeDirectedEdge(edge.v, edge.w)];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8:
                    stack.pop();
                    return [3 /*break*/, 14];
                case 9:
                    edge.t = true;
                    pre[edge.w] = timing++;
                    st[edge.w] = edge.v;
                    count++;
                    return [4 /*yield*/, { v: edge.v, w: edge.w, e: Graph_1.EdgeVisitEnum.tree }];
                case 10:
                    _a.sent();
                    nonTreeEdges = dfsFindAdjacents(edge.w, dfsProcessNonTreeDirectedEdge);
                    if (!!treeEdgesOnly) return [3 /*break*/, 14];
                    i = 0;
                    _a.label = 11;
                case 11:
                    if (!(i < nonTreeEdges.length)) return [3 /*break*/, 14];
                    return [4 /*yield*/, nonTreeEdges[i]];
                case 12:
                    _a.sent();
                    _a.label = 13;
                case 13:
                    i++;
                    return [3 /*break*/, 11];
                case 14: return [3 /*break*/, 5];
                case 15:
                    post[startNode] = postTiming++;
                    searchEndCallback && searchEndCallback(startNode, startNode);
                    return [2 /*return*/, count];
            }
        });
    };
    g.directed && (post = new Array(nodes).fill(-1));
    return {
        g: g,
        nodes: nodes,
        pre: pre,
        st: st,
        post: post,
        initial: function () { return start; },
        timing: function () { return timing; },
        next: function () { return enumerator.next(); },
        current: function () { return enumerator.current(); },
        edges: function () { return stack.items; },
        search: g.directed ? dfsDirected : dfs
    };
}
exports.dfsEngine = dfsEngine;
function bfsEngine(g, start, treeEdgesOnly, searchEndCallback) {
    var nodes = g.size, pre = new Array(nodes).fill(-1), st = new Array(nodes).fill(-1), post = void 0, startTiming = 0, timing = startTiming, discovered = function (node) { return pre[node] >= 0; }, enumerator = Utils_1.enumConditional(start, nodes - 1, discovered), queue = new Queue_1.default(), bfsFindAdjacents = function (v, processEdge) {
        var result = [];
        for (var adjacents = g.adjacentEdges(v), i = 0; i < adjacents.length; i++) {
            var w = adjacents[i];
            if (discovered(w))
                !treeEdgesOnly && result.push(processEdge(v, w));
            else
                queue.enqueue({ v: v, w: w });
        }
        return result;
    }, bfsProcessNonTreeEdge = function (v, w) {
        var edgeKind = function () {
            if (st[v] == w)
                return Graph_1.EdgeVisitEnum.parent;
            else if (pre[w] < pre[v])
                return Graph_1.EdgeVisitEnum.back;
            else
                return Graph_1.EdgeVisitEnum.down;
        };
        return { v: v, w: w, e: edgeKind() };
    }, bfs = function (startNode) {
        var count, nonTreeEdges, i, edge, i;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (discovered(startNode))
                        return [2 /*return*/, 0];
                    count = 1;
                    st[startNode] = startNode;
                    pre[startNode] = timing++;
                    return [4 /*yield*/, { v: startNode, w: startNode, e: Graph_1.EdgeVisitEnum.tree }];
                case 1:
                    _a.sent();
                    nonTreeEdges = bfsFindAdjacents(startNode, bfsProcessNonTreeEdge);
                    if (!!treeEdgesOnly) return [3 /*break*/, 5];
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < nonTreeEdges.length)) return [3 /*break*/, 5];
                    return [4 /*yield*/, nonTreeEdges[i]];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5:
                    if (!!queue.empty) return [3 /*break*/, 14];
                    edge = queue.dequeue();
                    if (!discovered(edge.w)) return [3 /*break*/, 8];
                    if (!!treeEdgesOnly) return [3 /*break*/, 7];
                    return [4 /*yield*/, bfsProcessNonTreeEdge(edge.v, edge.w)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [3 /*break*/, 13];
                case 8:
                    pre[edge.w] = timing++;
                    st[edge.w] = edge.v;
                    count++;
                    return [4 /*yield*/, { v: edge.v, w: edge.w, e: Graph_1.EdgeVisitEnum.tree }];
                case 9:
                    _a.sent();
                    nonTreeEdges = bfsFindAdjacents(edge.w, bfsProcessNonTreeEdge);
                    if (!!treeEdgesOnly) return [3 /*break*/, 13];
                    i = 0;
                    _a.label = 10;
                case 10:
                    if (!(i < nonTreeEdges.length)) return [3 /*break*/, 13];
                    return [4 /*yield*/, nonTreeEdges[i]];
                case 11:
                    _a.sent();
                    _a.label = 12;
                case 12:
                    i++;
                    return [3 /*break*/, 10];
                case 13: return [3 /*break*/, 5];
                case 14:
                    searchEndCallback && searchEndCallback(startNode, startNode);
                    return [2 /*return*/, count];
            }
        });
    };
    g.directed && (post = new Array(nodes).fill(-1));
    return {
        g: g,
        nodes: nodes,
        pre: pre,
        st: st,
        post: post,
        initial: function () { return start; },
        timing: function () { return timing; },
        next: function () { return enumerator.next(); },
        current: function () { return enumerator.current(); },
        edges: function () { return queue.items; },
        search: bfs
    };
}
exports.bfsEngine = bfsEngine;
