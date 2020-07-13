import { Tree, TreeNode } from '../src/lib/Tree';
import { visulizeTree, searchTree } from '../src/lib/Graph-Utils';

//independent run
//	node --require ts-node/register --trace-uncaught test/tree-display.ts

const t = new Tree<string>(
	new TreeNode("Art",
		new TreeNode("B",
			new TreeNode("C"),
			new TreeNode("D")
		),
		new TreeNode("E",
			new TreeNode("F",
				new TreeNode("G"),
				new TreeNode("H"))),
		new TreeNode("I"))
);

console.log('depth: ', t.depth());
console.log('pre order:   ', searchTree(t.root, t.preOrder).join(', '));
console.log('post order:  ', searchTree(t.root, t.postOrder).join(', '));

let a = new Array<string>();
let depth = t.levelOrder(t.root, (n, l) => a.push(`${n.value}::${l}`));
console.log('level order: ', a.join(', '));
console.log('level order depth: ', depth);

visulizeTree(t);