import { BTree, BTreeNode } from "../lib/BTree";
export declare function visulizeBTree<T>(tree: BTree<T>, svg: SVGSVGElement, caption: string, x: number, y: number, nodeClass?: (node: BTreeNode<T>) => string): {
    width: number;
    height: number;
};
