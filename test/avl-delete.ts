import { AVLTree } from '../src/lib/AVLTree';
import { visulizeTree } from '../src/lib/Graph-Utils';

//independent run
//	node --require ts-node/register --trace-uncaught test/avl-delete.ts

deleteTest("delete root", 1, [1]);
deleteTest("delete right leave", 2, [1, 2]);
deleteTest("delete left leave", 1, [2, 1]);
deleteTest("delete root with one right leave", 1, [1, 2]);
deleteTest("delete root with one left leave", 2, [2, 1]);

deleteTest("delete sequence #1", 5, [5, 4, 7, 6, 8]);
deleteTest("delete sequence #2", 7, [7, 5, 8, 4, 6]);

deleteTest("delete sequence #2", 19, [15, 27, 19, 36, 52, 29, 18, 4]);

function deleteTest(msg: string, node: number, array: number[]) {
	console.log("\r\n" + msg);
	let
		t = new AVLTree<number>();
	t.insertRange(array);
	visulizeTree(t);
	let deletedNode = t.delete(node);
	if (!deletedNode)
		console.log('not found: ' + node)
	else
		console.log(' deleted: ', node);
	visulizeTree(t);
	t.clear();
	t = <any>void 0
}

let
	t = new AVLTree<number>(),
	node = 0;
t.insertRange([15, 27, 19, 36, 52, 29, 18, 4]);
visulizeTree(t);
node = 19; console.log('delete: ', node); t.delete(node); visulizeTree(t);
node = 27; console.log('delete: ', node); t.delete(node); visulizeTree(t);
node = 52; console.log('delete: ', node); t.delete(node); visulizeTree(t);
node = 36; console.log('delete: ', node); t.delete(node); visulizeTree(t);
node = 29; console.log('delete: ', node); t.delete(node); visulizeTree(t);
node = 4; console.log('delete: ', node); t.delete(node); visulizeTree(t);
node = 15; console.log('delete: ', node); t.delete(node); visulizeTree(t);
node = 18; console.log('delete: ', node); t.delete(node); visulizeTree(t);