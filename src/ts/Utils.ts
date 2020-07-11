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

export const selectMany = <TIn, TOut>(input: TIn[], selectListFn: (t: TIn) => TOut[]): TOut[] =>
	input.reduce((out, inx) => {
		out.push(...selectListFn(inx));
		return out;
	}, new Array<TOut>());

export const matrix = <T>(rows: number, cols: number, filler: T): T[][] =>
	Array.from({ length: rows }, () => new Array(cols).fill(filler));

export const enumConditional = (start: number, max: number, discovered: (ndx: number) => boolean) => {
	var
		nextNdx = (ndx: number) => ndx >= max ? 0 : ++ndx,
		curr = start < 0 || start > max ? -1 : start,
		first = true;

	return {
		current: () => curr,
		next: () => {
			if (curr < 0)
				return false;
			if (first) {
				return first = false, true
			} else {
				while (!((curr = nextNdx(curr)) == start || !discovered(curr)));
				return curr != start;
			}
		}
	}
}
