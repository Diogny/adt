import { IDFSAnalizer, ISearchTask, DFSVisitEdge } from "./Graph";
export declare abstract class BaseAnalizer implements IDFSAnalizer {
    name: string;
    protected dfs: ISearchTask;
    abstract directed: boolean;
    constructor(name: string);
    register(dfs: ISearchTask): void;
    abstract startTree(node: number): void;
    endTree(v: number, w: number): void;
    abstract visit(v: number, w: number, e: DFSVisitEdge): void;
    report(): void;
}
export declare abstract class UndirectedBaseAnalizer extends BaseAnalizer {
    get directed(): boolean;
    constructor(name: string);
}
export declare class BridgeAnalizer extends UndirectedBaseAnalizer {
    low: number[];
    edgeList: string[];
    constructor();
    register(dfs: ISearchTask): void;
    startTree(node: number): void;
    endTree(v: number, w: number): void;
    visit(v: number, w: number, e: DFSVisitEdge): void;
    report(): void;
}
export declare class CyclesAnalizer extends UndirectedBaseAnalizer {
    cycles: number[][];
    get count(): number;
    constructor();
    startTree(node: number): void;
    visit(v: number, w: number, e: DFSVisitEdge): void;
    report(): void;
}
export declare abstract class BaseEdgeAnalizer extends BaseAnalizer {
    showStack?: boolean | undefined;
    showInternals?: boolean | undefined;
    showTreeEnd?: boolean | undefined;
    edgeList: string[];
    stackTrace: string[];
    tabs: number;
    colSpaces: number[];
    spaces: number;
    components: number;
    maxLabelWidth: number;
    constructor(name: string, showStack?: boolean | undefined, showInternals?: boolean | undefined, showTreeEnd?: boolean | undefined);
    register(dfs: ISearchTask): void;
    protected appendLine(edgeStr: string, stackStr: string): void;
    startTree(node: number): void;
    endTree(v: number, w: number): void;
    visit(v: number, w: number, e: DFSVisitEdge): void;
    report(): void;
}
export declare class EdgeAnalizer extends BaseEdgeAnalizer {
    showStack?: boolean | undefined;
    showInternals?: boolean | undefined;
    showTreeEnd?: boolean | undefined;
    get directed(): boolean;
    constructor(showStack?: boolean | undefined, showInternals?: boolean | undefined, showTreeEnd?: boolean | undefined);
}
