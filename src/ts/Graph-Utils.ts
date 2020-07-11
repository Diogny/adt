import { BaseGraph } from "./Graph";
import { range, toBool, formatNumber, padStr, matrix } from "./Utils";

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
		header = padStr(' ', width) + '|' + range(0, matrix.length).map(n => formatNumber(n, width)).join(' ');
	console.log(header);
	console.log(padStr('-', header.length + 1));
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
		header = padStr(' ', width) + '|' + range(0, g.size).map(n => formatNumber(n, width)).join(' ');
	console.log(header);
	console.log(padStr('-', header.length + 1));
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

export { transposeMatrix, toMatrix, fromJSON, displayMatrix, displayGraphMatrix }