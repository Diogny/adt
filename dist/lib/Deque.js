"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Queue_1 = tslib_1.__importDefault(require("./Queue"));
var Deque = /** @class */ (function (_super) {
    tslib_1.__extends(Deque, _super);
    function Deque() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Deque.prototype.popback = function () { return this.pop(); };
    Deque.prototype.popfront = function () { return this.n.shift(); };
    Deque.prototype.pushback = function (t) { this.n.push(t); };
    Deque.prototype.pushfront = function (t) { this.enqueue(t); };
    Deque.from = function (initialData) {
        var _a;
        if (initialData === void 0) { initialData = []; }
        var d = new Deque();
        (_a = d.n).unshift.apply(_a, tslib_1.__spread(initialData));
        return d;
    };
    return Deque;
}(Queue_1.default));
exports.default = Deque;
//# sourceMappingURL=Deque.js.map