import { BaseAnalizer, BaseEdgeAnalizer } from "./Graph-Analizers";
import { DFSVisitEdge, ISearchTask } from "./Graph";
export declare abstract class DirectedBaseAnalizer extends BaseAnalizer {
    get directed(): boolean;
}
export declare class DirectedEdgeAnalizer extends BaseEdgeAnalizer {
    showStack?: boolean | undefined;
    showInternals?: boolean | undefined;
    showTreeEnd?: boolean | undefined;
    get directed(): boolean;
    constructor(showStack?: boolean | undefined, showInternals?: boolean | undefined, showTreeEnd?: boolean | undefined);
    report(): void;
}
export declare class ToposortAnalizer extends DirectedBaseAnalizer {
    order: number[];
    index: number;
    isDAG: boolean;
    constructor();
    register(dfs: ISearchTask): void;
    startTree(node: number): void;
    visit(v: number, w: number, e: DFSVisitEdge): void;
    endTree(v: number, w: number): void;
    report(): void;
}
