import { Stack } from "./Stack";

export class Queue<T> extends Stack<T> {

	public dequeue(): T | undefined { return this.pop() }

	public enqueue(t: T): number { return this.n.unshift(t) }

	public peek(): T { return this.n[0] }

	public peekback(): T { return super.peek() }

	public static from<T>(initialData: Array<T> = []): Queue<T> {
		const q = new Queue<T>();
		q.n.unshift(...initialData);
		return q;
	}

}