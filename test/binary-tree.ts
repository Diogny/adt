import { expect } from 'chai';
import { BTree, BTreeNode } from '../src/ts/BTree';

const t = new BTree<string>(
	new BTreeNode("A",
		new BTreeNode("B",
			new BTreeNode("D")
		),
		new BTreeNode("C"))
);

describe('BTree', () => {
	it('t.root.data = "A"', () => {
		expect(t.root.data).to.equal("A");
	});
	it('t.depth() = 2', () => {
		expect(t.depth()).to.equal(2);
	});
	it('t.root.left?.data = "B"', () => {
		expect(t.root.left?.data).to.equal("B");
	});
	it('t.root.right?.data = "C"', () => {
		expect(t.root.right?.data).to.equal("C");
	});
});