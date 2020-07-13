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

	constructor() {
		super(<any>undefined)
	}

	public newNode(value: T): AVLTreeNode<T> {
		return new AVLTreeNode<T>(value)
	}

	public insert(value: T): BTreeNode<T> {
		let
			stack = new Stack<BTreeNode<T>>(),
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
			return this.root = this.newNode(value)
		insertNode(parent, node = this.newNode(value), comp);
		balance.call(this, stack);
		return node
	}

	public delete(value: T): AVLTreeNode<T> | undefined {
		let
			stack = new Stack<BTreeNode<T>>(),
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
					min = deleteMin.call(this, root.right, root, 1);
					min.right = node.right;
					min.left = root;
					root = min;
				} else
					root.right = node.right;
			} else {
				root = node.right as AVLTreeNode<T>;
				if (root.left) {
					min = deleteMin.call(this, root, node, 1);
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
			setChild(void 0, parent, this.comparer(node.value, parent.value))
		}
		balance.call(this, stack);
		return node
	}

}

const getDepth = <T>(n: AVLTreeNode<T> | undefined) => n?.depth || 0;

function setDepth<T>(node: AVLTreeNode<T>): number {
	let
		ldepth = getDepth(<any>node.left),
		rdepth = getDepth(<any>node.right);
	node.depth = Math.max(ldepth, rdepth) + 1;
	return rdepth - ldepth
}

function balance<T>(stack: Stack<BTreeNode<T>>) {
	while (!stack.empty) {
		let
			parent: AVLTreeNode<T> = <any>void 0,
			node = stack.pop() as AVLTreeNode<T>,
			balance = setDepth(node),
			svdPivot: AVLTreeNode<T> = <any>void 0,
			pivot: AVLTreeNode<T> = <any>void 0;

		if (node.depth > 2 && Math.abs(balance) > 1) {
			if (balance > 1) {
				pivot = <AVLTreeNode<T>>node.right;
				if (pivot.right) {
					node.right = pivot.left;
					setDepth(node);
				} else {
					svdPivot = pivot;
					pivot = pivot.left as AVLTreeNode<T>;
					pivot.right = svdPivot;
					node.right = svdPivot.left = <any>void 0;
					node.depth = svdPivot.depth = 1;
				}
				pivot.left = node;
			} else if (balance < 1) {
				pivot = <AVLTreeNode<T>>node.left;
				if (pivot.left) {
					node.left = pivot.right;
					setDepth(node);
				} else {
					svdPivot = pivot;
					pivot = pivot.right as AVLTreeNode<T>;
					pivot.left = svdPivot;
					node.left = svdPivot.right = <any>void 0;
					node.depth = svdPivot.depth = 1;
				}
				pivot.right = node;
			}
			setDepth(pivot);
			parent = stack.peek() as AVLTreeNode<T>;
			if (!parent) {
				(this as AVLTree<T>).root = pivot;
			} else {
				insertNode(parent, pivot, (this as AVLTree<T>).comparer(pivot.value, parent.value));
				setDepth(parent)
			}
		}
	}
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

function deleteMin<T>(node: BTreeNode<T>, parent: BTreeNode<T>, comp: number): BTreeNode<T> {
	let
		stack = new Stack<BTreeNode<T>>();
	if (node.left)
		comp = -1;
	while (node.left != undefined) {
		parent = node;
		node = node.left;
		if (node.left)
			stack.push(node);
	}
	setChild(node.right, parent, comp);
	setDepth(parent as AVLTreeNode<T>);
	balance.call(this, stack);
	return node
}