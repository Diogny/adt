import { AVLTree } from "../lib/AVLTree";
import { RedBlackTree, RedBlackTreeNode, RedBlackEnum } from "../lib/RedBlackTree";
import { visulizeBTree } from "./tree-utils";

let
	avl = new AVLTree<number>(),
	rbt = new RedBlackTree<number>(),
	svg = <SVGSVGElement>document.querySelector('svg'),
	leftpad = 20,
	toppad = 10,
	xstart = leftpad;

avl.insertRange([15, 27, 19, 36, 52, 29, 18, 4]);
let

	size = visulizeBTree(avl, svg, "AVL Tree", xstart, toppad);

console.log(size);

xstart += leftpad * 2 + size.width;
rbt.insertRange([7, 6, 5, 4, 3, 2, 1]);
size = visulizeBTree(rbt, svg, "Red-Black Tree", xstart, toppad,
	(node: RedBlackTreeNode<number>) => RedBlackEnum[node.color]);

xstart += leftpad * 2 + size.width;
rbt = new RedBlackTree<number>();
rbt.insertRange([10, 20, 30, 15]);
size = visulizeBTree(rbt, svg, "Red-Black Tree 2", xstart, toppad,
	(node: RedBlackTreeNode<number>) => RedBlackEnum[node.color]);

