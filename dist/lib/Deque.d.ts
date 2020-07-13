import Queue from "./Queue";
export default class Deque<T> extends Queue<T> {
    popback(): T | undefined;
    popfront(): T | undefined;
    pushback(t: T): void;
    pushfront(t: T): void;
    static from<T>(initialData?: Array<T>): Deque<T>;
}
