export default class Stack<T> {
    protected n: T[];
    constructor();
    get count(): number;
    get last(): number;
    get items(): T[];
    get empty(): boolean;
    pop(): T | undefined;
    push(t: T): number;
    peek(): T;
    clear(): void;
    static from<T>(initialData?: Array<T>): Stack<T>;
}
