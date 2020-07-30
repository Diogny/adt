"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tree = exports.BaseTree = exports.TreeNode = exports.ValueNode = void 0;
var tslib_1 = require("tslib");
var Queue_1 = tslib_1.__importDefault(require("./Queue"));
var Stack_1 = tslib_1.__importDefault(require("./Stack"));
var ValueNode = /** @class */ (function () {
    function ValueNode(value) {
        this.value = value;
    }
    Object.defineProperty(ValueNode.prototype, "length", {
        /**
         * @description return the amount of children
         */
        get: function () { return this.children.length; },
        enumerable: false,
        configurable: true
    });
    /**
     * @description children indexer
     * @param index 0-based index of child
     */
    ValueNode.prototype.get = function (index) { return this.children[index]; };
    return ValueNode;
}());
exports.ValueNode = ValueNode;
var TreeNode = /** @class */ (function (_super) {
    tslib_1.__extends(TreeNode, _super);
    function TreeNode(value) {
        var childrenNodes = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            childrenNodes[_i - 1] = arguments[_i];
        }
        var _this = _super.call(this, value) || this;
        _this.__children = new (Array.bind.apply(Array, tslib_1.__spread([void 0], childrenNodes)))();
        return _this;
    }
    Object.defineProperty(TreeNode.prototype, "children", {
        get: function () { return this.__children.slice(0); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "size", {
        get: function () { return this.__children.length; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "isLeaf", {
        get: function () { return this.size == 0; },
        enumerable: false,
        configurable: true
    });
    TreeNode.prototype.add = function (value) {
        var n = new TreeNode(value);
        this.__children.push(n);
        return n;
    };
    TreeNode.prototype.remove = function (value, comparer) {
        var defaultComparer = function (item) { return item.value === value; }, n = this.__children.findIndex(comparer || defaultComparer);
        return n != -1 ? this.__children.splice(n, 1)[0] : undefined;
    };
    TreeNode.prototype.removeAt = function (index) {
        return index >= 0 && index < this.size ? this.__children.splice(index, 1)[0] : undefined;
    };
    TreeNode.prototype.find = function (value, comparer) {
        var defaultComparer = function (item) { return item.value === value; };
        return this.__children.find(comparer || defaultComparer);
    };
    return TreeNode;
}(ValueNode));
exports.TreeNode = TreeNode;
var BaseTree = /** @class */ (function () {
    function BaseTree(comparer) {
        this.__comp = comparer || compare;
    }
    BaseTree.prototype.empty = function () { return this.root == undefined; };
    BaseTree.prototype.clear = function () {
        this.root = void 0;
    };
    Object.defineProperty(BaseTree.prototype, "comparer", {
        get: function () { return this.__comp; },
        enumerable: false,
        configurable: true
    });
    /**
     * @description it calls levelOrder from root, and returns it's result with empty callback.
     */
    BaseTree.prototype.depth = function () {
        var result, enumerator = this.levelOrderEnumerator();
        while (!(result = enumerator.next()).done)
            ;
        return result.value;
    };
    BaseTree.prototype.preOrderEnumerator = function (node) {
        var stack, count, children, i;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stack = new Stack_1.default(), count = 0;
                    !node && (node = this.root);
                    if (!node) return [3 /*break*/, 3];
                    stack.push(node);
                    _a.label = 1;
                case 1:
                    if (!!stack.empty) return [3 /*break*/, 3];
                    count++;
                    node = stack.pop();
                    return [4 /*yield*/, node];
                case 2:
                    _a.sent();
                    for (children = node.children, i = children.length - 1; i >= 0; i--) {
                        stack.push(children[i]);
                    }
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/, count];
            }
        });
    };
    BaseTree.prototype.preOrderIterator = function (node) {
        var _a;
        var enumerator = this.preOrderEnumerator(node), iterator = (_a = {
                //Iterator protocol
                next: function () {
                    return enumerator.next();
                }
            },
            //Iterable protocol
            _a[Symbol.iterator] = function () {
                return iterator;
            },
            _a);
        return iterator;
    };
    /**
     * @description it's an extended breadthSearch with a tree node level value
     * @param node root node to calculate level order
     * @param callback a function called for every tree node with it's level 1-based
     */
    BaseTree.prototype.levelOrderEnumerator = function (node) {
        var queue, maxLevel, _loop_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    queue = new Queue_1.default(), maxLevel = 0;
                    !node && (node = this.root);
                    if (!node) return [3 /*break*/, 3];
                    queue.enqueue({ node: node, level: 1 });
                    _loop_1 = function () {
                        var father;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    father = queue.dequeue();
                                    maxLevel = Math.max(maxLevel, father.level);
                                    return [4 /*yield*/, {
                                            node: father.node,
                                            level: father.level
                                        }];
                                case 1:
                                    _a.sent();
                                    father.node.children.forEach(function (child) { return queue.enqueue({ node: child, level: father.level + 1 }); });
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _a.label = 1;
                case 1:
                    if (!!queue.empty) return [3 /*break*/, 3];
                    return [5 /*yield**/, _loop_1()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/, maxLevel];
            }
        });
    };
    BaseTree.prototype.postOrderEnumerator = function (node) {
        var stack, count, n, children, i;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stack = new Stack_1.default(), count = 0;
                    !node && (node = this.root);
                    if (!node) return [3 /*break*/, 5];
                    stack.push({ node: node, t: false });
                    _a.label = 1;
                case 1:
                    if (!!stack.empty) return [3 /*break*/, 5];
                    n = stack.peek();
                    if (!n.t) return [3 /*break*/, 3];
                    count++;
                    return [4 /*yield*/, n.node];
                case 2:
                    _a.sent();
                    stack.pop();
                    return [3 /*break*/, 4];
                case 3:
                    n.t = true;
                    for (children = n.node.children, i = children.length - 1; i >= 0; i--) {
                        stack.push({ node: children[i], t: false });
                    }
                    _a.label = 4;
                case 4: return [3 /*break*/, 1];
                case 5: return [2 /*return*/, count];
            }
        });
    };
    BaseTree.prototype.breathSearchEnumerator = function (node) {
        var queue, count;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    queue = new Queue_1.default(), count = 0;
                    !node && (node = this.root);
                    if (!node) return [3 /*break*/, 3];
                    queue.enqueue(node);
                    _a.label = 1;
                case 1:
                    if (!!queue.empty) return [3 /*break*/, 3];
                    node = queue.dequeue();
                    count++;
                    return [4 /*yield*/, node];
                case 2:
                    _a.sent();
                    node.children.forEach(function (child) { return queue.enqueue(child); });
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/, count];
            }
        });
    };
    return BaseTree;
}());
exports.BaseTree = BaseTree;
var Tree = /** @class */ (function (_super) {
    tslib_1.__extends(Tree, _super);
    function Tree(root, comparer) {
        var _this = _super.call(this, comparer) || this;
        _this.root = root;
        return _this;
    }
    /**
     * @description implements a breadth search
     * @param value value to search
     */
    Tree.prototype.find = function (value) {
        var queue = new Queue_1.default(), node = this.root;
        if (node) {
            queue.enqueue(node);
            while (!queue.empty) {
                node = queue.dequeue();
                if (this.comparer(node.value, value) == 0) {
                    queue.clear();
                    return node;
                }
                else {
                    node.children.forEach(function (child) { return queue.enqueue(child); });
                }
            }
        }
        return;
    };
    return Tree;
}(BaseTree));
exports.Tree = Tree;
function compare(a, b) {
    if (a == b)
        return 0;
    else if (a > b)
        return 1;
    else
        return -1;
}
