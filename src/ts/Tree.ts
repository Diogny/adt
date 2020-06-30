import Queue from "./Queue";

export abstract class DataNode<T> {
	constructor(public data: T) { }

	abstract children: DataNode<T>[];
}

export class TreeNode<T> extends DataNode<T> {

	protected __children: TreeNode<T>[];

	public get children(): TreeNode<T>[] { return this.__children.slice(0) }

	public get size(): number { return this.__children.length }

	constructor(data: T, ...childrenNodes: TreeNode<T>[]) {
		super(data);
		this.__children = new Array(...childrenNodes);
	}

	public add(data: T): TreeNode<T> {
		let
			n = new TreeNode<T>(data);
		this.__children.push(n);
		return n
	}

	public remove(data: T, comparer?: (item: TreeNode<T>, index: number) => boolean): TreeNode<T> | undefined {
		let
			defaultComparer = (item: TreeNode<T>) => item.data === data,
			n = this.__children.findIndex(comparer || defaultComparer);
		return n != -1 ? this.__children.splice(n, 1)[0] : undefined
	}

	public removeAt(index: number): TreeNode<T> | undefined {
		return index >= 0 && index < this.size ? this.__children.splice(index, 1)[0] : undefined
	}

	public find(data: T, comparer?: (item: TreeNode<T>, index: number) => boolean): TreeNode<T> | undefined {
		let
			defaultComparer = (item: TreeNode<T>) => item.data === data;
		return this.__children.find(comparer || defaultComparer)
	}

}

export abstract class BaseTree<T> {
	abstract root: DataNode<T>;

	public depth(): number {
		let
			queue = new Queue<DataNode<T>>(),
			map = new Map<DataNode<T>, number>(),
			node: DataNode<T> | undefined,
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
		return depth;
	}
}

export class Tree<T> extends BaseTree<T>{

	public find(data: T): TreeNode<T>[] | undefined {
		return
	}

	constructor(public root: TreeNode<T>) {
		super()
	}

}