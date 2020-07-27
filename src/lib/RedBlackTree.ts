import { BTree, BTreeNode } from "./BTree";
import Stack from "./Stack";

export enum RedBlackEnum {
	red = 0,
	black = 1
}

export class RedBlackTreeNode<T> extends BTreeNode<T>{

	public color: RedBlackEnum;

	constructor(value: T) {
		super(value);
		this.color = RedBlackEnum.red;
	}

}

export class RedBlackTree<T> extends BTree<T> {

	constructor(comparer?: (a: T, b: T) => number) {
		super(<any>undefined, comparer)
	}

	insert(value: T): boolean {
		let
			stack = new Stack<RedBlackTreeNode<T>>(),
			parent: RedBlackTreeNode<T> = <any>void 0,
			node = <RedBlackTreeNode<T>>this.root,
			comp = 0;
		if (node == undefined) {
			this.root = node = newNode(value);
			node.color = RedBlackEnum.black;
			this.__size++;
			return true;
		}
		while (node != undefined) {
			parent = node;
			comp = this.comparer(value, node.value);
			if (comp == 0)
				return false
			else {
				if (comp < 0)
					node = <RedBlackTreeNode<T>>node.left
				else
					node = <RedBlackTreeNode<T>>node.right;
				stack.push(parent);
			}
		}
		node = newNode(value);
		setChild(parent, node, comp);
		balanceAfterInsert(this, node, stack);
		this.__size++;
		return true
	}

	delete(value: T): boolean {
		let
			found = false,
			comp = 0,
			stack = new Stack<RedBlackTreeNode<T>>(),
			parent: RedBlackTreeNode<T> = <any>void 0,
			node = this.root as RedBlackTreeNode<T>,
			yIsNode: boolean,
			x: RedBlackTreeNode<T>,
			ycomp = 0,
			yParent: RedBlackTreeNode<T>,
			y: RedBlackTreeNode<T>;
		while (node != undefined && !found) {
			let
				nextComp = this.comparer(value, node.value);
			if (nextComp == 0)
				found = true
			else {
				parent = node;
				if (nextComp < 0) {
					node = <RedBlackTreeNode<T>>node.left;
				} else {
					node = <RedBlackTreeNode<T>>node.right;
				}
				stack.push(parent);
				comp = nextComp;
			}
		}
		if (!found)
			return false;

		// "node" to be deleted: 
		//	  is a leaf with no children
		//	  has one child
		//	  has two children
		// if "node" is red, the red black properties still hold.
		// if "node" is black, the tree needs rebalancing and/or recolouring
		if (node.left == undefined || node.right == undefined) {
			//node is leaf or has at least one empty child
			y = node;
			yParent = parent;
			yIsNode = true;
		} else {
			//node has 2 children
			//replacement node is the leftmost node greater than "node"
			stack.push(node);
			y = <RedBlackTreeNode<T>>node.right;
			yParent = node;
			yIsNode = false;
			while (y.left != undefined) {
				stack.push(y);
				yParent = y;
				y = <RedBlackTreeNode<T>>y.left
			}
		}
		//y has the replacement node here, it's "value" content will be copied to "node"

		//x is y's only child, it'll be linked to y's parent
		if (y.left != undefined)
			x = <RedBlackTreeNode<T>>y.left
		else
			x = <RedBlackTreeNode<T>>y.right;

		// replace x's parent with y's parent and link x to proper subtree in parent, this removes y from tree
		if (yParent != undefined) {
			setChild(yParent, x, ycomp = this.comparer(y.value, yParent.value))
		} else {
			this.root = x;
			(x != undefined) && (x.color = RedBlackEnum.black);
			this.__size--;
			return true
		}

		!yIsNode && (node.value = y.value);

		if (y.color == RedBlackEnum.black) {
			// x may be undefined
			balanceAfterDelete(this, x, stack, ycomp)
		}
		this.__size--;
		return true
	}
}

const siblingComparer = (comp: number) => comp > 0 ? -1 : 1;

function setChild<T>(parent: BTreeNode<T>, node: BTreeNode<T> | undefined, comp: number) {
	if (comp < 0)
		parent.left = node
	else
		parent.right = node;
}

function getChild<T>(parent: RedBlackTreeNode<T>, comp: number): RedBlackTreeNode<T> {
	return <RedBlackTreeNode<T>>(comp < 0 ? parent.left : parent.right)
}

function newNode<T>(value: T): RedBlackTreeNode<T> {
	return new RedBlackTreeNode<T>(value)
}

function getColor<T>(node: RedBlackTreeNode<T> | undefined): RedBlackEnum {
	return node == undefined ?
		RedBlackEnum.black :
		node.color
}

function rotateLeft<T>(x: RedBlackTreeNode<T>, tree: RedBlackTree<T>, stack: Stack<RedBlackTreeNode<T>>, pushParent?: boolean) {
	let
		p = <RedBlackTreeNode<T>>stack.peek(),
		y = <RedBlackTreeNode<T>>x.right;
	x.right = y.left;
	y.left = x;
	pushParent && stack.push(y);
	if (p != undefined)
		setChild(p, y, tree.comparer(y.value, p.value))
	else
		tree.root = y
}

function rotateRight<T>(x: RedBlackTreeNode<T>, tree: RedBlackTree<T>, stack: Stack<RedBlackTreeNode<T>>, pushParent?: boolean) {
	let
		p = <RedBlackTreeNode<T>>stack.peek(),
		y = <RedBlackTreeNode<T>>x.left;
	x.left = y.right;
	y.right = x;
	pushParent && stack.push(y);
	if (p != undefined)
		setChild(p, y, tree.comparer(y.value, p.value))
	else
		tree.root = y
}

function balanceAfterInsert<T>(tree: RedBlackTree<T>, x: RedBlackTreeNode<T>, stack: Stack<RedBlackTreeNode<T>>) {
	let
		t: RedBlackTreeNode<T>,
		g: RedBlackTreeNode<T>,
		p: RedBlackTreeNode<T>,
		y = <RedBlackTreeNode<T>>x.left,
		comp = 0;
	while (stack.count >= 2 && (p = <RedBlackTreeNode<T>>stack.pop()).color == RedBlackEnum.red) {
		//parent is RED
		g = <RedBlackTreeNode<T>>stack.peek();
		comp = tree.comparer(p.value, g.value);
		//get x's parent uncle y
		if (comp < 0)
			y = <RedBlackTreeNode<T>>g.right
		else
			y = <RedBlackTreeNode<T>>g.left;

		if (y != undefined && y.color == RedBlackEnum.red) {
			//uncle is RED, change x's parent and uncle to black
			p.color = RedBlackEnum.black;
			y.color = RedBlackEnum.black;
			// grandparent must be red. Why? Every red node that is not 
			// a leaf has only black children
			g.color = RedBlackEnum.red;
			stack.pop();
			x = g;
		}
		else {
			//uncle is BLACK
			if (comp < 0) {
				if (tree.comparer(x.value, p.value) > 0) {
					// x > p, rotate left, make x a left child
					rotateLeft(p, tree, stack, false);
					//this's faster than ES6 array destructuring
					t = x;
					x = p;
					p = t;
				}
				// x < p
				p.color = RedBlackEnum.black;
				g.color = RedBlackEnum.red;
				stack.pop();
				rotateRight(g, tree, stack, true);
			} else {
				if (tree.comparer(x.value, p.value) < 0) {
					// x < p, rotate right, make x a right child
					rotateRight(p, tree, stack, false);
					//this's faster than ES6 array destructuring
					t = x;
					x = p;
					p = t;
				}
				// x > p
				p.color = RedBlackEnum.black;
				g.color = RedBlackEnum.red;
				stack.pop();
				rotateLeft(g, tree, stack, true);
			}
		}
	}
	(<RedBlackTreeNode<T>>tree.root).color = RedBlackEnum.black
}

function balanceAfterDelete<T>(tree: RedBlackTree<T>, x: RedBlackTreeNode<T>, stack: Stack<RedBlackTreeNode<T>>, comp: number) {
	let
		parent: RedBlackTreeNode<T>,
		y: RedBlackTreeNode<T>;

	while (!stack.empty && getColor(x) == RedBlackEnum.black) {

		parent = <RedBlackTreeNode<T>>stack.peek();

		y = getChild(parent, siblingComparer(comp));

		if (comp < 0) {
			//x is left child, y is right child
			if (getColor(y) == RedBlackEnum.red) {
				// x is black, y is red - make both black and rotate
				y.color = RedBlackEnum.black;
				parent.color = RedBlackEnum.red;
				stack.pop();
				rotateLeft(parent, tree, stack, true);
				stack.push(parent);
				y = <RedBlackTreeNode<T>>parent.right
			}
			if (y == undefined ||
				(getColor(<RedBlackTreeNode<T>>y.left) == RedBlackEnum.black &&
					getColor(<RedBlackTreeNode<T>>y.right) == RedBlackEnum.black)) {
				//y children are both black or y is a leaf
				(y != undefined) && (y.color = RedBlackEnum.red);
				//move up
				stack.pop();
				x = parent;
				parent = <RedBlackTreeNode<T>>stack.peek();
				(parent != undefined) && (comp = tree.comparer(x.value, parent.value))
			} else {
				if (getColor(<RedBlackTreeNode<T>>y.right) == RedBlackEnum.black) {
					(<RedBlackTreeNode<T>>y.left).color = RedBlackEnum.black;
					y.color = RedBlackEnum.red;
					rotateRight(y, tree, stack, false);
					y = getChild(parent, 1)
				}
				y.color = parent.color;	// x.parent.color
				parent.color = RedBlackEnum.black;
				(<RedBlackTreeNode<T>>y.right).color = RedBlackEnum.black;
				stack.pop();
				rotateLeft(parent, tree, stack, false);
				stack.clear();
				return
			}
		} else {
			//y is left child, x is right child
			//y could be null
			if (getColor(y) == RedBlackEnum.red) {
				// x is black, y is red - make both black and rotate
				y.color = RedBlackEnum.black;
				parent.color = RedBlackEnum.red;
				stack.pop();
				rotateRight(parent, tree, stack, true);
				stack.push(parent);
				y = <RedBlackTreeNode<T>>parent.left
			}
			if (y == undefined ||
				(getColor(<RedBlackTreeNode<T>>y.left) == RedBlackEnum.black &&
					getColor(<RedBlackTreeNode<T>>y.right) == RedBlackEnum.black)) {
				//y children are both black or y is a leaf
				(y != undefined) && (y.color = RedBlackEnum.red);
				//move up
				stack.pop();
				x = parent;
				parent = <RedBlackTreeNode<T>>stack.peek();
				(parent != undefined) && (comp = tree.comparer(x.value, parent.value))
			} else {
				if (getColor(<RedBlackTreeNode<T>>y.left) == RedBlackEnum.black) {
					(<RedBlackTreeNode<T>>y.right).color = RedBlackEnum.black;
					y.color = RedBlackEnum.red;
					rotateLeft(y, tree, stack, false);
					y = getChild(parent, -1)
				}
				y.color = parent.color;	// x.parent.color
				parent.color = RedBlackEnum.black;
				(<RedBlackTreeNode<T>>y.left).color = RedBlackEnum.black;
				stack.pop();
				rotateRight(parent, tree, stack, false);
				stack.clear();
				return;
			}
		}
	}
	(x != undefined) && (x.color = RedBlackEnum.black);
}