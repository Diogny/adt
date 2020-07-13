import { expect } from 'chai';
import { BTree, BTreeNode } from '../src/lib/BTree';
import { visulizeTree, searchTree } from '../src/lib/Graph-Utils';

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
		console.log('pre-order:   ', searchTree(t.root, t.preOrder).join(' '));
		expect(1).to.equal(1);
	});
	it('t.inOrder()', () => {
		console.log('in-order:   ', searchTree(t.root, t.inOrder).join(' '));
		expect(1).to.equal(1);
	});
	it('t.postOrder()', () => {
		console.log('post-order:   ', searchTree(t.root, t.postOrder).join(' '));
		expect(1).to.equal(1);
	});
	it('t.breathSearch()', () => {
		console.log('breathSearch:   ', searchTree(t.root, t.breathSearch).join(' '));
		expect(1).to.equal(1);
	});
	it('visulizeTree(t)', () => {
		visulizeTree(t);
		expect(1).to.equal(1);
	});
});