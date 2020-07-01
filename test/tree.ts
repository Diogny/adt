import { expect } from 'chai';
import { Tree, TreeNode } from '../src/ts/Tree';

const t = new Tree<string>(
	new TreeNode("A",
		new TreeNode("B",
			new TreeNode("D")
		),
		new TreeNode("C"),
		new TreeNode("D"))
);

describe('Tree', () => {
	it('t.root.value = "A"', () => {
		expect(t.root.value).to.equal("A");
	});
	it('t.depth() = 2', () => {
		expect(t.depth()).to.equal(2);
	});
});