import { BTree, BTreeNode } from "../lib/BTree";
import { tag, attr } from "../lib/Utils";

const WIDTH = 80;
const HEIGHT = 120;
const FONT_SIZE = 40;

export function visulizeBTree<T>(tree: BTree<T>, svg: SVGSVGElement, caption: string, x: number, y: number,
	nodeClass?: (node: BTreeNode<T>) => string): { svg: SVGGElement, width: number, height: number } {
	let
		depth = 0,
		width = 0,
		height = 0,
		svgTree = <SVGGElement>tag("g", "", {
			class: "svg-tree",
			transform: `translate(${x} ${y})`
		}),
		svgCaption = <SVGTextElement>tag("text", "", {
			"font-size": FONT_SIZE,
		});
	if (tree) {
		svg.appendChild(svgTree);
		depth = tree.depth();
		width = depth == 1 ? 1 : Math.pow(2, depth - 1);
		width = width * WIDTH;
		height = visualizeNode(tree.root, svgTree, 0, width, 0, nodeClass);
		svgCaption.innerHTML = caption;
		svgTree.appendChild(svgCaption);
		let
			box = svgCaption.getBBox();
		attr(svgCaption, {
			x: Math.max(0, (width / 2 - box.width / 2) | 0),
			y: height
		});
		box = svgTree.getBBox();
		width = box.width;
		height = box.height;
	}

	return {
		svg: svgTree,
		width: width,
		height: height
	}
}

function visualizeNode<T>(node: BTreeNode<T>, svg: SVGGElement, minx: number, maxx: number, y: number,
	nodeClass?: (node: BTreeNode<T>) => string): number {

	if (node == undefined)
		return 0;
	let
		halfWidth = WIDTH / 2 | 0,
		centerX = minx + (maxx - minx) / 2 | 0,
		centerY = y + halfWidth,
		circleRadius = WIDTH / 2 | 0,
		cl = nodeClass ? nodeClass(node) : "",
		nextYStart = y + HEIGHT,
		svgNode = tag("g", "", {
			class: "svg-node " + cl,
			transform: `translate(${centerX - circleRadius} ${centerY - circleRadius})`
		}),
		svgCircle = <SVGCircleElement>tag("circle", "", {
			cx: circleRadius,
			cy: circleRadius,
			r: circleRadius
		}),
		svgText = <SVGTextElement>tag("text", "", {
			"font-size": FONT_SIZE,
			class: "no-select"
		});

	if (!node.isLeaf) {
		let
			childrenY = nextYStart + halfWidth,
			childrenX = 0;
		if (node.left) {
			childrenX = minx + (centerX - minx) / 2 | 0;
			svg.appendChild(<SVGLineElement>tag("line", "", lineAttrs(centerX, centerY, childrenX, childrenY, circleRadius)))
		}
		if (node.right) {
			childrenX = centerX + (maxx - centerX) / 2 | 0;
			svg.appendChild(<SVGLineElement>tag("line", "", lineAttrs(centerX, centerY, childrenX, childrenY, circleRadius)))
		}
	}

	svgText.innerHTML = String(node.value);
	svgNode.appendChild(svgCircle);
	svgNode.appendChild(svgText);

	svg.appendChild(svgNode);
	let
		box = svgText.getBBox()
	attr(svgText, {
		x: circleRadius - box.width / 2 | 0,
		y: circleRadius + box.height / 4 | 0
	});

	return Math.max(
		nextYStart,
		visualizeNode(<BTreeNode<T>>node.left, svg, minx, centerX, nextYStart, nodeClass),
		visualizeNode(<BTreeNode<T>>node.right, svg, centerX, maxx, nextYStart, nodeClass));
}

function lineAttrs(x1: number, y1: number, x2: number, y2: number, r: number) {
	let
		angle = Math.atan2(y1 - y2, x1 - x2);
	x1 = (x1 - r * Math.cos(angle)) | 0;
	y1 = (y1 - r * Math.sin(angle)) | 0;
	x2 = (x2 + r * Math.cos(angle)) | 0;
	y2 = (y2 + r * Math.sin(angle)) | 0;
	return {
		x1: x1,
		y1: y1,
		x2: x2,
		y2: y2,
		class: "svg-line"
	}
}