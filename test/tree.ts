import { expect } from 'chai';
import { Tree, TreeNode } from '../src/lib/Tree';
import { visulizeTree } from '../src/lib/Graph-Utils';

//independent run
//	node node_modules/mocha/bin/_mocha --require ts-node/register test/tree.ts

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
	it('t.depth() = 3', () => {
		expect(t.depth()).to.equal(3);
	});
	it('visulizeTree(t)', () => {
		visulizeTree(t);
		expect(1).to.equal(1);
	});
});

