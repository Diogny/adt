"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchBTree = exports.BTree = exports.SearchBTreeTraverse = exports.BTreeNode = void 0;
const tslib_1 = require("tslib");
const Tree_1 = require("./Tree");
const Stack_1 = tslib_1.__importDefault(require("./Stack"));
class BTreeNode extends Tree_1.ValueNode {
    constructor(value, left, right) {
        super(value);
        this.left = left;
        this.right = right;
    }
    get isLeaf() { return !this.left && !this.right; }
    get children() {
        return [this.left, this.right].filter(item => !!item);
    }
}
exports.BTreeNode = BTreeNode;
var SearchBTreeTraverse;
(function (SearchBTreeTraverse) {
    SearchBTreeTraverse[SearchBTreeTraverse["Root"] = 0] = "Root";
    SearchBTreeTraverse[SearchBTreeTraverse["Left"] = 1] = "Left";
    SearchBTreeTraverse[SearchBTreeTraverse["Right"] = 2] = "Right";
})(SearchBTreeTraverse = exports.SearchBTreeTraverse || (exports.SearchBTreeTraverse = {}));
class BTree extends Tree_1.BaseTree {
    constructor(root) {
        super();
        this.root = root;
    }
    find(value) {
        let key = this.findKey(value);
        return key.comp == 0 ? key.node : undefined;
    }
    //(LNR)
    *inOrderEnumerator(node) {
        let stack = new Stack_1.default(), count = 0, n = node || this.root;
        while (!stack.empty || n != undefined) {
            if (n != undefined) {
                stack.push(n);
                n = n.left;
            }
            else {
                n = stack.pop();
                count++;
                yield n;
                n = n.right;
            }
        }
        return count;
    }
    *postOrderEnumerator(node) {
        let stack = new Stack_1.default(), n = node || this.root, lastNodeVisited, count = 0;
        while (!stack.empty || n != undefined) {
            if (n != undefined) {
                stack.push(n);
                n = n.left;
            }
            else {
                let peekNode = stack.peek();
                // if right child exists and traversing node from left child, then move right
                if (peekNode.right != undefined && lastNodeVisited != peekNode.right)
                    n = peekNode.right;
                else {
                    count++;
                    yield peekNode;
                    lastNodeVisited = stack.pop();
                }
            }
        }
        return count;
    }
    newNode(value) {
        return new BTreeNode(value);
    }
    findKey(value) {
        let comp = 0, parent = void 0, node = this.root;
        while (node != undefined) {
            parent = node;
            comp = this.comparer(value, node.value);
            if (comp == 0) {
                return {
                    node: node,
                    parent: parent,
                    comp: comp
                };
            }
            else if (comp < 0) {
                node = node.left;
            }
            else {
                node = node.right;
            }
        }
        return { node: node, parent: parent, comp: comp };
    }
    min(node) {
        if (node)
            while (node.left != undefined)
                node = node.left;
        return node;
    }
    max(node) {
        if (node)
            while (node.right != undefined)
                node = node.right;
        return node;
    }
}
exports.BTree = BTree;
class SearchBTree extends BTree {
    insertRange(values) {
        let array = [];
        values.forEach(value => array.push(this.insert(value)));
        return array;
    }
}
exports.SearchBTree = SearchBTree;
