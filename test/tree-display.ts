import { Tree, TreeNode, ValueNode } from '../src/lib/Tree';
import { visulizeTree, generatorObjToArray } from '../src/lib/Graph-Utils';

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

console.log('pre order enumerable');
let pre = generatorObjToArray(t.preOrderEnumerator(), (value) => value.value);
console.log('pre order:    ', pre.array.join(', '));
console.log('iterations: ', pre.value);

console.log('post order enumerable');
let post = generatorObjToArray(t.postOrderEnumerator(), (value) => value.value);
console.log('post order:   ', post.array.join(', '));
console.log('iterations: ', post.value);

console.log('level order enumerable');
let
	array = new Array<string>(),
	result: IteratorResult<{ node: ValueNode<string>, level: number }, number>,
	enumerator = t.levelOrderEnumerator(),
	getStr = (val: { node: ValueNode<string>, level: number }) => `${val.node.value}::${val.level}`;
while (!(result = enumerator.next()).done)
	array.push(getStr((<{ node: ValueNode<string>, level: number }>result.value)));

console.log('level order: ', array.join(', '));
console.log('level order depth: ', <number>result.value);

visulizeTree(t);

console.log('Iterator Iterable interface')
let iterator = t.preOrderIterator();
for (let node of iterator)
	console.log(node.value)

console.log('Generator enumerable')
for (let node of t.preOrderEnumerator())
	console.log(node.value)

