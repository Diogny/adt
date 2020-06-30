import { DataNode, BaseTree } from "./Tree";

export class BTreeNode<T> extends DataNode<T>  {

	public get children(): BTreeNode<T>[] {
		return [this.left, this.right].filter(item => !!item) as BTreeNode<T>[]
	}

	constructor(data: T, public left?: BTreeNode<T>, public right?: BTreeNode<T>) {
		super(data);
	}

}

export class BTree<T> extends BaseTree<T>{

	public find(data: T): BTreeNode<T>[] | undefined {
		return
	}

	constructor(public root: BTreeNode<T>) {
		super()
	}

}