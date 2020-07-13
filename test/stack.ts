import { expect } from 'chai';
import Stack from '../src/lib/Stack';

describe('Stack', () => {
	it('(new Stack()).length = 0', () => {
		const s = new Stack();
		expect(s.count).to.equal(0);
	})
})

