import { range } from "dabbjs/dist/lib/misc";
import { toBool } from "dabbjs/dist/lib/dab";
import { fillChar, formatNumber } from "dabbjs/dist/lib/strings";
import { BaseGraph } from "./Graph";
import { matrix, centerStr, centerPadStr, replaceAt } from "./Utils";
function toMatrix(g) {
    let array = matrix(g.size, g.size, 0);
    //row v and column w
    g.edges().forEach((edge) => array[edge.v][edge.w] = 1);
    return array;
}
;
function transposeMatrix(g) {
    let array = matrix(g.size, g.size, 0);
    //row v and column w
    g.edges().forEach((edge) => array[edge.w][edge.v] = 1);
    return array;
}
//this displays numbers
function displayMatrix(matrix) {
    let width = String(matrix.length).length + 1;
    let header = fillChar(' ', width) + '|' + range(0, matrix.length).map((n) => formatNumber(n, width)).join(' ');
    console.log(header);
    console.log(fillChar('-', header.length + 1));
    range(0, matrix.length).forEach((v) => {
        console.log(formatNumber(v, width) + '|' + range(0, matrix.length).map((w) => formatNumber(matrix[v][w], width)).join(' '));
    });
}
//this displays labels
function displayGraphMatrix(g) {
    let matrix = toMatrix(g), width = Math.max.apply(null, g.nodeList().map(n => n.label().length)) + 1;
    let header = fillChar(' ', width) + '|' + range(0, g.size).map((n) => formatNumber(n, width)).join(' ');
    console.log(header);
    console.log(fillChar('-', header.length + 1));
    range(0, g.size).forEach((v) => {
        console.log(formatNumber(v, width) + '|' + range(0, g.size).map((w) => formatNumber(matrix[v][w], width)).join(' '));
    });
}
function fromJSON(content) {
    let name = content["name"], directed = toBool(content["directed"]), weighted = toBool(content["weighted"]), labeled = !!content["labels"], labels = (labeled ? Array.from(content["labels"]) : undefined), labelMap = new Map(), nodes = labeled ? 0 : parseInt(content["nodes"]), edges = Array.from(content["edges"]), getNode = (nodeOrLabel) => {
        if (labeled) {
            let n = labelMap.get(nodeOrLabel);
            return {
                node: n !== null && n !== void 0 ? n : -1, // n != undefined ? n : -1,
                label: nodeOrLabel
            };
        }
        else
            return { node: g.hasNode(nodeOrLabel) ? nodeOrLabel : -1 };
    }, getEdge = (e) => ({
        v: getNode(e.from),
        w: getNode(e.to),
        weight: e.w
    }), g = BaseGraph.create(name, directed, weighted, labeled);
    if (labeled) {
        if (!labels)
            throw new Error(`invalid graph labels`);
        labels.forEach((label, node) => {
            g.addNode(label);
            labelMap.set(label, node);
        });
    }
    else {
        range(0, nodes).forEach((n) => g.addNode());
    }
    if (!edges)
        throw new Error(`invalid edges`);
    edges.forEach((e) => {
        let edge = getEdge(e);
        if (edge.v.node == -1 || edge.w.node == -1)
            throw new Error(`invalid edge`); //: ${e}
        if (weighted) {
            !edge.weight && (edge.weight = 0);
            g.connect(edge.v.node, edge.w.node, edge.weight);
        }
        else
            g.connect(edge.v.node, edge.w.node);
    });
    return g;
}
function visulizeTree(tree) {
    let columns = 0, map = new Map(), maxLabelWidth = 0, cons = [], newRow = () => new Array(columns).fill(fillChar(' ', maxLabelWidth + 1)), postOrder = tree.postOrderEnumerator(), result;
    if (!tree || !tree.root) {
        console.log('empty tree');
        return;
    }
    while (!(result = postOrder.next()).done) {
        let node = result.value;
        maxLabelWidth = Math.max(maxLabelWidth, String(node.value).length);
        let w = node.children.map(n => map.get(n)).reduce((acc, val) => acc + val, 0);
        w = w || 2;
        map.set(node, w);
    }
    !(maxLabelWidth & 1) && (maxLabelWidth++);
    columns = map.get(tree.root);
    visulizeNode(tree.root, 0, 0, columns - 1, cons, newRow, map, maxLabelWidth);
    cons.forEach(row => {
        console.log(`${row.join('')}`);
    });
}
function visulizeNode(node, row, mincol, maxcol, cons, newRow, map, maxLabelWidth) {
    let noderow = cons[row * 2], joinsrow = cons[row * 2 + 1], colStart = mincol, columns = [], getIndex = (mmin, mmax) => (mmin + (mmax - mmin + 1) / 2 | 0), drawLine = (startcol, endcol) => {
        for (let i = startcol + 1; i < endcol; i++) {
            joinsrow[i] = fillChar('─', maxLabelWidth + 1);
        }
    }, rootIndex = getIndex(mincol, maxcol);
    if (!noderow) {
        cons.push(noderow = newRow());
        cons.push(joinsrow = newRow());
    }
    noderow[rootIndex] = centerStr(String(node.value), maxLabelWidth);
    node.children.forEach((child) => {
        let rootWidth = map.get(child);
        columns.push(getIndex(colStart, colStart + rootWidth - 1));
        visulizeNode(child, row + 1, colStart, colStart + rootWidth - 1, cons, newRow, map, maxLabelWidth);
        colStart += rootWidth;
    });
    if (columns.length) {
        if (columns.length == 1)
            joinsrow[columns.pop()] = centerPadStr('│', maxLabelWidth, ' ', ' ');
        else {
            let startcol = 0, endcol = columns.pop();
            joinsrow[endcol] = centerPadStr('┐', maxLabelWidth, '─', ' ');
            while (columns.length > 1) {
                joinsrow[startcol = columns.pop()] = centerPadStr('┬', maxLabelWidth, '─', '─');
                drawLine(startcol, endcol);
                endcol = startcol;
            }
            joinsrow[startcol = columns.pop()] = centerPadStr('┌', maxLabelWidth, ' ', '─');
            drawLine(startcol, endcol);
            let rootStr = joinsrow[rootIndex], index = rootStr.length / 2 | 0;
            joinsrow[rootIndex] = rootStr[index] == '─'
                ? replaceAt(rootStr, index, '┴') : replaceAt(rootStr, index, '┼');
        }
    }
}
function generatorValueToArray(enumerator) {
    let array = new Array(), result;
    while (!(result = enumerator.next()).done) {
        array.push(result.value);
    }
    return {
        array: array,
        value: result.value
    };
}
function generatorObjToArray(enumerator, transformer) {
    let array = new Array(), result;
    while (!(result = enumerator.next()).done) {
        array.push(transformer(result.value));
    }
    return {
        array: array,
        value: result.value
    };
}
export { transposeMatrix, toMatrix, fromJSON, displayMatrix, displayGraphMatrix, visulizeTree, generatorValueToArray, generatorObjToArray };
