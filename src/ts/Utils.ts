var a = {
	'true': true,
	'false': false,
	'undefined': false,
	'null': false,
	'1': true,
	'0': false
};

export const toBool = (val: any): boolean => a[val];

//used for string & numbers
export const pad = (t: string, e: number, ch?: any) =>
	new Array(Math.max(0, (e || 2) + 1 - String(t).length)).join(ch ? ch : '0') + t;

export const fillChar = (ch: string, len: number) => new Array(len).join(ch);

export const padStr = (s: string, width: number) => new Array(Math.max(0, width - s.length)).join(' ') + s;

export const centerStr = (s: string, width: number) => {
	let w = (width - s.length) / 2 | 0;
	return (fillChar(' ', w + 1) + s + fillChar(' ', w + 1)).substr(0, width);
}

export const centerPadStr = (str: string, width: number, leftStr: string, rightStr: string) => {
	let w = (width - str.length) / 2 | 0,
		getChar = (s: string) => (s && (s = s[0]), s || ' ');
	return (fillChar(getChar(leftStr), w + 1) + str + fillChar(getChar(rightStr), w + 1)).substr(0, width);
}

export const formatNumber = (n: number, width: number) => padStr(n + "", width);

export const replaceAt = (str: string, index: number, replacement: string) =>
	str.substr(0, index) + replacement + str.substr(index + replacement.length);


export const range = (s: number, e: number) => Array.from('x'.repeat(e - s), (_, i) => s + i);

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
