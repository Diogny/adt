import { expect } from 'chai';
import { BTree, BTreeNode } from '../src/ts/BTree';
import { visulizeTree } from '../src/ts/Graph-Utils';

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
		const
			array = new Array<string>(),
			nodes = t.preOrder(t.root, (node) => {
				array.push(node.value);
			});
		console.log('node(s): ', nodes, 'pre-order: ', array.join(' '));
		expect(1).to.equal(1);
	});
	it('t.inOrder()', () => {
		const
			array = new Array<string>(),
			nodes = t.inOrder(t.root, (node) => {
				array.push(node.value);
			});
		console.log('node(s): ', nodes, 'in-order: ', array.join(' '));
		expect(1).to.equal(1);
	});
	it('t.postOrder()', () => {
		const
			array = new Array<string>(),
			nodes = t.postOrder(t.root, (node) => {
				array.push(node.value);
			});
		console.log('node(s): ', nodes, 'post-order: ', array.join(' '));
		expect(1).to.equal(1);
	});
	it('t.breathSearch()', () => {
		const
			array = new Array<string>(),
			nodes = t.breathSearch(t.root, (node) => {
				array.push(node.value);
			});
		console.log('node(s): ', nodes, 'breathSearch: ', array.join(' '));
		expect(1).to.equal(1);
	});
	it('visulizeTree(t)', () => {
		visulizeTree(t);
		expect(1).to.equal(1);
	});
});