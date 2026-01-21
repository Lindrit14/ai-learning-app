// src/utils/canvas/dataRenderer.js
// Data and Decision Boundary Visualization Renderer

import {
  CANVAS_CONFIG,
  DATA_RENDERING,
  TREE_COLORS,
  CLASS_COLORS,
  FONTS,
} from '../constants/decisionTreeConstants';

/**
 * Draw decision boundary predictions (colored background)
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Array} predictions - Array of {x, y, class} predictions
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 */
export function drawDecisionBoundary(ctx, predictions, width, height) {
  const { PREDICTION_BOX_HALF } = DATA_RENDERING;

  predictions.forEach(pred => {
    const x = pred.x * width;
    const y = pred.y * height;

    const color = CLASS_COLORS[pred.class].fillLight;
    ctx.fillStyle = color;
    ctx.fillRect(
      x - PREDICTION_BOX_HALF,
      y - PREDICTION_BOX_HALF,
      PREDICTION_BOX_HALF * 2,
      PREDICTION_BOX_HALF * 2
    );
  });
}

/**
 * Recursively draw decision split lines on the canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} node - Current tree node
 * @param {Object} bounds - Current bounds {xMin, xMax, yMin, yMax}
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 */
function drawSplitsRecursive(ctx, node, bounds, width, height) {
  if (!node || node.type === 'leaf') return;

  const { SPLIT_LINE_WIDTH, SPLIT_LINE_DASH } = DATA_RENDERING;
  const { SPLIT_LINE, SPLIT_LABEL } = TREE_COLORS;

  ctx.strokeStyle = SPLIT_LINE;
  ctx.lineWidth = SPLIT_LINE_WIDTH;
  ctx.setLineDash(SPLIT_LINE_DASH);

  if (node.feature === 'x') {
    // Vertical split line
    const x = node.threshold * width;
    ctx.beginPath();
    ctx.moveTo(x, bounds.yMin * height);
    ctx.lineTo(x, bounds.yMax * height);
    ctx.stroke();

    // Draw threshold label
    ctx.fillStyle = SPLIT_LABEL;
    ctx.font = FONTS.SPLIT_LABEL;
    ctx.fillText(`x ≤ ${node.threshold.toFixed(3)}`, x + 5, bounds.yMin * height + 15);

    // Recurse for children
    drawSplitsRecursive(ctx, node.left, { ...bounds, xMax: node.threshold }, width, height);
    drawSplitsRecursive(ctx, node.right, { ...bounds, xMin: node.threshold }, width, height);
  } else {
    // Horizontal split line
    const y = node.threshold * height;
    ctx.beginPath();
    ctx.moveTo(bounds.xMin * width, y);
    ctx.lineTo(bounds.xMax * width, y);
    ctx.stroke();

    // Draw threshold label
    ctx.fillStyle = SPLIT_LABEL;
    ctx.font = FONTS.SPLIT_LABEL;
    ctx.fillText(`y ≤ ${node.threshold.toFixed(3)}`, bounds.xMin * width + 5, y - 5);

    // Recurse for children
    drawSplitsRecursive(ctx, node.left, { ...bounds, yMax: node.threshold }, width, height);
    drawSplitsRecursive(ctx, node.right, { ...bounds, yMin: node.threshold }, width, height);
  }
}

/**
 * Draw split lines from decision tree
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} tree - Decision tree root node
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 */
export function drawSplitLines(ctx, tree, width, height) {
  if (!tree) return;

  const bounds = { xMin: 0, xMax: 1, yMin: 0, yMax: 1 };
  drawSplitsRecursive(ctx, tree, bounds, width, height);
  ctx.setLineDash([]); // Reset dash pattern
}

/**
 * Draw grid lines on canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 */
export function drawGrid(ctx, width, height) {
  const { GRID_SPACING } = DATA_RENDERING;
  const { GRID } = TREE_COLORS;

  ctx.strokeStyle = GRID;
  ctx.lineWidth = 1;

  // Vertical lines
  for (let i = 0; i < width; i += GRID_SPACING) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, height);
    ctx.stroke();
  }

  // Horizontal lines
  for (let i = 0; i < height; i += GRID_SPACING) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(width, i);
    ctx.stroke();
  }
}

/**
 * Draw data points on canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Array} dataPoints - Array of {x, y, class} data points
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 */
export function drawDataPoints(ctx, dataPoints, width, height) {
  const { POINT_RADIUS, POINT_STROKE_WIDTH } = DATA_RENDERING;

  dataPoints.forEach(point => {
    const x = point.x * width;
    const y = point.y * height;

    ctx.beginPath();
    ctx.arc(x, y, POINT_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = CLASS_COLORS[point.class].fill;
    ctx.fill();
    ctx.strokeStyle = CLASS_COLORS[point.class].stroke;
    ctx.lineWidth = POINT_STROKE_WIDTH;
    ctx.stroke();
  });
}

/**
 * Main function to render data canvas with all elements
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} options - Rendering options
 */
export function renderDataCanvas(ctx, options = {}) {
  const {
    dataPoints = [],
    predictions = [],
    tree = null,
    showSplits = true,
    canvasWidth = CANVAS_CONFIG.DATA_WIDTH,
    canvasHeight = CANVAS_CONFIG.DATA_HEIGHT,
  } = options;

  if (!ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // 1. Draw decision boundary (background)
  if (predictions.length > 0 && showSplits) {
    drawDecisionBoundary(ctx, predictions, canvasWidth, canvasHeight);
  }

  // 2. Draw split lines if tree exists
  if (tree && showSplits) {
    drawSplitLines(ctx, tree, canvasWidth, canvasHeight);
  }

  // 3. Draw grid
  drawGrid(ctx, canvasWidth, canvasHeight);

  // 4. Draw data points (on top)
  drawDataPoints(ctx, dataPoints, canvasWidth, canvasHeight);
}
