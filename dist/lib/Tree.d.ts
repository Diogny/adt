export declare abstract class ValueNode<T> {
    value: T;
    abstract children: ValueNode<T>[];
    abstract isLeaf: boolean;
    constructor(value: T);
}
export declare class TreeNode<T> extends ValueNode<T> {
    protected __children: TreeNode<T>[];
    get children(): TreeNode<T>[];
    get size(): number;
    get isLeaf(): boolean;
    constructor(value: T, ...childrenNodes: TreeNode<T>[]);
    add(value: T): TreeNode<T>;
    remove(value: T, comparer?: (item: TreeNode<T>, index: number) => boolean): TreeNode<T> | undefined;
    removeAt(index: number): TreeNode<T> | undefined;
    find(value: T, comparer?: (item: TreeNode<T>, index: number) => boolean): TreeNode<T> | undefined;
}
export declare abstract class BaseTree<T> {
    abstract root: ValueNode<T>;
    empty(): boolean;
    clear(): void;
    abstract find(value: T): ValueNode<T> | undefined;
    comparer(a: T, b: T): number;
    /**
     * @description it calls levelOrder from root, and returns it's result with empty callback.
     */
    depth(): number;
    preOrder(node: ValueNode<T>, callback: (node: ValueNode<T>) => void): number;
    /**
     * @description it's an extended breadthSearch with a tree node level value
     * @param node root node to calculate level order
     * @param callback a function called for every tree node with it's level 1-based
     */
    levelOrder(node: ValueNode<T>, callback: (node: ValueNode<T>, level: number) => void): number;
    postOrder(node: ValueNode<T>, callback: (node: ValueNode<T>) => void): number;
    breathSearch(node: ValueNode<T>, callback: (node: ValueNode<T>) => void): number;
}
export declare class Tree<T> extends BaseTree<T> {
    root: TreeNode<T>;
    /**
     * @description implements a breadth search
     * @param value value to search
     */
    find(value: T): TreeNode<T> | undefined;
    constructor(root: TreeNode<T>);
}
