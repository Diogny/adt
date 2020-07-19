import { ValueNode, BaseTree } from "./Tree";
export declare class BTreeNode<T> extends ValueNode<T> {
    left?: BTreeNode<T> | undefined;
    right?: BTreeNode<T> | undefined;
    get isLeaf(): boolean;
    get children(): BTreeNode<T>[];
    constructor(value: T, left?: BTreeNode<T> | undefined, right?: BTreeNode<T> | undefined);
}
export declare enum SearchBTreeTraverse {
    Root = 0,
    Left = 1,
    Right = 2
}
export declare class BTree<T> extends BaseTree<T> {
    root: BTreeNode<T>;
    constructor(root: BTreeNode<T>, comparer?: (a: T, b: T) => number);
    find(value: T): BTreeNode<T> | undefined;
    inOrderEnumerator(node?: BTreeNode<T>): Generator<BTreeNode<T>, number, unknown>;
    postOrderEnumerator(node?: BTreeNode<T>): Generator<BTreeNode<T>, number, unknown>;
    newNode(value: T): BTreeNode<T>;
    protected findKey(value: T): {
        node: BTreeNode<T>;
        parent: BTreeNode<T>;
        comp: number;
    };
    min(node: BTreeNode<T>): BTreeNode<T>;
    max(node: BTreeNode<T>): BTreeNode<T>;
}
export declare abstract class SearchBTree<T> extends BTree<T> {
    abstract insert(value: T): BTreeNode<T>;
    abstract delete(value: T): BTreeNode<T> | undefined;
    insertRange(values: T[]): BTreeNode<T>[];
}
