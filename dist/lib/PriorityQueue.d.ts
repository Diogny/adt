export default class PriorityQueue<T> {
    protected __settings: {
        items: T[];
        size: number;
    };
    get size(): number;
    get empty(): boolean;
    get element(): T;
    constructor(initialData?: T[]);
    clear(): void;
    comparer(a: T, b: T): number;
    add(data: T): boolean;
    remove(): T;
}
