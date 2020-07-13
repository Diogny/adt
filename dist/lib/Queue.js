"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Stack_1 = tslib_1.__importDefault(require("./Stack"));
class Queue extends Stack_1.default {
    dequeue() { return this.pop(); }
    enqueue(t) { return this.n.unshift(t); }
    peek() { return this.n[0]; }
    peekback() { return super.peek(); }
    static from(initialData = []) {
        const q = new Queue();
        q.n.unshift(...initialData);
        return q;
    }
}
exports.default = Queue;
