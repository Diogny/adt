import { AVLTree } from '../src/lib/AVLTree';
import { visulizeTree } from '../src/lib/Graph-Utils';
import { range } from '../src/lib/Utils';

//independent run
//	node --require ts-node/register --trace-uncaught test/avl-insert.ts

function f1() {
	const t = new AVLTree<number>();
	console.log('AVL Tree created');
	visulizeTree(t);

	range(1, 11).forEach(n => {
		console.log('insert ' + n);
		t.insert(n);
		visulizeTree(t);
	})
}
f1();

insertSequence("Single Left Rotation (LL Rotation)", [1, 2, 3]);
insertSequence("Single Right Rotation (RR Rotation)", [3, 2, 1]);
insertSequence("Left Right Rotation (LR Rotation)", [3, 1, 2]);
insertSequence("Right Left Rotation (RL Rotation", [1, 3, 2]);

insertSequence("Sequence #1", [5, 4, 7, 6, 8]);
insertSequence("Sequence #2", [7, 5, 8, 4, 6]);

insertSequence("Sequence #3", [1, 2, 3, 4, 5, 6, 7]);

//https://www.cs.wcupa.edu/rkline/ds/avl-trees.html

insertSequence("Sequence #4 (50)", [50]);
insertSequence("Sequence #4 (25)", [50, 25]);
insertSequence("Sequence #4 (10)", [50, 25, 10]);
insertSequence("Sequence #4  (5)", [50, 25, 10, 5]);
insertSequence("Sequence #4  (7)", [50, 25, 10, 5, 7]);
insertSequence("Sequence #4  (3)", [50, 25, 10, 5, 7, 3]);
insertSequence("Sequence #4 (30)", [50, 25, 10, 5, 7, 3, 30]);
insertSequence("Sequence #4 (20)", [50, 25, 10, 5, 7, 3, 30, 20]);
insertSequence("Sequence #4  (8)", [50, 25, 10, 5, 7, 3, 30, 20, 8]);
insertSequence("Sequence #4 (15)", [50, 25, 10, 5, 7, 3, 30, 20, 8, 15]);

insertSequenceSteps("Sequence #5", [15, 27, 19, 36, 52, 29, 18, 4]);

function insertSequence(msg: string, array: number[]) {
	console.log(msg)
	const t = new AVLTree<number>();
	t.insertRange(array);
	visulizeTree(t);
}

function insertSequenceSteps(msg: string, array: number[]) {
	console.log(msg);
	for (let i = 0; i < array.length; i++) {
		const
			t = new AVLTree<number>(),
			a = array.slice(0, i + 1);
		t.insertRange(a);
		visulizeTree(t);
	}
}