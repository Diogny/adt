import { BaseGraph } from "./Graph";
import { range, toBool, formatNumber, fillChar, matrix, centerStr, centerPadStr, replaceAt } from "./Utils";
import { BaseTree, ValueNode } from "./Tree";

function toMatrix(g: BaseGraph): number[][] {
	let
		array = matrix(g.size, g.size, 0);
	//row v and column w
	g.edges().forEach((edge) => array[edge.v][edge.w] = 1)
	return array
};

function transposeMatrix(g: BaseGraph): number[][] {
	let
		array = matrix(g.size, g.size, 0);
	//row v and column w
	g.edges().forEach((edge) => array[edge.w][edge.v] = 1)
	return array
}

//this displays numbers
function displayMatrix(matrix: number[][]) {
	let
		width = String(matrix.length).length + 1;
	let
		header = fillChar(' ', width) + '|' + range(0, matrix.length).map(n => formatNumber(n, width)).join(' ');
	console.log(header);
	console.log(fillChar('-', header.length + 1));
	range(0, matrix.length).forEach(v => {
		console.log(formatNumber(v, width) + '|' + range(0, matrix.length).map(w => formatNumber(matrix[v][w], width)).join(' '))
	})
}

//this displays labels
function displayGraphMatrix(g: BaseGraph) {
	let
		matrix = toMatrix(g),
		width = Math.max.apply(null, g.nodeList().map(n => n.label().length)) + 1;
	let
		header = fillChar(' ', width) + '|' + range(0, g.size).map(n => formatNumber(n, width)).join(' ');
	console.log(header);
	console.log(fillChar('-', header.length + 1));
	range(0, g.size).forEach(v => {
		console.log(formatNumber(v, width) + '|' + range(0, g.size).map(w => formatNumber(matrix[v][w], width)).join(' '))
	})
}

function fromJSON(content: { [x: string]: any }): BaseGraph {
	let
		name = content["name"],
		directed = toBool(content["directed"]),
		weighted = toBool(content["weighted"]),
		labeled = !!content["labels"],
		labels = (labeled ? Array.from(content["labels"]) : undefined) as string[],
		labelMap = new Map<string, number>(),
		nodes = labeled ? 0 : parseInt(content["nodes"]),
		edges = Array.from(content["edges"]) as { from: number | string, to: number | string, w?: number }[],
		getNode = (nodeOrLabel: number | string): { node: number, label?: string } => {
			if (labeled) {
				let
					n = labelMap.get(<string>nodeOrLabel);
				return {
					node: n != undefined ? <number>n : -1,
					label: <string>nodeOrLabel
				}
			} else
				return { node: g.hasNode(<number>nodeOrLabel) ? <number>nodeOrLabel : -1 }
		},
		getEdge = (e: { from: number | string, to: number | string, w?: number }): {
			v: { node: number, label?: string },
			w: { node: number, label?: string },
			weight?: number
		} => ({
			v: getNode(e.from),
			w: getNode(e.to),
			weight: e.w
		}),
		g = BaseGraph.create(name, directed, weighted, labeled);

	if (labeled) {
		if (!labels)
			throw `invalid graph labels`
		labels.forEach((label: string, node: number) => {
			g.addNode(label);
			labelMap.set(label, node)
		})
	} else {
		range(0, nodes).forEach(n => g.addNode())
	}

	if (!edges)
		throw `invalid edges`;
	edges.forEach((e) => {
		let
			edge = getEdge(e);
		if (edge.v.node == -1 || edge.w.node == -1)
			throw `invalid edge: ${e}`;
		if (weighted) {
			!edge.weight && (edge.weight = 0);
			g.connect(edge.v.node, edge.w.node, edge.weight)
		} else
			g.connect(edge.v.node, edge.w.node)
	});
	return g
}

function visulizeTree<T>(tree: BaseTree<T>) {
	let
		columns = 0,
		map = new Map<ValueNode<T>, number>(),
		maxLabelWidth = 0,
		cons: string[][] = [],
		newRow = (): string[] => new Array(columns).fill(fillChar(' ', maxLabelWidth + 1));

	if (!tree || !tree.root) {
		console.log('no tree root provided');
		return
	}
	tree.postOrder(tree.root, (node => {
		maxLabelWidth = Math.max(maxLabelWidth, String(node.value).length);
		let
			w = node.children.map(n => <number>map.get(n)).reduce((acc, val) => acc + val, 0);
		w = w || 2;
		map.set(node, w)
	}));
	!(maxLabelWidth & 1) && (maxLabelWidth++);
	columns = <number>map.get(tree.root);

	visulizeNode<T>(tree.root, 0, 0, columns - 1, cons, newRow, map, maxLabelWidth);
	cons.forEach(row => {
		console.log(`${row.join('')}`);
	})
}

function visulizeNode<T>(node: ValueNode<T>, row: number, mincol: number, maxcol: number, cons: string[][],
	newRow: () => string[], map: Map<ValueNode<T>, number>, maxLabelWidth: number) {
	let
		noderow = cons[row * 2],
		joinsrow = cons[row * 2 + 1],
		colStart = mincol,
		columns: number[] = [],
		getIndex = (mmin: number, mmax: number) => (mmin + (mmax - mmin + 1) / 2 | 0),
		drawLine = (startcol: number, endcol: number) => {
			for (let i = startcol + 1; i < endcol; i++) {
				joinsrow[i] = fillChar('─', maxLabelWidth + 1);
			}
		},
		rootIndex = getIndex(mincol, maxcol);
	if (!noderow) {
		cons.push(noderow = newRow());
		cons.push(joinsrow = newRow())
	}
	noderow[rootIndex] = centerStr(String(node.value), maxLabelWidth);
	node.children.forEach((child) => {
		let
			rootWidth = <number>map.get(child);
		columns.push(getIndex(colStart, colStart + rootWidth - 1));
		visulizeNode<T>(child, row + 1, colStart, colStart + rootWidth - 1, cons, newRow, map, maxLabelWidth)
		colStart += rootWidth;
	});
	if (columns.length) {
		if (columns.length == 1)
			joinsrow[<number>columns.pop()] = centerPadStr('│', maxLabelWidth, ' ', ' ')
		else {
			let startcol = 0,
				endcol = <number>columns.pop();
			joinsrow[endcol] = centerPadStr('┐', maxLabelWidth, '─', ' ');
			while (columns.length > 1) {
				joinsrow[startcol = <number>columns.pop()] = centerPadStr('┬', maxLabelWidth, '─', '─');
				drawLine(startcol, endcol);
				endcol = startcol
			}
			joinsrow[startcol = <number>columns.pop()] = centerPadStr('┌', maxLabelWidth, ' ', '─');
			drawLine(startcol, endcol);
			let
				rootStr = joinsrow[rootIndex],
				index = rootStr.length / 2 | 0;
			joinsrow[rootIndex] = rootStr[index] == '─'
				? replaceAt(rootStr, index, '┴') : replaceAt(rootStr, index, '┼');
		}
	}
}

export const searchTree = <T>(root: ValueNode<T>, fn: (node: ValueNode<T>, callback: (n: ValueNode<T>) => void) => number): T[] => {
	let
		array = new Array<T>(),
		nodeValue = (node: ValueNode<T>) => array.push(node.value);
	fn(root, nodeValue);
	return array
}

export {
	transposeMatrix,
	toMatrix,
	fromJSON,
	displayMatrix,
	displayGraphMatrix,
	visulizeTree
}