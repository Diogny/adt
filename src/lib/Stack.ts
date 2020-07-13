export default class Stack<T> {
	protected n: T[];

	constructor() {
		this.clear();
	}

	public get count(): number { return this.n.length }

	public get last(): number { return this.n.length - 1 }

	public get items(): T[] { return this.n.slice(0) }

	public get empty(): boolean { return !this.n.length }

	public pop(): T | undefined { return this.n.pop() }

	public push(t: T): number { return this.n.push(t) }

	public peek(): T { return this.n[this.last] }

	public clear() { this.n = new Array<T>() }

	public static from<T>(initialData: Array<T> = []): Stack<T> {
		const s = new Stack<T>();
		s.n.push(...initialData);
		return s;
	}
}