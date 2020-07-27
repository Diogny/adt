import { BTree, BTreeNode } from "../lib/BTree";
export interface IVisualBTreeConfig<T> {
    tree: BTree<T>;
    nodeClass?: (node: BTreeNode<T>) => string;
    nodeValue: (value: T) => string;
    svg: SVGSVGElement;
    caption: string;
    x: number;
    y: number;
    WIDTH: number;
    HEIGHT: number;
    FONT_SIZE: number;
}
export declare function BTreeVisualizer<T>(conf: IVisualBTreeConfig<T>): {
    svg: SVGGElement;
    width: number;
    height: number;
};
