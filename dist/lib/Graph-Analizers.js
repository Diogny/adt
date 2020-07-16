"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentAnalizer = exports.BaseComponentAnalizer = exports.EdgeAnalizer = exports.BaseEdgeAnalizer = exports.CyclesAnalizer = exports.BridgeAnalizer = exports.UndirectedBaseAnalizer = exports.BaseAnalizer = void 0;
const Graph_1 = require("./Graph");
const Utils_1 = require("./Utils");
class BaseAnalizer {
    constructor(name) {
        this.name = name;
    }
    register(dfs) {
        this.dfs = dfs;
    }
    endTree(v, w) { }
    report() {
        console.log(this.name);
    }
}
exports.BaseAnalizer = BaseAnalizer;
class UndirectedBaseAnalizer extends BaseAnalizer {
    get directed() { return false; }
    constructor(name) {
        super(name);
    }
}
exports.UndirectedBaseAnalizer = UndirectedBaseAnalizer;
class BridgeAnalizer extends UndirectedBaseAnalizer {
    constructor() {
        super("Bridge Analizer");
    }
    register(dfs) {
        super.register(dfs);
        this.edgeList = [];
        this.low = new Array(this.dfs.nodes).fill(-1);
    }
    endTree(v, w) {
        super.endTree(v, w);
        if (this.low[v] > this.low[w])
            this.low[v] = this.low[w];
        if (v != w && this.low[w] == this.dfs.pre[w]) {
            this.edgeList.push(`${v}-${w}`);
        }
    }
    visit(v, w, e) {
        switch (e) {
            case Graph_1.EdgeVisitEnum.tree:
                this.low[w] = this.dfs.pre[w];
                break;
            case Graph_1.EdgeVisitEnum.parent:
            case Graph_1.EdgeVisitEnum.down:
                break;
            case Graph_1.EdgeVisitEnum.back:
                if (this.low[v] > this.dfs.pre[w])
                    this.low[v] = this.dfs.pre[w];
                break;
        }
    }
    report() {
        super.report();
        this.edgeList.forEach(s => console.log(s));
        let biggest = Math.max.apply(null, this.dfs.g.nodeList().map(n => n.label().length)) + 1, header = `node: ${Utils_1.range(0, this.dfs.nodes).map(n => Utils_1.formatNumber(n, biggest)).join('  ')}`;
        console.log(header);
        console.log(Utils_1.fillChar('-', header.length + 1));
        console.log(`low:  ${this.low.map(n => Utils_1.formatNumber(n, biggest)).join('  ')}`);
    }
}
exports.BridgeAnalizer = BridgeAnalizer;
class CyclesAnalizer extends UndirectedBaseAnalizer {
    constructor() {
        super("Cycles Analizer");
    }
    get count() { return this.cycles.length; }
    register(dfs) {
        super.register(dfs);
        this.cycles = new Array();
    }
    visit(v, w, e) {
        if (e == Graph_1.EdgeVisitEnum.back) {
            let array = [v, w], p = v;
            while ((p = this.dfs.st[p]) != w)
                array.unshift(p);
            array.unshift(w);
            this.cycles.push(array);
        }
    }
    report() {
        super.report();
        console.log(` cycle(s): ${this.count}`);
        this.cycles.forEach(c => {
            console.log('  ' + c.join('-'));
        });
    }
}
exports.CyclesAnalizer = CyclesAnalizer;
//multi-analizers
class BaseEdgeAnalizer extends BaseAnalizer {
    constructor(name, showStack, showInternals, showTreeEnd) {
        super(name);
        this.showStack = showStack;
        this.showInternals = showInternals;
        this.showTreeEnd = showTreeEnd;
        this.tabs = 4;
        this.spaces = 0;
        this.components = 0;
        this.maxLabelWidth = 0;
    }
    register(dfs) {
        super.register(dfs);
        this.colSpaces = new Array(this.dfs.g.size).fill(-1);
        this.edgeList = [];
        this.stackTrace = [];
        this.spaces = 0;
    }
    appendLine(edgeStr, stackStr) {
        this.edgeList.push(edgeStr);
        this.showStack
            && this.stackTrace.push(stackStr);
    }
    endTree(v, w) {
        super.endTree(v, w);
        if (this.showTreeEnd) {
            let s = this.colSpaces[w] * this.tabs, nv = this.dfs.g.nodeLabel(v), nw = this.dfs.g.nodeLabel(w);
            this.appendLine(`${Utils_1.fillChar(' ', s)}[${nw}] tree analized as:(${nv}-${nw})`, '');
        }
    }
    visit(v, w, e) {
        let nv = this.dfs.g.nodeLabel(v), nw = this.dfs.g.nodeLabel(w), isRoot = false;
        if (this.colSpaces[v] < 0)
            this.colSpaces[v] = 0;
        if (e == Graph_1.EdgeVisitEnum.tree) {
            this.colSpaces[w] = this.colSpaces[v] + 1;
            if (v == w) {
                isRoot = true;
                this.appendLine(`component: ${++this.components}`, '');
                this.appendLine(`[${w}] start tree`, '');
            }
        }
        this.spaces = this.colSpaces[v] * this.tabs;
        this.appendLine(`${Utils_1.fillChar(' ', isRoot ? 0 : this.spaces)}(${nv}-${nw}) ${Graph_1.EdgeVisitEnum[e]}`, this.showStack ? `[${this.dfs.edges().map(e => `${e.v}-${e.w}`).join(', ')}]` : '');
    }
    report() {
        super.report();
        let w = this.showStack ? Math.max.apply(null, this.edgeList.map(s => s.length)) : 0;
        this.edgeList.map((s, ndx) => {
            if (!this.showStack)
                return s;
            return s + Utils_1.padStr(' ', w - s.length + 5) + this.stackTrace[ndx];
        })
            .forEach(s => console.log(s));
        if (this.showInternals) {
            this.maxLabelWidth = Math.max.apply(null, this.dfs.g.nodeList().map(n => n.label().length)) + 1;
            let header = `node: ${Utils_1.range(0, this.dfs.nodes).map(n => Utils_1.formatNumber(n, this.maxLabelWidth)).join('  ')}`;
            console.log();
            console.log(header);
            console.log(Utils_1.fillChar('-', header.length + 1));
            console.log(`pre:  ${this.dfs.pre.map(n => Utils_1.formatNumber(n, this.maxLabelWidth)).join('  ')}`);
            console.log(`st:   ${this.dfs.st.map(n => Utils_1.formatNumber(n, this.maxLabelWidth)).join('  ')}`);
        }
    }
}
exports.BaseEdgeAnalizer = BaseEdgeAnalizer;
class EdgeAnalizer extends BaseEdgeAnalizer {
    constructor(showStack, showInternals, showTreeEnd) {
        super("Edge Analizer", showStack, showInternals, showTreeEnd);
        this.showStack = showStack;
        this.showInternals = showInternals;
        this.showTreeEnd = showTreeEnd;
    }
    get directed() { return false; }
}
exports.EdgeAnalizer = EdgeAnalizer;
class BaseComponentAnalizer extends BaseAnalizer {
    constructor(name) {
        super(name);
    }
    register(dfs) {
        super.register(dfs);
        this.count = 0;
        this.components = new Array(this.dfs.g.size).fill(-1);
    }
    visit(v, w, e) {
        if (e == Graph_1.EdgeVisitEnum.tree) {
            if (v == w)
                this.count++;
            this.components[w] = this.count;
        }
    }
    report() {
        super.report();
        let maxLabelWidth = String(this.dfs.nodes).length + 1, header = `node: ${Utils_1.range(0, this.dfs.nodes).map(n => Utils_1.formatNumber(n, maxLabelWidth)).join('  ')}`;
        console.log(`component(s): ${this.count}`);
        console.log(header);
        console.log(Utils_1.fillChar('-', header.length + 1));
        console.log(`comp:  ${this.components.map(n => Utils_1.formatNumber(n, maxLabelWidth)).join('  ')}`);
    }
}
exports.BaseComponentAnalizer = BaseComponentAnalizer;
class ComponentAnalizer extends BaseComponentAnalizer {
    get directed() { return false; }
    constructor() {
        super("Component Analizer");
    }
}
exports.ComponentAnalizer = ComponentAnalizer;
