var expect = require('chai').expect;
var Stack = require('../dist/lib/Stack').default;
var Queue = require('../dist/lib/Queue').default;

describe('Stack tests', () => {
	let
		stack = new Stack();
	it('(new Stack()).count = 0', () => {
		var c = stack.count;
		expect(c).to.equal(0);
	});

});

describe('Queue tests', () => {
	let
		queue = new Queue();
	it('queue.enqueue(50) = 1', () => {
		var c = queue.enqueue(50);
		expect(c).to.equal(1);
	});
	it('queue.dequeue() = 50', () => {
		var c = queue.dequeue();
		expect(c).to.equal(50);
	});
});
