import { BaseGraph, IDFSAnalizer, EdgeCallback, EdgeVisitEnum, ISearchTask, IEdgeSearch } from "./Graph";
import Stack from "./Stack";
import Queue from "./Queue";
import { enumConditional } from "./Utils";

function* searchGraph(engine: ISearchTask, start: number, full?: boolean): Generator<IEdgeSearch, number> {
	let
		components = 0;
	if (engine.next()) {
		do {
			components++;
			start = engine.current();
			for (let edge of engine.search(start)) {
				yield edge;
			}
		} while (full && engine.next());
	}
	return components
}

function dfs(g: BaseGraph, start: number, full?: boolean, treeEdgesOnly?: boolean, searchTreeEdgeEndCallback?: EdgeCallback)
	: IterableIterator<IEdgeSearch> {
	let
		enumerator = searchGraph(dfsEngine(g, start, treeEdgesOnly, searchTreeEdgeEndCallback), start, full),
		iterator = {
			next: (): IteratorResult<IEdgeSearch, number> => {
				return enumerator.next()
			},
			[Symbol.iterator]() {
				return iterator
			}
		};
	return iterator
}

function bfs(g: BaseGraph, start: number, full?: boolean, treeEdgesOnly?: boolean, searchTreeEdgeEndCallback?: EdgeCallback)
	: IterableIterator<IEdgeSearch> {
	let
		enumerator = searchGraph(bfsEngine(g, start, treeEdgesOnly, searchTreeEdgeEndCallback), start, full),
		iterator = {
			next: (): IteratorResult<IEdgeSearch, number> => {
				return enumerator.next()
			},
			[Symbol.iterator]() {
				return iterator
			}
		};
	return iterator
}

function searchGraphAnalysis(engine: ISearchTask, start: number, analizers: IDFSAnalizer[]): number {
	let
		enumerator = searchGraph(engine, start, true),
		result: IteratorResult<IEdgeSearch, number>;
	analizers.forEach(a => {
		if (engine.g.directed != a.directed)
			throw `edge analizer direction does not match graph`
		a.register(engine)
	});
	while (!(result = enumerator.next()).done) {
		let
			edge = result.value as IEdgeSearch;
		analizers.forEach(a => a.visit(edge.v, edge.w, edge.e))
	}
	analizers.forEach(a => a.report());
	return <number>result.value
}

function dfsAnalysis(g: BaseGraph, start: number, analizers: IDFSAnalizer[]): number {
	let
		endTreeEdgeCallback = (v: number, w: number) => {
			analizers.forEach(a => a.endTree(v, w))
		},
		engine = dfsEngine(g, start, false, endTreeEdgeCallback);
	return searchGraphAnalysis(engine, start, analizers)
}

function bfsAnalysis(g: BaseGraph, start: number, analizers: IDFSAnalizer[]): number {
	let
		endTreeEdgeCallback = (v: number, w: number) => {
			analizers.forEach(a => a.endTree(v, w))
		},
		engine = bfsEngine(g, start, false, endTreeEdgeCallback);
	return searchGraphAnalysis(engine, start, analizers)
}

function dfsEngine(g: BaseGraph, start: number, treeEdgesOnly?: boolean, searchEndCallback?: EdgeCallback): ISearchTask {
	let
		nodes = g.size,
		pre = new Array<number>(nodes).fill(-1),
		st = new Array<number>(nodes).fill(-1),
		post: number[] = <any>void 0,
		startTiming = 0,
		timing = startTiming,
		postTiming = startTiming,
		discovered = (node: number) => pre[node] >= 0,
		enumerator = enumConditional(start, nodes - 1, discovered),
		stack = new Stack<{ v: number, w: number, t: boolean }>(),
		dfsFindAdjacents = (v: number, processEdge: (v: number, w: number) => IEdgeSearch): IEdgeSearch[] => {
			let
				result: IEdgeSearch[] = [];
			for (let adjacents = g.adjacentEdges(v), i = adjacents.length - 1; i >= 0; i--) {
				let
					w = adjacents[i];
				if (discovered(w)) {
					!treeEdgesOnly && result.push(processEdge(v, w));
				}
				else
					stack.push({ v: v, w: w, t: false });
			}
			return result
		},
		dfsProcessNonTreeEdge = (v: number, w: number): IEdgeSearch => {
			let
				edgeKind = (): EdgeVisitEnum => {
					if (st[v] == w)
						return EdgeVisitEnum.parent;
					else if (pre[w] < pre[v])
						return EdgeVisitEnum.back
					else
						return EdgeVisitEnum.down;
				}
			return { v: v, w: w, e: edgeKind() }
		},
		dfsProcessNonTreeDirectedEdge = (v: number, w: number): IEdgeSearch => {
			let
				edgeKind = (): EdgeVisitEnum => {
					if (pre[v] < pre[w])
						return EdgeVisitEnum.down
					else if (post[v] == -1 && post[w] == -1)
						return EdgeVisitEnum.back
					else
						return EdgeVisitEnum.cross;
				};
			return { v: v, w: w, e: edgeKind() }
		},
		dfs = function* (startNode: number): Generator<IEdgeSearch, number> {
			if (discovered(startNode))
				return 0;
			let
				count = 1;
			st[startNode] = startNode;
			pre[startNode] = timing++;
			yield { v: startNode, w: startNode, e: EdgeVisitEnum.tree };
			let
				nonTreeEdges = dfsFindAdjacents(startNode, dfsProcessNonTreeEdge);
			if (!treeEdgesOnly) {
				for (let i = 0; i < nonTreeEdges.length; i++)
					yield nonTreeEdges[i];
			}
			while (!stack.empty) {
				let
					edge = stack.peek() as { v: number, w: number, t: boolean };
				if (edge.t) {
					searchEndCallback && searchEndCallback(edge.v, edge.w);
					stack.pop();
				} else {
					if (discovered(edge.w)) {
						if (!treeEdgesOnly)
							yield dfsProcessNonTreeEdge(edge.v, edge.w);
						stack.pop();
					} else {
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
			}
			searchEndCallback && searchEndCallback(startNode, startNode);
			return count;
		},
		dfsDirected = function* (startNode: number): Generator<IEdgeSearch, number> {
			if (discovered(startNode))
				return 0;
			let
				count = 1;
			st[startNode] = startNode;
			pre[startNode] = timing++;
			yield { v: startNode, w: startNode, e: EdgeVisitEnum.tree };
			let
				nonTreeEdges = dfsFindAdjacents(startNode, dfsProcessNonTreeDirectedEdge);
			if (!treeEdgesOnly) {
				for (let i = 0; i < nonTreeEdges.length; i++)
					yield nonTreeEdges[i];
			}
			while (!stack.empty) {
				let
					edge = stack.peek() as { v: number, w: number, t: boolean };
				if (edge.t) {
					post[edge.w] = postTiming++;
					searchEndCallback && searchEndCallback(edge.v, edge.w);
					stack.pop();
				} else {
					if (discovered(edge.w)) {
						if (!treeEdgesOnly)
							yield dfsProcessNonTreeDirectedEdge(edge.v, edge.w);
						stack.pop();
					} else {
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
	g.directed && (post = new Array<number>(nodes).fill(-1));
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
	}
}

function bfsEngine(g: BaseGraph, start: number, treeEdgesOnly?: boolean, searchEndCallback?: EdgeCallback): ISearchTask {
	let
		nodes = g.size,
		pre = new Array<number>(nodes).fill(-1),
		st = new Array<number>(nodes).fill(-1),
		post: number[] = <any>void 0,
		startTiming = 0,
		timing = startTiming,
		discovered = (node: number) => pre[node] >= 0,
		enumerator = enumConditional(start, nodes - 1, discovered),
		queue = new Queue<{ v: number, w: number }>(),
		bfsFindAdjacents = (v: number, processEdge: (v: number, w: number) => IEdgeSearch): IEdgeSearch[] => {
			let
				result: IEdgeSearch[] = [];
			for (let adjacents = g.adjacentEdges(v), i = 0; i < adjacents.length; i++) {
				let
					w = adjacents[i];
				if (discovered(w))
					!treeEdgesOnly && result.push(processEdge(v, w));
				else
					queue.enqueue({ v: v, w: w });
			}
			return result
		},
		bfsProcessNonTreeEdge = (v: number, w: number): IEdgeSearch => {
			let
				edgeKind = (): EdgeVisitEnum => {
					if (st[v] == w)
						return EdgeVisitEnum.parent;
					else if (pre[w] < pre[v])
						return EdgeVisitEnum.back
					else
						return EdgeVisitEnum.down;
				};
			return { v: v, w: w, e: edgeKind() }
		},
		bfs = function* (startNode: number): Generator<IEdgeSearch, number> {
			if (discovered(startNode))
				return 0;
			let
				count = 1;
			st[startNode] = startNode;
			pre[startNode] = timing++;
			yield { v: startNode, w: startNode, e: EdgeVisitEnum.tree };
			let
				nonTreeEdges = bfsFindAdjacents(startNode, bfsProcessNonTreeEdge);
			if (!treeEdgesOnly) {
				for (let i = 0; i < nonTreeEdges.length; i++)
					yield nonTreeEdges[i];
			}
			while (!queue.empty) {
				let
					edge = queue.dequeue() as { v: number, w: number };
				if (discovered(edge.w)) {
					if (!treeEdgesOnly)
						yield bfsProcessNonTreeEdge(edge.v, edge.w);
				} else {
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
	g.directed && (post = new Array<number>(nodes).fill(-1));
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
	}
}

export {
	searchGraph,

	dfs,
	dfsAnalysis,
	dfsEngine,

	bfs,
	bfsAnalysis,
	bfsEngine,
}
