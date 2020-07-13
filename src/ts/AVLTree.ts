import { BTree, BTreeNode } from "./BTree";
import Stack from "./Stack";

export class AVLTreeNode<T> extends BTreeNode<T>{

	public depth: number;

	constructor(value: T) {
		super(value);
		this.depth = 1;
	}

}

export class AVLTree<T> extends BTree<T> {

	constructor() {
		super(<any>undefined)
	}

	public newNode(value: T): AVLTreeNode<T> {
		return new AVLTreeNode<T>(value)
	}

	public insert(value: T): BTreeNode<T> {
		let
			stack = new Stack<BTreeNode<T>>(),
			getDepth = (n: AVLTreeNode<T> | undefined) => n?.depth || 0,
			insertNode = (parent: AVLTreeNode<T>, node: AVLTreeNode<T>, comp: Number): AVLTreeNode<T> => {
				if (comp < 0) {
					parent.left = node;
				} else {
					parent.right = node;
				}
				return parent
			},
			setDepth = (node: AVLTreeNode<T>) => {
				node.depth = Math.max(getDepth(<any>node.left), getDepth(<any>node.right)) + 1;
			},
			comp = 0,
			parent: AVLTreeNode<T> = <any>void 0,
			node = this.root as AVLTreeNode<T>;
		while (node != undefined) {
			parent = node;
			comp = this.comparer(value, node.value);
			if (comp == 0) {
				return node
			}
			else {
				if (comp < 0) {
					node = <AVLTreeNode<T>>node.left;
				} else {
					node = <AVLTreeNode<T>>node.right;
				}
				stack.push(parent);
			}
		}
		if (!parent) {
			return this.root = this.newNode(value)
		}
		insertNode(parent, node = this.newNode(value), comp);
		while (!stack.empty) {
			node = stack.pop() as AVLTreeNode<T>;
			let
				leftDepth = getDepth(<AVLTreeNode<T>>node.left),
				rightDepth = getDepth(<AVLTreeNode<T>>node.right),
				balance = rightDepth - leftDepth,
				pivot: AVLTreeNode<T> = <any>void 0;

			node.depth = Math.max(leftDepth, rightDepth) + 1;

			if (node.depth > 2 && Math.abs(balance) > 1) {
				if (balance > 1) {
					pivot = <AVLTreeNode<T>>node.right;
					node.right = <any>pivot.left;
					setDepth(node);
					insertNode(pivot, node, -1);
				} else if (balance > 1) {
					pivot = <AVLTreeNode<T>>node.left;
					node.left = <any>pivot.right;
					setDepth(node)
					insertNode(pivot, node, 1);
				}
				setDepth(pivot);
				parent = stack.peek() as AVLTreeNode<T>;
				if (!parent) {
					this.root = pivot;
				} else {
					insertNode(parent, pivot, this.comparer(pivot.value, parent.value));
					setDepth(parent)
				}
			}
		}
		return node
	}
}
