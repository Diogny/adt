import { AVLTree } from "../lib/AVLTree";
import { RedBlackTree, RedBlackEnum } from "../lib/RedBlackTree";
import { BTreeVisualizer } from "./tree-utils";
import { generatorObjToArray } from "../lib/Graph-Utils";
import { attr } from "dabbjs/dist/lib/dom";
let svg = document.querySelector('svg'), svgTree, leftpad = 20, toppad = 40, xstart = leftpad, ystart = toppad, rowHeight = ystart, viewbox = attr(svg, "viewBox").split(' '), vbWidth = parseFloat(viewbox[2]) | 0, vbHeight = parseFloat(viewbox[3]) | 0, options = {
    svg: svg,
    tree: void 0,
    caption: "[caption]",
    WIDTH: 80,
    HEIGHT: 120,
    FONT_SIZE: 40,
    x: 0,
    y: 0,
    nodeValue: (node) => String(node)
}, svgRowItems = [], maxYcaption = Number.MIN_SAFE_INTEGER;
let x, y, width, height;
[x, y, width, height] = viewbox.map(s => parseFloat(s) | 0);
console.log(`x: ${x}, y: ${y}, width: ${width}, height: ${height}`);
//console.log('viewBox: ', viewbox, ', w: ', vbWidth, ', h: ', vbHeight);
let avl = new AVLTree();
avl.insertRange([15, 27, 19, 36, 52, 29, 18, 4]);
options.tree = avl;
addSVGTree("AVL Tree");
options.tree = new RedBlackTree();
options.tree.insertRange([7, 6, 5, 4, 3, 2, 1]);
options.nodeClass = (node) => RedBlackEnum[node.color];
addSVGTree("Red-Black Tree 1");
let ino = generatorObjToArray(options.tree.inOrderEnumerator(), (value) => value.value);
console.log('in-order Insert:   ', ino.array.join(' '));
options.tree = new RedBlackTree();
options.tree.insertRange([10, 20, 30, 15]);
addSVGTree("Red-Black Tree 2");
moveToNextRow();
options.tree = new RedBlackTree();
options.tree.insertRange([7, 3, 18, 10, 22, 8, 11, 26, 2, 6, 13]);
addSVGTree("Red-Black Tree");
ino = generatorObjToArray(options.tree.inOrderEnumerator(), (value) => value.value);
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
    addSVGTree(`deleted ${node}`);
    let ino = generatorObjToArray(t.inOrderEnumerator(), (value) => value.value);
    //console.log(`in-order after delete (${node})`, ino.array.join(' '));
}
function addSVGTree(caption) {
    options.caption = caption;
    options.x = xstart;
    options.y = ystart;
    svgTree = BTreeVisualizer(options);
    rowHeight = Math.max(rowHeight, svgTree.height);
    if (svgTree.width + xstart > vbWidth) {
        moveToNextRow();
        svgTree.svg.setAttribute("transform", `translate(${xstart} ${ystart})`);
        svgRowItems = [svgTree.svg];
        maxYcaption = svgTree.height;
    }
    else {
        svgRowItems.push(svgTree.svg);
        //adjust g>text
        maxYcaption = Math.max(maxYcaption, svgTree.height);
        svgRowItems.forEach((svg) => {
            let text = svg.querySelector("text.caption");
            attr(text, {
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
