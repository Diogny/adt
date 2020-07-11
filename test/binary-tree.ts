import { expect } from 'chai';
import { BTree, BTreeNode } from '../src/ts/BTree';

//independent run
//node node_modules/mocha/bin/_mocha --require ts-node/register test/binary-tree.ts

const t = new BTree<string>(
	new BTreeNode("A",
		new BTreeNode("B",
			new BTreeNode("D")
		),
		new BTreeNode("C"))
);

describe('BTree', () => {
	it('t.root.value = "A"', () => {
		expect(t.root.value).to.equal("A");
	});
	it('t.depth() = 2', () => {
		expect(t.depth()).to.equal(2);
	});
	it('t.root.left?.value = "B"', () => {
		expect(t.root.left?.value).to.equal("B");
	});
	it('t.root.right?.value = "C"', () => {
		expect(t.root.right?.value).to.equal("C");
	});
});