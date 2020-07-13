import { BaseGraph } from "./Graph";
import { BaseTree, ValueNode } from "./Tree";
declare function toMatrix(g: BaseGraph): number[][];
declare function transposeMatrix(g: BaseGraph): number[][];
declare function displayMatrix(matrix: number[][]): void;
declare function displayGraphMatrix(g: BaseGraph): void;
declare function fromJSON(content: {
    [x: string]: any;
}): BaseGraph;
declare function visulizeTree<T>(tree: BaseTree<T>): void;
export declare const searchTree: <T>(root: ValueNode<T>, fn: (node: ValueNode<T>, callback: (n: ValueNode<T>) => void) => number) => T[];
export { transposeMatrix, toMatrix, fromJSON, displayMatrix, displayGraphMatrix, visulizeTree };
