import { RedBlackTree, RedBlackTreeNode, RedBlackEnum } from "../lib/RedBlackTree";
import { IVisualBTreeConfig, BTreeVisualizer } from "./tree-utils";
import { attr, qS, aEL, html } from "src/lib/Utils";

interface SVGBTreeNode {
	x: number,
	y: number,
	r: number,
	svg: SVGGElement,
	value: number,
}

let
	ratio = window.screen.width / window.screen.height,
	svg = <SVGSVGElement>document.querySelector('svg'),
	vbinfo = <HTMLLabelElement>qS("#canvas-info"),
	node = <HTMLInputElement>qS("#node-value"),
	cons = <HTMLDivElement>qS("#cons-out>div:nth-of-type(2)"),
	treeSize = <HTMLLabelElement>qS("#tree-size"),
	leftpad = 20,
	toppad = 40,
	xstart = leftpad,
	ystart = toppad,
	rowHeight = ystart,
	viewbox = setViewBox(0, 0, svg.clientWidth * ratio | 0, svg.clientHeight * ratio | 0),
	options: IVisualBTreeConfig<SVGBTreeNode> = <any>void 0,
	svgRowItems: SVGGElement[] = [],
	maxYcaption = Number.MIN_SAFE_INTEGER;

clearSVG(createTree());

aEL(qS("#clear-tree"), "click", () => {
	clearSVG(createTree())
}, false);

aEL(qS("#load-sample"), "click", (e: MouseEvent) => {
	clearSVG(getTreeSample());
	addSVGTree("sample tree")
}, false);

aEL(qS("#insert"), "click", (e: MouseEvent) => {
	let
		nodeValue = getNodeValue(),
		value = parseFloat(nodeValue);
	if (isNaN(value)) {
		logMsg(`invalid number: ${nodeValue}`)
	} else {
		if (options.tree.insert(createNode(value))) {
			addSVGTree(`added: ${value}`)
		} else {
			logMsg(`could not insert: ${nodeValue}`)
		}
	}
}, false);

aEL(qS("#delete"), "click", (e: MouseEvent) => {
	let
		nodeValue = getNodeValue(),
		value = parseFloat(nodeValue);
	if (isNaN(value)) {
		logMsg(`invalid number: ${nodeValue}`)
	} else {
		if (options.tree.delete(createNode(value))) {
			addSVGTree(`deleted: ${value}`)
		} else {
			logMsg(`could not insert: ${nodeValue}`)
		}
	}
}, false);

function setViewBox(x: number, y: number, w: number, h: number) {
	attr(svg, { "viewBox": `${x} ${y} ${w} ${h}` });
	vbinfo.innerText = `x: ${x}, y: ${y}, width: ${w}, height: ${h}`;
	return {
		x: x,
		y: y,
		width: w,
		height: h
	}
}

function createTree(): RedBlackTree<SVGBTreeNode> {
	return new RedBlackTree<SVGBTreeNode>((a: SVGBTreeNode, b: SVGBTreeNode) => {
		if (a.value == b.value)
			return 0
		else if (a.value > b.value)
			return 1
		else
			return -1
	})
}

function createNode(value: number): SVGBTreeNode {
	return <SVGBTreeNode>{
		value: value
	}
}

function getTreeSample(): RedBlackTree<SVGBTreeNode> {
	let
		t = createTree(),
		array = [7, 3, 18, 10, 22, 8, 11, 26, 2, 6, 13].map(v => createNode(v));
	t.insertRange(array);
	return t
}

function getNodeValue(): string {
	let
		nodeValue = node.value;
	node.value = "";
	return nodeValue;
}

function getTreeSizeLabel(): string {
	return `Size: ${options.tree.size}`
}

function clearSVG(tree: RedBlackTree<SVGBTreeNode>) {
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
		nodeClass: (node: RedBlackTreeNode<SVGBTreeNode>) => RedBlackEnum[node.color],
		nodeValue: (node: SVGBTreeNode) => String(node.value)
	};
	cons.innerHTML = "";
	treeSize.innerText = getTreeSizeLabel();
	svgRowItems = [];
}

function logMsg(msg: string) {
	cons.appendChild(html(`<div>${msg}</div>`))
}

function addSVGTree(caption: string) {
	treeSize.innerText = getTreeSizeLabel();
	options.caption = caption;
	options.x = xstart;
	options.y = ystart;
	let
		svgTree = BTreeVisualizer(options);
	rowHeight = Math.max(rowHeight, svgTree.height);
	if (svgTree.width + xstart > viewbox.width) {
		moveToNextRow();
		svgTree.svg.setAttribute("transform", `translate(${xstart} ${ystart})`);
		svgRowItems = [svgTree.svg];
		maxYcaption = svgTree.height;
	} else {
		svgRowItems.push(svgTree.svg);
		maxYcaption = Math.max(maxYcaption, svgTree.height);
		//adjust g>text
		svgRowItems.forEach((svg: SVGGElement) => {
			let
				text = svg.querySelector("text.caption");
			attr(text, {
				y: maxYcaption
			})
		})
	}
	xstart += leftpad * 2 + svgTree.width;
}

function moveToNextRow() {
	xstart = leftpad * 2;
	ystart += rowHeight + toppad * 2;
	rowHeight = 0;
}