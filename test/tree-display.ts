import { Tree, TreeNode, ValueNode } from '../src/ts/Tree';

//independent run
//	node --require ts-node/register --trace-uncaught test/tree-display.ts

const t = new Tree<string>(
	new TreeNode("A",
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
let
	search = <T>(root: ValueNode<T>, fn: (node: ValueNode<T>, callback: (n: ValueNode<T>) => void) => number): T[] => {
		let
			array = new Array<T>(),
			nodeValue = (node: ValueNode<T>) => array.push(node.value);
		fn(root, nodeValue);
		return array
	};
console.log('pre order:   ', search(t.root, t.preOrder).join(', '));
//console.log('level order: ', search(t.root, t.levelOrder).join(', '));
console.log('post order:  ', search(t.root, t.postOrder).join(', '));

let a = new Array<string>();
t.levelOrder(t.root, (n, l) => a.push(`${n.value}:${l}`));
console.log('level order: ', a.join(', '));
//level order:  A, B, E, I, C, D, F, G, H