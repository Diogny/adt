import { RedBlackTree, RedBlackEnum } from "../lib/RedBlackTree";
import { BTreeVisualizer } from "./tree-utils";
import { aEL, attr, html, qS } from "dabbjs/dist/lib/dom";
let ratio = window.screen.width / window.screen.height, svg = document.querySelector('svg'), vbinfo = qS("#canvas-info"), node = qS("#node-value"), cons = qS("#cons-out>div:nth-of-type(2)"), treeSize = qS("#tree-size"), leftpad = 20, toppad = 40, xstart = leftpad, ystart = toppad, rowHeight = ystart, viewbox = setViewBox(0, 0, svg.clientWidth * ratio | 0, svg.clientHeight * ratio | 0), options = void 0, svgRowItems = [], maxYcaption = Number.MIN_SAFE_INTEGER;
clearSVG(createTree());
aEL(qS("#clear-tree"), "click", () => {
    clearSVG(createTree());
}, false);
aEL(qS("#load-sample"), "click", (e) => {
    clearSVG(getTreeSample());
    addSVGTree("sample tree");
}, false);
aEL(qS("#insert"), "click", (e) => {
    let nodeValue = getNodeValue(), value = parseFloat(nodeValue);
    if (isNaN(value)) {
        logMsg(`invalid number: ${nodeValue}`);
    }
    else {
        if (options.tree.insert(createNode(value))) {
            addSVGTree(`added: ${value}`);
        }
        else {
            logMsg(`could not insert: ${nodeValue}`);
        }
    }
}, false);
aEL(qS("#delete"), "click", (e) => {
    let nodeValue = getNodeValue(), value = parseFloat(nodeValue);
    if (isNaN(value)) {
        logMsg(`invalid number: ${nodeValue}`);
    }
    else {
        if (options.tree.delete(createNode(value))) {
            addSVGTree(`deleted: ${value}`);
        }
        else {
            logMsg(`could not insert: ${nodeValue}`);
        }
    }
}, false);
function setViewBox(x, y, w, h) {
    attr(svg, { "viewBox": `${x} ${y} ${w} ${h}` });
    vbinfo.innerText = `x: ${x}, y: ${y}, width: ${w}, height: ${h}`;
    return {
        x: x,
        y: y,
        width: w,
        height: h
    };
}
function createTree() {
    return new RedBlackTree((a, b) => {
        if (a.value == b.value)
            return 0;
        else if (a.value > b.value)
            return 1;
        else
            return -1;
    });
}
function createNode(value) {
    return {
        value: value
    };
}
function getTreeSample() {
    let t = createTree(), array = [7, 3, 18, 10, 22, 8, 11, 26, 2, 6, 13].map(v => createNode(v));
    t.insertRange(array);
    return t;
}
function getNodeValue() {
    let nodeValue = node.value;
    node.value = "";
    return nodeValue;
}
function getTreeSizeLabel() {
    return `Size: ${options.tree.size}`;
}
function clearSVG(tree) {
    svg.innerHTML = "";
    leftpad = 20;
    toppad = 40;
    xstart = leftpad;
    ystart = toppad;
    rowHeight = ystart;
    options = {
        svg: svg,
        tree: tree,
        caption: "[caption]",
        WIDTH: 40,
        HEIGHT: 60,
        FONT_SIZE: 20,
        x: 0,
        y: 0,
        nodeClass: (node) => RedBlackEnum[node.color],
        nodeValue: (node) => String(node.value)
    };
    cons.innerHTML = "";
    treeSize.innerText = getTreeSizeLabel();
    svgRowItems = [];
}
function logMsg(msg) {
    cons.appendChild(html(`<div>${msg}</div>`));
}
function addSVGTree(caption) {
    treeSize.innerText = getTreeSizeLabel();
    options.caption = caption;
    options.x = xstart;
    options.y = ystart;
    let svgTree = BTreeVisualizer(options);
    rowHeight = Math.max(rowHeight, svgTree.height);
    if (svgTree.width + xstart > viewbox.width) {
        moveToNextRow();
        svgTree.svg.setAttribute("transform", `translate(${xstart} ${ystart})`);
        svgRowItems = [svgTree.svg];
        maxYcaption = svgTree.height;
    }
    else {
        svgRowItems.push(svgTree.svg);
        maxYcaption = Math.max(maxYcaption, svgTree.height);
        //adjust g>text
        svgRowItems.forEach((svg) => {
            let text = svg.querySelector("text.caption");
            attr(text, {
                y: maxYcaption
            });
        });
    }
    xstart += leftpad * 2 + svgTree.width;
}
function moveToNextRow() {
    xstart = leftpad * 2;
    ystart += rowHeight + toppad * 2;
    rowHeight = 0;
}
