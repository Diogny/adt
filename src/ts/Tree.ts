import Queue from "./Queue";
import Stack from "./Stack";

export abstract class ValueNode<T> {

	abstract children: ValueNode<T>[];

	abstract isLeaf: boolean;

	constructor(public value: T) { }
}

export class TreeNode<T> extends ValueNode<T> {

	protected __children: TreeNode<T>[];

	public get children(): TreeNode<T>[] { return this.__children.slice(0) }

	public get size(): number { return this.__children.length }

	public get isLeaf(): boolean { return this.size == 0 }

	constructor(value: T, ...childrenNodes: TreeNode<T>[]) {
		super(value);
		this.__children = new Array(...childrenNodes);
	}

	public add(value: T): TreeNode<T> {
		let
			n = new TreeNode<T>(value);
		this.__children.push(n);
		return n
	}

	public remove(value: T, comparer?: (item: TreeNode<T>, index: number) => boolean): TreeNode<T> | undefined {
		let
			defaultComparer = (item: TreeNode<T>) => item.value === value,
			n = this.__children.findIndex(comparer || defaultComparer);
		return n != -1 ? this.__children.splice(n, 1)[0] : undefined
	}

	public removeAt(index: number): TreeNode<T> | undefined {
		return index >= 0 && index < this.size ? this.__children.splice(index, 1)[0] : undefined
	}

	public find(value: T, comparer?: (item: TreeNode<T>, index: number) => boolean): TreeNode<T> | undefined {
		let
			defaultComparer = (item: TreeNode<T>) => item.value === value;
		return this.__children.find(comparer || defaultComparer)
	}

}

export abstract class BaseTree<T> {

	abstract root: ValueNode<T>;

	abstract find(value: T): ValueNode<T> | undefined;

	public comparer(a: T, b: T): number {
		if (a == b)
			return 0
		else if (a > b)
			return 1
		else
			return -1
	}

	/**
	 * @description it calls levelOrder from root, and returns it's result with empty callback.
	 */
	public depth(): number {
		return this.levelOrder(this.root, (node, level) => 1);
	}

	public preOrder(node: ValueNode<T>, callback: (node: ValueNode<T>) => void): number {
		let
			stack = new Stack<ValueNode<T>>(),
			count = 0;
		if (node) {
			stack.push(node);
			while (!stack.empty) {
				count++;
				node = stack.pop() as ValueNode<T>;
				callback(node);
				for (let children = node.children, i = children.length - 1; i >= 0; i--) {
					stack.push(children[i]);
				}
			}
		}
		return count
	}

	/**
	 * @description it's an extended breadthSearch with a tree node level value
	 * @param node root node to calculate level order
	 * @param callback a function called for every tree node with it's level 1-based
	 */
	public levelOrder(node: ValueNode<T>, callback: (node: ValueNode<T>, level: number) => void): number {
		let
			queue = new Queue<{ node: ValueNode<T>, level: number }>(),
			maxLevel = 0;
		if (node) {
			queue.enqueue({ node: node, level: 1 });
			while (!queue.empty) {
				let
					father = queue.dequeue() as { node: ValueNode<T>, level: number };
				maxLevel = Math.max(maxLevel, father.level);
				callback(father.node, father.level);
				father.node.children.forEach((child) => queue.enqueue({ node: child, level: father.level + 1 }))
			}
		}
		return maxLevel
	}

	public postOrder(node: ValueNode<T>, callback: (node: ValueNode<T>) => void): number {
		let
			stack = new Stack<{ n: ValueNode<T>, t: boolean }>(),
			count = 0;
		if (node) {
			stack.push({ n: node, t: false });
			while (!stack.empty) {
				let
					n = stack.peek();
				if (n.t) {
					callback(n.n);
					stack.pop();
				} else {
					n.t = true;
					for (let children = n.n.children, i = children.length - 1; i >= 0; i--) {
						stack.push({ n: children[i], t: false })
					}
				}
			}
		}
		return count
	}

	public breathSearch(node: ValueNode<T>, callback: (node: ValueNode<T>) => void): number {
		let
			queue = new Queue<ValueNode<T>>(),
			count = 0;
		if (node) {
			queue.enqueue(node);
			while (!queue.empty) {
				node = queue.dequeue() as ValueNode<T>;
				count++;
				callback(node);
				node.children.forEach(child => queue.enqueue(child))
			}
		}
		return count;
	}

}

export class Tree<T> extends BaseTree<T>{

	/**
	 * @description implements a breadth search
	 * @param value value to search
	 */
	public find(value: T): TreeNode<T> | undefined {
		let
			queue = new Queue<TreeNode<T>>(),
			node = this.root;
		if (node) {
			queue.enqueue(node);
			while (!queue.empty) {
				node = queue.dequeue() as TreeNode<T>;
				if (this.comparer(node.value, value) == 0) {
					queue.clear();
					return node;
				} else {
					node.children.forEach(child => queue.enqueue(child))
				}
			}
		}
		return
	}

	constructor(public root: TreeNode<T>) {
		super()
	}

}