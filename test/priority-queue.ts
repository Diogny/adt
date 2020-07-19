import { expect } from 'chai';
import PriorityQueue from '../src/lib/PriorityQueue';

//run as Task launch.json
//or	node node_modules/mocha/bin/_mocha --require ts-node/register test/priority-queue.ts

describe('Priority Queue <number>', () => {
	it('bulk add/remove', () => {
		const pq = new PriorityQueue<number>([4, 3, 5]);
		expect(pq.size).to.equal(3);
		while (!pq.empty) {
			expect(pq.element).to.equal(pq.remove())
		}
		expect(pq.empty).to.equal(true)
	})
	it('add/remove', () => {
		const pq = new PriorityQueue<number>();
		expect(pq.size).to.equal(0);
		expect(pq.empty).to.equal(true);
		pq.add(4);
		expect(pq.size).to.equal(1);
		pq.add(3);
		expect(pq.size).to.equal(2);
		pq.add(5);
		expect(pq.size).to.equal(3);
		console.log('priority:');
		while (!pq.empty)
			console.log(pq.remove());
		expect(pq.empty).to.equal(true)
	})
})
describe('Priority Queue <bject>', () => {
	it('bulk add/remove', () => {
		const pq = new PriorityQueue<{ weight: number, data: string }>([
			{ weight: 4, data: "B" },
			{ weight: 3, data: "A" },
			{ weight: 5, data: "C" }
		],
			(a, b) => {
				if (a.weight == b.weight)
					return 0
				else if (a.weight > b.weight)
					return 1
				else
					return -1
			}
		);
		expect(pq.size).to.equal(3);
		while (!pq.empty) {
			let
				item = pq.element,
				removed = pq.remove();
			console.log('removing: ', item);
			expect(item).to.equal(removed)
		}
		expect(pq.empty).to.equal(true)
	})
})