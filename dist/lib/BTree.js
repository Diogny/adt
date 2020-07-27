"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BTree = exports.SearchBTreeTraverse = exports.BTreeNode = void 0;
var tslib_1 = require("tslib");
var Tree_1 = require("./Tree");
var Stack_1 = tslib_1.__importDefault(require("./Stack"));
var BTreeNode = /** @class */ (function (_super) {
    tslib_1.__extends(BTreeNode, _super);
    function BTreeNode(value, left, right) {
        var _this = _super.call(this, value) || this;
        _this.left = left;
        _this.right = right;
        return _this;
    }
    Object.defineProperty(BTreeNode.prototype, "isLeaf", {
        get: function () { return !this.left && !this.right; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BTreeNode.prototype, "children", {
        get: function () {
            return [this.left, this.right].filter(function (item) { return !!item; });
        },
        enumerable: false,
        configurable: true
    });
    return BTreeNode;
}(Tree_1.ValueNode));
exports.BTreeNode = BTreeNode;
var SearchBTreeTraverse;
(function (SearchBTreeTraverse) {
    SearchBTreeTraverse[SearchBTreeTraverse["Root"] = 0] = "Root";
    SearchBTreeTraverse[SearchBTreeTraverse["Left"] = 1] = "Left";
    SearchBTreeTraverse[SearchBTreeTraverse["Right"] = 2] = "Right";
})(SearchBTreeTraverse = exports.SearchBTreeTraverse || (exports.SearchBTreeTraverse = {}));
var BTree = /** @class */ (function (_super) {
    tslib_1.__extends(BTree, _super);
    function BTree(root, comparer) {
        var e_1, _a;
        var _this = _super.call(this, comparer) || this;
        _this.root = root;
        _this.__size = 0;
        if (_this.root != undefined) {
            try {
                for (var _b = tslib_1.__values(_this.preOrderEnumerator()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var n = _c.value;
                    _this.__size++;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        return _this;
    }
    Object.defineProperty(BTree.prototype, "size", {
        get: function () { return this.__size; },
        enumerable: false,
        configurable: true
    });
    BTree.prototype.find = function (value) {
        var key = this.findKey(value);
        return key.comp == 0 ? key.node : undefined;
    };
    //(LNR)
    BTree.prototype.inOrderEnumerator = function (node) {
        var stack, count, n;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stack = new Stack_1.default(), count = 0, n = node || this.root;
                    _a.label = 1;
                case 1:
                    if (!(!stack.empty || n != undefined)) return [3 /*break*/, 5];
                    if (!(n != undefined)) return [3 /*break*/, 2];
                    stack.push(n);
                    n = n.left;
                    return [3 /*break*/, 4];
                case 2:
                    n = stack.pop();
                    count++;
                    return [4 /*yield*/, n];
                case 3:
                    _a.sent();
                    n = n.right;
                    _a.label = 4;
                case 4: return [3 /*break*/, 1];
                case 5: return [2 /*return*/, count];
            }
        });
    };
    BTree.prototype.postOrderEnumerator = function (node) {
        var stack, n, lastNodeVisited, count, peekNode;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stack = new Stack_1.default(), n = node || this.root, count = 0;
                    _a.label = 1;
                case 1:
                    if (!(!stack.empty || n != undefined)) return [3 /*break*/, 6];
                    if (!(n != undefined)) return [3 /*break*/, 2];
                    stack.push(n);
                    n = n.left;
                    return [3 /*break*/, 5];
                case 2:
                    peekNode = stack.peek();
                    if (!(peekNode.right != undefined && lastNodeVisited != peekNode.right)) return [3 /*break*/, 3];
                    n = peekNode.right;
                    return [3 /*break*/, 5];
                case 3:
                    count++;
                    return [4 /*yield*/, peekNode];
                case 4:
                    _a.sent();
                    lastNodeVisited = stack.pop();
                    _a.label = 5;
                case 5: return [3 /*break*/, 1];
                case 6: return [2 /*return*/, count];
            }
        });
    };
    BTree.prototype.newNode = function (value) {
        return new BTreeNode(value);
    };
    BTree.prototype.findKey = function (value) {
        var comp = 0, parent = void 0, node = this.root;
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
    };
    BTree.prototype.min = function (node) {
        if (node)
            while (node.left != undefined)
                node = node.left;
        return node;
    };
    BTree.prototype.max = function (node) {
        if (node)
            while (node.right != undefined)
                node = node.right;
        return node;
    };
    BTree.prototype.insert = function (value) {
        //will be implemented later
        return false;
    };
    BTree.prototype.delete = function (value) {
        //will be implemented later
        return false;
    };
    BTree.prototype.insertRange = function (values) {
        var _this = this;
        var array = [];
        values.forEach(function (value) { return array.push(_this.insert(value)); });
        return array;
    };
    BTree.prototype.deleteRange = function (values) {
        var _this = this;
        var array = [];
        values.forEach(function (value) { return array.push(_this.delete(value)); });
        return array;
    };
    return BTree;
}(Tree_1.BaseTree));
exports.BTree = BTree;
//# sourceMappingURL=BTree.js.map