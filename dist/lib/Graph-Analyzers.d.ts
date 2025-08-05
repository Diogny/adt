import { IDFSAnalyzer, ISearchTask, EdgeVisitEnum, IEdge } from "./Graph";
export declare abstract class BaseAnalyzer implements IDFSAnalyzer {
    name: string;
    protected dfs: ISearchTask;
    abstract directed: boolean;
    constructor(name: string);
    register(dfs: ISearchTask): void;
    endTree(v: number, w: number): void;
    abstract visit(v: number, w: number, e: EdgeVisitEnum): void;
    report(): void;
}
export declare abstract class UndirectedBaseAnalyzer extends BaseAnalyzer {
    get directed(): boolean;
}
export declare class BridgeAnalyzer extends UndirectedBaseAnalyzer {
    low: number[];
    bridges: IEdge[];
    articulationPoints: number[];
    constructor();
    register(dfs: ISearchTask): void;
    endTree(v: number, w: number): void;
    visit(v: number, w: number, e: EdgeVisitEnum): void;
    report(): void;
}
export declare class CyclesAnalyzer extends UndirectedBaseAnalyzer {
    cycles: number[][];
    get count(): number;
    constructor();
    register(dfs: ISearchTask): void;
    visit(v: number, w: number, e: EdgeVisitEnum): void;
    report(): void;
}
export declare abstract class BaseEdgeAnalyzer extends BaseAnalyzer {
    showStack?: boolean | undefined;
    showInternals?: boolean | undefined;
    showTreeEnd?: boolean | undefined;
    colSpaces: number[];
    edgeList: string[];
    stackTrace: string[];
    tabs: number;
    spaces: number;
    components: number;
    maxLabelWidth: number;
    constructor(name: string, showStack?: boolean | undefined, showInternals?: boolean | undefined, showTreeEnd?: boolean | undefined);
    register(dfs: ISearchTask): void;
    protected appendLine(edgeStr: string, stackStr: string): void;
    endTree(v: number, w: number): void;
    visit(v: number, w: number, e: EdgeVisitEnum): void;
    report(): void;
}
export declare class EdgeAnalyzer extends BaseEdgeAnalyzer {
    showStack?: boolean | undefined;
    showInternals?: boolean | undefined;
    showTreeEnd?: boolean | undefined;
    get directed(): boolean;
    constructor(showStack?: boolean | undefined, showInternals?: boolean | undefined, showTreeEnd?: boolean | undefined);
}
export declare abstract class BaseComponentAnalyzer extends BaseAnalyzer {
    count: number;
    components: number[];
    register(dfs: ISearchTask): void;
    visit(v: number, w: number, e: EdgeVisitEnum): void;
    report(): void;
}
export declare class ComponentAnalyzer extends BaseComponentAnalyzer {
    get directed(): boolean;
    constructor();
}
