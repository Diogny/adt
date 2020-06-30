import Queue from "./Queue";

export default class Deque<T> extends Queue<T>{

	public popback(): T | undefined { return this.pop() }

	public popfront(): T | undefined { return this.n.shift() }

	public pushback(t: T) { this.n.push(t) }

	public pushfront(t: T) { this.enqueue(t) }

	public static from<T>(initialData: Array<T> = []): Deque<T> {
		const d = new Deque<T>();
		d.n.unshift(...initialData);
		return d;
	}
}