"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bfsAnalysis = exports.bfs = exports.dfsAnalysis = exports.dfs = void 0;
const tslib_1 = require("tslib");
const Graph_1 = require("./Graph");
const Stack_1 = tslib_1.__importDefault(require("./Stack"));
const Queue_1 = tslib_1.__importDefault(require("./Queue"));
const Utils_1 = require("./Utils");
function dfs(g, start, edgeCallback, treeStartCallback, treeEndCallback) {
    return graphSearch.call(g, start, dfsEngine.call(g, start, 0), edgeCallback, treeStartCallback, treeEndCallback);
}
exports.dfs = dfs;
function dfsAnalysis(g, start, analizers) {
    return graphAnalysis.call(g, start, dfsEngine.call(g, start, 0), analizers, g.directed);
}
exports.dfsAnalysis = dfsAnalysis;
function bfs(g, start, edgeCallback, treeStartCallback, treeEndCallback) {
    return graphSearch.call(g, start, bfsEngine.call(g, start, 0), edgeCallback, treeStartCallback, treeEndCallback);
}
exports.bfs = bfs;
function bfsAnalysis(g, start, analizers) {
    return graphAnalysis.call(g, start, bfsEngine.call(g, start, 0), analizers, g.directed);
}
exports.bfsAnalysis = bfsAnalysis;
function graphSearch(start, engine, edgeCallback, treeStartCallback, treeEndCallback) {
    let count = 0;
    while (engine.next()) {
        treeStartCallback(start = engine.current());
        count++;
        engine.run(start, edgeCallback, treeEndCallback);
    }
    return count;
}
function graphAnalysis(start, engine, analizers, directed) {
    let edgeCallback = (v, w, e) => analizers.forEach(a => a.visit(v, w, e)), endTreeCallback = (v, w) => analizers.forEach(a => a.endTree(v, w)), count = 0;
    analizers.forEach(a => {
        if (directed != a.directed)
            throw `edge analizer direction does not match graph`;
        a.register(engine);
    });
    while (engine.next()) {
        count++;
        analizers.forEach(a => a.startTree(start = engine.current()));
        engine.run(start, edgeCallback, endTreeCallback);
    }
    analizers.forEach(a => a.report());
    return count;
}
function bfsEngine(entryNode, startTiming) {
    let g = this, nodes = g.size, pre = new Array(nodes).fill(-1), st = new Array(nodes).fill(-1), post = void 0, timing = startTiming, postTiming = startTiming, discovered = (node) => pre[node] >= 0, enumerator = Utils_1.enumConditional(entryNode, nodes - 1, discovered), queue = new Queue_1.default(), bfsFindAdjacents = (v, edgeCallback, processEdge) => {
        let empty = true;
        for (let array = g.adjacentEdges(v), i = 0, count = array.length; i < count; i++) {
            let w = array[i];
            if (discovered(w))
                processEdge(v, w, edgeCallback);
            else {
                queue.enqueue({ v: v, w: w });
                empty = false;
            }
        }
        empty && (console.log(`leaf: ${v}`));
    }, bfsProcessNonTreeEdge = (v, w, edgeCallback) => {
        if (st[v] == w)
            edgeCallback(v, w, Graph_1.DFSVisitEdge.parent);
        else {
            if (pre[w] < pre[v]) {
                edgeCallback(v, w, Graph_1.DFSVisitEdge.back);
            }
            else if (pre[w] > pre[v])
                edgeCallback(v, w, Graph_1.DFSVisitEdge.down);
            else
                console.log(v, w, 'Ooopsie!');
        }
    }, bfsProcessNonTreeDirectedEdge = (v, w, edgeCallback) => {
    }, bfs = (startNode, edgeCallback, treeEndCallback) => {
        st[startNode] = startNode;
        pre[startNode] = timing++;
        bfsFindAdjacents(startNode, edgeCallback, bfsProcessNonTreeEdge);
        while (!queue.empty) {
            let edge = queue.dequeue();
            if (discovered(edge.w)) {
                bfsProcessNonTreeEdge(edge.v, edge.w, edgeCallback);
            }
            else {
                pre[edge.w] = timing++;
                st[edge.w] = edge.v;
                edgeCallback(edge.v, edge.w, Graph_1.DFSVisitEdge.tree);
                bfsFindAdjacents(edge.w, edgeCallback, bfsProcessNonTreeEdge);
            }
        }
        treeEndCallback(startNode, startNode);
    }, bfsDirected = (startNode, edgeCallback, treeEndCallback) => {
        st[startNode] = startNode;
        pre[startNode] = timing++;
        //
        post[startNode] = postTiming++;
        treeEndCallback(startNode, startNode);
    };
    g.directed && (post = new Array(nodes).fill(-1));
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
    };
}
function dfsEngine(entryNode, startTiming) {
    let g = this, nodes = g.size, pre = new Array(nodes).fill(-1), st = new Array(nodes).fill(-1), post = void 0, timing = startTiming, postTiming = startTiming, discovered = (node) => pre[node] >= 0, enumerator = Utils_1.enumConditional(entryNode, nodes - 1, discovered), stack = new Stack_1.default(), dfsFindAdjacents = (v, edgeCallback, processEdge) => {
        for (let array = g.adjacentEdges(v), i = array.length - 1; i >= 0; i--) {
            let w = array[i];
            if (discovered(w))
                processEdge(v, w, edgeCallback);
            else {
                stack.push({ v: v, w: w, t: false });
            }
        }
    }, dfsProcessNonTreeEdge = (v, w, edgeCallback) => {
        if (st[v] == w)
            edgeCallback(v, w, Graph_1.DFSVisitEdge.parent);
        else {
            if (pre[w] < pre[v]) {
                edgeCallback(v, w, Graph_1.DFSVisitEdge.back);
            }
            else if (pre[w] > pre[v])
                edgeCallback(v, w, Graph_1.DFSVisitEdge.down);
            else
                console.log(v, w, 'Ooopsie!');
        }
    }, dfsProcessNonTreeDirectedEdge = (v, w, edgeCallback) => {
        if (pre[v] < pre[w])
            edgeCallback(v, w, Graph_1.DFSVisitEdge.down);
        else if (post[v] == -1 && post[w] == -1)
            edgeCallback(v, w, Graph_1.DFSVisitEdge.back);
        else
            edgeCallback(v, w, Graph_1.DFSVisitEdge.cross);
    }, dfs = (startNode, edgeCallback, treeEndCallback) => {
        st[startNode] = startNode;
        pre[startNode] = timing++;
        dfsFindAdjacents(startNode, edgeCallback, dfsProcessNonTreeEdge);
        while (!stack.empty) {
            let edge = stack.peek();
            if (edge.t) {
                treeEndCallback(edge.v, edge.w);
                stack.pop();
            }
            else {
                if (discovered(edge.w)) {
                    dfsProcessNonTreeEdge(edge.v, edge.w, edgeCallback);
                    stack.pop();
                }
                else {
                    edge.t = true;
                    pre[edge.w] = timing++;
                    st[edge.w] = edge.v;
                    edgeCallback(edge.v, edge.w, Graph_1.DFSVisitEdge.tree);
                    dfsFindAdjacents(edge.w, edgeCallback, dfsProcessNonTreeEdge);
                }
            }
        }
        treeEndCallback(startNode, startNode);
    }, dfsDirected = (startNode, edgeCallback, treeEndCallback) => {
        st[startNode] = startNode;
        pre[startNode] = timing++;
        dfsFindAdjacents(startNode, edgeCallback, dfsProcessNonTreeDirectedEdge);
        while (!stack.empty) {
            let edge = stack.peek();
            if (edge.t) {
                post[edge.w] = postTiming++;
                treeEndCallback(edge.v, edge.w);
                stack.pop();
            }
            else {
                if (discovered(edge.w)) {
                    dfsProcessNonTreeDirectedEdge(edge.v, edge.w, edgeCallback);
                    stack.pop();
                }
                else {
                    edge.t = true;
                    pre[edge.w] = timing++;
                    st[edge.w] = edge.v;
                    edgeCallback(edge.v, edge.w, Graph_1.DFSVisitEdge.tree);
                    dfsFindAdjacents(edge.w, edgeCallback, dfsProcessNonTreeDirectedEdge);
                }
            }
        }
        post[startNode] = postTiming++;
        treeEndCallback(startNode, startNode);
    };
    g.directed && (post = new Array(nodes).fill(-1));
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
    };
}
