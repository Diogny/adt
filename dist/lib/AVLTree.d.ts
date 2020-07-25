import { BTreeNode, SearchBTree } from "./BTree";
export declare class AVLTreeNode<T> extends BTreeNode<T> {
    depth: number;
    constructor(value: T);
}
export declare class AVLTree<T> extends SearchBTree<T> {
    constructor(comparer?: (a: T, b: T) => number);
    insert(value: T): boolean;
    delete(value: T): boolean;
}
