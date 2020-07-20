"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedBlackTree = exports.RedBlackTreeNode = exports.RedBlackEnum = void 0;
const tslib_1 = require("tslib");
const BTree_1 = require("./BTree");
const Stack_1 = tslib_1.__importDefault(require("./Stack"));
var RedBlackEnum;
(function (RedBlackEnum) {
    RedBlackEnum[RedBlackEnum["red"] = 0] = "red";
    RedBlackEnum[RedBlackEnum["black"] = 1] = "black";
})(RedBlackEnum = exports.RedBlackEnum || (exports.RedBlackEnum = {}));
class RedBlackTreeNode extends BTree_1.BTreeNode {
    constructor(value) {
        super(value);
        this.color = RedBlackEnum.red;
    }
}
exports.RedBlackTreeNode = RedBlackTreeNode;
class RedBlackTree extends BTree_1.SearchBTree {
    constructor(comparer) {
        super(undefined, comparer);
    }
    insert(value) {
        if (this.root == undefined) {
            this.root = newNode(value);
            this.root.color = RedBlackEnum.black;
            return this.root;
        }
        let stack = new Stack_1.default(), parent = void 0, node = this.root, comp = 0;
        while (node != undefined) {
            parent = node;
            comp = this.comparer(value, node.value);
            if (comp == 0)
                return node;
            else {
                if (comp < 0)
                    node = node.left;
                else
                    node = node.right;
                stack.push(parent);
            }
        }
        insertNode(parent, node = newNode(value), comp);
        balanceTree(this, node, stack);
        return node;
    }
    delete(value) {
        return;
    }
}
exports.RedBlackTree = RedBlackTree;
function newNode(value) {
    return new RedBlackTreeNode(value);
}
function insertNode(parent, node, comp) {
    if (comp < 0) {
        parent.left = node;
    }
    else {
        parent.right = node;
    }
    return parent;
}
function getColor(node) {
    return node == undefined ?
        RedBlackEnum.black :
        node.color;
}
function balanceTree(tree, node, stack) {
    while (!stack.empty) {
        let comp = 0, parent = stack.pop(), grandparent = stack.pop();
        if (parent.color == RedBlackEnum.black || grandparent == undefined) {
            return;
        }
        let uncle = ((comp = tree.comparer(parent.value, grandparent.value)) < 0 ? grandparent.right : grandparent.left);
        if (getColor(uncle) == RedBlackEnum.red) {
            parent.color = RedBlackEnum.black;
            uncle.color = RedBlackEnum.black;
            if (stack.empty)
                grandparent.color = RedBlackEnum.black;
            else
                grandparent.color = RedBlackEnum.red;
            node = grandparent;
        }
        else {
            if (comp < 0) {
                if (tree.comparer(node.value, parent.value) < 0) {
                    grandparent.left = parent.right;
                    parent.right = grandparent;
                    parent.color = RedBlackEnum.black;
                    grandparent.color = RedBlackEnum.red;
                    node = parent;
                }
                else {
                    parent.right = node.left;
                    grandparent.left = node.right;
                    grandparent.right = uncle;
                    node.left = parent;
                    node.right = grandparent;
                    grandparent.color = RedBlackEnum.red;
                    node.color = RedBlackEnum.black;
                }
            }
            else {
                if (tree.comparer(node.value, parent.value) > 0) {
                    grandparent.right = parent.left;
                    parent.left = grandparent;
                    parent.color = RedBlackEnum.black;
                    grandparent.color = RedBlackEnum.red;
                    node = parent;
                }
                else {
                    parent.left = node.right;
                    grandparent.right = node.left;
                    grandparent.left = uncle;
                    node.left = grandparent;
                    node.right = parent;
                    grandparent.color = RedBlackEnum.red;
                    node.color = RedBlackEnum.black;
                }
            }
            parent = stack.peek();
            if (parent == undefined) {
                tree.root = node;
                return;
            }
            else {
                if (tree.comparer(node.value, parent.value) > 0)
                    parent.right = node;
                else
                    parent.left = node;
            }
        }
    }
}
