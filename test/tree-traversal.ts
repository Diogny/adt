import { expect } from 'chai';
import { BTree, BTreeNode } from '../src/ts/BTree';

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
	it('t.depth() = 3', () => {
		expect(t.depth()).to.equal(3);
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
});