// src/hooks/useTreeCanvas.js
// Custom hook for managing tree visualization canvas

import { useEffect } from 'react';
import { renderTree } from '../utils/canvas/treeRenderer';
import { CANVAS_CONFIG } from '../utils/constants/decisionTreeConstants';

/**
 * Custom hook to handle tree canvas rendering
 * @param {Object} tree - Decision tree to render
 * @param {Object} canvasRef - React ref to canvas element
 * @param {Object} options - Rendering options
 */
export function useTreeCanvas(tree, canvasRef, options = {}) {
  const {
    selectedNode = null,
    showMetrics = true,
    criterion = 'gini',
  } = options;

  useEffect(() => {
    if (!canvasRef.current || !tree) return;

    const ctx = canvasRef.current.getContext('2d');

    renderTree(ctx, tree, {
      canvasWidth: CANVAS_CONFIG.TREE_WIDTH,
      canvasHeight: CANVAS_CONFIG.TREE_HEIGHT,
      selectedNode,
      showMetrics,
      criterion,
    });
  }, [tree, selectedNode, showMetrics, criterion, canvasRef]);
}
