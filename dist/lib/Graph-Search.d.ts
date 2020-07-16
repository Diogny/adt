import { BaseGraph, IDFSAnalizer, EdgeCallback, ISearchTask, IEdgeSearch } from "./Graph";
declare function searchGraph(engine: ISearchTask, start: number, full?: boolean): Generator<IEdgeSearch, number>;
declare function dfs(g: BaseGraph, start: number, full?: boolean, treeEdgesOnly?: boolean, searchTreeEdgeEndCallback?: EdgeCallback): IterableIterator<IEdgeSearch>;
declare function bfs(g: BaseGraph, start: number, full?: boolean, treeEdgesOnly?: boolean, searchTreeEdgeEndCallback?: EdgeCallback): IterableIterator<IEdgeSearch>;
declare function dfsAnalysis(g: BaseGraph, start: number, analizers: IDFSAnalizer[]): number;
declare function bfsAnalysis(g: BaseGraph, start: number, analizers: IDFSAnalizer[]): number;
declare function dfsEngine(g: BaseGraph, start: number, treeEdgesOnly?: boolean, searchEndCallback?: EdgeCallback): ISearchTask;
declare function bfsEngine(g: BaseGraph, start: number, treeEdgesOnly?: boolean, searchEndCallback?: EdgeCallback): ISearchTask;
export { searchGraph, dfs, dfsAnalysis, dfsEngine, bfs, bfsAnalysis, bfsEngine, };
