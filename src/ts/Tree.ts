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

	public depth(): number {
		let
			queue = new Queue<ValueNode<T>>(),
			map = new Map<ValueNode<T>, number>(),
			node: ValueNode<T> | undefined,
			depth = 0;
		queue.enqueue(this.root);
		map.set(this.root, 0);
		while (node = queue.dequeue()) {
			let
				d = map.get(node) as number;
			node.children.forEach(child => {
				map.set(child, d + 1);
				queue.enqueue(child);
			});
			depth = Math.max(depth, d)
		}
		return depth + (this.root ? 1 : 0)
	}

	public preOrder(node: ValueNode<T>, callback: (node: ValueNode<T>) => void): number {
		if (!node)
			return -1;
		let
			stack = new Stack<ValueNode<T>>(),
			count = 0;
		stack.push(node);
		while (!stack.empty) {
			count++;
			node = stack.pop() as ValueNode<T>;
			callback(node);
			for (let children = node.children, i = children.length - 1; i >= 0; i--) {
				stack.push(children[i]);
			}
		}
		return count
	}

	//it's breadthSearch with level value
	public levelOrder(node: ValueNode<T>, callback: (node: ValueNode<T>, level: number) => void): number {
		if (!node)
			return -1;
		let
			queue = new Queue<{ node: ValueNode<T>, level: number }>(),
			maxLevel = 0;
		queue.enqueue({ node: node, level: 1 });
		while (!queue.empty) {
			let n = queue.dequeue() as { node: ValueNode<T>, level: number };
			maxLevel = Math.max(maxLevel, n.level);
			callback(n.node, n.level);
			for (let children = n.node.children, i = 0; i < children.length; i++) {
				queue.enqueue({ node: children[i], level: n.level + 1 })
			}
		}
		return maxLevel
	}

	public postOrder(node: ValueNode<T>, callback: (node: ValueNode<T>) => void): number {
		if (!node)
			return -1;
		let
			stack = new Stack<{ n: ValueNode<T>, t: boolean }>(),
			count = 0;
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
		return count
	}

	public breathSearch(node: ValueNode<T>, callback: (node: ValueNode<T>) => void): number {
		if (!node)
			return -1;
		let
			queue = new Queue<ValueNode<T>>(),
			count = 0;
		queue.enqueue(node);
		while (!queue.empty) {
			node = queue.dequeue() as ValueNode<T>;
			count++;
			callback(node);
			node.children.forEach(n => {
				queue.enqueue(n);
			})
		}
		return count;
	}

}

export class Tree<T> extends BaseTree<T>{

	public find(value: T): TreeNode<T>[] | undefined {
		return
	}

	constructor(public root: TreeNode<T>) {
		super()
	}

}