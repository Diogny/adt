"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var AVLTree_1 = require("../lib/AVLTree");
var RedBlackTree_1 = require("../lib/RedBlackTree");
var tree_utils_1 = require("./tree-utils");
var Graph_Utils_1 = require("../lib/Graph-Utils");
var Utils_1 = require("src/lib/Utils");
var svg = document.querySelector('svg'), svgTree, leftpad = 20, toppad = 40, xstart = leftpad, ystart = toppad, rowHeight = ystart, viewbox = Utils_1.attr(svg, "viewBox").split(' '), vbWidth = parseFloat(viewbox[2]) | 0, vbHeight = parseFloat(viewbox[3]) | 0, options = {
    svg: svg,
    tree: void 0,
    caption: "[caption]",
    WIDTH: 80,
    HEIGHT: 120,
    FONT_SIZE: 40,
    x: 0,
    y: 0,
    nodeValue: function (node) { return String(node); }
}, svgRowItems = [], maxYcaption = Number.MIN_SAFE_INTEGER;
var x, y, width, height;
_a = tslib_1.__read(viewbox.map(function (s) { return parseFloat(s) | 0; }), 4), x = _a[0], y = _a[1], width = _a[2], height = _a[3];
console.log("x: " + x + ", y: " + y + ", width: " + width + ", height: " + height);
//console.log('viewBox: ', viewbox, ', w: ', vbWidth, ', h: ', vbHeight);
var avl = new AVLTree_1.AVLTree();
avl.insertRange([15, 27, 19, 36, 52, 29, 18, 4]);
options.tree = avl;
addSVGTree("AVL Tree");
options.tree = new RedBlackTree_1.RedBlackTree();
options.tree.insertRange([7, 6, 5, 4, 3, 2, 1]);
options.nodeClass = function (node) { return RedBlackTree_1.RedBlackEnum[node.color]; };
addSVGTree("Red-Black Tree 1");
var ino = Graph_Utils_1.generatorObjToArray(options.tree.inOrderEnumerator(), function (value) { return value.value; });
console.log('in-order Insert:   ', ino.array.join(' '));
options.tree = new RedBlackTree_1.RedBlackTree();
options.tree.insertRange([10, 20, 30, 15]);
addSVGTree("Red-Black Tree 2");
moveToNextRow();
options.tree = new RedBlackTree_1.RedBlackTree();
options.tree.insertRange([7, 3, 18, 10, 22, 8, 11, 26, 2, 6, 13]);
addSVGTree("Red-Black Tree");
ino = Graph_Utils_1.generatorObjToArray(options.tree.inOrderEnumerator(), function (value) { return value.value; });
console.log('in-order Delete:   ', ino.array.join(' '));
deleteNode(options.tree, 18);
deleteNode(options.tree, 11);
deleteNode(options.tree, 3);
deleteNode(options.tree, 10);
deleteNode(options.tree, 22);
deleteNode(options.tree, 26);
deleteNode(options.tree, 13);
deleteNode(options.tree, 8);
deleteNode(options.tree, 7);
deleteNode(options.tree, 6);
deleteNode(options.tree, 2);
function deleteNode(t, node) {
    t.delete(node);
    addSVGTree("deleted " + node);
    var ino = Graph_Utils_1.generatorObjToArray(t.inOrderEnumerator(), function (value) { return value.value; });
    //console.log(`in-order after delete (${node})`, ino.array.join(' '));
}
function addSVGTree(caption) {
    options.caption = caption;
    options.x = xstart;
    options.y = ystart;
    svgTree = tree_utils_1.BTreeVisualizer(options);
    rowHeight = Math.max(rowHeight, svgTree.height);
    if (svgTree.width + xstart > vbWidth) {
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
//# sourceMappingURL=index.js.map