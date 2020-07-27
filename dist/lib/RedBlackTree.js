"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedBlackTree = exports.RedBlackTreeNode = exports.RedBlackEnum = void 0;
var tslib_1 = require("tslib");
var BTree_1 = require("./BTree");
var Stack_1 = tslib_1.__importDefault(require("./Stack"));
var RedBlackEnum;
(function (RedBlackEnum) {
    RedBlackEnum[RedBlackEnum["red"] = 0] = "red";
    RedBlackEnum[RedBlackEnum["black"] = 1] = "black";
})(RedBlackEnum = exports.RedBlackEnum || (exports.RedBlackEnum = {}));
var RedBlackTreeNode = /** @class */ (function (_super) {
    tslib_1.__extends(RedBlackTreeNode, _super);
    function RedBlackTreeNode(value) {
        var _this = _super.call(this, value) || this;
        _this.color = RedBlackEnum.red;
        return _this;
    }
    return RedBlackTreeNode;
}(BTree_1.BTreeNode));
exports.RedBlackTreeNode = RedBlackTreeNode;
var RedBlackTree = /** @class */ (function (_super) {
    tslib_1.__extends(RedBlackTree, _super);
    function RedBlackTree(comparer) {
        return _super.call(this, undefined, comparer) || this;
    }
    RedBlackTree.prototype.insert = function (value) {
        var stack = new Stack_1.default(), parent = void 0, node = this.root, comp = 0;
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
                return false;
            else {
                if (comp < 0)
                    node = node.left;
                else
                    node = node.right;
                stack.push(parent);
            }
        }
        node = newNode(value);
        setChild(parent, node, comp);
        balanceAfterInsert(this, node, stack);
        this.__size++;
        return true;
    };
    RedBlackTree.prototype.delete = function (value) {
        var found = false, comp = 0, stack = new Stack_1.default(), parent = void 0, node = this.root, yIsNode, x, ycomp = 0, yParent, y;
        while (node != undefined && !found) {
            var nextComp = this.comparer(value, node.value);
            if (nextComp == 0)
                found = true;
            else {
                parent = node;
                if (nextComp < 0) {
                    node = node.left;
                }
                else {
                    node = node.right;
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
        }
        else {
            //node has 2 children
            //replacement node is the leftmost node greater than "node"
            stack.push(node);
            y = node.right;
            yParent = node;
            yIsNode = false;
            while (y.left != undefined) {
                stack.push(y);
                yParent = y;
                y = y.left;
            }
        }
        //y has the replacement node here, it's "value" content will be copied to "node"
        //x is y's only child, it'll be linked to y's parent
        if (y.left != undefined)
            x = y.left;
        else
            x = y.right;
        // replace x's parent with y's parent and link x to proper subtree in parent, this removes y from tree
        if (yParent != undefined) {
            setChild(yParent, x, ycomp = this.comparer(y.value, yParent.value));
        }
        else {
            this.root = x;
            (x != undefined) && (x.color = RedBlackEnum.black);
            this.__size--;
            return true;
        }
        !yIsNode && (node.value = y.value);
        if (y.color == RedBlackEnum.black) {
            // x may be undefined
            balanceAfterDelete(this, x, stack, ycomp);
        }
        this.__size--;
        return true;
    };
    return RedBlackTree;
}(BTree_1.BTree));
exports.RedBlackTree = RedBlackTree;
var siblingComparer = function (comp) { return comp > 0 ? -1 : 1; };
function setChild(parent, node, comp) {
    if (comp < 0)
        parent.left = node;
    else
        parent.right = node;
}
function getChild(parent, comp) {
    return (comp < 0 ? parent.left : parent.right);
}
function newNode(value) {
    return new RedBlackTreeNode(value);
}
function getColor(node) {
    return node == undefined ?
        RedBlackEnum.black :
        node.color;
}
function rotateLeft(x, tree, stack, pushParent) {
    var p = stack.peek(), y = x.right;
    x.right = y.left;
    y.left = x;
    pushParent && stack.push(y);
    if (p != undefined)
        setChild(p, y, tree.comparer(y.value, p.value));
    else
        tree.root = y;
}
function rotateRight(x, tree, stack, pushParent) {
    var p = stack.peek(), y = x.left;
    x.left = y.right;
    y.right = x;
    pushParent && stack.push(y);
    if (p != undefined)
        setChild(p, y, tree.comparer(y.value, p.value));
    else
        tree.root = y;
}
function balanceAfterInsert(tree, x, stack) {
    var t, g, p, y = x.left, comp = 0;
    while (stack.count >= 2 && (p = stack.pop()).color == RedBlackEnum.red) {
        //parent is RED
        g = stack.peek();
        comp = tree.comparer(p.value, g.value);
        //get x's parent uncle y
        if (comp < 0)
            y = g.right;
        else
            y = g.left;
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
            }
            else {
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
    tree.root.color = RedBlackEnum.black;
}
function balanceAfterDelete(tree, x, stack, comp) {
    var parent, y;
    while (!stack.empty && getColor(x) == RedBlackEnum.black) {
        parent = stack.peek();
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
                y = parent.right;
            }
            if (y == undefined ||
                (getColor(y.left) == RedBlackEnum.black &&
                    getColor(y.right) == RedBlackEnum.black)) {
                //y children are both black or y is a leaf
                (y != undefined) && (y.color = RedBlackEnum.red);
                //move up
                stack.pop();
                x = parent;
                parent = stack.peek();
                (parent != undefined) && (comp = tree.comparer(x.value, parent.value));
            }
            else {
                if (getColor(y.right) == RedBlackEnum.black) {
                    y.left.color = RedBlackEnum.black;
                    y.color = RedBlackEnum.red;
                    rotateRight(y, tree, stack, false);
                    y = getChild(parent, 1);
                }
                y.color = parent.color; // x.parent.color
                parent.color = RedBlackEnum.black;
                y.right.color = RedBlackEnum.black;
                stack.pop();
                rotateLeft(parent, tree, stack, false);
                stack.clear();
                return;
            }
        }
        else {
            //y is left child, x is right child
            //y could be null
            if (getColor(y) == RedBlackEnum.red) {
                // x is black, y is red - make both black and rotate
                y.color = RedBlackEnum.black;
                parent.color = RedBlackEnum.red;
                stack.pop();
                rotateRight(parent, tree, stack, true);
                stack.push(parent);
                y = parent.left;
            }
            if (y == undefined ||
                (getColor(y.left) == RedBlackEnum.black &&
                    getColor(y.right) == RedBlackEnum.black)) {
                //y children are both black or y is a leaf
                (y != undefined) && (y.color = RedBlackEnum.red);
                //move up
                stack.pop();
                x = parent;
                parent = stack.peek();
                (parent != undefined) && (comp = tree.comparer(x.value, parent.value));
            }
            else {
                if (getColor(y.left) == RedBlackEnum.black) {
                    y.right.color = RedBlackEnum.black;
                    y.color = RedBlackEnum.red;
                    rotateLeft(y, tree, stack, false);
                    y = getChild(parent, -1);
                }
                y.color = parent.color; // x.parent.color
                parent.color = RedBlackEnum.black;
                y.left.color = RedBlackEnum.black;
                stack.pop();
                rotateRight(parent, tree, stack, false);
                stack.clear();
                return;
            }
        }
    }
    (x != undefined) && (x.color = RedBlackEnum.black);
}
//# sourceMappingURL=RedBlackTree.js.map