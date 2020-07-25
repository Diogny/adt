import { RedBlackTree } from '../src/lib/RedBlackTree';
import { visulizeTree } from '../src/lib/Graph-Utils';

//independent run
//	node --require ts-node/register --trace-uncaught test/rbt-delete.ts

deleteteNodeFrom("Sequence #1", [18, 11, 3, 10, 22, 26, 13, 8], [7, 3, 18, 10, 22, 8, 11, 26, 2, 6, 13]); //

function deleteteNodeFrom(msg: string, deleteList: number[], array: number[]) {
	console.log(msg)
	const t = new RedBlackTree<number>();
	t.insertRange(array);
	visulizeTree(t);
	deleteList.forEach(node => t.delete(node));
	visulizeTree(t);
}