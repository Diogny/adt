import { expect } from 'chai';
import PriorityQueue from '../src/lib/PriorityQueue';

//run as Task launch.json
//or	node node_modules/mocha/bin/_mocha --require ts-node/register test/priority-queue.ts

describe('Priority Queue', () => {
	it('bulk add/remove', () => {
		const pq = new PriorityQueue<number>([4, 3, 5]);

		console.log('priority:');
		while (!pq.empty)
			console.log(pq.remove());
		expect(1).to.equal(1);
	})
	it('add/remove', () => {
		const pq = new PriorityQueue<number>();
		pq.add(4);
		pq.add(3);
		pq.add(5);

		console.log('priority:');
		while (!pq.empty)
			console.log(pq.remove());
		expect(1).to.equal(1);
	})
})
