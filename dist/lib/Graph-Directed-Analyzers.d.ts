import { BaseAnalyzer, BaseEdgeAnalyzer, BaseComponentAnalyzer } from "./Graph-Analyzers";
import { EdgeVisitEnum, ISearchTask } from "./Graph";
export declare abstract class DirectedBaseAnalyzer extends BaseAnalyzer {
    get directed(): boolean;
}
export declare class DirectedEdgeAnalyzer extends BaseEdgeAnalyzer {
    showStack?: boolean | undefined;
    showInternals?: boolean | undefined;
    showTreeEnd?: boolean | undefined;
    get directed(): boolean;
    constructor(showStack?: boolean | undefined, showInternals?: boolean | undefined, showTreeEnd?: boolean | undefined);
    report(): void;
}
export declare class DirectedComponentAnalyzer extends BaseComponentAnalyzer {
    get directed(): boolean;
    constructor();
}
export declare class TopoSortAnalyzer extends DirectedBaseAnalyzer {
    order: number[];
    index: number;
    isDAG: boolean;
    constructor();
    register(dfs: ISearchTask): void;
    visit(v: number, w: number, e: EdgeVisitEnum): void;
    endTree(v: number, w: number): void;
    report(): void;
}
