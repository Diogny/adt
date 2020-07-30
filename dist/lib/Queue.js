"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Stack_1 = tslib_1.__importDefault(require("./Stack"));
var Queue = /** @class */ (function (_super) {
    tslib_1.__extends(Queue, _super);
    function Queue() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Queue.prototype.dequeue = function () { return this.pop(); };
    Queue.prototype.enqueue = function (t) { return this.n.unshift(t); };
    Queue.prototype.peek = function () { return this.n[0]; };
    Queue.prototype.peekback = function () { return _super.prototype.peek.call(this); };
    Queue.from = function (initialData) {
        var _a;
        if (initialData === void 0) { initialData = []; }
        var q = new Queue();
        (_a = q.n).unshift.apply(_a, tslib_1.__spread(initialData));
        return q;
    };
    return Queue;
}(Stack_1.default));
exports.default = Queue;
