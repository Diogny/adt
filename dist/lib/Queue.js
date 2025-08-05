import { Stack } from "./Stack";
export class Queue extends Stack {
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
