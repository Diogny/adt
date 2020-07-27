"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatorObjToArray = exports.generatorValueToArray = exports.visulizeTree = exports.displayGraphMatrix = exports.displayMatrix = exports.fromJSON = exports.toMatrix = exports.transposeMatrix = void 0;
var Graph_1 = require("./Graph");
var Utils_1 = require("./Utils");
function toMatrix(g) {
    var array = Utils_1.matrix(g.size, g.size, 0);
    //row v and column w
    g.edges().forEach(function (edge) { return array[edge.v][edge.w] = 1; });
    return array;
}
exports.toMatrix = toMatrix;
;
function transposeMatrix(g) {
    var array = Utils_1.matrix(g.size, g.size, 0);
    //row v and column w
    g.edges().forEach(function (edge) { return array[edge.w][edge.v] = 1; });
    return array;
}
exports.transposeMatrix = transposeMatrix;
//this displays numbers
function displayMatrix(matrix) {
    var width = String(matrix.length).length + 1;
    var header = Utils_1.fillChar(' ', width) + '|' + Utils_1.range(0, matrix.length).map(function (n) { return Utils_1.formatNumber(n, width); }).join(' ');
    console.log(header);
    console.log(Utils_1.fillChar('-', header.length + 1));
    Utils_1.range(0, matrix.length).forEach(function (v) {
        console.log(Utils_1.formatNumber(v, width) + '|' + Utils_1.range(0, matrix.length).map(function (w) { return Utils_1.formatNumber(matrix[v][w], width); }).join(' '));
    });
}
exports.displayMatrix = displayMatrix;
//this displays labels
function displayGraphMatrix(g) {
    var matrix = toMatrix(g), width = Math.max.apply(null, g.nodeList().map(function (n) { return n.label().length; })) + 1;
    var header = Utils_1.fillChar(' ', width) + '|' + Utils_1.range(0, g.size).map(function (n) { return Utils_1.formatNumber(n, width); }).join(' ');
    console.log(header);
    console.log(Utils_1.fillChar('-', header.length + 1));
    Utils_1.range(0, g.size).forEach(function (v) {
        console.log(Utils_1.formatNumber(v, width) + '|' + Utils_1.range(0, g.size).map(function (w) { return Utils_1.formatNumber(matrix[v][w], width); }).join(' '));
    });
}
exports.displayGraphMatrix = displayGraphMatrix;
function fromJSON(content) {
    var name = content["name"], directed = Utils_1.toBool(content["directed"]), weighted = Utils_1.toBool(content["weighted"]), labeled = !!content["labels"], labels = (labeled ? Array.from(content["labels"]) : undefined), labelMap = new Map(), nodes = labeled ? 0 : parseInt(content["nodes"]), edges = Array.from(content["edges"]), getNode = function (nodeOrLabel) {
        if (labeled) {
            var n = labelMap.get(nodeOrLabel);
            return {
                node: n != undefined ? n : -1,
                label: nodeOrLabel
            };
        }
        else
            return { node: g.hasNode(nodeOrLabel) ? nodeOrLabel : -1 };
    }, getEdge = function (e) { return ({
        v: getNode(e.from),
        w: getNode(e.to),
        weight: e.w
    }); }, g = Graph_1.BaseGraph.create(name, directed, weighted, labeled);
    if (labeled) {
        if (!labels)
            throw "invalid graph labels";
        labels.forEach(function (label, node) {
            g.addNode(label);
            labelMap.set(label, node);
        });
    }
    else {
        Utils_1.range(0, nodes).forEach(function (n) { return g.addNode(); });
    }
    if (!edges)
        throw "invalid edges";
    edges.forEach(function (e) {
        var edge = getEdge(e);
        if (edge.v.node == -1 || edge.w.node == -1)
            throw "invalid edge: " + e;
        if (weighted) {
            !edge.weight && (edge.weight = 0);
            g.connect(edge.v.node, edge.w.node, edge.weight);
        }
        else
            g.connect(edge.v.node, edge.w.node);
    });
    return g;
}
exports.fromJSON = fromJSON;
function visulizeTree(tree) {
    var columns = 0, map = new Map(), maxLabelWidth = 0, cons = [], newRow = function () { return new Array(columns).fill(Utils_1.fillChar(' ', maxLabelWidth + 1)); }, postOrder = tree.postOrderEnumerator(), result;
    if (!tree || !tree.root) {
        console.log('empty tree');
        return;
    }
    while (!(result = postOrder.next()).done) {
        var node = result.value;
        maxLabelWidth = Math.max(maxLabelWidth, String(node.value).length);
        var w = node.children.map(function (n) { return map.get(n); }).reduce(function (acc, val) { return acc + val; }, 0);
        w = w || 2;
        map.set(node, w);
    }
    !(maxLabelWidth & 1) && (maxLabelWidth++);
    columns = map.get(tree.root);
    visulizeNode(tree.root, 0, 0, columns - 1, cons, newRow, map, maxLabelWidth);
    cons.forEach(function (row) {
        console.log("" + row.join(''));
    });
}
exports.visulizeTree = visulizeTree;
function visulizeNode(node, row, mincol, maxcol, cons, newRow, map, maxLabelWidth) {
    var noderow = cons[row * 2], joinsrow = cons[row * 2 + 1], colStart = mincol, columns = [], getIndex = function (mmin, mmax) { return (mmin + (mmax - mmin + 1) / 2 | 0); }, drawLine = function (startcol, endcol) {
        for (var i = startcol + 1; i < endcol; i++) {
            joinsrow[i] = Utils_1.fillChar('─', maxLabelWidth + 1);
        }
    }, rootIndex = getIndex(mincol, maxcol);
    if (!noderow) {
        cons.push(noderow = newRow());
        cons.push(joinsrow = newRow());
    }
    noderow[rootIndex] = Utils_1.centerStr(String(node.value), maxLabelWidth);
    node.children.forEach(function (child) {
        var rootWidth = map.get(child);
        columns.push(getIndex(colStart, colStart + rootWidth - 1));
        visulizeNode(child, row + 1, colStart, colStart + rootWidth - 1, cons, newRow, map, maxLabelWidth);
        colStart += rootWidth;
    });
    if (columns.length) {
        if (columns.length == 1)
            joinsrow[columns.pop()] = Utils_1.centerPadStr('│', maxLabelWidth, ' ', ' ');
        else {
            var startcol = 0, endcol = columns.pop();
            joinsrow[endcol] = Utils_1.centerPadStr('┐', maxLabelWidth, '─', ' ');
            while (columns.length > 1) {
                joinsrow[startcol = columns.pop()] = Utils_1.centerPadStr('┬', maxLabelWidth, '─', '─');
                drawLine(startcol, endcol);
                endcol = startcol;
            }
            joinsrow[startcol = columns.pop()] = Utils_1.centerPadStr('┌', maxLabelWidth, ' ', '─');
            drawLine(startcol, endcol);
            var rootStr = joinsrow[rootIndex], index = rootStr.length / 2 | 0;
            joinsrow[rootIndex] = rootStr[index] == '─'
                ? Utils_1.replaceAt(rootStr, index, '┴') : Utils_1.replaceAt(rootStr, index, '┼');
        }
    }
}
function generatorValueToArray(enumerator) {
    var array = new Array(), result;
    while (!(result = enumerator.next()).done) {
        array.push(result.value);
    }
    return {
        array: array,
        value: result.value
    };
}
exports.generatorValueToArray = generatorValueToArray;
function generatorObjToArray(enumerator, transformer) {
    var array = new Array(), result;
    while (!(result = enumerator.next()).done) {
        array.push(transformer(result.value));
    }
    return {
        array: array,
        value: result.value
    };
}
exports.generatorObjToArray = generatorObjToArray;
//# sourceMappingURL=Graph-Utils.js.map