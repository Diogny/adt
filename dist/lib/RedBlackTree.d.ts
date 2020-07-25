import { SearchBTree, BTreeNode } from "./BTree";
export declare enum RedBlackEnum {
    red = 0,
    black = 1
}
export declare class RedBlackTreeNode<T> extends BTreeNode<T> {
    color: RedBlackEnum;
    constructor(value: T);
}
export declare class RedBlackTree<T> extends SearchBTree<T> {
    constructor(comparer?: (a: T, b: T) => number);
    insert(value: T): boolean;
    delete(value: T): boolean;
}
