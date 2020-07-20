import { RedBlackTree } from '../src/lib/RedBlackTree';
import { visulizeTree } from '../src/lib/Graph-Utils';

//independent run
//	node --require ts-node/register --trace-uncaught test/rbt-insert.ts

insertSequence("Sequence #1", [7, 6, 5, 4, 3, 2, 1]);

insertSequence("Single Left Rotation (LL Rotation)", [1, 2, 3]);
insertSequence("Single Right Rotation (RR Rotation)", [3, 2, 1]);
insertSequence("Left Right Rotation (LR Rotation)", [3, 1, 2]);
insertSequence("Right Left Rotation (RL Rotation", [1, 3, 2]);

function insertSequence(msg: string, array: number[]) {
	console.log(msg)
	const t = new RedBlackTree<number>();
	t.insertRange(array);
	visulizeTree(t);
}

function insertSequenceSteps(msg: string, array: number[]) {
	console.log(msg);
	for (let i = 0; i < array.length; i++) {
		const
			t = new RedBlackTree<number>(),
			a = array.slice(0, i + 1);
		t.insertRange(a);
		visulizeTree(t);
	}
}