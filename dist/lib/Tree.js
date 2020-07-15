"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tree = exports.BaseTree = exports.TreeNode = exports.ValueNode = void 0;
const tslib_1 = require("tslib");
const Queue_1 = tslib_1.__importDefault(require("./Queue"));
const Stack_1 = tslib_1.__importDefault(require("./Stack"));
class ValueNode {
    constructor(value) {
        this.value = value;
    }
    /**
     * @description return the amount of children
     */
    get length() { return this.children.length; }
    /**
     * @description children indexer
     * @param index 0-based index of child
     */
    get(index) { return this.children[index]; }
}
exports.ValueNode = ValueNode;
class TreeNode extends ValueNode {
    constructor(value, ...childrenNodes) {
        super(value);
        this.__children = new Array(...childrenNodes);
    }
    get children() { return this.__children.slice(0); }
    get size() { return this.__children.length; }
    get isLeaf() { return this.size == 0; }
    add(value) {
        let n = new TreeNode(value);
        this.__children.push(n);
        return n;
    }
    remove(value, comparer) {
        let defaultComparer = (item) => item.value === value, n = this.__children.findIndex(comparer || defaultComparer);
        return n != -1 ? this.__children.splice(n, 1)[0] : undefined;
    }
    removeAt(index) {
        return index >= 0 && index < this.size ? this.__children.splice(index, 1)[0] : undefined;
    }
    find(value, comparer) {
        let defaultComparer = (item) => item.value === value;
        return this.__children.find(comparer || defaultComparer);
    }
}
exports.TreeNode = TreeNode;
class BaseTree {
    empty() { return this.root == undefined; }
    clear() {
        this.root = void 0;
    }
    comparer(a, b) {
        if (a == b)
            return 0;
        else if (a > b)
            return 1;
        else
            return -1;
    }
    /**
     * @description it calls levelOrder from root, and returns it's result with empty callback.
     */
    depth() {
        let result, enumerator = this.levelOrderEnumerator();
        while (!(result = enumerator.next()).done)
            ;
        return result.value;
    }
    *preOrderEnumerator(node) {
        let stack = new Stack_1.default(), count = 0;
        !node && (node = this.root);
        if (node) {
            stack.push(node);
            while (!stack.empty) {
                count++;
                node = stack.pop();
                yield node;
                for (let children = node.children, i = children.length - 1; i >= 0; i--) {
                    stack.push(children[i]);
                }
            }
        }
        return count;
    }
    preOrderIterator(node) {
        let enumerator = this.preOrderEnumerator(node), iterator = {
            //Iterator protocol
            next: () => {
                return enumerator.next();
            },
            //Iterable protocol
            [Symbol.iterator]() {
                return iterator;
            }
        };
        return iterator;
    }
    /**
     * @description it's an extended breadthSearch with a tree node level value
     * @param node root node to calculate level order
     * @param callback a function called for every tree node with it's level 1-based
     */
    *levelOrderEnumerator(node) {
        let queue = new Queue_1.default(), maxLevel = 0;
        !node && (node = this.root);
        if (node) {
            queue.enqueue({ node: node, level: 1 });
            while (!queue.empty) {
                let father = queue.dequeue();
                maxLevel = Math.max(maxLevel, father.level);
                yield {
                    node: father.node,
                    level: father.level
                };
                father.node.children.forEach((child) => queue.enqueue({ node: child, level: father.level + 1 }));
            }
        }
        return maxLevel;
    }
    *postOrderEnumerator(node) {
        let stack = new Stack_1.default(), count = 0;
        !node && (node = this.root);
        if (node) {
            stack.push({ node: node, t: false });
            while (!stack.empty) {
                let n = stack.peek();
                if (n.t) {
                    count++;
                    yield n.node;
                    stack.pop();
                }
                else {
                    n.t = true;
                    for (let children = n.node.children, i = children.length - 1; i >= 0; i--) {
                        stack.push({ node: children[i], t: false });
                    }
                }
            }
        }
        return count;
    }
    *breathSearchEnumerator(node) {
        let queue = new Queue_1.default(), count = 0;
        !node && (node = this.root);
        if (node) {
            queue.enqueue(node);
            while (!queue.empty) {
                node = queue.dequeue();
                count++;
                yield node;
                node.children.forEach(child => queue.enqueue(child));
            }
        }
        return count;
    }
}
exports.BaseTree = BaseTree;
class Tree extends BaseTree {
    constructor(root) {
        super();
        this.root = root;
    }
    /**
     * @description implements a breadth search
     * @param value value to search
     */
    find(value) {
        let queue = new Queue_1.default(), node = this.root;
        if (node) {
            queue.enqueue(node);
            while (!queue.empty) {
                node = queue.dequeue();
                if (this.comparer(node.value, value) == 0) {
                    queue.clear();
                    return node;
                }
                else {
                    node.children.forEach(child => queue.enqueue(child));
                }
            }
        }
        return;
    }
}
exports.Tree = Tree;
