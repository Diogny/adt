import { EdgeVisitEnum } from "./Graph";
import { range } from "dabbjs/dist/lib/misc";
import { fillChar, formatNumber, padStr } from "dabbjs/dist/lib/strings";
export class BaseAnalyzer {
    constructor(name) {
        this.name = name;
    }
    register(dfs) {
        this.dfs = dfs;
    }
    endTree(v, w) { }
    report() {
        console.log();
        console.log(this.name);
    }
}
export class UndirectedBaseAnalyzer extends BaseAnalyzer {
    get directed() { return false; }
}
export class BridgeAnalyzer extends UndirectedBaseAnalyzer {
    constructor() {
        super("Bridge Analyzer");
    }
    register(dfs) {
        super.register(dfs);
        this.bridges = [];
        this.articulationPoints = [];
        this.low = new Array(this.dfs.nodes).fill(-1);
    }
    endTree(v, w) {
        super.endTree(v, w);
        if (this.low[v] > this.low[w])
            this.low[v] = this.low[w];
        if (v != w) {
            if (this.low[w] > this.dfs.pre[v]) {
                this.articulationPoints.push(w);
                this.articulationPoints.push(v);
            }
            else if (this.low[w] == this.dfs.pre[v] && this.low[v] != this.low[w]) {
                this.articulationPoints.push(v);
            }
            if (this.low[w] == this.dfs.pre[w]) {
                this.bridges.push({ v: v, w: w });
            }
        }
    }
    visit(v, w, e) {
        switch (e) {
            case EdgeVisitEnum.tree:
                this.low[w] = this.dfs.pre[w];
                break;
            case EdgeVisitEnum.parent:
            case EdgeVisitEnum.down:
                break;
            case EdgeVisitEnum.back:
                if (this.low[v] > this.dfs.pre[w])
                    this.low[v] = this.dfs.pre[w];
                break;
        }
    }
    report() {
        super.report();
        let label = (node) => this.dfs.g.nodeLabel(node), biggest = Math.max.apply(null, this.dfs.g.nodeList().map(n => n.label().length)) + 1, header = `node: ${this.dfs.g.nodeList().map(n => padStr(n.label(), biggest)).join('  ')}`;
        console.log(this.bridges.length ? `${this.bridges.length} bridge(s)` : 'no bridges');
        this.bridges
            .forEach(e => console.log(`${label(e.v)}-${label(e.w)}`));
        console.log(this.articulationPoints.length ? `${this.articulationPoints.length} articulation point(s)` : 'no articulation points');
        console.log(this.articulationPoints
            .map(node => label(node))
            .join(', '));
        console.log(header);
        console.log(fillChar('-', header.length + 1));
        console.log(`low:  ${this.low.map(n => formatNumber(n, biggest)).join('  ')}`);
        if (this.dfs.g.labeled)
            console.log(`      ${this.low.map(n => padStr(this.dfs.g.nodeLabel(n), biggest)).join('  ')}`);
    }
}
export class CyclesAnalyzer extends UndirectedBaseAnalyzer {
    get count() { return this.cycles.length; }
    constructor() {
        super("Cycles Analyzer");
    }
    register(dfs) {
        super.register(dfs);
        this.cycles = new Array();
    }
    visit(v, w, e) {
        if (e == EdgeVisitEnum.back) {
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
//multi-analyzers
export class BaseEdgeAnalyzer extends BaseAnalyzer {
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
            this.appendLine(`${fillChar(' ', s)}[${nw}] tree analized as:(${nv}-${nw})`, '');
        }
    }
    visit(v, w, e) {
        let nv = this.dfs.g.nodeLabel(v), nw = this.dfs.g.nodeLabel(w), isRoot = false;
        if (this.colSpaces[v] < 0)
            this.colSpaces[v] = 0;
        if (e == EdgeVisitEnum.tree) {
            this.colSpaces[w] = this.colSpaces[v] + 1;
            if (v == w) {
                isRoot = true;
                this.appendLine(`component: ${++this.components}`, '');
                this.appendLine(`[${w}] start tree`, '');
            }
        }
        this.spaces = this.colSpaces[v] * this.tabs;
        this.appendLine(`${fillChar(' ', isRoot ? 0 : this.spaces)}(${nv}-${nw}) ${EdgeVisitEnum[e]}`, this.showStack ? `[${this.dfs.edges().map(e => `${e.v}-${e.w}`).join(', ')}]` : '');
    }
    report() {
        super.report();
        let w = this.showStack ? Math.max.apply(null, this.edgeList.map(s => s.length)) : 0;
        this.edgeList.map((s, ndx) => {
            if (!this.showStack)
                return s;
            return s + padStr(' ', w - s.length + 5) + this.stackTrace[ndx];
        })
            .forEach(s => console.log(s));
        if (this.showInternals) {
            this.maxLabelWidth = Math.max.apply(null, this.dfs.g.nodeList().map(n => n.label().length)) + 1;
            let header = `node: ${range(0, this.dfs.nodes).map(n => formatNumber(n, this.maxLabelWidth)).join('  ')}`;
            console.log();
            console.log(header);
            console.log(fillChar('-', header.length + 1));
            console.log(`pre:  ${this.dfs.pre.map(n => formatNumber(n, this.maxLabelWidth)).join('  ')}`);
            console.log(`st:   ${this.dfs.st.map(n => formatNumber(n, this.maxLabelWidth)).join('  ')}`);
        }
    }
}
export class EdgeAnalyzer extends BaseEdgeAnalyzer {
    get directed() { return false; }
    constructor(showStack, showInternals, showTreeEnd) {
        super("Edge Analyzer", showStack, showInternals, showTreeEnd);
        this.showStack = showStack;
        this.showInternals = showInternals;
        this.showTreeEnd = showTreeEnd;
    }
}
export class BaseComponentAnalyzer extends BaseAnalyzer {
    register(dfs) {
        super.register(dfs);
        this.count = 0;
        this.components = new Array(this.dfs.g.size).fill(-1);
    }
    visit(v, w, e) {
        if (e == EdgeVisitEnum.tree) {
            if (v == w)
                this.count++;
            this.components[w] = this.count;
        }
    }
    report() {
        super.report();
        let maxLabelWidth = String(this.dfs.nodes).length + 1, header = `node: ${range(0, this.dfs.nodes).map(n => formatNumber(n, maxLabelWidth)).join('  ')}`;
        console.log(`component(s): ${this.count}`);
        console.log(header);
        console.log(fillChar('-', header.length + 1));
        console.log(`comp:  ${this.components.map(n => formatNumber(n, maxLabelWidth)).join('  ')}`);
    }
}
export class ComponentAnalyzer extends BaseComponentAnalyzer {
    get directed() { return false; }
    constructor() {
        super("Component Analyzer");
    }
}
