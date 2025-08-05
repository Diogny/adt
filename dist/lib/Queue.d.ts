import { Stack } from "./Stack";
export declare class Queue<T> extends Stack<T> {
    dequeue(): T | undefined;
    enqueue(t: T): number;
    peek(): T;
    peekback(): T;
    static from<T>(initialData?: Array<T>): Queue<T>;
}
