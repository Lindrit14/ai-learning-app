// src/hooks/useDataCanvas.js
// Custom hook for managing data visualization canvas

import { useEffect } from 'react';
import { renderDataCanvas } from '../utils/canvas/dataRenderer';
import { CANVAS_CONFIG } from '../utils/constants/decisionTreeConstants';

/**
 * Custom hook to handle data canvas rendering
 * @param {Array} dataPoints - Data points to render
 * @param {Object} canvasRef - React ref to canvas element
 * @param {Object} options - Rendering options
 */
export function useDataCanvas(dataPoints, canvasRef, options = {}) {
  const {
    predictions = [],
    tree = null,
    showSplits = true,
  } = options;

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');

    renderDataCanvas(ctx, {
      dataPoints,
      predictions,
      tree,
      showSplits,
      canvasWidth: CANVAS_CONFIG.DATA_WIDTH,
      canvasHeight: CANVAS_CONFIG.DATA_HEIGHT,
    });
  }, [dataPoints, predictions, tree, showSplits, canvasRef]);
}
