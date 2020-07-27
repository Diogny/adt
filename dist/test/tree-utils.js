"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BTreeVisualizer = void 0;
var Utils_1 = require("../lib/Utils");
;
function BTreeVisualizer(conf) {
    var depth = 0, width = 0, height = 0, svgTree = Utils_1.tag("g", "", {
        class: "svg-tree",
        transform: "translate(" + (conf.x | 0) + " " + (conf.y | 0) + ")"
    }), svgCaption = Utils_1.tag("text", "", {
        class: "caption",
        "font-size": conf.FONT_SIZE,
    });
    if (conf && conf.tree && conf.svg) {
        conf.svg.appendChild(svgTree);
        depth = conf.tree.depth();
        width = depth == 1 ? 1 : Math.pow(2, depth - 1);
        width = width * conf.WIDTH;
        height = visualizeNode(conf.tree.root, svgTree, 0, width, 0, conf);
        svgCaption.innerHTML = conf.caption || "[caption]";
        svgTree.appendChild(svgCaption);
        var box = svgCaption.getBBox();
        Utils_1.attr(svgCaption, {
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
    };
}
exports.BTreeVisualizer = BTreeVisualizer;
function visualizeNode(node, svg, minx, maxx, y, conf) {
    if (node == undefined)
        return 0;
    var halfWidth = conf.WIDTH / 2 | 0, centerX = minx + (maxx - minx) / 2 | 0, centerY = y + halfWidth, circleRadius = conf.WIDTH / 2 | 0, cl = conf.nodeClass ? conf.nodeClass(node) : "", nextYStart = y + conf.HEIGHT, svgNodeX = centerX - circleRadius, svgNodeY = centerY - circleRadius, svgNode = Utils_1.tag("g", "", {
        class: "svg-node " + cl,
        transform: "translate(" + svgNodeX + " " + svgNodeY + ")"
    }), svgCircle = Utils_1.tag("circle", "", {
        cx: circleRadius,
        cy: circleRadius,
        r: circleRadius
    }), svgText = Utils_1.tag("text", "", {
        "font-size": conf.FONT_SIZE,
        class: "no-select"
    });
    svgText.innerHTML = conf.nodeValue(node.value);
    svgNode.appendChild(svgCircle);
    svgNode.appendChild(svgText);
    svg.appendChild(svgNode);
    if (!node.isLeaf) {
        var childrenY = nextYStart + halfWidth, childrenX = 0;
        if (node.left) {
            childrenX = minx + (centerX - minx) / 2 | 0;
            svg.appendChild(Utils_1.tag("line", "", lineAttrs(centerX, centerY, childrenX, childrenY, circleRadius)));
        }
        if (node.right) {
            childrenX = centerX + (maxx - centerX) / 2 | 0;
            svg.appendChild(Utils_1.tag("line", "", lineAttrs(centerX, centerY, childrenX, childrenY, circleRadius)));
        }
    }
    var box = svgText.getBBox();
    Utils_1.attr(svgText, {
        x: circleRadius - box.width / 2 | 0,
        y: circleRadius + box.height / 4 | 0
    });
    return Math.max(nextYStart, visualizeNode(node.left, svg, minx, centerX, nextYStart, conf), visualizeNode(node.right, svg, centerX, maxx, nextYStart, conf));
}
function lineAttrs(x1, y1, x2, y2, r) {
    var angle = Math.atan2(y1 - y2, x1 - x2);
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
    };
}
//# sourceMappingURL=tree-utils.js.map