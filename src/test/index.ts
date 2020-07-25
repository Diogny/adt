import { AVLTree } from "../lib/AVLTree";
import { RedBlackTree, RedBlackTreeNode, RedBlackEnum } from "../lib/RedBlackTree";
import { visulizeBTree } from "./tree-utils";
import { generatorObjToArray } from "../lib/Graph-Utils";
import { attr } from "src/lib/Utils";

let
	avl = new AVLTree<number>(),
	rbt = new RedBlackTree<number>(),
	svg = <SVGSVGElement>document.querySelector('svg'),
	leftpad = 20,
	toppad = 40,
	xstart = leftpad,
	ystart = toppad,
	rowHeight = ystart,
	viewbox = (<string>attr(svg, "viewBox")).split(' '),
	vbWidth = parseFloat(viewbox[2]) | 0,
	vbHeight = parseFloat(viewbox[3]) | 0;

let
	x: number, y: number, width: number, height: number;

[x, y, width, height] = viewbox.map(s => parseFloat(s) | 0);
console.log(`x: ${x}, y: ${y}, width: ${width}, height: ${height}`);

console.log('viewBox: ', viewbox, ', w: ', vbWidth, ', h: ', vbHeight);

avl.insertRange([15, 27, 19, 36, 52, 29, 18, 4]);
let
	svgTree = visulizeBTree(avl, svg, "AVL Tree", xstart, ystart);

console.log(svgTree);

xstart += leftpad * 2 + svgTree.width;
rowHeight = Math.max(rowHeight, svgTree.height);

//rbt.insertRange([7, 6, 5, 4, 3, 2, 1]);
insertRange(rbt, [7, 6, 5, 4, 3, 2, 1]);
svgTree = visulizeBTree(rbt, svg, "Red-Black Tree Insert", xstart, ystart,
	(node: RedBlackTreeNode<number>) => RedBlackEnum[node.color]);

let ino = generatorObjToArray(rbt.inOrderEnumerator(), (value) => value.value);
console.log('in-order Insert:   ', ino.array.join(' '));

xstart += leftpad * 2 + svgTree.width;
rowHeight = Math.max(rowHeight, svgTree.height);

rbt = new RedBlackTree<number>();
//rbt.insertRange([10, 20, 30, 15]);
insertRange(rbt, [10, 20, 30, 15]);
svgTree = visulizeBTree(rbt, svg, "Red-Black Tree 2", xstart, ystart,
	(node: RedBlackTreeNode<number>) => RedBlackEnum[node.color]);


xstart = leftpad * 2;
ystart += rowHeight + toppad * 2;
rowHeight = 0;

rbt = new RedBlackTree<number>();
//rbt.insertRange([7, 3, 18, 10, 22, 8, 11, 26, 2, 6, 13]);
insertRange(rbt, [7, 3, 18, 10, 22, 8, 11, 26, 2, 6, 13]);
svgTree = visulizeBTree(rbt, svg, "Red-Black Tree Delete", xstart, ystart,
	(node: RedBlackTreeNode<number>) => RedBlackEnum[node.color]);
xstart += leftpad * 2 + svgTree.width;
rowHeight = Math.max(rowHeight, svgTree.height);

ino = generatorObjToArray(rbt.inOrderEnumerator(), (value) => value.value);
console.log('in-order Delete:   ', ino.array.join(' '));

function insertRange<T>(tree: RedBlackTree<T>, array: T[]) {
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

function deleteNode<T>(t: RedBlackTree<T>, node: T) {
	t.delete(node);
	svgTree = visulizeBTree(t, svg, `RedBlackTree delete ${node}`, xstart, ystart,
		(node: RedBlackTreeNode<T>) => RedBlackEnum[node.color]);
	rowHeight = Math.max(rowHeight, svgTree.height);
	if (svgTree.width + xstart > vbWidth) {
		xstart = leftpad * 2;
		ystart += rowHeight + toppad * 2;
		rowHeight = 0;
		svgTree.svg.setAttribute("transform", `translate(${xstart} ${ystart})`);
	}
	xstart += leftpad * 2 + svgTree.width;
	let
		ino = generatorObjToArray(t.inOrderEnumerator(), (value) => value.value);
	//console.log(`in-order after delete (${node})`, ino.array.join(' '));
}