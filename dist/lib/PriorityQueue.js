"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PriorityQueue = /** @class */ (function () {
    function PriorityQueue(initialData, comparer) {
        var _this = this;
        this.__settings = {
            size: 0,
            items: [],
            comp: comparer || compare
        };
        if (initialData) {
            this.__settings.size = initialData.length;
            initialData
                .forEach(function (d, ndx) { return _this.__settings.items[ndx + 1] = d; });
            buildHeap(this, this.__settings.items);
        }
    }
    Object.defineProperty(PriorityQueue.prototype, "size", {
        get: function () { return this.__settings.size; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PriorityQueue.prototype, "empty", {
        get: function () { return !this.__settings.size; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PriorityQueue.prototype, "comparer", {
        get: function () { return this.__settings.comp; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PriorityQueue.prototype, "element", {
        get: function () {
            if (this.empty)
                throw "priority queue is empty";
            return this.__settings.items[1];
        },
        enumerable: false,
        configurable: true
    });
    PriorityQueue.prototype.clear = function () {
        this.__settings.size = 0;
        this.__settings.items = [];
    };
    PriorityQueue.prototype.add = function (data) {
        // Percolate up
        var hole = ++this.__settings.size;
        this.__settings.items[0] = data;
        for (; this.comparer(data, this.__settings.items[hole / 2 | 0]) < 0; hole = hole / 2 | 0)
            this.__settings.items[hole] = this.__settings.items[hole / 2 | 0];
        this.__settings.items[hole] = data;
        return true;
    };
    PriorityQueue.prototype.remove = function () {
        var minItem = this.element;
        this.__settings.items[1] = this.__settings.items[this.__settings.size--];
        percolateDown(this, this.__settings.items, 1);
        this.__settings.items.length = this.__settings.size + 1;
        return minItem;
    };
    return PriorityQueue;
}());
exports.default = PriorityQueue;
function buildHeap(pq, array) {
    for (var i = pq.size / 2 | 0; i > 0; i--)
        percolateDown(pq, array, i);
}
function percolateDown(pq, array, hole) {
    var child = 0, tmp = array[hole];
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
//# sourceMappingURL=PriorityQueue.js.map