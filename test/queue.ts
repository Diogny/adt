import { expect } from 'chai';
import Queue from '../src/ts/Queue';

describe('Queue', () => {
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