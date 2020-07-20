/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/lib/AVLTree.ts":
/*!****************************!*\
  !*** ./src/lib/AVLTree.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.AVLTree = exports.AVLTreeNode = void 0;\r\nconst BTree_1 = __webpack_require__(/*! ./BTree */ \"./src/lib/BTree.ts\");\r\nconst Stack_1 = __importDefault(__webpack_require__(/*! ./Stack */ \"./src/lib/Stack.ts\"));\r\nclass AVLTreeNode extends BTree_1.BTreeNode {\r\n    constructor(value) {\r\n        super(value);\r\n        this.depth = 1;\r\n    }\r\n}\r\nexports.AVLTreeNode = AVLTreeNode;\r\nclass AVLTree extends BTree_1.SearchBTree {\r\n    constructor(comparer) {\r\n        super(undefined, comparer);\r\n    }\r\n    insert(value) {\r\n        let stack = new Stack_1.default(), comp = 0, parent = void 0, node = this.root;\r\n        while (node != undefined) {\r\n            parent = node;\r\n            comp = this.comparer(value, node.value);\r\n            if (comp == 0)\r\n                return node;\r\n            else {\r\n                if (comp < 0) {\r\n                    node = node.left;\r\n                }\r\n                else {\r\n                    node = node.right;\r\n                }\r\n                stack.push(parent);\r\n            }\r\n        }\r\n        if (!parent)\r\n            return this.root = newNode(value);\r\n        insertNode(parent, node = newNode(value), comp);\r\n        balanceTree(this, stack);\r\n        return node;\r\n    }\r\n    delete(value) {\r\n        let stack = new Stack_1.default(), comp = 0, parent = void 0, root = void 0, node = this.root, min = void 0, found = false;\r\n        while (node != undefined && !found) {\r\n            parent = node;\r\n            comp = this.comparer(value, node.value);\r\n            if (comp == 0)\r\n                found = true;\r\n            else {\r\n                if (comp < 0) {\r\n                    node = node.left;\r\n                }\r\n                else {\r\n                    node = node.right;\r\n                }\r\n                stack.push(parent);\r\n            }\r\n        }\r\n        if (!found)\r\n            return undefined;\r\n        parent = stack.peek();\r\n        if (node.isLeaf) {\r\n            if (!parent) {\r\n                return this.root = void 0, node;\r\n            }\r\n            setChild(void 0, parent, this.comparer(node.value, parent.value));\r\n        }\r\n        else if (node.left && node.right) {\r\n            if (getDepth(node.left) >= getDepth(node.right)) {\r\n                root = node.left;\r\n                if (root.right) {\r\n                    min = deleteMin(this, root.right, root, 1);\r\n                    min.right = node.right;\r\n                    min.left = root;\r\n                    root = min;\r\n                }\r\n                else\r\n                    root.right = node.right;\r\n            }\r\n            else {\r\n                root = node.right;\r\n                if (root.left) {\r\n                    min = deleteMin(this, root, node, 1);\r\n                    root.left = void 0;\r\n                    min.left = node.left;\r\n                    min.right = root;\r\n                    root = min;\r\n                }\r\n                else\r\n                    root.left = node.left;\r\n            }\r\n            setDepth(root);\r\n            if (!parent)\r\n                this.root = root;\r\n            else {\r\n                setChild(root, parent, this.comparer(root.value, parent.value));\r\n            }\r\n        }\r\n        else {\r\n            if (!parent) {\r\n                return this.root = (node.left || node.right), node;\r\n            }\r\n            setChild(node.left || node.right, parent, this.comparer(node.value, parent.value));\r\n        }\r\n        balanceTree(this, stack);\r\n        return node;\r\n    }\r\n}\r\nexports.AVLTree = AVLTree;\r\nfunction newNode(value) {\r\n    return new AVLTreeNode(value);\r\n}\r\nconst getDepth = (n) => (n === null || n === void 0 ? void 0 : n.depth) || 0;\r\nfunction setDepth(node) {\r\n    let ldepth = getDepth(node.left), rdepth = getDepth(node.right);\r\n    node.depth = Math.max(ldepth, rdepth) + 1;\r\n    return rdepth - ldepth;\r\n}\r\nfunction insertNode(parent, node, comp) {\r\n    if (comp < 0) {\r\n        parent.left = node;\r\n    }\r\n    else {\r\n        parent.right = node;\r\n    }\r\n    return parent;\r\n}\r\nfunction setChild(node, parent, comp) {\r\n    if (comp < 0)\r\n        parent.left = node;\r\n    else\r\n        parent.right = node;\r\n}\r\nfunction deleteMin(tree, node, parent, comp) {\r\n    let stack = new Stack_1.default();\r\n    if (node.left)\r\n        comp = -1;\r\n    while (node.left != undefined) {\r\n        parent = node;\r\n        node = node.left;\r\n        if (node.left)\r\n            stack.push(node);\r\n    }\r\n    setChild(node.right, parent, comp);\r\n    setDepth(parent);\r\n    balanceTree(tree, stack);\r\n    return node;\r\n}\r\nfunction balanceTree(tree, stack) {\r\n    while (!stack.empty) {\r\n        let parent = void 0, node = stack.pop(), balance = setDepth(node), childrenBalance = 0, root = void 0;\r\n        if (node.depth > 2 && Math.abs(balance) > 1) {\r\n            if (balance < 0) {\r\n                root = node.left;\r\n                childrenBalance = getDepth(root.right) - getDepth(root.left);\r\n                if (childrenBalance < 0) {\r\n                    node.left = root.right;\r\n                    root.right = node;\r\n                }\r\n                else {\r\n                    parent = root;\r\n                    root = root.right;\r\n                    parent.right = root.left;\r\n                    root.left = parent;\r\n                    node.left = root.right;\r\n                    root.right = node;\r\n                    setDepth(parent);\r\n                }\r\n            }\r\n            else {\r\n                root = node.right;\r\n                childrenBalance = getDepth(root.right) - getDepth(root.left);\r\n                if (childrenBalance > 0) {\r\n                    node.right = root.left;\r\n                    root.left = node;\r\n                }\r\n                else {\r\n                    parent = root;\r\n                    root = root.left;\r\n                    parent.left = root.right;\r\n                    root.right = parent;\r\n                    node.right = root.left;\r\n                    root.left = node;\r\n                    setDepth(parent);\r\n                }\r\n            }\r\n            setDepth(node);\r\n            setDepth(root);\r\n            parent = stack.peek();\r\n            if (!parent) {\r\n                tree.root = root;\r\n            }\r\n            else {\r\n                if (tree.comparer(root.value, parent.value) > 0)\r\n                    parent.right = root;\r\n                else\r\n                    parent.left = root;\r\n                setDepth(parent);\r\n            }\r\n        }\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/lib/AVLTree.ts?");

/***/ }),

/***/ "./src/lib/BTree.ts":
/*!**************************!*\
  !*** ./src/lib/BTree.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.SearchBTree = exports.BTree = exports.SearchBTreeTraverse = exports.BTreeNode = void 0;\r\nconst Tree_1 = __webpack_require__(/*! ./Tree */ \"./src/lib/Tree.ts\");\r\nconst Stack_1 = __importDefault(__webpack_require__(/*! ./Stack */ \"./src/lib/Stack.ts\"));\r\nclass BTreeNode extends Tree_1.ValueNode {\r\n    constructor(value, left, right) {\r\n        super(value);\r\n        this.left = left;\r\n        this.right = right;\r\n    }\r\n    get isLeaf() { return !this.left && !this.right; }\r\n    get children() {\r\n        return [this.left, this.right].filter(item => !!item);\r\n    }\r\n}\r\nexports.BTreeNode = BTreeNode;\r\nvar SearchBTreeTraverse;\r\n(function (SearchBTreeTraverse) {\r\n    SearchBTreeTraverse[SearchBTreeTraverse[\"Root\"] = 0] = \"Root\";\r\n    SearchBTreeTraverse[SearchBTreeTraverse[\"Left\"] = 1] = \"Left\";\r\n    SearchBTreeTraverse[SearchBTreeTraverse[\"Right\"] = 2] = \"Right\";\r\n})(SearchBTreeTraverse = exports.SearchBTreeTraverse || (exports.SearchBTreeTraverse = {}));\r\nclass BTree extends Tree_1.BaseTree {\r\n    constructor(root, comparer) {\r\n        super(comparer);\r\n        this.root = root;\r\n    }\r\n    find(value) {\r\n        let key = this.findKey(value);\r\n        return key.comp == 0 ? key.node : undefined;\r\n    }\r\n    //(LNR)\r\n    *inOrderEnumerator(node) {\r\n        let stack = new Stack_1.default(), count = 0, n = node || this.root;\r\n        while (!stack.empty || n != undefined) {\r\n            if (n != undefined) {\r\n                stack.push(n);\r\n                n = n.left;\r\n            }\r\n            else {\r\n                n = stack.pop();\r\n                count++;\r\n                yield n;\r\n                n = n.right;\r\n            }\r\n        }\r\n        return count;\r\n    }\r\n    *postOrderEnumerator(node) {\r\n        let stack = new Stack_1.default(), n = node || this.root, lastNodeVisited, count = 0;\r\n        while (!stack.empty || n != undefined) {\r\n            if (n != undefined) {\r\n                stack.push(n);\r\n                n = n.left;\r\n            }\r\n            else {\r\n                let peekNode = stack.peek();\r\n                // if right child exists and traversing node from left child, then move right\r\n                if (peekNode.right != undefined && lastNodeVisited != peekNode.right)\r\n                    n = peekNode.right;\r\n                else {\r\n                    count++;\r\n                    yield peekNode;\r\n                    lastNodeVisited = stack.pop();\r\n                }\r\n            }\r\n        }\r\n        return count;\r\n    }\r\n    newNode(value) {\r\n        return new BTreeNode(value);\r\n    }\r\n    findKey(value) {\r\n        let comp = 0, parent = void 0, node = this.root;\r\n        while (node != undefined) {\r\n            parent = node;\r\n            comp = this.comparer(value, node.value);\r\n            if (comp == 0) {\r\n                return {\r\n                    node: node,\r\n                    parent: parent,\r\n                    comp: comp\r\n                };\r\n            }\r\n            else if (comp < 0) {\r\n                node = node.left;\r\n            }\r\n            else {\r\n                node = node.right;\r\n            }\r\n        }\r\n        return { node: node, parent: parent, comp: comp };\r\n    }\r\n    min(node) {\r\n        if (node)\r\n            while (node.left != undefined)\r\n                node = node.left;\r\n        return node;\r\n    }\r\n    max(node) {\r\n        if (node)\r\n            while (node.right != undefined)\r\n                node = node.right;\r\n        return node;\r\n    }\r\n}\r\nexports.BTree = BTree;\r\nclass SearchBTree extends BTree {\r\n    insertRange(values) {\r\n        let array = [];\r\n        values.forEach(value => array.push(this.insert(value)));\r\n        return array;\r\n    }\r\n}\r\nexports.SearchBTree = SearchBTree;\r\n\n\n//# sourceURL=webpack:///./src/lib/BTree.ts?");

/***/ }),

/***/ "./src/lib/Queue.ts":
/*!**************************!*\
  !*** ./src/lib/Queue.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst Stack_1 = __importDefault(__webpack_require__(/*! ./Stack */ \"./src/lib/Stack.ts\"));\r\nclass Queue extends Stack_1.default {\r\n    dequeue() { return this.pop(); }\r\n    enqueue(t) { return this.n.unshift(t); }\r\n    peek() { return this.n[0]; }\r\n    peekback() { return super.peek(); }\r\n    static from(initialData = []) {\r\n        const q = new Queue();\r\n        q.n.unshift(...initialData);\r\n        return q;\r\n    }\r\n}\r\nexports.default = Queue;\r\n\n\n//# sourceURL=webpack:///./src/lib/Queue.ts?");

/***/ }),

/***/ "./src/lib/RedBlackTree.ts":
/*!*********************************!*\
  !*** ./src/lib/RedBlackTree.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.RedBlackTree = exports.RedBlackTreeNode = exports.RedBlackEnum = void 0;\r\nconst BTree_1 = __webpack_require__(/*! ./BTree */ \"./src/lib/BTree.ts\");\r\nconst Stack_1 = __importDefault(__webpack_require__(/*! ./Stack */ \"./src/lib/Stack.ts\"));\r\nvar RedBlackEnum;\r\n(function (RedBlackEnum) {\r\n    RedBlackEnum[RedBlackEnum[\"red\"] = 0] = \"red\";\r\n    RedBlackEnum[RedBlackEnum[\"black\"] = 1] = \"black\";\r\n})(RedBlackEnum = exports.RedBlackEnum || (exports.RedBlackEnum = {}));\r\nclass RedBlackTreeNode extends BTree_1.BTreeNode {\r\n    constructor(value) {\r\n        super(value);\r\n        this.color = RedBlackEnum.red;\r\n    }\r\n}\r\nexports.RedBlackTreeNode = RedBlackTreeNode;\r\nclass RedBlackTree extends BTree_1.SearchBTree {\r\n    constructor(comparer) {\r\n        super(undefined, comparer);\r\n    }\r\n    insert(value) {\r\n        if (this.root == undefined) {\r\n            this.root = newNode(value);\r\n            this.root.color = RedBlackEnum.black;\r\n            return this.root;\r\n        }\r\n        let stack = new Stack_1.default(), parent = void 0, node = this.root, comp = 0;\r\n        while (node != undefined) {\r\n            parent = node;\r\n            comp = this.comparer(value, node.value);\r\n            if (comp == 0)\r\n                return node;\r\n            else {\r\n                if (comp < 0)\r\n                    node = node.left;\r\n                else\r\n                    node = node.right;\r\n                stack.push(parent);\r\n            }\r\n        }\r\n        insertNode(parent, node = newNode(value), comp);\r\n        balanceTree(this, node, stack);\r\n        return node;\r\n    }\r\n    delete(value) {\r\n        return;\r\n    }\r\n}\r\nexports.RedBlackTree = RedBlackTree;\r\nfunction newNode(value) {\r\n    return new RedBlackTreeNode(value);\r\n}\r\nfunction insertNode(parent, node, comp) {\r\n    if (comp < 0) {\r\n        parent.left = node;\r\n    }\r\n    else {\r\n        parent.right = node;\r\n    }\r\n    return parent;\r\n}\r\nfunction getColor(node) {\r\n    return node == undefined ?\r\n        RedBlackEnum.black :\r\n        node.color;\r\n}\r\nfunction balanceTree(tree, node, stack) {\r\n    while (!stack.empty) {\r\n        let comp = 0, parent = stack.pop(), grandparent = stack.pop();\r\n        if (parent.color == RedBlackEnum.black || grandparent == undefined) {\r\n            return;\r\n        }\r\n        let uncle = ((comp = tree.comparer(parent.value, grandparent.value)) < 0 ? grandparent.right : grandparent.left);\r\n        if (getColor(uncle) == RedBlackEnum.red) {\r\n            parent.color = RedBlackEnum.black;\r\n            uncle.color = RedBlackEnum.black;\r\n            if (stack.empty)\r\n                grandparent.color = RedBlackEnum.black;\r\n            else\r\n                grandparent.color = RedBlackEnum.red;\r\n            node = grandparent;\r\n        }\r\n        else {\r\n            if (comp < 0) {\r\n                if (tree.comparer(node.value, parent.value) < 0) {\r\n                    grandparent.left = parent.right;\r\n                    parent.right = grandparent;\r\n                    parent.color = RedBlackEnum.black;\r\n                    grandparent.color = RedBlackEnum.red;\r\n                    node = parent;\r\n                }\r\n                else {\r\n                    parent.right = node.left;\r\n                    grandparent.left = node.right;\r\n                    grandparent.right = uncle;\r\n                    node.left = parent;\r\n                    node.right = grandparent;\r\n                    grandparent.color = RedBlackEnum.red;\r\n                    node.color = RedBlackEnum.black;\r\n                }\r\n            }\r\n            else {\r\n                if (tree.comparer(node.value, parent.value) > 0) {\r\n                    grandparent.right = parent.left;\r\n                    parent.left = grandparent;\r\n                    parent.color = RedBlackEnum.black;\r\n                    grandparent.color = RedBlackEnum.red;\r\n                    node = parent;\r\n                }\r\n                else {\r\n                    parent.left = node.right;\r\n                    grandparent.right = node.left;\r\n                    grandparent.left = uncle;\r\n                    node.left = grandparent;\r\n                    node.right = parent;\r\n                    grandparent.color = RedBlackEnum.red;\r\n                    node.color = RedBlackEnum.black;\r\n                }\r\n            }\r\n            parent = stack.peek();\r\n            if (parent == undefined) {\r\n                tree.root = node;\r\n                return;\r\n            }\r\n            else {\r\n                if (tree.comparer(node.value, parent.value) > 0)\r\n                    parent.right = node;\r\n                else\r\n                    parent.left = node;\r\n            }\r\n        }\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/lib/RedBlackTree.ts?");

/***/ }),

/***/ "./src/lib/Stack.ts":
/*!**************************!*\
  !*** ./src/lib/Stack.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nclass Stack {\r\n    constructor() {\r\n        this.clear();\r\n    }\r\n    get count() { return this.n.length; }\r\n    get last() { return this.n.length - 1; }\r\n    get items() { return this.n.slice(0); }\r\n    get empty() { return !this.n.length; }\r\n    pop() { return this.n.pop(); }\r\n    push(t) { return this.n.push(t); }\r\n    peek() { return this.n[this.last]; }\r\n    clear() { this.n = new Array(); }\r\n    static from(initialData = []) {\r\n        const s = new Stack();\r\n        s.n.push(...initialData);\r\n        return s;\r\n    }\r\n}\r\nexports.default = Stack;\r\n\n\n//# sourceURL=webpack:///./src/lib/Stack.ts?");

/***/ }),

/***/ "./src/lib/Tree.ts":
/*!*************************!*\
  !*** ./src/lib/Tree.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.Tree = exports.BaseTree = exports.TreeNode = exports.ValueNode = void 0;\r\nconst Queue_1 = __importDefault(__webpack_require__(/*! ./Queue */ \"./src/lib/Queue.ts\"));\r\nconst Stack_1 = __importDefault(__webpack_require__(/*! ./Stack */ \"./src/lib/Stack.ts\"));\r\nclass ValueNode {\r\n    constructor(value) {\r\n        this.value = value;\r\n    }\r\n    /**\r\n     * @description return the amount of children\r\n     */\r\n    get length() { return this.children.length; }\r\n    /**\r\n     * @description children indexer\r\n     * @param index 0-based index of child\r\n     */\r\n    get(index) { return this.children[index]; }\r\n}\r\nexports.ValueNode = ValueNode;\r\nclass TreeNode extends ValueNode {\r\n    constructor(value, ...childrenNodes) {\r\n        super(value);\r\n        this.__children = new Array(...childrenNodes);\r\n    }\r\n    get children() { return this.__children.slice(0); }\r\n    get size() { return this.__children.length; }\r\n    get isLeaf() { return this.size == 0; }\r\n    add(value) {\r\n        let n = new TreeNode(value);\r\n        this.__children.push(n);\r\n        return n;\r\n    }\r\n    remove(value, comparer) {\r\n        let defaultComparer = (item) => item.value === value, n = this.__children.findIndex(comparer || defaultComparer);\r\n        return n != -1 ? this.__children.splice(n, 1)[0] : undefined;\r\n    }\r\n    removeAt(index) {\r\n        return index >= 0 && index < this.size ? this.__children.splice(index, 1)[0] : undefined;\r\n    }\r\n    find(value, comparer) {\r\n        let defaultComparer = (item) => item.value === value;\r\n        return this.__children.find(comparer || defaultComparer);\r\n    }\r\n}\r\nexports.TreeNode = TreeNode;\r\nclass BaseTree {\r\n    constructor(comparer) {\r\n        this.__comp = comparer || compare;\r\n    }\r\n    empty() { return this.root == undefined; }\r\n    clear() {\r\n        this.root = void 0;\r\n    }\r\n    get comparer() { return this.__comp; }\r\n    /**\r\n     * @description it calls levelOrder from root, and returns it's result with empty callback.\r\n     */\r\n    depth() {\r\n        let result, enumerator = this.levelOrderEnumerator();\r\n        while (!(result = enumerator.next()).done)\r\n            ;\r\n        return result.value;\r\n    }\r\n    *preOrderEnumerator(node) {\r\n        let stack = new Stack_1.default(), count = 0;\r\n        !node && (node = this.root);\r\n        if (node) {\r\n            stack.push(node);\r\n            while (!stack.empty) {\r\n                count++;\r\n                node = stack.pop();\r\n                yield node;\r\n                for (let children = node.children, i = children.length - 1; i >= 0; i--) {\r\n                    stack.push(children[i]);\r\n                }\r\n            }\r\n        }\r\n        return count;\r\n    }\r\n    preOrderIterator(node) {\r\n        let enumerator = this.preOrderEnumerator(node), iterator = {\r\n            //Iterator protocol\r\n            next: () => {\r\n                return enumerator.next();\r\n            },\r\n            //Iterable protocol\r\n            [Symbol.iterator]() {\r\n                return iterator;\r\n            }\r\n        };\r\n        return iterator;\r\n    }\r\n    /**\r\n     * @description it's an extended breadthSearch with a tree node level value\r\n     * @param node root node to calculate level order\r\n     * @param callback a function called for every tree node with it's level 1-based\r\n     */\r\n    *levelOrderEnumerator(node) {\r\n        let queue = new Queue_1.default(), maxLevel = 0;\r\n        !node && (node = this.root);\r\n        if (node) {\r\n            queue.enqueue({ node: node, level: 1 });\r\n            while (!queue.empty) {\r\n                let father = queue.dequeue();\r\n                maxLevel = Math.max(maxLevel, father.level);\r\n                yield {\r\n                    node: father.node,\r\n                    level: father.level\r\n                };\r\n                father.node.children.forEach((child) => queue.enqueue({ node: child, level: father.level + 1 }));\r\n            }\r\n        }\r\n        return maxLevel;\r\n    }\r\n    *postOrderEnumerator(node) {\r\n        let stack = new Stack_1.default(), count = 0;\r\n        !node && (node = this.root);\r\n        if (node) {\r\n            stack.push({ node: node, t: false });\r\n            while (!stack.empty) {\r\n                let n = stack.peek();\r\n                if (n.t) {\r\n                    count++;\r\n                    yield n.node;\r\n                    stack.pop();\r\n                }\r\n                else {\r\n                    n.t = true;\r\n                    for (let children = n.node.children, i = children.length - 1; i >= 0; i--) {\r\n                        stack.push({ node: children[i], t: false });\r\n                    }\r\n                }\r\n            }\r\n        }\r\n        return count;\r\n    }\r\n    *breathSearchEnumerator(node) {\r\n        let queue = new Queue_1.default(), count = 0;\r\n        !node && (node = this.root);\r\n        if (node) {\r\n            queue.enqueue(node);\r\n            while (!queue.empty) {\r\n                node = queue.dequeue();\r\n                count++;\r\n                yield node;\r\n                node.children.forEach(child => queue.enqueue(child));\r\n            }\r\n        }\r\n        return count;\r\n    }\r\n}\r\nexports.BaseTree = BaseTree;\r\nclass Tree extends BaseTree {\r\n    constructor(root, comparer) {\r\n        super(comparer);\r\n        this.root = root;\r\n    }\r\n    /**\r\n     * @description implements a breadth search\r\n     * @param value value to search\r\n     */\r\n    find(value) {\r\n        let queue = new Queue_1.default(), node = this.root;\r\n        if (node) {\r\n            queue.enqueue(node);\r\n            while (!queue.empty) {\r\n                node = queue.dequeue();\r\n                if (this.comparer(node.value, value) == 0) {\r\n                    queue.clear();\r\n                    return node;\r\n                }\r\n                else {\r\n                    node.children.forEach(child => queue.enqueue(child));\r\n                }\r\n            }\r\n        }\r\n        return;\r\n    }\r\n}\r\nexports.Tree = Tree;\r\nfunction compare(a, b) {\r\n    if (a == b)\r\n        return 0;\r\n    else if (a > b)\r\n        return 1;\r\n    else\r\n        return -1;\r\n}\r\n\n\n//# sourceURL=webpack:///./src/lib/Tree.ts?");

/***/ }),

/***/ "./src/lib/Utils.ts":
/*!**************************!*\
  !*** ./src/lib/Utils.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.html = exports.svg = exports.tag = exports.attr = exports.css = exports.isStr = exports.enumConditional = exports.matrix = exports.selectMany = exports.range = exports.replaceAt = exports.formatNumber = exports.centerPadStr = exports.centerStr = exports.padStr = exports.fillChar = exports.pad = exports.toBool = void 0;\r\nvar a = {\r\n    'true': true,\r\n    'false': false,\r\n    'undefined': false,\r\n    'null': false,\r\n    '1': true,\r\n    '0': false\r\n};\r\nconst svgNS = \"http://www.w3.org/2000/svg\";\r\nexports.toBool = (val) => a[val];\r\n//used for string & numbers\r\nexports.pad = (t, e, ch) => new Array(Math.max(0, (e || 2) + 1 - String(t).length)).join(ch ? ch : '0') + t;\r\nexports.fillChar = (ch, len) => new Array(len).join(ch);\r\nexports.padStr = (s, width) => new Array(Math.max(0, width - s.length)).join(' ') + s;\r\nexports.centerStr = (s, width) => {\r\n    let w = (width - s.length) / 2 | 0;\r\n    return (exports.fillChar(' ', w + 1) + s + exports.fillChar(' ', w + 1)).substr(0, width);\r\n};\r\nexports.centerPadStr = (str, width, leftStr, rightStr) => {\r\n    let w = (width - str.length) / 2 | 0, getChar = (s) => (s && (s = s[0]), s || ' ');\r\n    return (exports.fillChar(getChar(leftStr), w + 1) + str + exports.fillChar(getChar(rightStr), w + 1)).substr(0, width);\r\n};\r\nexports.formatNumber = (n, width) => exports.padStr(n + \"\", width);\r\nexports.replaceAt = (str, index, replacement) => str.substr(0, index) + replacement + str.substr(index + replacement.length);\r\nexports.range = (s, e) => Array.from('x'.repeat(e - s), (_, i) => s + i);\r\nexports.selectMany = (input, selectListFn) => input.reduce((out, inx) => {\r\n    out.push(...selectListFn(inx));\r\n    return out;\r\n}, new Array());\r\nexports.matrix = (rows, cols, filler) => Array.from({ length: rows }, () => new Array(cols).fill(filler));\r\nexports.enumConditional = (start, max, discovered) => {\r\n    var nextNdx = (ndx) => ndx >= max ? 0 : ++ndx, curr = start < 0 || start > max ? -1 : start, first = true;\r\n    return {\r\n        current: () => curr,\r\n        next: () => {\r\n            if (curr < 0)\r\n                return false;\r\n            if (first) {\r\n                return first = false, true;\r\n            }\r\n            else {\r\n                while (!((curr = nextNdx(curr)) == start || !discovered(curr)))\r\n                    ;\r\n                return curr != start;\r\n            }\r\n        }\r\n    };\r\n};\r\nexports.isStr = (s) => typeof s === \"string\";\r\nexports.css = (el, styles) => {\r\n    if (exports.isStr(styles))\r\n        return el.style[styles];\r\n    for (let prop in styles)\r\n        el.style[prop] = styles[prop];\r\n    return el;\r\n};\r\nexports.attr = function (el, attrs) {\r\n    if (exports.isStr(attrs))\r\n        return el.getAttribute(attrs);\r\n    for (let attr in attrs)\r\n        el.setAttribute(attr, attrs[attr]);\r\n    return el;\r\n};\r\nexports.tag = (tagName, id, nsAttrs) => (id && (nsAttrs.id = id),\r\n    exports.attr(document.createElementNS(svgNS, tagName), nsAttrs));\r\nexports.svg = (html) => {\r\n    let template = document.createElementNS(svgNS, \"template\");\r\n    template.innerHTML = html;\r\n    return template.children[0];\r\n};\r\nexports.html = (html) => {\r\n    let template = document.createElement(\"template\");\r\n    template.innerHTML = html;\r\n    return template.content.firstChild;\r\n};\r\n\n\n//# sourceURL=webpack:///./src/lib/Utils.ts?");

/***/ }),

/***/ "./src/test/css/styles.css":
/*!*********************************!*\
  !*** ./src/test/css/styles.css ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/test/css/styles.css?");

/***/ }),

/***/ "./src/test/index.ts":
/*!***************************!*\
  !*** ./src/test/index.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst AVLTree_1 = __webpack_require__(/*! ../lib/AVLTree */ \"./src/lib/AVLTree.ts\");\r\nconst RedBlackTree_1 = __webpack_require__(/*! ../lib/RedBlackTree */ \"./src/lib/RedBlackTree.ts\");\r\nconst tree_utils_1 = __webpack_require__(/*! ./tree-utils */ \"./src/test/tree-utils.ts\");\r\nlet avl = new AVLTree_1.AVLTree(), rbt = new RedBlackTree_1.RedBlackTree(), svg = document.querySelector('svg'), leftpad = 20, toppad = 10, xstart = leftpad;\r\navl.insertRange([15, 27, 19, 36, 52, 29, 18, 4]);\r\nlet size = tree_utils_1.visulizeBTree(avl, svg, \"AVL Tree\", xstart, toppad);\r\nconsole.log(size);\r\nxstart += leftpad * 2 + size.width;\r\nrbt.insertRange([7, 6, 5, 4, 3, 2, 1]);\r\nsize = tree_utils_1.visulizeBTree(rbt, svg, \"Red-Black Tree\", xstart, toppad, (node) => RedBlackTree_1.RedBlackEnum[node.color]);\r\nxstart += leftpad * 2 + size.width;\r\nrbt = new RedBlackTree_1.RedBlackTree();\r\nrbt.insertRange([10, 20, 30, 15]);\r\nsize = tree_utils_1.visulizeBTree(rbt, svg, \"Red-Black Tree 2\", xstart, toppad, (node) => RedBlackTree_1.RedBlackEnum[node.color]);\r\n\n\n//# sourceURL=webpack:///./src/test/index.ts?");

/***/ }),

/***/ "./src/test/tree-utils.ts":
/*!********************************!*\
  !*** ./src/test/tree-utils.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.visulizeBTree = void 0;\r\nconst Utils_1 = __webpack_require__(/*! ../lib/Utils */ \"./src/lib/Utils.ts\");\r\nconst WIDTH = 80;\r\nconst HEIGHT = 120;\r\nconst FONT_SIZE = 40;\r\nfunction visulizeBTree(tree, svg, caption, x, y, nodeClass) {\r\n    let depth = 0, width = 0, height = 0, svgTree = Utils_1.tag(\"g\", \"\", {\r\n        class: \"svg-tree\",\r\n        transform: `translate(${x} ${y})`\r\n    }), svgCaption = Utils_1.tag(\"text\", \"\", {\r\n        \"font-size\": FONT_SIZE,\r\n    });\r\n    if (tree && tree.root) {\r\n        svg.appendChild(svgTree);\r\n        depth = tree.depth();\r\n        width = depth == 1 ? 1 : Math.pow(2, depth - 1);\r\n        width = width * WIDTH;\r\n        height = visualizeNode(tree.root, svgTree, 0, width, 0, nodeClass);\r\n        svgCaption.innerHTML = caption;\r\n        svgTree.appendChild(svgCaption);\r\n        let box = svgCaption.getBBox();\r\n        Utils_1.attr(svgCaption, {\r\n            x: Math.max(0, (width / 2 - box.width / 2) | 0),\r\n            y: height\r\n        });\r\n        box = svgTree.getBBox();\r\n        width = box.width;\r\n        height = box.height;\r\n    }\r\n    return {\r\n        width: width,\r\n        height: height\r\n    };\r\n}\r\nexports.visulizeBTree = visulizeBTree;\r\nfunction visualizeNode(node, svg, minx, maxx, y, nodeClass) {\r\n    if (node == undefined)\r\n        return 0;\r\n    let halfWidth = WIDTH / 2 | 0, centerX = minx + (maxx - minx) / 2 | 0, centerY = y + halfWidth, circleRadius = WIDTH / 2 | 0, cl = nodeClass ? nodeClass(node) : \"\", nextYStart = y + HEIGHT, svgNode = Utils_1.tag(\"g\", \"\", {\r\n        class: \"svg-node \" + cl,\r\n        transform: `translate(${centerX - circleRadius} ${centerY - circleRadius})`\r\n    }), svgCircle = Utils_1.tag(\"circle\", \"\", {\r\n        cx: circleRadius,\r\n        cy: circleRadius,\r\n        r: circleRadius\r\n    }), svgText = Utils_1.tag(\"text\", \"\", {\r\n        \"font-size\": FONT_SIZE,\r\n        class: \"no-select\"\r\n    });\r\n    if (!node.isLeaf) {\r\n        let childrenY = nextYStart + halfWidth, childrenX = 0;\r\n        if (node.left) {\r\n            childrenX = minx + (centerX - minx) / 2 | 0;\r\n            svg.appendChild(Utils_1.tag(\"line\", \"\", lineAttrs(centerX, centerY, childrenX, childrenY, circleRadius)));\r\n        }\r\n        if (node.right) {\r\n            childrenX = centerX + (maxx - centerX) / 2 | 0;\r\n            svg.appendChild(Utils_1.tag(\"line\", \"\", lineAttrs(centerX, centerY, childrenX, childrenY, circleRadius)));\r\n        }\r\n    }\r\n    svgText.innerHTML = String(node.value);\r\n    svgNode.appendChild(svgCircle);\r\n    svgNode.appendChild(svgText);\r\n    svg.appendChild(svgNode);\r\n    let box = svgText.getBBox();\r\n    Utils_1.attr(svgText, {\r\n        x: circleRadius - box.width / 2 | 0,\r\n        y: circleRadius + box.height / 4 | 0\r\n    });\r\n    return Math.max(nextYStart, visualizeNode(node.left, svg, minx, centerX, nextYStart, nodeClass), visualizeNode(node.right, svg, centerX, maxx, nextYStart, nodeClass));\r\n}\r\nfunction lineAttrs(x1, y1, x2, y2, r) {\r\n    let angle = Math.atan2(y1 - y2, x1 - x2);\r\n    x1 = (x1 - r * Math.cos(angle)) | 0;\r\n    y1 = (y1 - r * Math.sin(angle)) | 0;\r\n    x2 = (x2 + r * Math.cos(angle)) | 0;\r\n    y2 = (y2 + r * Math.sin(angle)) | 0;\r\n    return {\r\n        x1: x1,\r\n        y1: y1,\r\n        x2: x2,\r\n        y2: y2,\r\n        class: \"svg-line\"\r\n    };\r\n}\r\n\n\n//# sourceURL=webpack:///./src/test/tree-utils.ts?");

/***/ }),

/***/ 0:
/*!***********************************************************!*\
  !*** multi ./src/test/index.ts ./src/test/css/styles.css ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ./src/test/index.ts */\"./src/test/index.ts\");\nmodule.exports = __webpack_require__(/*! ./src/test/css/styles.css */\"./src/test/css/styles.css\");\n\n\n//# sourceURL=webpack:///multi_./src/test/index.ts_./src/test/css/styles.css?");

/***/ })

/******/ });