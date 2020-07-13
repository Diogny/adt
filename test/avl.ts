import { AVLTree } from '../src/ts/AVLTree';
import { visulizeTree } from '../src/ts/Graph-Utils';
import { range } from '../src/ts/Utils';

//independent run
//	node --require ts-node/register --trace-uncaught test/avl.ts

const t = new AVLTree<number>();
console.log('AVL Tree created');
visulizeTree(t);

range(1, 11).forEach(n => {
	console.log('insert ' + n);
	t.insert(n);
	visulizeTree(t);
})
