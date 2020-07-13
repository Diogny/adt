"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AVLTree = exports.AVLTreeNode = void 0;
const tslib_1 = require("tslib");
const BTree_1 = require("./BTree");
const Stack_1 = tslib_1.__importDefault(require("./Stack"));
class AVLTreeNode extends BTree_1.BTreeNode {
    constructor(value) {
        super(value);
        this.depth = 1;
    }
}
exports.AVLTreeNode = AVLTreeNode;
class AVLTree extends BTree_1.SearchBTree {
    constructor() {
        super(undefined);
    }
    newNode(value) {
        return new AVLTreeNode(value);
    }
    insert(value) {
        let stack = new Stack_1.default(), comp = 0, parent = void 0, node = this.root;
        while (node != undefined) {
            parent = node;
            comp = this.comparer(value, node.value);
            if (comp == 0)
                return node;
            else {
                if (comp < 0) {
                    node = node.left;
                }
                else {
                    node = node.right;
                }
                stack.push(parent);
            }
        }
        if (!parent)
            return this.root = this.newNode(value);
        insertNode(parent, node = this.newNode(value), comp);
        balance.call(this, stack);
        return node;
    }
    delete(value) {
        let stack = new Stack_1.default(), comp = 0, parent = void 0, root = void 0, node = this.root, min = void 0, found = false;
        while (node != undefined && !found) {
            parent = node;
            comp = this.comparer(value, node.value);
            if (comp == 0)
                found = true;
            else {
                if (comp < 0) {
                    node = node.left;
                }
                else {
                    node = node.right;
                }
                stack.push(parent);
            }
        }
        if (!found)
            return undefined;
        parent = stack.peek();
        if (node.isLeaf) {
            if (!parent) {
                return this.root = void 0, node;
            }
            setChild(void 0, parent, this.comparer(node.value, parent.value));
        }
        else if (node.left && node.right) {
            if (getDepth(node.left) >= getDepth(node.right)) {
                root = node.left;
                if (root.right) {
                    min = deleteMin.call(this, root.right, root, 1);
                    min.right = node.right;
                    min.left = root;
                    root = min;
                }
                else
                    root.right = node.right;
            }
            else {
                root = node.right;
                if (root.left) {
                    min = deleteMin.call(this, root, node, 1);
                    root.left = void 0;
                    min.left = node.left;
                    min.right = root;
                    root = min;
                }
                else
                    root.left = node.left;
            }
            setDepth(root);
            if (!parent)
                this.root = root;
            else {
                setChild(root, parent, this.comparer(root.value, parent.value));
            }
        }
        else {
            if (!parent) {
                return this.root = (node.left || node.right), node;
            }
            setChild(void 0, parent, this.comparer(node.value, parent.value));
        }
        balance.call(this, stack);
        return node;
    }
}
exports.AVLTree = AVLTree;
const getDepth = (n) => (n === null || n === void 0 ? void 0 : n.depth) || 0;
function setDepth(node) {
    let ldepth = getDepth(node.left), rdepth = getDepth(node.right);
    node.depth = Math.max(ldepth, rdepth) + 1;
    return rdepth - ldepth;
}
function balance(stack) {
    while (!stack.empty) {
        let parent = void 0, node = stack.pop(), balance = setDepth(node), svdPivot = void 0, pivot = void 0;
        if (node.depth > 2 && Math.abs(balance) > 1) {
            if (balance > 1) {
                pivot = node.right;
                if (pivot.right) {
                    node.right = pivot.left;
                    setDepth(node);
                }
                else {
                    svdPivot = pivot;
                    pivot = pivot.left;
                    pivot.right = svdPivot;
                    node.right = svdPivot.left = void 0;
                    node.depth = svdPivot.depth = 1;
                }
                pivot.left = node;
            }
            else if (balance < 1) {
                pivot = node.left;
                if (pivot.left) {
                    node.left = pivot.right;
                    setDepth(node);
                }
                else {
                    svdPivot = pivot;
                    pivot = pivot.right;
                    pivot.left = svdPivot;
                    node.left = svdPivot.right = void 0;
                    node.depth = svdPivot.depth = 1;
                }
                pivot.right = node;
            }
            setDepth(pivot);
            parent = stack.peek();
            if (!parent) {
                this.root = pivot;
            }
            else {
                insertNode(parent, pivot, this.comparer(pivot.value, parent.value));
                setDepth(parent);
            }
        }
    }
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
function setChild(node, parent, comp) {
    if (comp < 0)
        parent.left = node;
    else
        parent.right = node;
}
function deleteMin(node, parent, comp) {
    let stack = new Stack_1.default();
    if (node.left)
        comp = -1;
    while (node.left != undefined) {
        parent = node;
        node = node.left;
        if (node.left)
            stack.push(node);
    }
    setChild(node.right, parent, comp);
    setDepth(parent);
    balance.call(this, stack);
    return node;
}
