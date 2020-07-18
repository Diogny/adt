export default class PriorityQueue<T> {

	protected __settings: {
		items: T[],
		size: number
	}

	public get size(): number { return this.__settings.size }

	public get empty(): boolean { return !this.__settings.size }

	public get element(): T {
		if (this.empty)
			throw `priority queue is empty`;
		return this.__settings.items[1]
	}

	constructor(initialData?: T[]) {
		this.clear();
		if (initialData) {
			this.__settings.size = initialData.length;
			initialData
				.forEach((d: T, ndx: number) => this.__settings.items[ndx + 1] = d);
			buildHeap(this, this.__settings.items)
		}
	}

	public clear() {
		this.__settings = {
			size: 0,
			items: new Array<T>()
		}
	}

	public comparer(a: T, b: T): number {
		if (a == b)
			return 0
		else if (a > b)
			return 1
		else
			return -1
	}

	public add(data: T): boolean {
		// Percolate up
		let hole = ++this.__settings.size;
		this.__settings.items[0] = data;

		for (; this.comparer(data, this.__settings.items[hole / 2 | 0]) < 0; hole = hole / 2 | 0)
			this.__settings.items[hole] = this.__settings.items[hole / 2 | 0];
		this.__settings.items[hole] = data;

		return true
	}

	public remove(): T {
		let
			minItem = this.element;
		this.__settings.items[1] = this.__settings.items[this.__settings.size--];
		percolateDown(this, this.__settings.items, 1);
		return minItem;

	}
}

function buildHeap<T>(pq: PriorityQueue<T>, array: T[]) {
	for (let i = pq.size / 2 | 0; i > 0; i--)
		percolateDown(pq, array, i)
}

function percolateDown<T>(pq: PriorityQueue<T>, array: T[], hole: number) {
	let child = 0,
		tmp = array[hole];

	for (; hole * 2 <= pq.size; hole = child) {
		child = hole * 2;
		if (child != pq.size &&
			pq.comparer(array[child + 1], array[child]) < 0)
			child++;
		if (pq.comparer(array[child], tmp) < 0)
			array[hole] = array[child];
		else
			break;
	}
	array[hole] = tmp;
}