import { expect } from 'chai';
import { BTree, BTreeNode } from '../src/lib/BTree';
import { visulizeTree, generatorObjToArray } from '../src/lib/Graph-Utils';

//independent run
//	node node_modules/mocha/bin/_mocha --require ts-node/register test/btree-traversal.ts

const t = new BTree<string>(
	new BTreeNode("+",
		new BTreeNode("*",
			new BTreeNode("A"),
			new BTreeNode("-",
				new BTreeNode("B"),
				new BTreeNode("C"))
		),
		new BTreeNode("+",
			new BTreeNode("D"),
			new BTreeNode("E")))
);

describe('BTree traversal', () => {
	it('t.depth() = 4', () => {
		expect(t.depth()).to.equal(4);
	});
	it('t.preOrder()', () => {
		let pre = generatorObjToArray(t.preOrderEnumerator(), (value) => value.value);
		console.log('pre-order:   ', pre.array.join(' '));
		expect(1).to.equal(1);
	});
	it('t.inOrder()', () => {
		let ino = generatorObjToArray(t.inOrderEnumerator(), (value) => value.value);
		console.log('in-order:   ', ino.array.join(' '));
		expect(1).to.equal(1);
	});
	it('t.postOrder()', () => {
		let post = generatorObjToArray(t.postOrderEnumerator(), (value) => value.value);
		console.log('post-order:   ', post.array.join(' '));
		expect(1).to.equal(1);
	});
	it('t.breathSearch()', () => {
		let bre = generatorObjToArray(t.breathSearchEnumerator(), (value) => value.value);
		console.log('breathSearch:   ', bre.array.join(' '));
		expect(1).to.equal(1);
	});
	it('visulizeTree(t)', () => {
		visulizeTree(t);
		expect(1).to.equal(1);
	});
});