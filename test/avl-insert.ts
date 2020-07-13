import { AVLTree } from '../src/ts/AVLTree';
import { visulizeTree } from '../src/ts/Graph-Utils';
import { range } from '../src/ts/Utils';

//independent run
//	node --require ts-node/register --trace-uncaught test/avl-insert.ts

const t = new AVLTree<number>();
console.log('AVL Tree created');
visulizeTree(t);

range(1, 11).forEach(n => {
	console.log('insert ' + n);
	t.insert(n);
	visulizeTree(t);
})

insertSequence("Single Left Rotation (LL Rotation)", [1, 2, 3]);
insertSequence("Single Right Rotation (RR Rotation)", [3, 2, 1]);
insertSequence("Left Right Rotation (LR Rotation)", [3, 1, 2]);
insertSequence("Right Left Rotation (RL Rotation", [1, 3, 2]);

insertSequence("Sequence #1", [5, 4, 7, 6, 8]);
insertSequence("Sequence #2", [7, 5, 8, 4, 6]);

function insertSequence(msg: string, array: number[]) {
	console.log(msg)
	const t = new AVLTree<number>();
	t.insertRange(array);
	visulizeTree(t);
}