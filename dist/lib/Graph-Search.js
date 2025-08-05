import { EdgeVisitEnum } from "./Graph";
import { Stack } from "./Stack";
import { Queue } from "./Queue";
import { enumConditional } from "./Utils";
function* searchGraph(engine, start, full) {
    let components = 0;
    if (engine.next()) {
        do {
            components++;
            start = engine.current();
            for (let edge of engine.search(start)) {
                yield edge;
            }
        } while (full && engine.next());
    }
    return components;
}
function dfs(g, start, full, treeEdgesOnly, searchTreeEdgeEndCallback) {
    let enumerator = searchGraph(dfsEngine(g, start, treeEdgesOnly, searchTreeEdgeEndCallback), start, full), iterator = {
        next: () => {
            return enumerator.next();
        },
        [Symbol.iterator]() {
            return iterator;
        }
    };
    return iterator;
}
function bfs(g, start, full, treeEdgesOnly, searchTreeEdgeEndCallback) {
    let enumerator = searchGraph(bfsEngine(g, start, treeEdgesOnly, searchTreeEdgeEndCallback), start, full), iterator = {
        next: () => {
            return enumerator.next();
        },
        [Symbol.iterator]() {
            return iterator;
        }
    };
    return iterator;
}
function searchGraphAnalysis(engine, start, analyzers) {
    let enumerator = searchGraph(engine, start, true), result;
    analyzers.forEach(a => {
        if (engine.g.directed != a.directed)
            throw new Error(`edge analyzers direction does not match graph`);
        a.register(engine);
    });
    while (!(result = enumerator.next()).done) {
        let edge = result.value;
        analyzers.forEach(a => a.visit(edge.v, edge.w, edge.e));
    }
    analyzers.forEach(a => a.report());
    return result.value;
}
function dfsAnalysis(g, start, analyzers) {
    let endTreeEdgeCallback = (v, w) => {
        analyzers.forEach(a => a.endTree(v, w));
    }, engine = dfsEngine(g, start, false, endTreeEdgeCallback);
    return searchGraphAnalysis(engine, start, analyzers);
}
function bfsAnalysis(g, start, analyzers) {
    let endTreeEdgeCallback = (v, w) => {
        analyzers.forEach(a => a.endTree(v, w));
    }, engine = bfsEngine(g, start, false, endTreeEdgeCallback);
    return searchGraphAnalysis(engine, start, analyzers);
}
function dfsEngine(g, start, treeEdgesOnly, searchEndCallback) {
    let nodes = g.size, pre = new Array(nodes).fill(-1), st = new Array(nodes).fill(-1), post = void 0, startTiming = 0, timing = startTiming, postTiming = startTiming, discovered = (node) => pre[node] >= 0, enumerator = enumConditional(start, nodes - 1, discovered), stack = new Stack(), dfsFindAdjacents = (v, processEdge) => {
        let result = [];
        for (let adjacents = g.adjacentEdges(v), i = adjacents.length - 1; i >= 0; i--) {
            let w = adjacents[i];
            if (discovered(w)) {
                !treeEdgesOnly && result.push(processEdge(v, w));
            }
            else
                stack.push({ v: v, w: w, t: false });
        }
        return result;
    }, dfsProcessNonTreeEdge = (v, w) => {
        let edgeKind = () => {
            if (st[v] == w)
                return EdgeVisitEnum.parent;
            else if (pre[w] < pre[v])
                return EdgeVisitEnum.back;
            else
                return EdgeVisitEnum.down;
        };
        return { v: v, w: w, e: edgeKind() };
    }, dfsProcessNonTreeDirectedEdge = (v, w) => {
        let edgeKind = () => {
            if (pre[v] < pre[w])
                return EdgeVisitEnum.down;
            else if (post[v] == -1 && post[w] == -1)
                return EdgeVisitEnum.back;
            else
                return EdgeVisitEnum.cross;
        };
        return { v: v, w: w, e: edgeKind() };
    }, dfs = function* (startNode) {
        if (discovered(startNode))
            return 0;
        let count = 1;
        st[startNode] = startNode;
        pre[startNode] = timing++;
        yield { v: startNode, w: startNode, e: EdgeVisitEnum.tree };
        let nonTreeEdges = dfsFindAdjacents(startNode, dfsProcessNonTreeEdge);
        if (!treeEdgesOnly) {
            for (let i = 0; i < nonTreeEdges.length; i++)
                yield nonTreeEdges[i];
        }
        while (!stack.empty) {
            let edge = stack.peek();
            if (edge.t) {
                searchEndCallback && searchEndCallback(edge.v, edge.w);
                stack.pop();
            }
            else if (discovered(edge.w)) {
                if (!treeEdgesOnly)
                    yield dfsProcessNonTreeEdge(edge.v, edge.w);
                stack.pop();
            }
            else {
                edge.t = true;
                pre[edge.w] = timing++;
                st[edge.w] = edge.v;
                count++;
                yield { v: edge.v, w: edge.w, e: EdgeVisitEnum.tree };
                nonTreeEdges = dfsFindAdjacents(edge.w, dfsProcessNonTreeEdge);
                if (!treeEdgesOnly) {
                    for (let i = 0; i < nonTreeEdges.length; i++)
                        yield nonTreeEdges[i];
                }
            }
        }
        searchEndCallback && searchEndCallback(startNode, startNode);
        return count;
    }, dfsDirected = function* (startNode) {
        if (discovered(startNode))
            return 0;
        let count = 1;
        st[startNode] = startNode;
        pre[startNode] = timing++;
        yield { v: startNode, w: startNode, e: EdgeVisitEnum.tree };
        let nonTreeEdges = dfsFindAdjacents(startNode, dfsProcessNonTreeDirectedEdge);
        if (!treeEdgesOnly) {
            for (let i = 0; i < nonTreeEdges.length; i++)
                yield nonTreeEdges[i];
        }
        while (!stack.empty) {
            let edge = stack.peek();
            if (edge.t) {
                post[edge.w] = postTiming++;
                searchEndCallback && searchEndCallback(edge.v, edge.w);
                stack.pop();
            }
            else {
                if (discovered(edge.w)) {
                    if (!treeEdgesOnly)
                        yield dfsProcessNonTreeDirectedEdge(edge.v, edge.w);
                    stack.pop();
                }
                else {
                    edge.t = true;
                    pre[edge.w] = timing++;
                    st[edge.w] = edge.v;
                    count++;
                    yield { v: edge.v, w: edge.w, e: EdgeVisitEnum.tree };
                    nonTreeEdges = dfsFindAdjacents(edge.w, dfsProcessNonTreeDirectedEdge);
                    if (!treeEdgesOnly) {
                        for (let i = 0; i < nonTreeEdges.length; i++)
                            yield nonTreeEdges[i];
                    }
                }
            }
        }
        post[startNode] = postTiming++;
        searchEndCallback && searchEndCallback(startNode, startNode);
        return count;
    };
    g.directed && (post = new Array(nodes).fill(-1));
    return {
        g: g,
        nodes: nodes,
        pre: pre,
        st: st,
        post: post,
        initial: () => start,
        timing: () => timing,
        next: () => enumerator.next(),
        current: () => enumerator.current(),
        edges: () => stack.items,
        search: g.directed ? dfsDirected : dfs
    };
}
function bfsEngine(g, start, treeEdgesOnly, searchEndCallback) {
    let nodes = g.size, pre = new Array(nodes).fill(-1), st = new Array(nodes).fill(-1), post = void 0, startTiming = 0, timing = startTiming, discovered = (node) => pre[node] >= 0, enumerator = enumConditional(start, nodes - 1, discovered), queue = new Queue(), bfsFindAdjacents = (v, processEdge) => {
        let result = [];
        for (let adjacents = g.adjacentEdges(v), i = 0; i < adjacents.length; i++) {
            let w = adjacents[i];
            if (discovered(w))
                !treeEdgesOnly && result.push(processEdge(v, w));
            else
                queue.enqueue({ v: v, w: w });
        }
        return result;
    }, bfsProcessNonTreeEdge = (v, w) => {
        let edgeKind = () => {
            if (st[v] == w)
                return EdgeVisitEnum.parent;
            else if (pre[w] < pre[v])
                return EdgeVisitEnum.back;
            else
                return EdgeVisitEnum.down;
        };
        return { v: v, w: w, e: edgeKind() };
    }, bfs = function* (startNode) {
        if (discovered(startNode))
            return 0;
        let count = 1;
        st[startNode] = startNode;
        pre[startNode] = timing++;
        yield { v: startNode, w: startNode, e: EdgeVisitEnum.tree };
        let nonTreeEdges = bfsFindAdjacents(startNode, bfsProcessNonTreeEdge);
        if (!treeEdgesOnly) {
            for (let i = 0; i < nonTreeEdges.length; i++)
                yield nonTreeEdges[i];
        }
        while (!queue.empty) {
            let edge = queue.dequeue();
            if (discovered(edge.w)) {
                if (!treeEdgesOnly)
                    yield bfsProcessNonTreeEdge(edge.v, edge.w);
            }
            else {
                pre[edge.w] = timing++;
                st[edge.w] = edge.v;
                count++;
                yield { v: edge.v, w: edge.w, e: EdgeVisitEnum.tree };
                nonTreeEdges = bfsFindAdjacents(edge.w, bfsProcessNonTreeEdge);
                if (!treeEdgesOnly) {
                    for (let i = 0; i < nonTreeEdges.length; i++)
                        yield nonTreeEdges[i];
                }
            }
        }
        searchEndCallback && searchEndCallback(startNode, startNode);
        return count;
    };
    g.directed && (post = new Array(nodes).fill(-1));
    return {
        g: g,
        nodes: nodes,
        pre: pre,
        st: st,
        post: post,
        initial: () => start,
        timing: () => timing,
        next: () => enumerator.next(),
        current: () => enumerator.current(),
        edges: () => queue.items,
        search: bfs
    };
}
export { searchGraph, dfs, dfsAnalysis, dfsEngine, bfs, bfsAnalysis, bfsEngine, };
