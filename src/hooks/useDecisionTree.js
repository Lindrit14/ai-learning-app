// src/hooks/useDecisionTree.js
// Custom hook for decision tree state management and training

import { useState, useCallback } from 'react';
import {
  buildTree,
  countTreeStats,
  calculateAccuracy,
  generatePredictions,
} from '../utils/algorithms/decisionTree';

/**
 * Custom hook to manage decision tree state and training
 * @param {Array} dataPoints - Training data points
 * @param {Object} hyperparameters - {maxDepth, minSamplesSplit, criterion}
 * @returns {Object} Tree state and training function
 */
export function useDecisionTree(dataPoints, hyperparameters) {
  const { maxDepth, minSamplesSplit, criterion } = hyperparameters;

  const [tree, setTree] = useState(null);
  const [treeDepth, setTreeDepth] = useState(0);
  const [numNodes, setNumNodes] = useState(0);
  const [numLeaves, setNumLeaves] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [predictions, setPredictions] = useState([]);

  /**
   * Train the decision tree on current data
   */
  const train = useCallback(() => {
    if (dataPoints.length < minSamplesSplit) {
      alert(`Need at least ${minSamplesSplit} data points to train!`);
      return;
    }

    // Build tree
    const newTree = buildTree(dataPoints, {
      maxDepth,
      minSamplesSplit,
      criterion,
    });

    setTree(newTree);

    // Calculate statistics
    const stats = countTreeStats(newTree);
    setTreeDepth(stats.depth + 1);
    setNumNodes(stats.nodes);
    setNumLeaves(stats.leaves);

    // Calculate accuracy
    const acc = calculateAccuracy(newTree, dataPoints);
    setAccuracy(acc);

    // Generate predictions for decision boundary
    const preds = generatePredictions(newTree);
    setPredictions(preds);
  }, [dataPoints, maxDepth, minSamplesSplit, criterion]);

  /**
   * Reset tree and all statistics
   */
  const reset = useCallback(() => {
    setTree(null);
    setTreeDepth(0);
    setNumNodes(0);
    setNumLeaves(0);
    setAccuracy(0);
    setPredictions([]);
  }, []);

  return {
    tree,
    treeDepth,
    numNodes,
    numLeaves,
    accuracy,
    predictions,
    train,
    reset,
  };
}
