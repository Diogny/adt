"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.html = exports.svg = exports.tag = exports.attr = exports.css = exports.isStr = exports.enumConditional = exports.matrix = exports.selectMany = exports.range = exports.replaceAt = exports.formatNumber = exports.centerPadStr = exports.centerStr = exports.padStr = exports.fillChar = exports.pad = exports.toBool = void 0;
var a = {
    'true': true,
    'false': false,
    'undefined': false,
    'null': false,
    '1': true,
    '0': false
};
const svgNS = "http://www.w3.org/2000/svg";
exports.toBool = (val) => a[val];
//used for string & numbers
exports.pad = (t, e, ch) => new Array(Math.max(0, (e || 2) + 1 - String(t).length)).join(ch ? ch : '0') + t;
exports.fillChar = (ch, len) => new Array(len).join(ch);
exports.padStr = (s, width) => new Array(Math.max(0, width - s.length)).join(' ') + s;
exports.centerStr = (s, width) => {
    let w = (width - s.length) / 2 | 0;
    return (exports.fillChar(' ', w + 1) + s + exports.fillChar(' ', w + 1)).substr(0, width);
};
exports.centerPadStr = (str, width, leftStr, rightStr) => {
    let w = (width - str.length) / 2 | 0, getChar = (s) => (s && (s = s[0]), s || ' ');
    return (exports.fillChar(getChar(leftStr), w + 1) + str + exports.fillChar(getChar(rightStr), w + 1)).substr(0, width);
};
exports.formatNumber = (n, width) => exports.padStr(n + "", width);
exports.replaceAt = (str, index, replacement) => str.substr(0, index) + replacement + str.substr(index + replacement.length);
exports.range = (s, e) => Array.from('x'.repeat(e - s), (_, i) => s + i);
exports.selectMany = (input, selectListFn) => input.reduce((out, inx) => {
    out.push(...selectListFn(inx));
    return out;
}, new Array());
exports.matrix = (rows, cols, filler) => Array.from({ length: rows }, () => new Array(cols).fill(filler));
exports.enumConditional = (start, max, discovered) => {
    var nextNdx = (ndx) => ndx >= max ? 0 : ++ndx, curr = start < 0 || start > max ? -1 : start, first = true;
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
exports.isStr = (s) => typeof s === "string";
exports.css = (el, styles) => {
    if (exports.isStr(styles))
        return el.style[styles];
    for (let prop in styles)
        el.style[prop] = styles[prop];
    return el;
};
exports.attr = function (el, attrs) {
    if (exports.isStr(attrs))
        return el.getAttribute(attrs);
    for (let attr in attrs)
        el.setAttribute(attr, attrs[attr]);
    return el;
};
exports.tag = (tagName, id, nsAttrs) => (id && (nsAttrs.id = id),
    exports.attr(document.createElementNS(svgNS, tagName), nsAttrs));
exports.svg = (html) => {
    let template = document.createElementNS(svgNS, "template");
    template.innerHTML = html;
    return template.children[0];
};
exports.html = (html) => {
    let template = document.createElement("template");
    template.innerHTML = html;
    return template.content.firstChild;
};
