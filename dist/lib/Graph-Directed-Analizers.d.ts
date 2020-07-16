import { BaseAnalizer, BaseEdgeAnalizer, BaseComponentAnalizer } from "./Graph-Analizers";
import { EdgeVisitEnum, ISearchTask } from "./Graph";
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
export declare class DirectedComponentAnalizer extends BaseComponentAnalizer {
    get directed(): boolean;
    constructor();
}
export declare class ToposortAnalizer extends DirectedBaseAnalizer {
    order: number[];
    index: number;
    isDAG: boolean;
    constructor();
    register(dfs: ISearchTask): void;
    visit(v: number, w: number, e: EdgeVisitEnum): void;
    endTree(v: number, w: number): void;
    report(): void;
}
