import { BTreeNode, BTree } from "./BTree";
import { Stack } from "./Stack";
export class AVLTreeNode extends BTreeNode {
    constructor(value) {
        super(value);
        this.depth = 1;
    }
}
export class AVLTree extends BTree {
    constructor(comparer) {
        super(undefined, comparer);
    }
    insert(value) {
        let stack = new Stack(), comp = 0, parent = void 0, node = this.root;
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
        insertNode(parent, newNode(value), comp); //node =
        balanceTree(this, stack);
        this.__size++;
        return true;
    }
    delete(value) {
        let stack = new Stack(), comp = 0, parent, root = void 0, node = this.root, min = void 0, found = false;
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
    }
}
function newNode(value) {
    return new AVLTreeNode(value);
}
const getDepth = (n) => (n === null || n === void 0 ? void 0 : n.depth) || 0;
function setDepth(node) {
    let ldepth = getDepth(node.left), rdepth = getDepth(node.right);
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
    let stack = new Stack();
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
        let parent = void 0, node = stack.pop(), balance = setDepth(node), childrenBalance = 0, root = void 0;
        if (node.depth > 2 && Math.abs(balance) > 1) {
            if (balance < 0) {
                root = node.left;
                childrenBalance = getDepth(root.right) - getDepth(root.left);
                if (childrenBalance < 0) {
                    node.left = root.right;
                    root.right = node;
                }
                else {
                    parent = root;
                    root = root.right;
                    parent.right = root.left;
                    root.left = parent;
                    node.left = root.right;
                    root.right = node;
                    setDepth(parent);
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
                    parent = root;
                    root = root.left;
                    parent.left = root.right;
                    root.right = parent;
                    node.right = root.left;
                    root.left = node;
                    setDepth(parent);
                }
            }
            setDepth(node);
            setDepth(root);
            parent = stack.peek();
            if (!parent) {
                tree.root = root;
            }
            else {
                if (tree.comparer(root.value, parent.value) > 0)
                    parent.right = root;
                else
                    parent.left = root;
                setDepth(parent);
            }
        }
    }
}
