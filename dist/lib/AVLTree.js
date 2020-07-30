"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AVLTree = exports.AVLTreeNode = void 0;
var tslib_1 = require("tslib");
var BTree_1 = require("./BTree");
var Stack_1 = tslib_1.__importDefault(require("./Stack"));
var AVLTreeNode = /** @class */ (function (_super) {
    tslib_1.__extends(AVLTreeNode, _super);
    function AVLTreeNode(value) {
        var _this = _super.call(this, value) || this;
        _this.depth = 1;
        return _this;
    }
    return AVLTreeNode;
}(BTree_1.BTreeNode));
exports.AVLTreeNode = AVLTreeNode;
var AVLTree = /** @class */ (function (_super) {
    tslib_1.__extends(AVLTree, _super);
    function AVLTree(comparer) {
        return _super.call(this, undefined, comparer) || this;
    }
    AVLTree.prototype.insert = function (value) {
        var stack = new Stack_1.default(), comp = 0, parent = void 0, node = this.root;
        while (node != undefined) {
            parent = node;
            comp = this.comparer(value, node.value);
            if (comp == 0)
                return false;
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
        if (!parent) {
            this.root = newNode(value);
            this.__size++;
            return true;
        }
        insertNode(parent, node = newNode(value), comp);
        balanceTree(this, stack);
        this.__size++;
        return true;
    };
    AVLTree.prototype.delete = function (value) {
        var stack = new Stack_1.default(), comp = 0, parent = void 0, root = void 0, node = this.root, min = void 0, found = false;
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
            return false;
        parent = stack.peek();
        if (node.isLeaf) {
            if (!parent) {
                this.root = void 0;
                this.__size--;
                return true;
            }
            setChild(void 0, parent, this.comparer(node.value, parent.value));
        }
        else if (node.left && node.right) {
            if (getDepth(node.left) >= getDepth(node.right)) {
                root = node.left;
                if (root.right) {
                    min = deleteMin(this, root.right, root, 1);
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
                    min = deleteMin(this, root, node, 1);
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
                this.root = (node.left || node.right);
                this.__size--;
                return true;
            }
            setChild(node.left || node.right, parent, this.comparer(node.value, parent.value));
        }
        balanceTree(this, stack);
        this.__size--;
        return true;
    };
    return AVLTree;
}(BTree_1.BTree));
exports.AVLTree = AVLTree;
function newNode(value) {
    return new AVLTreeNode(value);
}
var getDepth = function (n) { return (n === null || n === void 0 ? void 0 : n.depth) || 0; };
function setDepth(node) {
    var ldepth = getDepth(node.left), rdepth = getDepth(node.right);
    node.depth = Math.max(ldepth, rdepth) + 1;
    return rdepth - ldepth;
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
function deleteMin(tree, node, parent, comp) {
    var stack = new Stack_1.default();
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
    balanceTree(tree, stack);
    return node;
}
function balanceTree(tree, stack) {
    while (!stack.empty) {
        var parent_1 = void 0, node = stack.pop(), balance = setDepth(node), childrenBalance = 0, root = void 0;
        if (node.depth > 2 && Math.abs(balance) > 1) {
            if (balance < 0) {
                root = node.left;
                childrenBalance = getDepth(root.right) - getDepth(root.left);
                if (childrenBalance < 0) {
                    node.left = root.right;
                    root.right = node;
                }
                else {
                    parent_1 = root;
                    root = root.right;
                    parent_1.right = root.left;
                    root.left = parent_1;
                    node.left = root.right;
                    root.right = node;
                    setDepth(parent_1);
                }
            }
            else {
                root = node.right;
                childrenBalance = getDepth(root.right) - getDepth(root.left);
                if (childrenBalance > 0) {
                    node.right = root.left;
                    root.left = node;
                }
                else {
                    parent_1 = root;
                    root = root.left;
                    parent_1.left = root.right;
                    root.right = parent_1;
                    node.right = root.left;
                    root.left = node;
                    setDepth(parent_1);
                }
            }
            setDepth(node);
            setDepth(root);
            parent_1 = stack.peek();
            if (!parent_1) {
                tree.root = root;
            }
            else {
                if (tree.comparer(root.value, parent_1.value) > 0)
                    parent_1.right = root;
                else
                    parent_1.left = root;
                setDepth(parent_1);
            }
        }
    }
}
