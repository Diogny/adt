import { Queue } from "./Queue";
export class Deque extends Queue {
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
