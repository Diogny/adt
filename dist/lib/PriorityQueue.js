export class PriorityQueue {
    get size() { return this.__settings.size; }
    get empty() { return !this.__settings.size; }
    get comparer() { return this.__settings.comp; }
    get element() {
        if (this.empty)
            throw new Error(`priority queue is empty`);
        return this.__settings.items[1];
    }
    constructor(initialData, comparer) {
        this.__settings = {
            size: 0,
            items: [],
            comp: comparer || compare
        };
        if (initialData) {
            this.__settings.size = initialData.length;
            initialData
                .forEach((d, ndx) => this.__settings.items[ndx + 1] = d);
            buildHeap(this, this.__settings.items);
        }
    }
    clear() {
        this.__settings.size = 0;
        this.__settings.items = [];
    }
    add(data) {
        // Percolate up
        let hole = ++this.__settings.size;
        this.__settings.items[0] = data;
        for (; this.comparer(data, this.__settings.items[hole / 2 | 0]) < 0; hole = hole / 2 | 0)
            this.__settings.items[hole] = this.__settings.items[hole / 2 | 0];
        this.__settings.items[hole] = data;
        return true;
    }
    remove() {
        let minItem = this.element;
        this.__settings.items[1] = this.__settings.items[this.__settings.size--];
        percolateDown(this, this.__settings.items, 1);
        this.__settings.items.length = this.__settings.size + 1;
        return minItem;
    }
}
function buildHeap(pq, array) {
    for (let i = pq.size / 2 | 0; i > 0; i--)
        percolateDown(pq, array, i);
}
function percolateDown(pq, array, hole) {
    let child = 0, tmp = array[hole];
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
function compare(a, b) {
    if (a == b)
        return 0;
    else if (a > b)
        return 1;
    else
        return -1;
}
