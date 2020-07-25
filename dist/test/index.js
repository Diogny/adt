"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AVLTree_1 = require("../lib/AVLTree");
const RedBlackTree_1 = require("../lib/RedBlackTree");
const tree_utils_1 = require("./tree-utils");
const Graph_Utils_1 = require("../lib/Graph-Utils");
const Utils_1 = require("src/lib/Utils");
let avl = new AVLTree_1.AVLTree(), rbt = new RedBlackTree_1.RedBlackTree(), svg = document.querySelector('svg'), leftpad = 20, toppad = 40, xstart = leftpad, ystart = toppad, rowHeight = ystart, viewbox = Utils_1.attr(svg, "viewBox").split(' '), vbWidth = parseFloat(viewbox[2]) | 0, vbHeight = parseFloat(viewbox[3]) | 0;
console.log('viewBox: ', viewbox, ', w: ', vbWidth, ', h: ', vbHeight);
avl.insertRange([15, 27, 19, 36, 52, 29, 18, 4]);
let svgTree = tree_utils_1.visulizeBTree(avl, svg, "AVL Tree", xstart, ystart);
console.log(svgTree);
xstart += leftpad * 2 + svgTree.width;
rowHeight = Math.max(rowHeight, svgTree.height);
//rbt.insertRange([7, 6, 5, 4, 3, 2, 1]);
insertRange(rbt, [7, 6, 5, 4, 3, 2, 1]);
svgTree = tree_utils_1.visulizeBTree(rbt, svg, "Red-Black Tree Insert", xstart, ystart, (node) => RedBlackTree_1.RedBlackEnum[node.color]);
let ino = Graph_Utils_1.generatorObjToArray(rbt.inOrderEnumerator(), (value) => value.value);
console.log('in-order Insert:   ', ino.array.join(' '));
xstart += leftpad * 2 + svgTree.width;
rowHeight = Math.max(rowHeight, svgTree.height);
rbt = new RedBlackTree_1.RedBlackTree();
//rbt.insertRange([10, 20, 30, 15]);
insertRange(rbt, [10, 20, 30, 15]);
svgTree = tree_utils_1.visulizeBTree(rbt, svg, "Red-Black Tree 2", xstart, ystart, (node) => RedBlackTree_1.RedBlackEnum[node.color]);
xstart = leftpad * 2;
ystart += rowHeight + toppad * 2;
rowHeight = 0;
rbt = new RedBlackTree_1.RedBlackTree();
//rbt.insertRange([7, 3, 18, 10, 22, 8, 11, 26, 2, 6, 13]);
insertRange(rbt, [7, 3, 18, 10, 22, 8, 11, 26, 2, 6, 13]);
svgTree = tree_utils_1.visulizeBTree(rbt, svg, "Red-Black Tree Delete", xstart, ystart, (node) => RedBlackTree_1.RedBlackEnum[node.color]);
xstart += leftpad * 2 + svgTree.width;
rowHeight = Math.max(rowHeight, svgTree.height);
ino = Graph_Utils_1.generatorObjToArray(rbt.inOrderEnumerator(), (value) => value.value);
console.log('in-order Delete:   ', ino.array.join(' '));
function insertRange(tree, array) {
    array.forEach(value => tree.insert(value));
}
deleteNode(rbt, 18);
deleteNode(rbt, 11);
deleteNode(rbt, 3);
deleteNode(rbt, 10);
deleteNode(rbt, 22);
deleteNode(rbt, 26);
deleteNode(rbt, 13);
deleteNode(rbt, 8);
deleteNode(rbt, 7);
deleteNode(rbt, 6);
deleteNode(rbt, 2);
function deleteNode(t, node) {
    t.delete(node);
    svgTree = tree_utils_1.visulizeBTree(t, svg, `RedBlackTree delete ${node}`, xstart, ystart, (node) => RedBlackTree_1.RedBlackEnum[node.color]);
    rowHeight = Math.max(rowHeight, svgTree.height);
    if (svgTree.width + xstart > vbWidth) {
        xstart = leftpad * 2;
        ystart += rowHeight + toppad * 2;
        rowHeight = 0;
        svgTree.svg.setAttribute("transform", `translate(${xstart} ${ystart})`);
    }
    xstart += leftpad * 2 + svgTree.width;
    let ino = Graph_Utils_1.generatorObjToArray(t.inOrderEnumerator(), (value) => value.value);
    //console.log(`in-order after delete (${node})`, ino.array.join(' '));
}
