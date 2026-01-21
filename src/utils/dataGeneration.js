// src/utils/dataGeneration.js
// Utilities for generating sample datasets

import { DATA_GENERATION } from './constants/decisionTreeConstants';

/**
 * Generate clustered data for binary classification
 * @param {Object} options - Generation options
 * @returns {Array} Array of {x, y, class} data points
 */
export function generateClusteredData(options = {}) {
  const {
    pointsPerClass = DATA_GENERATION.POINTS_PER_CLASS,
    class0Range = DATA_GENERATION.CLASS_0_RANGE,
    class1Range = DATA_GENERATION.CLASS_1_RANGE,
  } = options;

  const points = [];

  // Generate Class 0 points
  for (let i = 0; i < pointsPerClass; i++) {
    const x = Math.random() * (class0Range.x[1] - class0Range.x[0]) + class0Range.x[0];
    const y = Math.random() * (class0Range.y[1] - class0Range.y[0]) + class0Range.y[0];
    points.push({ x, y, class: 0 });
  }

  // Generate Class 1 points
  for (let i = 0; i < pointsPerClass; i++) {
    const x = Math.random() * (class1Range.x[1] - class1Range.x[0]) + class1Range.x[0];
    const y = Math.random() * (class1Range.y[1] - class1Range.y[0]) + class1Range.y[0];
    points.push({ x, y, class: 1 });
  }

  return points;
}

/**
 * Generate circular pattern data (for more complex decision boundaries)
 * @param {number} pointsPerClass - Number of points per class
 * @returns {Array} Array of {x, y, class} data points
 */
export function generateCircularData(pointsPerClass = 30) {
  const points = [];

  // Inner circle (Class 0)
  for (let i = 0; i < pointsPerClass; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const r = Math.random() * 0.2 + 0.1;
    const x = 0.5 + r * Math.cos(angle);
    const y = 0.5 + r * Math.sin(angle);
    points.push({ x, y, class: 0 });
  }

  // Outer circle (Class 1)
  for (let i = 0; i < pointsPerClass; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const r = Math.random() * 0.2 + 0.4;
    const x = 0.5 + r * Math.cos(angle);
    const y = 0.5 + r * Math.sin(angle);
    points.push({ x, y, class: 1 });
  }

  return points;
}

/**
 * Generate XOR pattern data (difficult for decision trees)
 * @param {number} pointsPerQuadrant - Number of points per quadrant
 * @returns {Array} Array of {x, y, class} data points
 */
export function generateXORData(pointsPerQuadrant = 15) {
  const points = [];

  // Top-left and bottom-right: Class 0
  for (let i = 0; i < pointsPerQuadrant; i++) {
    // Top-left
    const x1 = Math.random() * 0.4 + 0.1;
    const y1 = Math.random() * 0.4 + 0.5;
    points.push({ x: x1, y: y1, class: 0 });

    // Bottom-right
    const x2 = Math.random() * 0.4 + 0.5;
    const y2 = Math.random() * 0.4 + 0.1;
    points.push({ x: x2, y: y2, class: 0 });
  }

  // Top-right and bottom-left: Class 1
  for (let i = 0; i < pointsPerQuadrant; i++) {
    // Top-right
    const x1 = Math.random() * 0.4 + 0.5;
    const y1 = Math.random() * 0.4 + 0.5;
    points.push({ x: x1, y: y1, class: 1 });

    // Bottom-left
    const x2 = Math.random() * 0.4 + 0.1;
    const y2 = Math.random() * 0.4 + 0.1;
    points.push({ x: x2, y: y2, class: 1 });
  }

  return points;
}
