"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToposortAnalizer = exports.DirectedEdgeAnalizer = exports.DirectedBaseAnalizer = void 0;
const Utils_1 = require("./Utils");
const Graph_Analizers_1 = require("./Graph-Analizers");
const Graph_1 = require("./Graph");
class DirectedBaseAnalizer extends Graph_Analizers_1.BaseAnalizer {
    get directed() { return true; }
}
exports.DirectedBaseAnalizer = DirectedBaseAnalizer;
class DirectedEdgeAnalizer extends Graph_Analizers_1.BaseEdgeAnalizer {
    constructor(showStack, showInternals, showTreeEnd) {
        super("Directed Edge Analizer", showStack, showInternals, showTreeEnd);
        this.showStack = showStack;
        this.showInternals = showInternals;
        this.showTreeEnd = showTreeEnd;
    }
    get directed() { return true; }
    report() {
        super.report();
        if (this.showInternals) {
            console.log(`post: ${this.dfs.post.map(n => Utils_1.formatNumber(n, this.maxLabelWidth)).join('  ')}`);
        }
    }
}
exports.DirectedEdgeAnalizer = DirectedEdgeAnalizer;
//works with DFS only
class ToposortAnalizer extends DirectedBaseAnalizer {
    constructor() {
        super("Topological sort");
    }
    register(dfs) {
        super.register(dfs);
        this.order = new Array(this.dfs.nodes).fill(-1);
        this.index = 0;
        this.isDAG = true;
    }
    startTree(node) { }
    visit(v, w, e) {
        if (e == Graph_1.DFSVisitEdge.back)
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
            console.log(`order:   ${this.order.map(n => Utils_1.formatNumber(n, w)).join(' > ')}`);
        }
    }
}
exports.ToposortAnalizer = ToposortAnalizer;
