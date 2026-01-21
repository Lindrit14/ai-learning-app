// src/utils/constants/decisionTreeConstants.js
// Constants for Decision Tree Playground

// Canvas dimensions
export const CANVAS_CONFIG = {
  DATA_WIDTH: 400,
  DATA_HEIGHT: 400,
  TREE_WIDTH: 800,
  TREE_HEIGHT: 600,
};

// Class colors for visualization
export const CLASS_COLORS = {
  0: {
    fill: '#ef4444',           // Red
    fillLight: 'rgba(255, 100, 100, 0.3)',
    background: '#fecaca',     // Light red
    stroke: '#fff',
  },
  1: {
    fill: '#3b82f6',           // Blue
    fillLight: 'rgba(100, 150, 255, 0.3)',
    background: '#bfdbfe',     // Light blue
    stroke: '#fff',
  },
};

// Tree visualization settings
export const TREE_RENDERING = {
  NODE_RADIUS: 30,
  LEVEL_HEIGHT: 100,
  START_Y: 50,
  CONNECTION_WIDTH: 2,
  SELECTED_BORDER_WIDTH: 3,
  DEFAULT_BORDER_WIDTH: 2,
};

// Data visualization settings
export const DATA_RENDERING = {
  POINT_RADIUS: 6,
  POINT_STROKE_WIDTH: 2,
  GRID_SPACING: 50,
  GRID_SIZE: 30,           // For decision boundary
  SPLIT_LINE_WIDTH: 2,
  SPLIT_LINE_DASH: [5, 5],
  PREDICTION_BOX_SIZE: 14,
  PREDICTION_BOX_HALF: 7,
};

// Color scheme for tree elements
export const TREE_COLORS = {
  // Split lines and labels
  SPLIT_LINE: '#6366f1',         // Indigo
  SPLIT_LABEL: '#6366f1',

  // Node colors
  NODE_DEFAULT: '#e5e7eb',       // Light gray
  NODE_SELECTED: '#6366f1',      // Indigo
  NODE_BORDER_DEFAULT: '#9ca3af',// Gray
  NODE_BORDER_SELECTED: '#4338ca', // Dark indigo

  // Connection lines
  CONNECTION: '#9ca3af',         // Gray
  BRANCH_LABEL_TRUE: '#22c55e',  // Green
  BRANCH_LABEL_FALSE: '#ef4444', // Red

  // Grid and background
  GRID: '#e5e7eb',               // Light gray

  // Text
  TEXT_PRIMARY: '#1f2937',       // Dark gray
};

// Default hyperparameters
export const DEFAULT_HYPERPARAMETERS = {
  MAX_DEPTH: 3,
  MIN_SAMPLES_SPLIT: 2,
  CRITERION: 'gini',  // 'gini' or 'entropy'
};

// Data generation settings
export const DATA_GENERATION = {
  POINTS_PER_CLASS: 30,
  CLASS_0_RANGE: { x: [0.1, 0.5], y: [0.1, 0.5] },
  CLASS_1_RANGE: { x: [0.5, 0.9], y: [0.5, 0.9] },
};

// Font settings
export const FONTS = {
  NODE_LABEL: 'bold 12px Arial',
  NODE_SUBLABEL: '10px Arial',
  SPLIT_LABEL: '12px Arial',
  BRANCH_LABEL: '12px Arial',
};
