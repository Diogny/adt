import { BTreeNode, SearchBTree } from "./BTree";
import Stack from "./Stack";

export class AVLTreeNode<T> extends BTreeNode<T>{

	public depth: number;

	constructor(value: T) {
		super(value);
		this.depth = 1;
	}

}

export class AVLTree<T> extends SearchBTree<T> {

	constructor(comparer?: (a: T, b: T) => number) {
		super(<any>undefined, comparer)
	}

	public insert(value: T): AVLTreeNode<T> {
		let
			stack = new Stack<AVLTreeNode<T>>(),
			comp = 0,
			parent: AVLTreeNode<T> = <any>void 0,
			node = this.root as AVLTreeNode<T>;
		while (node != undefined) {
			parent = node;
			comp = this.comparer(value, node.value);
			if (comp == 0)
				return node
			else {
				if (comp < 0) {
					node = <AVLTreeNode<T>>node.left;
				} else {
					node = <AVLTreeNode<T>>node.right;
				}
				stack.push(parent);
			}
		}
		if (!parent)
			return this.root = newNode(value)
		insertNode(parent, node = newNode(value), comp);
		balanceTree(this, stack);
		return node
	}

	public delete(value: T): AVLTreeNode<T> | undefined {
		let
			stack = new Stack<AVLTreeNode<T>>(),
			comp = 0,
			parent: AVLTreeNode<T> = <any>void 0,
			root: AVLTreeNode<T> = <any>void 0,
			node = this.root as AVLTreeNode<T>,
			min: AVLTreeNode<T> = <any>void 0,
			found = false;
		while (node != undefined && !found) {
			parent = node;
			comp = this.comparer(value, node.value);
			if (comp == 0)
				found = true
			else {
				if (comp < 0) {
					node = <AVLTreeNode<T>>node.left;
				} else {
					node = <AVLTreeNode<T>>node.right;
				}
				stack.push(parent);
			}
		}
		if (!found)
			return undefined;
		parent = stack.peek() as AVLTreeNode<T>;
		if (node.isLeaf) {
			if (!parent) {
				return this.root = <any>void 0, node
			}
			setChild(void 0, parent, this.comparer(node.value, parent.value))
		}
		else if (node.left && node.right) {
			if (getDepth(node.left as AVLTreeNode<T>) >= getDepth(node.right as AVLTreeNode<T>)) {
				root = node.left as AVLTreeNode<T>;
				if (root.right) {
					min = deleteMin(this, <AVLTreeNode<T>>root.right, root, 1);
					min.right = node.right;
					min.left = root;
					root = min;
				} else
					root.right = node.right;
			} else {
				root = node.right as AVLTreeNode<T>;
				if (root.left) {
					min = deleteMin(this, root, node, 1);
					root.left = <any>void 0;
					min.left = node.left;
					min.right = root;
					root = min;
				} else
					root.left = node.left;
			}
			setDepth(root);
			if (!parent)
				this.root = root
			else {
				setChild(root, parent, this.comparer(root.value, parent.value))
			}
		} else {
			if (!parent) {
				return this.root = <AVLTreeNode<T>>(node.left || node.right), node
			}
			setChild(node.left || node.right, parent, this.comparer(node.value, parent.value))
		}
		balanceTree(this, stack);
		return node
	}
}

function newNode<T>(value: T): AVLTreeNode<T> {
	return new AVLTreeNode<T>(value)
}

const getDepth = <T>(n: AVLTreeNode<T> | undefined) => n?.depth || 0;

function setDepth<T>(node: AVLTreeNode<T>): number {
	let
		ldepth = getDepth(<any>node.left),
		rdepth = getDepth(<any>node.right);
	node.depth = Math.max(ldepth, rdepth) + 1;
	return rdepth - ldepth
}

function insertNode<T>(parent: AVLTreeNode<T>, node: AVLTreeNode<T>, comp: number): AVLTreeNode<T> {
	if (comp < 0) {
		parent.left = node;
	} else {
		parent.right = node;
	}
	return parent
}

function setChild<T>(node: BTreeNode<T> | undefined, parent: BTreeNode<T>, comp: number) {
	if (comp < 0)
		parent.left = node
	else
		parent.right = node;
}

function deleteMin<T>(tree: AVLTree<T>, node: AVLTreeNode<T>, parent: AVLTreeNode<T>, comp: number): AVLTreeNode<T> {
	let
		stack = new Stack<AVLTreeNode<T>>();
	if (node.left)
		comp = -1;
	while (node.left != undefined) {
		parent = node;
		node = <AVLTreeNode<T>>node.left;
		if (node.left)
			stack.push(node);
	}
	setChild(node.right, parent, comp);
	setDepth(parent as AVLTreeNode<T>);
	balanceTree(tree, stack);
	return node
}

function balanceTree<T>(tree: AVLTree<T>, stack: Stack<AVLTreeNode<T>>) {
	while (!stack.empty) {
		let
			parent: AVLTreeNode<T> = <any>void 0,
			node = stack.pop() as AVLTreeNode<T>,
			balance = setDepth(node),
			childrenBalance = 0,
			root: AVLTreeNode<T> = <any>void 0;
		if (node.depth > 2 && Math.abs(balance) > 1) {
			if (balance < 0) {
				root = <AVLTreeNode<T>>node.left;
				childrenBalance = getDepth(<any>root.right) - getDepth(<any>root.left);
				if (childrenBalance < 0) {
					node.left = root.right;
					root.right = node;
				} else {
					parent = root;
					root = <AVLTreeNode<T>>root.right;
					parent.right = root.left;
					root.left = parent;
					node.left = root.right;
					root.right = node;
					setDepth(parent)
				}
			} else {
				root = <AVLTreeNode<T>>node.right;
				childrenBalance = getDepth(<any>root.right) - getDepth(<any>root.left);
				if (childrenBalance > 0) {
					node.right = root.left;
					root.left = node;
				} else {
					parent = root;
					root = <AVLTreeNode<T>>root.left;
					parent.left = root.right;
					root.right = parent;
					node.right = root.left;
					root.left = node;
					setDepth(parent)
				}
			}
			setDepth(node);
			setDepth(root);
			parent = stack.peek() as AVLTreeNode<T>;
			if (!parent) {
				tree.root = root;
			} else {
				if (tree.comparer(root.value, parent.value) > 0)
					parent.right = root
				else
					parent.left = root;
				setDepth(parent)
			}
		}
	}
}
