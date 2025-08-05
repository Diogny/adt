export declare class PriorityQueue<T> {
    protected __settings: {
        items: T[];
        size: number;
        comp: (a: T, b: T) => number;
    };
    get size(): number;
    get empty(): boolean;
    get comparer(): (a: T, b: T) => number;
    get element(): T;
    constructor(initialData?: T[], comparer?: (a: T, b: T) => number);
    clear(): void;
    add(data: T): boolean;
    remove(): T;
}
