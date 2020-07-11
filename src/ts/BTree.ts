import { ValueNode, BaseTree } from "./Tree";
import Stack from "./Stack";

export class BTreeNode<T> extends ValueNode<T>  {

	public get isLeaf(): boolean { return !this.left && !this.right }

	public get children(): BTreeNode<T>[] {
		return [this.left, this.right].filter(item => !!item) as BTreeNode<T>[]
	}

	constructor(value: T, public left?: BTreeNode<T>, public right?: BTreeNode<T>) {
		super(value);
	}

}

export class BTree<T> extends BaseTree<T>{

	public find(value: T): BTreeNode<T>[] | undefined {
		return
	}

	constructor(public root: BTreeNode<T>) {
		super()
	}

	//(LNR)
	public inOrder(node: BTreeNode<T>, callback: (node: BTreeNode<T>) => void): number {
		let
			stack = new Stack<BTreeNode<T>>(),
			count = 0,
			n: BTreeNode<T> | undefined = node;
		while (!stack.empty || n != undefined) {
			if (n != undefined) {
				stack.push(n);
				n = n.left;
			} else {
				n = stack.pop() as BTreeNode<T>;
				count++;
				callback(n);
				n = n.right;
			}
		}
		return count;
	}

	public postOrder(node: BTreeNode<T>, callback: (node: BTreeNode<T>) => void): number {
		let
			stack = new Stack<BTreeNode<T>>(),
			n: BTreeNode<T> | undefined = node,
			lastNodeVisited: BTreeNode<T> | undefined,
			count = 0;
		while (!stack.empty || n != undefined) {
			if (n != undefined) {
				stack.push(n);
				n = n.left;
			} else {
				let
					peekNode = stack.peek();
				// if right child exists and traversing node from left child, then move right
				if (peekNode.right != undefined && lastNodeVisited != peekNode.right)
					n = peekNode.right;
				else {
					count++;
					callback(peekNode);
					lastNodeVisited = stack.pop();
				}
			}
		}
		return count;
	}

}