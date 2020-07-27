"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RedBlackTree_1 = require("../lib/RedBlackTree");
var tree_utils_1 = require("./tree-utils");
var Utils_1 = require("src/lib/Utils");
var ratio = window.screen.width / window.screen.height, svg = document.querySelector('svg'), vbinfo = Utils_1.qS("#canvas-info"), node = Utils_1.qS("#node-value"), cons = Utils_1.qS("#cons-out>div:nth-of-type(2)"), treeSize = Utils_1.qS("#tree-size"), leftpad = 20, toppad = 40, xstart = leftpad, ystart = toppad, rowHeight = ystart, viewbox = setViewBox(0, 0, svg.clientWidth * ratio | 0, svg.clientHeight * ratio | 0), options = void 0, svgRowItems = [], maxYcaption = Number.MIN_SAFE_INTEGER;
clearSVG(createTree());
Utils_1.aEL(Utils_1.qS("#clear-tree"), "click", function () {
    clearSVG(createTree());
}, false);
Utils_1.aEL(Utils_1.qS("#load-sample"), "click", function (e) {
    clearSVG(getTreeSample());
    addSVGTree("sample tree");
}, false);
Utils_1.aEL(Utils_1.qS("#insert"), "click", function (e) {
    var nodeValue = getNodeValue(), value = parseFloat(nodeValue);
    if (isNaN(value)) {
        logMsg("invalid number: " + nodeValue);
    }
    else {
        if (options.tree.insert(createNode(value))) {
            addSVGTree("added: " + value);
        }
        else {
            logMsg("could not insert: " + nodeValue);
        }
    }
}, false);
Utils_1.aEL(Utils_1.qS("#delete"), "click", function (e) {
    var nodeValue = getNodeValue(), value = parseFloat(nodeValue);
    if (isNaN(value)) {
        logMsg("invalid number: " + nodeValue);
    }
    else {
        if (options.tree.delete(createNode(value))) {
            addSVGTree("deleted: " + value);
        }
        else {
            logMsg("could not insert: " + nodeValue);
        }
    }
}, false);
function setViewBox(x, y, w, h) {
    Utils_1.attr(svg, { "viewBox": x + " " + y + " " + w + " " + h });
    vbinfo.innerText = "x: " + x + ", y: " + y + ", width: " + w + ", height: " + h;
    return {
        x: x,
        y: y,
        width: w,
        height: h
    };
}
function createTree() {
    return new RedBlackTree_1.RedBlackTree(function (a, b) {
        if (a.value == b.value)
            return 0;
        else if (a.value > b.value)
            return 1;
        else
            return -1;
    });
}
function createNode(value) {
    return {
        value: value
    };
}
function getTreeSample() {
    var t = createTree(), array = [7, 3, 18, 10, 22, 8, 11, 26, 2, 6, 13].map(function (v) { return createNode(v); });
    t.insertRange(array);
    return t;
}
function getNodeValue() {
    var nodeValue = node.value;
    node.value = "";
    return nodeValue;
}
function getTreeSizeLabel() {
    return "Size: " + options.tree.size;
}
function clearSVG(tree) {
    svg.innerHTML = "";
    leftpad = 20;
    toppad = 40;
    xstart = leftpad;
    ystart = toppad;
    rowHeight = ystart;
    options = {
        svg: svg,
        tree: tree,
        caption: "[caption]",
        WIDTH: 40,
        HEIGHT: 60,
        FONT_SIZE: 20,
        x: 0,
        y: 0,
        nodeClass: function (node) { return RedBlackTree_1.RedBlackEnum[node.color]; },
        nodeValue: function (node) { return String(node.value); }
    };
    cons.innerHTML = "";
    treeSize.innerText = getTreeSizeLabel();
    svgRowItems = [];
}
function logMsg(msg) {
    cons.appendChild(Utils_1.html("<div>" + msg + "</div>"));
}
function addSVGTree(caption) {
    treeSize.innerText = getTreeSizeLabel();
    options.caption = caption;
    options.x = xstart;
    options.y = ystart;
    var svgTree = tree_utils_1.BTreeVisualizer(options);
    rowHeight = Math.max(rowHeight, svgTree.height);
    if (svgTree.width + xstart > viewbox.width) {
        moveToNextRow();
        svgTree.svg.setAttribute("transform", "translate(" + xstart + " " + ystart + ")");
        svgRowItems = [svgTree.svg];
        maxYcaption = svgTree.height;
    }
    else {
        svgRowItems.push(svgTree.svg);
        //adjust g>text
        maxYcaption = Math.max(maxYcaption, svgTree.height);
        svgRowItems.forEach(function (svg) {
            var text = svg.querySelector("text.caption");
            Utils_1.attr(text, {
                y: maxYcaption
            });
        });
    }
    xstart += leftpad * 2 + svgTree.width;
}
function moveToNextRow() {
    xstart = leftpad * 2;
    ystart += rowHeight + toppad * 2;
    rowHeight = 0;
}
//# sourceMappingURL=rbt.js.map