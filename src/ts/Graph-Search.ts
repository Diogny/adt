import { BaseGraph, EdgeSearchCallback, ISearchTask, IDFSAnalizer, EdgeCallback, DFSVisitEdge } from "./Graph";
import Stack from "./Stack";
import Queue from "./Queue";
import { enumConditional } from "./Utils";

function dfs(g: BaseGraph, start: number, edgeCallback: EdgeSearchCallback, treeStartCallback: (n: number) => void, treeEndCallback: EdgeCallback): number {
	return graphSearch.call(g, start, dfsEngine.call(g, start, 0) as ISearchTask,
		edgeCallback, treeStartCallback, treeEndCallback)
}

function dfsAnalysis(g: BaseGraph, start: number, analizers: IDFSAnalizer[]): number {
	return graphAnalysis.call(g, start, dfsEngine.call(g, start, 0) as ISearchTask,
		analizers, g.directed)
}

function bfs(g: BaseGraph, start: number, edgeCallback: EdgeSearchCallback, treeStartCallback: (n: number) => void, treeEndCallback: EdgeCallback): number {
	return graphSearch.call(g, start, bfsEngine.call(g, start, 0) as ISearchTask,
		edgeCallback, treeStartCallback, treeEndCallback)
}

function bfsAnalysis(g: BaseGraph, start: number, analizers: IDFSAnalizer[]): number {
	return graphAnalysis.call(g, start, bfsEngine.call(g, start, 0) as ISearchTask,
		analizers, g.directed)
}

function graphSearch(start: number, engine: ISearchTask, edgeCallback: EdgeSearchCallback,
	treeStartCallback: (n: number) => void, treeEndCallback: EdgeCallback): number {
	let
		count = 0;
	while (engine.next()) {
		treeStartCallback(start = engine.current());
		count++;
		engine.run(start, edgeCallback, treeEndCallback);
	}
	return count
}

function graphAnalysis(start: number, engine: ISearchTask, analizers: IDFSAnalizer[], directed: boolean): number {
	let
		edgeCallback = (v: number, w: number, e: DFSVisitEdge) =>
			analizers.forEach(a => a.visit(v, w, e)),
		endTreeCallback = (v: number, w: number) =>
			analizers.forEach(a => a.endTree(v, w)),
		count = 0;
	analizers.forEach(a => {
		if (directed != a.directed)
			throw `edge analizer direction does not match graph`
		a.register(engine)
	});
	while (engine.next()) {
		count++;
		analizers.forEach(a => a.startTree(start = engine.current()));
		engine.run(start, edgeCallback, endTreeCallback);
	}
	analizers.forEach(a => a.report());
	return count
}

function bfsEngine(entryNode: number, startTiming: number): ISearchTask {
	let
		g = (this as BaseGraph),
		nodes = g.size,
		pre = new Array<number>(nodes).fill(-1),
		st = new Array<number>(nodes).fill(-1),
		post: number[] = <any>void 0,
		timing = startTiming,
		postTiming = startTiming,
		discovered = (node: number) => pre[node] >= 0,
		enumerator = enumConditional(entryNode, nodes - 1, discovered),
		queue = new Queue<{ v: number, w: number }>(),
		bfsFindAdjacents = (v: number, edgeCallback: EdgeSearchCallback, processEdge: (v: number, w: number, edgeCallback: EdgeSearchCallback) => void) => {
			let
				empty = true;
			for (let array = g.adjacentEdges(v), i = 0, count = array.length; i < count; i++) {
				let
					w = array[i];
				if (discovered(w))
					processEdge(v, w, edgeCallback);
				else {
					queue.enqueue({ v: v, w: w });
					empty = false;
				}
			}
			empty && (console.log(`leaf: ${v}`))
		},
		bfsProcessNonTreeEdge = (v: number, w: number, edgeCallback: EdgeSearchCallback) => {
			if (st[v] == w)
				edgeCallback(v, w, DFSVisitEdge.parent)
			else {
				if (pre[w] < pre[v]) {
					edgeCallback(v, w, DFSVisitEdge.back)
				}
				else if (pre[w] > pre[v])
					edgeCallback(v, w, DFSVisitEdge.down)
				else
					console.log(v, w, 'Ooopsie!');
			}
		},
		bfsProcessNonTreeDirectedEdge = (v: number, w: number, edgeCallback: EdgeSearchCallback) => {
		},
		bfs = (startNode: number, edgeCallback: EdgeSearchCallback, treeEndCallback: EdgeCallback) => {
			st[startNode] = startNode;
			pre[startNode] = timing++;
			bfsFindAdjacents(startNode, edgeCallback, bfsProcessNonTreeEdge);
			while (!queue.empty) {
				let
					edge = queue.dequeue() as { v: number, w: number };

				if (discovered(edge.w)) {
					bfsProcessNonTreeEdge(edge.v, edge.w, edgeCallback);
				} else {
					pre[edge.w] = timing++;
					st[edge.w] = edge.v;
					edgeCallback(edge.v, edge.w, DFSVisitEdge.tree);
					bfsFindAdjacents(edge.w, edgeCallback, bfsProcessNonTreeEdge);
				}
			}
			treeEndCallback(startNode, startNode);
		},
		bfsDirected = (startNode: number, edgeCallback: EdgeSearchCallback, treeEndCallback: EdgeCallback) => {
			st[startNode] = startNode;
			pre[startNode] = timing++;
			//
			post[startNode] = postTiming++;
			treeEndCallback(startNode, startNode);
		};

	g.directed && (post = new Array<number>(nodes).fill(-1));
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
	}
}

function dfsEngine(entryNode: number, startTiming: number): ISearchTask {
	let
		g = (this as BaseGraph),
		nodes = g.size,
		pre = new Array<number>(nodes).fill(-1),
		st = new Array<number>(nodes).fill(-1),
		post: number[] = <any>void 0,
		timing = startTiming,
		postTiming = startTiming,
		discovered = (node: number) => pre[node] >= 0,
		enumerator = enumConditional(entryNode, nodes - 1, discovered),
		stack = new Stack<{ v: number, w: number, t: boolean }>(),
		dfsFindAdjacents = (v: number, edgeCallback: EdgeSearchCallback, processEdge: (v: number, w: number, edgeCallback: EdgeSearchCallback) => void) => {
			for (let array = g.adjacentEdges(v), i = array.length - 1; i >= 0; i--) {
				let
					w = array[i];
				if (discovered(w))
					processEdge(v, w, edgeCallback);
				else {
					stack.push({ v: v, w: w, t: false });
				}
			}
		},
		dfsProcessNonTreeEdge = (v: number, w: number, edgeCallback: EdgeSearchCallback) => {
			if (st[v] == w)
				edgeCallback(v, w, DFSVisitEdge.parent)
			else {
				if (pre[w] < pre[v]) {
					edgeCallback(v, w, DFSVisitEdge.back)
				}
				else if (pre[w] > pre[v])
					edgeCallback(v, w, DFSVisitEdge.down)
				else
					console.log(v, w, 'Ooopsie!');
			}
		},
		dfsProcessNonTreeDirectedEdge = (v: number, w: number, edgeCallback: EdgeSearchCallback) => {
			if (pre[v] < pre[w])
				edgeCallback(v, w, DFSVisitEdge.down)
			else if (post[v] == -1 && post[w] == -1)
				edgeCallback(v, w, DFSVisitEdge.back)
			else
				edgeCallback(v, w, DFSVisitEdge.cross)
		},
		dfs = (startNode: number, edgeCallback: EdgeSearchCallback, treeEndCallback: EdgeCallback) => {
			st[startNode] = startNode;
			pre[startNode] = timing++;
			dfsFindAdjacents(startNode, edgeCallback, dfsProcessNonTreeEdge);
			while (!stack.empty) {
				let
					edge = stack.peek() as { v: number, w: number, t: boolean };
				if (edge.t) {
					treeEndCallback(edge.v, edge.w);
					stack.pop();
				} else {
					if (discovered(edge.w)) {
						dfsProcessNonTreeEdge(edge.v, edge.w, edgeCallback);
						stack.pop();
					} else {
						edge.t = true;
						pre[edge.w] = timing++;
						st[edge.w] = edge.v;
						edgeCallback(edge.v, edge.w, DFSVisitEdge.tree);
						dfsFindAdjacents(edge.w, edgeCallback, dfsProcessNonTreeEdge);
					}
				}
			}
			treeEndCallback(startNode, startNode);
		},
		dfsDirected = (startNode: number, edgeCallback: EdgeSearchCallback, treeEndCallback: EdgeCallback) => {
			st[startNode] = startNode;
			pre[startNode] = timing++;
			dfsFindAdjacents(startNode, edgeCallback, dfsProcessNonTreeDirectedEdge);
			while (!stack.empty) {
				let
					edge = stack.peek() as { v: number, w: number, t: boolean };
				if (edge.t) {
					post[edge.w] = postTiming++;
					treeEndCallback(edge.v, edge.w);
					stack.pop();
				} else {
					if (discovered(edge.w)) {
						dfsProcessNonTreeDirectedEdge(edge.v, edge.w, edgeCallback);
						stack.pop();
					} else {
						edge.t = true;
						pre[edge.w] = timing++;
						st[edge.w] = edge.v;
						edgeCallback(edge.v, edge.w, DFSVisitEdge.tree);
						dfsFindAdjacents(edge.w, edgeCallback, dfsProcessNonTreeDirectedEdge);
					}
				}
			}
			post[startNode] = postTiming++;
			treeEndCallback(startNode, startNode);
		};
	g.directed && (post = new Array<number>(nodes).fill(-1));
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
	}
}

export { dfs, dfsAnalysis, bfs, bfsAnalysis }
