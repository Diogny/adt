import { BaseGraph } from "./Graph";
import { BaseTree } from "./Tree";
declare function toMatrix(g: BaseGraph): number[][];
declare function transposeMatrix(g: BaseGraph): number[][];
declare function displayMatrix(matrix: number[][]): void;
declare function displayGraphMatrix(g: BaseGraph): void;
declare function fromJSON(content: {
    [x: string]: any;
}): BaseGraph;
declare function visulizeTree<T>(tree: BaseTree<T>): void;
declare function generatorValueToArray<TValue, TResult>(enumerator: Generator<TValue, TResult>): {
    array: TValue[];
    value: TResult;
};
declare function generatorObjToArray<TValue, TValueOut, TResult>(enumerator: Generator<TValue, TResult>, transformer: (value: TValue) => TValueOut): {
    array: TValueOut[];
    value: TResult;
};
export { transposeMatrix, toMatrix, fromJSON, displayMatrix, displayGraphMatrix, visulizeTree, generatorValueToArray, generatorObjToArray };
