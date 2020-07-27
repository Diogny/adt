"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Stack = /** @class */ (function () {
    function Stack() {
        this.clear();
    }
    Object.defineProperty(Stack.prototype, "count", {
        get: function () { return this.n.length; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Stack.prototype, "last", {
        get: function () { return this.n.length - 1; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Stack.prototype, "items", {
        get: function () { return this.n.slice(0); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Stack.prototype, "empty", {
        get: function () { return !this.n.length; },
        enumerable: false,
        configurable: true
    });
    Stack.prototype.pop = function () { return this.n.pop(); };
    Stack.prototype.push = function (t) { return this.n.push(t); };
    Stack.prototype.peek = function () { return this.n[this.last]; };
    Stack.prototype.clear = function () { this.n = new Array(); };
    Stack.from = function (initialData) {
        var _a;
        if (initialData === void 0) { initialData = []; }
        var s = new Stack();
        (_a = s.n).push.apply(_a, tslib_1.__spread(initialData));
        return s;
    };
    return Stack;
}());
exports.default = Stack;
//# sourceMappingURL=Stack.js.map