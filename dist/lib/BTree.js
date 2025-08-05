import { ValueNode, BaseTree } from "./Tree";
import { Stack } from "./Stack";
export class BTreeNode extends ValueNode {
    get isLeaf() { return !this.left && !this.right; }
    get children() {
        return [this.left, this.right].filter(item => !!item);
    }
    constructor(value, left, right) {
        super(value);
        this.left = left;
        this.right = right;
    }
}
export var SearchBTreeTraverse;
(function (SearchBTreeTraverse) {
    SearchBTreeTraverse[SearchBTreeTraverse["Root"] = 0] = "Root";
    SearchBTreeTraverse[SearchBTreeTraverse["Left"] = 1] = "Left";
    SearchBTreeTraverse[SearchBTreeTraverse["Right"] = 2] = "Right";
})(SearchBTreeTraverse || (SearchBTreeTraverse = {}));
export class BTree extends BaseTree {
    get size() { return this.__size; }
    constructor(root, comparer) {
        super(comparer);
        this.root = root;
        this.__size = 0;
        if (this.root != undefined) {
            for (let n of this.preOrderEnumerator())
                this.__size++;
        }
    }
    find(value) {
        let key = this.findKey(value);
        //key.comp == 0 && key.node != undefined has a valid found node
        return key.comp == 0 ? key.node : undefined;
    }
    //(LNR)
    *inOrderEnumerator(node) {
        let stack = new Stack(), count = 0, n = node || this.root;
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
        let stack = new Stack(), n = node || this.root, lastNodeVisited, count = 0;
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
    findKey(value) {
        let prevComp = 0, parent = void 0, node = this.root;
        while (node != undefined) {
            let comp = this.comparer(value, node.value);
            if (comp == 0) {
                return {
                    node: node,
                    parent: parent,
                    prevComp: prevComp,
                    comp: 0
                };
            }
            else if (comp < 0) {
                if (node.left != undefined) {
                    parent = node;
                    prevComp = comp;
                }
                node = node.left;
            }
            else {
                if (node.right != undefined) {
                    parent = node;
                    prevComp = comp;
                }
                node = node.right;
            }
        }
        return { node: void 0, parent: void 0, prevComp: 0, comp: 0 };
    }
    insert(value) {
        let key = this.findKey(value), node = getChild(key.parent, key.prevComp), child = this.newNode(value);
        return (node != undefined) && (setChild(node, child, key.comp), this.__size++, true);
    }
    delete(value) {
        let key = this.findKey(value);
        if (!(key.comp == 0 && key.node != undefined)) {
            return false;
        }
        if (key.node.isLeaf) {
            setChild(key.parent, void 0, key.prevComp);
        }
        else if (key.node.left == undefined || key.node.right == undefined) {
            setChild(key.parent, getChild(key.node, key.node.left == undefined ? 1 : -1), key.prevComp);
        }
        else {
            let p = void 0, n = key.node.left, comp = n.right == undefined ? -1 : 1;
            while (n.right != undefined) {
                p = n;
                n = n.right;
            }
            key.node.value = n.value;
            if (p == undefined)
                p = key.node;
            setChild(p, n.left, comp);
        }
        this.__size--;
        return true;
    }
    insertRange(values) {
        let array = [];
        values.forEach(value => array.push(this.insert(value)));
        return array;
    }
    deleteRange(values) {
        let array = [];
        values.forEach(value => array.push(this.delete(value)));
        return array;
    }
}
function getChild(parent, comp) {
    return (parent == undefined) ? undefined : (comp < 0 ? parent.left : parent.right);
}
function setChild(parent, node, comp) {
    (parent != undefined) && (comp < 0 ? parent.left = node : parent.right = node);
}
