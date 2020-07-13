"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Queue_1 = tslib_1.__importDefault(require("./Queue"));
class Deque extends Queue_1.default {
    popback() { return this.pop(); }
    popfront() { return this.n.shift(); }
    pushback(t) { this.n.push(t); }
    pushfront(t) { this.enqueue(t); }
    static from(initialData = []) {
        const d = new Deque();
        d.n.unshift(...initialData);
        return d;
    }
}
exports.default = Deque;
