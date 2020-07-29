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
    protected __size: number;
    get size(): number;
    constructor(root: BTreeNode<T>, comparer?: (a: T, b: T) => number);
    find(value: T): BTreeNode<T> | undefined;
    inOrderEnumerator(node?: BTreeNode<T>): Generator<BTreeNode<T>, number, unknown>;
    postOrderEnumerator(node?: BTreeNode<T>): Generator<BTreeNode<T>, number, unknown>;
    newNode(value: T): BTreeNode<T>;
    min(node: BTreeNode<T>): BTreeNode<T>;
    max(node: BTreeNode<T>): BTreeNode<T>;
    protected findKey(value: T): {
        node: BTreeNode<T>;
        parent: BTreeNode<T>;
        prevComp: number;
        comp: number;
    };
    insert(value: T): boolean;
    delete(value: T): boolean;
    insertRange(values: T[]): boolean[];
    deleteRange(values: T[]): boolean[];
}
