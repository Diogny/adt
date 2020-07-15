export declare abstract class ValueNode<T> {
    value: T;
    abstract children: ValueNode<T>[];
    abstract isLeaf: boolean;
    constructor(value: T);
    /**
     * @description return the amount of children
     */
    get length(): number;
    /**
     * @description children indexer
     * @param index 0-based index of child
     */
    get(index: number): ValueNode<T> | undefined;
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
    preOrderEnumerator(node?: ValueNode<T>): Generator<ValueNode<T>, number, unknown>;
    preOrderIterator(node?: ValueNode<T>): IterableIterator<ValueNode<T>>;
    /**
     * @description it's an extended breadthSearch with a tree node level value
     * @param node root node to calculate level order
     * @param callback a function called for every tree node with it's level 1-based
     */
    levelOrderEnumerator(node?: ValueNode<T>): Generator<{
        node: ValueNode<T>;
        level: number;
    }, number, unknown>;
    postOrderEnumerator(node?: ValueNode<T>): Generator<ValueNode<T>, number, unknown>;
    breathSearchEnumerator(node?: ValueNode<T>): Generator<ValueNode<T>, number, unknown>;
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
