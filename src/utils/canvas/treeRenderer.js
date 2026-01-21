// src/utils/canvas/treeRenderer.js
// Decision Tree Visualization Renderer

import {
  CANVAS_CONFIG,
  TREE_RENDERING,
  TREE_COLORS,
  CLASS_COLORS,
  FONTS,
} from '../constants/decisionTreeConstants';

/**
 * Calculate positions for all nodes in the tree
 * @param {Object} tree - Decision tree root node
 * @param {number} canvasWidth - Width of canvas
 * @param {number} canvasHeight - Height of canvas
 * @returns {Array} Array of {node, x, y, depth} positions
 */
export function calculateNodePositions(tree, canvasWidth = CANVAS_CONFIG.TREE_WIDTH, canvasHeight = CANVAS_CONFIG.TREE_HEIGHT) {
  if (!tree) return [];

  const { NODE_RADIUS, LEVEL_HEIGHT, START_Y } = TREE_RENDERING;

  // Get tree architecture
  const architecture = [];
  const getArchitecture = (node, depth = 0) => {
    if (!architecture[depth]) architecture[depth] = 0;
    architecture[depth]++;
    if (node.type === 'internal') {
      if (node.left) getArchitecture(node.left, depth + 1);
      if (node.right) getArchitecture(node.right, depth + 1);
    }
  };
  getArchitecture(tree);

  // Recursive function to calculate positions
  const calculatePos = (node, depth = 0, xMin = 0, xMax = canvasWidth) => {
    if (!node) return [];

    const x = (xMin + xMax) / 2;
    const y = START_Y + depth * LEVEL_HEIGHT;

    const positions = [{ node, x, y, depth }];

    if (node.type === 'internal') {
      const mid = (xMin + xMax) / 2;
      positions.push(...calculatePos(node.left, depth + 1, xMin, mid));
      positions.push(...calculatePos(node.right, depth + 1, mid, xMax));
    }

    return positions;
  };

  return calculatePos(tree);
}

/**
 * Draw connection lines between parent and child nodes
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Array} positions - Node positions from calculateNodePositions
 */
export function drawTreeConnections(ctx, positions) {
  const { NODE_RADIUS, CONNECTION_WIDTH } = TREE_RENDERING;
  const { CONNECTION, BRANCH_LABEL_TRUE, BRANCH_LABEL_FALSE } = TREE_COLORS;

  ctx.strokeStyle = CONNECTION;
  ctx.lineWidth = CONNECTION_WIDTH;
  ctx.font = FONTS.BRANCH_LABEL;

  positions.forEach(pos => {
    if (pos.node.type === 'internal') {
      const leftChild = positions.find(p => p.node === pos.node.left);
      const rightChild = positions.find(p => p.node === pos.node.right);

      if (leftChild) {
        // Draw line
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y + NODE_RADIUS);
        ctx.lineTo(leftChild.x, leftChild.y - NODE_RADIUS);
        ctx.stroke();

        // Label for left branch (True)
        ctx.fillStyle = BRANCH_LABEL_TRUE;
        ctx.fillText('True', (pos.x + leftChild.x) / 2 - 15, (pos.y + leftChild.y) / 2);
      }

      if (rightChild) {
        // Draw line
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y + NODE_RADIUS);
        ctx.lineTo(rightChild.x, rightChild.y - NODE_RADIUS);
        ctx.stroke();

        // Label for right branch (False)
        ctx.fillStyle = BRANCH_LABEL_FALSE;
        ctx.fillText('False', (pos.x + rightChild.x) / 2 + 5, (pos.y + rightChild.y) / 2);
      }
    }
  });
}

/**
 * Draw individual tree nodes (circles with labels)
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Array} positions - Node positions
 * @param {Object} selectedNode - Currently selected node (optional)
 * @param {boolean} showMetrics - Whether to show impurity metrics
 * @param {string} criterion - 'gini' or 'entropy'
 */
export function drawTreeNodes(ctx, positions, selectedNode = null, showMetrics = true, criterion = 'gini') {
  const { NODE_RADIUS, SELECTED_BORDER_WIDTH, DEFAULT_BORDER_WIDTH } = TREE_RENDERING;
  const {
    NODE_DEFAULT,
    NODE_SELECTED,
    NODE_BORDER_DEFAULT,
    NODE_BORDER_SELECTED,
    TEXT_PRIMARY,
  } = TREE_COLORS;

  positions.forEach(pos => {
    const isSelected = selectedNode === pos.node;

    // Draw node circle
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, NODE_RADIUS, 0, Math.PI * 2);

    // Fill based on node type
    if (pos.node.type === 'leaf') {
      ctx.fillStyle = CLASS_COLORS[pos.node.class].background;
    } else {
      ctx.fillStyle = isSelected ? NODE_SELECTED : NODE_DEFAULT;
    }
    ctx.fill();

    // Border
    ctx.strokeStyle = isSelected ? NODE_BORDER_SELECTED : NODE_BORDER_DEFAULT;
    ctx.lineWidth = isSelected ? SELECTED_BORDER_WIDTH : DEFAULT_BORDER_WIDTH;
    ctx.stroke();

    // Draw node text
    ctx.fillStyle = TEXT_PRIMARY;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (pos.node.type === 'leaf') {
      // Leaf node: show class and sample count
      ctx.font = FONTS.NODE_LABEL;
      ctx.fillText(`Class ${pos.node.class}`, pos.x, pos.y - 5);
      ctx.font = FONTS.NODE_SUBLABEL;
      ctx.fillText(`n=${pos.node.samples}`, pos.x, pos.y + 8);
    } else {
      // Internal node: show split condition
      const featureName = pos.node.feature === 'x' ? 'X' : 'Y';
      ctx.font = FONTS.NODE_LABEL;
      ctx.fillText(`${featureName} ≤ ${pos.node.threshold.toFixed(2)}`, pos.x, pos.y - 8);
      ctx.font = FONTS.NODE_SUBLABEL;
      ctx.fillText(`n=${pos.node.samples}`, pos.x, pos.y + 5);

      // Show impurity if enabled
      if (showMetrics) {
        const impurityName = criterion === 'gini' ? 'gini' : 'entropy';
        ctx.fillText(`${impurityName}=${pos.node.impurity.toFixed(3)}`, pos.x, pos.y + 15);
      }
    }
  });
}

/**
 * Main function to render the entire decision tree
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} tree - Decision tree root node
 * @param {Object} options - Rendering options
 */
export function renderTree(ctx, tree, options = {}) {
  const {
    canvasWidth = CANVAS_CONFIG.TREE_WIDTH,
    canvasHeight = CANVAS_CONFIG.TREE_HEIGHT,
    selectedNode = null,
    showMetrics = true,
    criterion = 'gini',
  } = options;

  if (!ctx || !tree) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Calculate all node positions
  const positions = calculateNodePositions(tree, canvasWidth, canvasHeight);

  // Draw connections first (so they're behind nodes)
  drawTreeConnections(ctx, positions);

  // Draw nodes on top
  drawTreeNodes(ctx, positions, selectedNode, showMetrics, criterion);
}
