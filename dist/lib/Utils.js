import { attr } from "dabbjs/dist/lib/dom";
import { fillChar } from "dabbjs/dist/lib/strings";
const svgNS = "http://www.w3.org/2000/svg";
//used for string & numbers
// export const pad = (t: string, e: number, ch?: any) =>
// 	new Array(Math.max(0, (e || 2) + 1 - String(t).length)).join(ch || '0') + t;
// export const fillChar = (ch: string, len: number) => new Array(len).join(ch);
// export const padStr = (s: string, width: number) => new Array(Math.max(0, width - s.length)).join(' ') + s;
// export const formatNumber = (n: number, width: number) => padStr(n + "", width);
export const centerStr = (s, width) => {
    let w = (width - s.length) / 2 | 0;
    return (fillChar(' ', w + 1) + s + fillChar(' ', w + 1)).substring(0, width);
};
export const centerPadStr = (str, width, leftStr, rightStr) => {
    let w = (width - str.length) / 2 | 0, getChar = (s) => (s && (s = s[0]), s || ' ');
    return (fillChar(getChar(leftStr), w + 1) + str + fillChar(getChar(rightStr), w + 1)).substring(0, width);
};
export const replaceAt = (str, index, replacement) => str.substring(0, index) + replacement + str.substring(index + replacement.length);
export const matrix = (rows, cols, filler) => Array.from({ length: rows }, () => new Array(cols).fill(filler));
export const enumConditional = (start, max, discovered) => {
    let nextNdx = (ndx) => ndx >= max ? 0 : ++ndx, curr = start < 0 || start > max ? -1 : start, first = true;
    return {
        current: () => curr,
        next: () => {
            if (curr < 0)
                return false;
            if (first) {
                return first = false, true;
            }
            else {
                while (!((curr = nextNdx(curr)) == start || !discovered(curr)))
                    ;
                return curr != start;
            }
        }
    };
};
export const tag = (tagName, id, nsAttrs) => (id && (nsAttrs.id = id),
    attr(document.createElementNS(svgNS, tagName), nsAttrs));
export const svg = (html) => {
    let template = document.createElementNS(svgNS, "template");
    template.innerHTML = html;
    return template.children[0];
};
