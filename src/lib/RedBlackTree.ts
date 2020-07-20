import { SearchBTree, BTreeNode } from "./BTree";
import Stack from "./Stack";

export enum RedBlackEnum {
	red = 0,
	black = 1
}

export class RedBlackTreeNode<T> extends BTreeNode<T>{

	public color: RedBlackEnum;

	constructor(value: T) {
		super(value);
		this.color = RedBlackEnum.red;
	}

}

export class RedBlackTree<T> extends SearchBTree<T> {

	constructor(comparer?: (a: T, b: T) => number) {
		super(<any>undefined, comparer)
	}

	insert(value: T): RedBlackTreeNode<T> {
		if (this.root == undefined) {
			this.root = newNode(value);
			(<RedBlackTreeNode<T>>this.root).color = RedBlackEnum.black;
			return <RedBlackTreeNode<T>>this.root;
		}
		let
			stack = new Stack<RedBlackTreeNode<T>>(),
			parent: RedBlackTreeNode<T> = <any>void 0,
			node = <RedBlackTreeNode<T>>this.root,
			comp = 0;
		while (node != undefined) {
			parent = node;
			comp = this.comparer(value, node.value);
			if (comp == 0)
				return node
			else {
				if (comp < 0)
					node = <RedBlackTreeNode<T>>node.left
				else
					node = <RedBlackTreeNode<T>>node.right;
				stack.push(parent);
			}
		}
		insertNode(parent, node = newNode(value), comp);
		balanceTree(this, node, stack);
		return node
	}

	delete(value: T): RedBlackTreeNode<T> | undefined {
		return;
	}
}

function newNode<T>(value: T): RedBlackTreeNode<T> {
	return new RedBlackTreeNode<T>(value)
}

function insertNode<T>(parent: RedBlackTreeNode<T>, node: RedBlackTreeNode<T>, comp: number): RedBlackTreeNode<T> {
	if (comp < 0) {
		parent.left = node;
	} else {
		parent.right = node;
	}
	return parent
}

function getColor<T>(node: RedBlackTreeNode<T> | undefined): RedBlackEnum {
	return node == undefined ?
		RedBlackEnum.black :
		node.color
}

function balanceTree<T>(tree: RedBlackTree<T>, node: RedBlackTreeNode<T>, stack: Stack<RedBlackTreeNode<T>>) {
	while (!stack.empty) {
		let
			comp = 0,
			parent = <RedBlackTreeNode<T>>stack.pop(),
			grandparent = <RedBlackTreeNode<T>>stack.pop();
		if (parent.color == RedBlackEnum.black || grandparent == undefined) {
			return;
		}
		let
			uncle = <RedBlackTreeNode<T>>
				((comp = tree.comparer(parent.value, grandparent.value)) < 0 ? grandparent.right : grandparent.left);
		if (getColor(uncle) == RedBlackEnum.red) {
			parent.color = RedBlackEnum.black;
			uncle.color = RedBlackEnum.black
			if (stack.empty)
				grandparent.color = RedBlackEnum.black
			else
				grandparent.color = RedBlackEnum.red;
			node = grandparent;
		} else {
			if (comp < 0) {
				if (tree.comparer(node.value, parent.value) < 0) {
					grandparent.left = parent.right;
					parent.right = grandparent;
					parent.color = RedBlackEnum.black;
					grandparent.color = RedBlackEnum.red;
					node = parent;
				} else {
					parent.right = node.left;
					grandparent.left = node.right;
					grandparent.right = uncle;
					node.left = parent;
					node.right = grandparent;
					grandparent.color = RedBlackEnum.red;
					node.color = RedBlackEnum.black;
				}
			} else {
				if (tree.comparer(node.value, parent.value) > 0) {
					grandparent.right = parent.left;
					parent.left = grandparent;
					parent.color = RedBlackEnum.black;
					grandparent.color = RedBlackEnum.red;
					node = parent;
				} else {
					parent.left = node.right;
					grandparent.right = node.left;
					grandparent.left = uncle;
					node.left = grandparent;
					node.right = parent;
					grandparent.color = RedBlackEnum.red;
					node.color = RedBlackEnum.black;
				}
			}
			parent = stack.peek() as RedBlackTreeNode<T>;
			if (parent == undefined) {
				tree.root = node
				return;
			} else {
				if (tree.comparer(node.value, parent.value) > 0)
					parent.right = node
				else
					parent.left = node;
			}
		}
	}
}