"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ready = exports.gEId = exports.qSA = exports.qS = exports.rEL = exports.aEL = exports.html = exports.svg = exports.tag = exports.attr = exports.css = exports.isStr = exports.enumConditional = exports.matrix = exports.selectMany = exports.range = exports.replaceAt = exports.formatNumber = exports.centerPadStr = exports.centerStr = exports.padStr = exports.fillChar = exports.pad = exports.toBool = void 0;
var tslib_1 = require("tslib");
var a = {
    'true': true,
    'false': false,
    'undefined': false,
    'null': false,
    '1': true,
    '0': false
};
var svgNS = "http://www.w3.org/2000/svg";
exports.toBool = function (val) { return a[val]; };
//used for string & numbers
exports.pad = function (t, e, ch) {
    return new Array(Math.max(0, (e || 2) + 1 - String(t).length)).join(ch ? ch : '0') + t;
};
exports.fillChar = function (ch, len) { return new Array(len).join(ch); };
exports.padStr = function (s, width) { return new Array(Math.max(0, width - s.length)).join(' ') + s; };
exports.centerStr = function (s, width) {
    var w = (width - s.length) / 2 | 0;
    return (exports.fillChar(' ', w + 1) + s + exports.fillChar(' ', w + 1)).substr(0, width);
};
exports.centerPadStr = function (str, width, leftStr, rightStr) {
    var w = (width - str.length) / 2 | 0, getChar = function (s) { return (s && (s = s[0]), s || ' '); };
    return (exports.fillChar(getChar(leftStr), w + 1) + str + exports.fillChar(getChar(rightStr), w + 1)).substr(0, width);
};
exports.formatNumber = function (n, width) { return exports.padStr(n + "", width); };
exports.replaceAt = function (str, index, replacement) {
    return str.substr(0, index) + replacement + str.substr(index + replacement.length);
};
exports.range = function (s, e) { return Array.from('x'.repeat(e - s), function (_, i) { return s + i; }); };
exports.selectMany = function (input, selectListFn) {
    return input.reduce(function (out, inx) {
        out.push.apply(out, tslib_1.__spread(selectListFn(inx)));
        return out;
    }, new Array());
};
exports.matrix = function (rows, cols, filler) {
    return Array.from({ length: rows }, function () { return new Array(cols).fill(filler); });
};
exports.enumConditional = function (start, max, discovered) {
    var nextNdx = function (ndx) { return ndx >= max ? 0 : ++ndx; }, curr = start < 0 || start > max ? -1 : start, first = true;
    return {
        current: function () { return curr; },
        next: function () {
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
exports.isStr = function (s) { return typeof s === "string"; };
exports.css = function (el, styles) {
    if (exports.isStr(styles))
        return el.style[styles];
    for (var prop in styles)
        el.style[prop] = styles[prop];
    return el;
};
exports.attr = function (el, attrs) {
    if (exports.isStr(attrs))
        return el.getAttribute(attrs);
    for (var attr_1 in attrs)
        el.setAttribute(attr_1, attrs[attr_1]);
    return el;
};
exports.tag = function (tagName, id, nsAttrs) { return (id && (nsAttrs.id = id),
    exports.attr(document.createElementNS(svgNS, tagName), nsAttrs)); };
exports.svg = function (html) {
    var template = document.createElementNS(svgNS, "template");
    template.innerHTML = html;
    return template.children[0];
};
exports.html = function (html) {
    var template = document.createElement("template");
    template.innerHTML = html;
    return template.content.firstChild;
};
exports.aEL = function (el, eventName, fn, b) { return el.addEventListener(eventName, fn, b); };
exports.rEL = function (el, eventName, fn, b) { return el.removeEventListener(eventName, fn, b); };
exports.qS = function (s) { return document.querySelector(s); };
exports.qSA = function (s) { return document.querySelectorAll(s); };
exports.gEId = function (id) { return document.getElementById(id); };
exports.ready = function (fn) {
    if (typeof fn != "function") {
        return !1;
    }
    if (document.readyState != "loading")
        return (fn(), !0);
    else if (document["addEventListener"])
        exports.aEL(document, "DOMContentLoaded", fn, false);
    else
        document.attachEvent("onreadystatechange", function () {
            if (document.readyState == "complete")
                fn();
        });
    return !0;
};
//# sourceMappingURL=Utils.js.map