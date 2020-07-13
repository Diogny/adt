import { BaseGraph, EdgeSearchCallback, IDFSAnalizer, EdgeCallback } from "./Graph";
declare function dfs(g: BaseGraph, start: number, edgeCallback: EdgeSearchCallback, treeStartCallback: (n: number) => void, treeEndCallback: EdgeCallback): number;
declare function dfsAnalysis(g: BaseGraph, start: number, analizers: IDFSAnalizer[]): number;
declare function bfs(g: BaseGraph, start: number, edgeCallback: EdgeSearchCallback, treeStartCallback: (n: number) => void, treeEndCallback: EdgeCallback): number;
declare function bfsAnalysis(g: BaseGraph, start: number, analizers: IDFSAnalizer[]): number;
export { dfs, dfsAnalysis, bfs, bfsAnalysis };
