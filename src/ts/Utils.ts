var a = {
	'true': true,
	'false': false,
	'undefined': false,
	'null': false,
	'1': true,
	'0': false
};

export const toBool = (val: any): boolean => a[val];

export const padStr = (ch: string, len: number) => new Array(len).join(ch);

export const pad = (s: string, width: number) => new Array(width - s.length).join(' ') + s;

export const range = (s: number, e: number) => Array.from('x'.repeat(e - s), (_, i) => s + i);

export const formatNumber = (n: number, width: number) => pad(n + "", width);