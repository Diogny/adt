import { BTree, BTreeNode } from "./BTree";

export class BSTNode<T> extends BTreeNode<T> {

	constructor(public key: number, value: T) {
		super(value);
	}
}

export class BST<T> extends BTree<T> {

	constructor() {
		super(<any>undefined)
	}

	public findNode(key: number): BSTNode<T> | undefined {
		let
			keyNode = findKey.call(this, key) as { node: BSTNode<T>, parent: BSTNode<T>, d: BSTTraverse };
		return keyNode.node;
	}

	public insert(key: number, value: T): BSTNode<T> {
		if (this.root == undefined) {
			return this.root = new BSTNode<T>(key, value);
		} else {
			let
				node = this.root as BSTNode<T>;
			while (true) {
				if (node.key == key) {
					node.value = value;
					return node;
				}
				else if (key > node.key) {
					if (node.right != undefined)
						node = node.right as BSTNode<T>;
					else
						return node.right = new BSTNode<T>(key, value);
				} else {
					if (node.left != undefined)
						node = node.left as BSTNode<T>;
					else
						return node.left = new BSTNode<T>(key, value);
				}
			}
		}
	}

	public delete(key: number) {
		let
			keyNode = findKey.call(this, key) as { node: BSTNode<T>, parent: BSTNode<T>, d: BSTTraverse };
		if (keyNode.node == undefined)
			return;
		if (keyNode.node.left && keyNode.node.right) {
			//both left & right children
			let
				successorFather = findMinFather.call(keyNode.node.right) as BSTNode<T>,
				minChild = successorFather.left as BSTNode<T>;
			if (minChild == undefined) {
				//copy node value and key
				keyNode.node.key = successorFather.key;
				keyNode.node.value = successorFather.value;
				//remove link
				keyNode.node.right = undefined;
				//needs to rebalance

			} else {
				//copy node value and key
				keyNode.node.key = minChild.key;
				keyNode.node.value = minChild.value;
				//relink
				successorFather.left = minChild.right;
			}
		}
		else if (keyNode.node.left) {
			//only left child
			(keyNode.d == BSTTraverse.Left)
				? keyNode.parent.left = keyNode.node.left
				: keyNode.parent.right = keyNode.node.left;
		}
		else if (keyNode.node.right) {
			//only right child
			(keyNode.d == BSTTraverse.Left)
				? keyNode.parent.left = keyNode.node.right
				: keyNode.parent.right = keyNode.node.right;
		}
		else {
			//a leave, no children
			if (keyNode.parent == undefined)
				this.root = <any>undefined;
			else {
				keyNode.parent.left = <any>undefined;
				keyNode.parent.right = <any>undefined;
			}
		}
	}
}

function findMinFather<T>(node: BSTNode<T>): BSTNode<T> {
	while (node.left != undefined && node.left.left != undefined)
		node = node.left as BSTNode<T>;
	return node;
}

enum BSTTraverse {
	Root,
	Left,
	Right
}

function findKey<T>(key: number): { node: BSTNode<T>, parent: BSTNode<T>, d: BSTTraverse } {
	let
		d = BSTTraverse.Root,
		parent: BSTNode<T> = <any>void 0,
		n = (this as BST<T>).root as BSTNode<T>;
	while (n != undefined) {
		if (key == n.key) {
			return {
				node: n,
				parent: parent,
				d: d
			}
		} else {
			parent = n;
			if (key > n.key) {
				n = n.right as BSTNode<T>;
				d = BSTTraverse.Right;
			}
			else {
				n = n.left as BSTNode<T>;
				d = BSTTraverse.Left;
			}
		}
	}
	return { node: n, parent: parent, d: d }
}