import { formatNumber } from "dabbjs/dist/lib/strings";
import { BaseAnalyzer, BaseEdgeAnalyzer, BaseComponentAnalyzer } from "./Graph-Analyzers";
import { EdgeVisitEnum } from "./Graph";
export class DirectedBaseAnalyzer extends BaseAnalyzer {
    get directed() { return true; }
}
export class DirectedEdgeAnalyzer extends BaseEdgeAnalyzer {
    get directed() { return true; }
    constructor(showStack, showInternals, showTreeEnd) {
        super("Directed Edge Analyzer", showStack, showInternals, showTreeEnd);
        this.showStack = showStack;
        this.showInternals = showInternals;
        this.showTreeEnd = showTreeEnd;
    }
    report() {
        super.report();
        if (this.showInternals) {
            console.log(`post: ${this.dfs.post.map(n => formatNumber(n, this.maxLabelWidth)).join('  ')}`);
        }
    }
}
export class DirectedComponentAnalyzer extends BaseComponentAnalyzer {
    get directed() { return true; }
    constructor() {
        super("Directed Component Analyzer");
    }
}
//works with DFS only
export class TopoSortAnalyzer extends DirectedBaseAnalyzer {
    constructor() {
        super("Topological sort");
    }
    register(dfs) {
        super.register(dfs);
        this.order = new Array(this.dfs.nodes).fill(-1);
        this.index = 0;
        this.isDAG = true;
    }
    visit(v, w, e) {
        if (e == EdgeVisitEnum.back)
            this.isDAG = false;
    }
    endTree(v, w) {
        super.endTree(v, w);
        this.isDAG && (this.order[this.index++] = w);
    }
    report() {
        super.report();
        if (!this.isDAG) {
            console.log("Directed Graph is not a DAG, it has cycles");
        }
        else {
            let w = Math.max.apply(null, this.dfs.g.nodeList().map(n => n.label().length)) + 1;
            console.log(`order:   ${this.order.map(n => formatNumber(n, w)).join(' > ')}`);
        }
    }
}
