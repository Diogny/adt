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

	protected __size: number;

	public get size(): number { return this.__size }

	constructor(public root: BTreeNode<T>, comparer?: (a: T, b: T) => number) {
		super(comparer);
		this.__size = 0;
		if (this.root != undefined) {
			for (let n of this.preOrderEnumerator())
				this.__size++;
		}
	}

	public find(value: T): BTreeNode<T> | undefined {
		let
			key = this.findKey(value);
		//key.comp == 0 && key.node != undefined has a valid found node
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

	protected findKey(value: T): { node: BTreeNode<T>, parent: BTreeNode<T>, prevComp: number, comp: number } {
		let
			prevComp = 0,
			parent: BTreeNode<T> = <any>void 0,
			node = this.root;
		while (node != undefined) {
			let
				comp = this.comparer(value, node.value);
			if (comp == 0) {
				return {
					node: node,
					parent: parent,
					prevComp: prevComp,
					comp: 0
				}
			} else {
				if (comp < 0) {
					if (node.left != undefined) {
						parent = node;
						prevComp = comp;
					}
					node = <BTreeNode<T>>node.left
				} else {
					if (node.right != undefined) {
						parent = node;
						prevComp = comp;
					}
					node = <BTreeNode<T>>node.right
				}
			}
		}
		return { node: <any>void 0, parent: <any>void 0, prevComp: 0, comp: 0 }
	}

	public insert(value: T): boolean {
		let
			key = this.findKey(value),
			node = getChild(key.parent, key.prevComp),
			child = this.newNode(value);
		return (node != undefined) && (setChild(node, child, key.comp), this.__size++, true)
	}

	public delete(value: T): boolean {
		let
			key = this.findKey(value);
		if (!(key.comp == 0 && key.node != undefined)) {
			return false
		} if (key.node.isLeaf) {
			setChild(key.parent, void 0, key.prevComp);
		} else
			if (key.node.left == undefined || key.node.right == undefined) {
				setChild(key.parent, getChild(key.node, key.node.left == undefined ? 1 : -1), key.prevComp)
			} else {
				let
					p: BTreeNode<T> = <any>void 0,
					n = <BTreeNode<T>>key.node.left,
					comp = n.right == undefined ? -1 : 1;
				while (n.right != undefined) {
					p = n;
					n = <BTreeNode<T>>n.right
				}
				key.node.value = n.value;
				if (p == undefined)
					p = key.node;
				setChild(p, n.left, comp)
			}
		this.__size--;
		return true
	}

	public insertRange(values: T[]): boolean[] {
		let
			array: boolean[] = [];
		values.forEach(value => array.push(this.insert(value)))
		return array
	}

	public deleteRange(values: T[]): boolean[] {
		let
			array: boolean[] = [];
		values.forEach(value => array.push(this.delete(value)))
		return array
	}
}

function getChild<T>(parent: BTreeNode<T>, comp: number): BTreeNode<T> | undefined {
	return (parent == undefined) ? undefined : (comp < 0 ? parent.left : parent.right)
}

function setChild<T>(parent: BTreeNode<T>, node: BTreeNode<T> | undefined, comp: number) {
	(parent != undefined) && (comp < 0 ? parent.left = node : parent.right = node)
}
