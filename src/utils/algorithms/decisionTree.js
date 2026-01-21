// src/utils/algorithms/decisionTree.js
// Decision Tree (CART) Algorithm Implementation

/**
 * Calculate entropy (Shannon entropy) of a dataset
 * H(S) = -Σ p_i × log2(p_i)
 * @param {number[]} labels - Array of class labels
 * @returns {number} Entropy value (0 = pure, 1 = max uncertainty for binary)
 */
export function calculateEntropy(labels) {
  if (labels.length === 0) return 0;

  const counts = {};
  labels.forEach(label => {
    counts[label] = (counts[label] || 0) + 1;
  });

  let entropy = 0;
  const total = labels.length;

  Object.values(counts).forEach(count => {
    const p = count / total;
    if (p > 0) {
      entropy -= p * Math.log2(p);
    }
  });

  return entropy;
}

/**
 * Calculate Gini impurity of a dataset
 * Gini(S) = 1 - Σ p_i²
 * @param {number[]} labels - Array of class labels
 * @returns {number} Gini impurity (0 = pure, 0.5 = max impurity for binary)
 */
export function calculateGini(labels) {
  if (labels.length === 0) return 0;

  const counts = {};
  labels.forEach(label => {
    counts[label] = (counts[label] || 0) + 1;
  });

  let gini = 1;
  const total = labels.length;

  Object.values(counts).forEach(count => {
    const p = count / total;
    gini -= p * p;
  });

  return gini;
}

/**
 * Calculate impurity based on criterion
 * @param {number[]} labels - Array of class labels
 * @param {string} criterion - 'gini' or 'entropy'
 * @returns {number} Impurity value
 */
export function calculateImpurity(labels, criterion = 'gini') {
  return criterion === 'gini' ? calculateGini(labels) : calculateEntropy(labels);
}

/**
 * Calculate information gain from a split
 * IG = H(parent) - [w_L × H(left) + w_R × H(right)]
 * @param {number[]} parentLabels - Labels before split
 * @param {number[]} leftLabels - Labels in left child
 * @param {number[]} rightLabels - Labels in right child
 * @param {string} criterion - 'gini' or 'entropy'
 * @returns {number} Information gain (higher is better)
 */
export function calculateInformationGain(parentLabels, leftLabels, rightLabels, criterion = 'gini') {
  const parentImpurity = calculateImpurity(parentLabels, criterion);
  const n = parentLabels.length;
  const nLeft = leftLabels.length;
  const nRight = rightLabels.length;

  if (nLeft === 0 || nRight === 0) return 0;

  const weightedImpurity =
    (nLeft / n) * calculateImpurity(leftLabels, criterion) +
    (nRight / n) * calculateImpurity(rightLabels, criterion);

  return parentImpurity - weightedImpurity;
}

/**
 * Count class distribution in labels
 * @param {number[]} labels - Array of class labels
 * @returns {Object} Object with class counts {0: count0, 1: count1, ...}
 */
export function countClassDistribution(labels) {
  const counts = {};
  labels.forEach(label => {
    counts[label] = (counts[label] || 0) + 1;
  });
  return counts;
}

/**
 * Find the best split for a set of data points
 * Tries all features and thresholds, returns split with highest information gain
 * @param {Array} points - Array of data points {x, y, class}
 * @param {string} criterion - 'gini' or 'entropy'
 * @returns {Object} Best split info {gain, feature, threshold, left, right}
 */
export function findBestSplit(points, criterion = 'gini') {
  let bestGain = -Infinity;
  let bestFeature = null;
  let bestThreshold = null;
  let bestLeft = [];
  let bestRight = [];

  const labels = points.map(p => p.class);

  // Try splits on both features (x and y)
  ['x', 'y'].forEach(feature => {
    // Get unique values for this feature
    const values = [...new Set(points.map(p => p[feature]))].sort((a, b) => a - b);

    // Try splits between consecutive values
    for (let i = 0; i < values.length - 1; i++) {
      const threshold = (values[i] + values[i + 1]) / 2;

      const left = points.filter(p => p[feature] <= threshold);
      const right = points.filter(p => p[feature] > threshold);

      const leftLabels = left.map(p => p.class);
      const rightLabels = right.map(p => p.class);

      const gain = calculateInformationGain(labels, leftLabels, rightLabels, criterion);

      if (gain > bestGain) {
        bestGain = gain;
        bestFeature = feature;
        bestThreshold = threshold;
        bestLeft = left;
        bestRight = right;
      }
    }
  });

  return {
    gain: bestGain,
    feature: bestFeature,
    threshold: bestThreshold,
    left: bestLeft,
    right: bestRight
  };
}

/**
 * Build a decision tree recursively using CART algorithm
 * @param {Array} points - Training data points {x, y, class}
 * @param {Object} options - {maxDepth, minSamplesSplit, criterion, currentDepth}
 * @returns {Object} Decision tree node
 */
export function buildTree(points, options = {}) {
  const {
    maxDepth = 5,
    minSamplesSplit = 2,
    criterion = 'gini',
    currentDepth = 0
  } = options;

  const labels = points.map(p => p.class);
  const numSamples = points.length;

  // Calculate class distribution
  const classCounts = countClassDistribution(labels);

  const majorityClass = Object.entries(classCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 0;

  // Check stopping criteria
  const allSameClass = new Set(labels).size === 1;
  const reachedMaxDepth = currentDepth >= maxDepth;
  const tooFewSamples = numSamples < minSamplesSplit;

  if (allSameClass || reachedMaxDepth || tooFewSamples) {
    return {
      type: 'leaf',
      class: parseInt(majorityClass),
      samples: numSamples,
      distribution: classCounts,
      impurity: calculateImpurity(labels, criterion),
      depth: currentDepth
    };
  }

  // Find best split
  const split = findBestSplit(points, criterion);

  // If no valid split found, make it a leaf
  if (split.gain <= 0 || split.left.length === 0 || split.right.length === 0) {
    return {
      type: 'leaf',
      class: parseInt(majorityClass),
      samples: numSamples,
      distribution: classCounts,
      impurity: calculateImpurity(labels, criterion),
      depth: currentDepth
    };
  }

  // Create internal node and recurse
  return {
    type: 'internal',
    feature: split.feature,
    threshold: split.threshold,
    gain: split.gain,
    samples: numSamples,
    distribution: classCounts,
    impurity: calculateImpurity(labels, criterion),
    depth: currentDepth,
    left: buildTree(split.left, { ...options, currentDepth: currentDepth + 1 }),
    right: buildTree(split.right, { ...options, currentDepth: currentDepth + 1 })
  };
}

/**
 * Count tree statistics (depth, total nodes, leaf nodes)
 * @param {Object} node - Tree node
 * @returns {Object} Stats {depth, nodes, leaves}
 */
export function countTreeStats(node) {
  if (!node) return { depth: 0, nodes: 0, leaves: 0 };

  if (node.type === 'leaf') {
    return { depth: node.depth, nodes: 1, leaves: 1 };
  }

  const leftStats = countTreeStats(node.left);
  const rightStats = countTreeStats(node.right);

  return {
    depth: Math.max(leftStats.depth, rightStats.depth),
    nodes: 1 + leftStats.nodes + rightStats.nodes,
    leaves: leftStats.leaves + rightStats.leaves
  };
}

/**
 * Predict class for a single data point using the tree
 * @param {Object} node - Tree node
 * @param {Object} point - Data point {x, y}
 * @returns {number} Predicted class
 */
export function predict(node, point) {
  if (!node) return 0;

  if (node.type === 'leaf') {
    return node.class;
  }

  if (point[node.feature] <= node.threshold) {
    return predict(node.left, point);
  } else {
    return predict(node.right, point);
  }
}

/**
 * Calculate accuracy on a dataset
 * @param {Object} tree - Decision tree
 * @param {Array} points - Test data points {x, y, class}
 * @returns {number} Accuracy (0-1)
 */
export function calculateAccuracy(tree, points) {
  if (!tree || points.length === 0) return 0;

  let correct = 0;
  points.forEach(point => {
    const predicted = predict(tree, point);
    if (predicted === point.class) correct++;
  });

  return correct / points.length;
}

/**
 * Generate predictions for a grid of points (for decision boundary visualization)
 * @param {Object} tree - Decision tree
 * @param {number} gridSize - Number of points per dimension
 * @returns {Array} Array of {x, y, class} predictions
 */
export function generatePredictions(tree, gridSize = 30) {
  if (!tree) return [];

  const predPoints = [];

  for (let i = 0; i <= gridSize; i++) {
    for (let j = 0; j <= gridSize; j++) {
      const x = i / gridSize;
      const y = j / gridSize;
      const predictedClass = predict(tree, { x, y });
      predPoints.push({ x, y, class: predictedClass });
    }
  }

  return predPoints;
}
