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

export enum SearchBTreeTraverse {
	Root,
	Left,
	Right
}

export class BTree<T> extends BaseTree<T>{

	constructor(public root: BTreeNode<T>) {
		super()
	}

	public find(value: T): BTreeNode<T> | undefined {
		let
			key = this.findKey(value);
		return key.comp == 0 ? key.node : undefined
	}

	//(LNR)
	public *inOrderEnumerator(node?: BTreeNode<T>) {
		let
			stack = new Stack<BTreeNode<T>>(),
			count = 0,
			n: BTreeNode<T> | undefined = node || this.root;
		while (!stack.empty || n != undefined) {
			if (n != undefined) {
				stack.push(n);
				n = n.left;
			} else {
				n = stack.pop() as BTreeNode<T>;
				count++;
				yield n;
				n = n.right;
			}
		}
		return count;
	}

	public *postOrderEnumerator(node?: BTreeNode<T>) {
		let
			stack = new Stack<BTreeNode<T>>(),
			n: BTreeNode<T> | undefined = node || this.root,
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
					yield peekNode;
					lastNodeVisited = stack.pop();
				}
			}
		}
		return count;
	}

	public newNode(value: T): BTreeNode<T> {
		return new BTreeNode<T>(value)
	}

	protected findKey(value: T): { node: BTreeNode<T>, parent: BTreeNode<T>, comp: number } {
		let
			comp = 0,
			parent: BTreeNode<T> = <any>void 0,
			node = this.root;
		while (node != undefined) {
			parent = node;
			comp = this.comparer(value, node.value);
			if (comp == 0) {
				return {
					node: node,
					parent: parent,
					comp: comp
				}
			} else if (comp < 0) {
				node = <BTreeNode<T>>node.left
			} else {
				node = <BTreeNode<T>>node.right
			}
		}
		return { node: node, parent: parent, comp: comp }
	}

	public min(node: BTreeNode<T>): BTreeNode<T> {
		if (node)
			while (node.left != undefined)
				node = node.left;
		return node
	}

	public max(node: BTreeNode<T>): BTreeNode<T> {
		if (node)
			while (node.right != undefined)
				node = node.right;
		return node
	}

}

export abstract class SearchBTree<T> extends BTree<T> {

	abstract insert(value: T): BTreeNode<T>;

	abstract delete(value: T): BTreeNode<T> | undefined;

	public insertRange(values: T[]): BTreeNode<T>[] {
		let
			array: BTreeNode<T>[] = [];
		values.forEach(value => array.push(this.insert(value)))
		return array
	}

}