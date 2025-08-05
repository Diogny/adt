export class Stack {
    constructor() {
        this.clear();
    }
    get count() { return this.n.length; }
    get last() { return this.n.length - 1; }
    get items() { return this.n.slice(0); }
    get empty() { return !this.n.length; }
    pop() { return this.n.pop(); }
    push(t) { return this.n.push(t); }
    peek() { return this.n[this.last]; }
    clear() { this.n = new Array(); }
    static from(initialData = []) {
        const s = new Stack();
        s.n.push(...initialData);
        return s;
    }
}
