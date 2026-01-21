// src/components/playground/DecisionTreePlayground.jsx
import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Plus, GitBranch, Eye, TrendingDown } from 'lucide-react';

function DecisionTreePlayground() {
  // Canvas refs
  const treeCanvasRef = useRef(null);
  const dataCanvasRef = useRef(null);

  // Data
  const [dataPoints, setDataPoints] = useState([]);
  const [currentClass, setCurrentClass] = useState(0);

  // Decision Tree
  const [tree, setTree] = useState(null);
  const [maxDepth, setMaxDepth] = useState(3);
  const [minSamplesSplit, setMinSamplesSplit] = useState(2);
  const [criterion, setCriterion] = useState('gini'); // 'gini' or 'entropy'

  // Training state
  const [treeDepth, setTreeDepth] = useState(0);
  const [numNodes, setNumNodes] = useState(0);
  const [numLeaves, setNumLeaves] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  // Visualization
  const [selectedNode, setSelectedNode] = useState(null);
  const [showSplits, setShowSplits] = useState(true);
  const [showMetrics, setShowMetrics] = useState(true);
  const [predictions, setPredictions] = useState([]);

  // Canvas settings
  const dataWidth = 400;
  const dataHeight = 400;
  const treeWidth = 800;
  const treeHeight = 600;

  // Calculate entropy
  const calculateEntropy = (labels) => {
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
  };

  // Calculate Gini impurity
  const calculateGini = (labels) => {
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
  };

  // Calculate impurity based on criterion
  const calculateImpurity = (labels) => {
    return criterion === 'gini' ? calculateGini(labels) : calculateEntropy(labels);
  };

  // Calculate information gain
  const calculateInformationGain = (parentLabels, leftLabels, rightLabels) => {
    const parentImpurity = calculateImpurity(parentLabels);
    const n = parentLabels.length;
    const nLeft = leftLabels.length;
    const nRight = rightLabels.length;

    if (nLeft === 0 || nRight === 0) return 0;

    const weightedImpurity =
      (nLeft / n) * calculateImpurity(leftLabels) +
      (nRight / n) * calculateImpurity(rightLabels);

    return parentImpurity - weightedImpurity;
  };

  // Find best split
  const findBestSplit = (points) => {
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

        const gain = calculateInformationGain(labels, leftLabels, rightLabels);

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
  };

  // Build decision tree recursively
  const buildTree = (points, depth = 0) => {
    const labels = points.map(p => p.class);
    const numSamples = points.length;

    // Calculate class distribution
    const classCounts = {};
    labels.forEach(label => {
      classCounts[label] = (classCounts[label] || 0) + 1;
    });

    const majorityClass = Object.entries(classCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 0;

    // Check stopping criteria
    const allSameClass = new Set(labels).size === 1;
    const reachedMaxDepth = depth >= maxDepth;
    const tooFewSamples = numSamples < minSamplesSplit;

    if (allSameClass || reachedMaxDepth || tooFewSamples) {
      return {
        type: 'leaf',
        class: parseInt(majorityClass),
        samples: numSamples,
        distribution: classCounts,
        impurity: calculateImpurity(labels),
        depth
      };
    }

    // Find best split
    const split = findBestSplit(points);

    // If no valid split found, make it a leaf
    if (split.gain <= 0 || split.left.length === 0 || split.right.length === 0) {
      return {
        type: 'leaf',
        class: parseInt(majorityClass),
        samples: numSamples,
        distribution: classCounts,
        impurity: calculateImpurity(labels),
        depth
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
      impurity: calculateImpurity(labels),
      depth,
      left: buildTree(split.left, depth + 1),
      right: buildTree(split.right, depth + 1)
    };
  };

  // Count tree statistics
  const countTreeStats = (node) => {
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
  };

  // Predict class for a point
  const predict = (node, point) => {
    if (!node) return 0;

    if (node.type === 'leaf') {
      return node.class;
    }

    if (point[node.feature] <= node.threshold) {
      return predict(node.left, point);
    } else {
      return predict(node.right, point);
    }
  };

  // Calculate accuracy
  const calculateAccuracy = (tree, points) => {
    if (!tree || points.length === 0) return 0;

    let correct = 0;
    points.forEach(point => {
      const predicted = predict(tree, point);
      if (predicted === point.class) correct++;
    });

    return correct / points.length;
  };

  // Train the decision tree
  const trainTree = () => {
    if (dataPoints.length < minSamplesSplit) {
      alert(`Need at least ${minSamplesSplit} data points to train!`);
      return;
    }

    const newTree = buildTree(dataPoints);
    setTree(newTree);

    const stats = countTreeStats(newTree);
    setTreeDepth(stats.depth + 1);
    setNumNodes(stats.nodes);
    setNumLeaves(stats.leaves);

    const acc = calculateAccuracy(newTree, dataPoints);
    setAccuracy(acc);

    // Generate predictions for visualization
    generatePredictions(newTree);
  };

  // Generate predictions for decision boundary
  const generatePredictions = (tree) => {
    if (!tree) return;

    const gridSize = 30;
    const predPoints = [];

    for (let i = 0; i <= gridSize; i++) {
      for (let j = 0; j <= gridSize; j++) {
        const x = i / gridSize;
        const y = j / gridSize;
        const predictedClass = predict(tree, { x, y });
        predPoints.push({ x, y, class: predictedClass });
      }
    }

    setPredictions(predPoints);
  };

  // Generate sample data
  const generateData = () => {
    const newPoints = [];

    // Generate two clusters for binary classification
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * 0.4 + 0.1;
      const y = Math.random() * 0.4 + 0.1;
      newPoints.push({ x, y, class: 0 });
    }

    for (let i = 0; i < 30; i++) {
      const x = Math.random() * 0.4 + 0.5;
      const y = Math.random() * 0.4 + 0.5;
      newPoints.push({ x, y, class: 1 });
    }

    setDataPoints(newPoints);
  };

  // Add point on canvas click
  const handleCanvasClick = (e) => {
    const canvas = dataCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const x = clickX / dataWidth;
    const y = clickY / dataHeight;

    if (x < 0 || x > 1 || y < 0 || y > 1) return;

    setDataPoints([...dataPoints, { x, y, class: currentClass }]);
  };

  // Initialize
  useEffect(() => {
    generateData();
  }, []);

  // Draw data canvas
  useEffect(() => {
    const canvas = dataCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, dataWidth, dataHeight);

    // Draw predictions (decision boundary)
    if (predictions.length > 0 && showSplits) {
      predictions.forEach(pred => {
        const x = pred.x * dataWidth;
        const y = pred.y * dataHeight;

        const color = pred.class === 0
          ? 'rgba(255, 100, 100, 0.3)'
          : 'rgba(100, 150, 255, 0.3)';

        ctx.fillStyle = color;
        ctx.fillRect(x - 7, y - 7, 14, 14);
      });
    }

    // Draw splits if tree exists
    if (tree && showSplits) {
      const drawSplits = (node, bounds = { xMin: 0, xMax: 1, yMin: 0, yMax: 1 }) => {
        if (!node || node.type === 'leaf') return;

        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);

        if (node.feature === 'x') {
          const x = node.threshold * dataWidth;
          ctx.beginPath();
          ctx.moveTo(x, bounds.yMin * dataHeight);
          ctx.lineTo(x, bounds.yMax * dataHeight);
          ctx.stroke();

          // Draw threshold label
          ctx.fillStyle = '#6366f1';
          ctx.font = '12px Arial';
          ctx.fillText(`x d ${node.threshold.toFixed(3)}`, x + 5, bounds.yMin * dataHeight + 15);

          drawSplits(node.left, { ...bounds, xMax: node.threshold });
          drawSplits(node.right, { ...bounds, xMin: node.threshold });
        } else {
          const y = node.threshold * dataHeight;
          ctx.beginPath();
          ctx.moveTo(bounds.xMin * dataWidth, y);
          ctx.lineTo(bounds.xMax * dataWidth, y);
          ctx.stroke();

          // Draw threshold label
          ctx.fillStyle = '#6366f1';
          ctx.font = '12px Arial';
          ctx.fillText(`y d ${node.threshold.toFixed(3)}`, bounds.xMin * dataWidth + 5, y - 5);

          drawSplits(node.left, { ...bounds, yMax: node.threshold });
          drawSplits(node.right, { ...bounds, yMin: node.threshold });
        }
      };

      ctx.setLineDash([]);
      drawSplits(tree);
      ctx.setLineDash([]);
    }

    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i < dataWidth; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, dataHeight);
      ctx.stroke();
    }
    for (let i = 0; i < dataHeight; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(dataWidth, i);
      ctx.stroke();
    }

    // Draw data points
    dataPoints.forEach(point => {
      const x = point.x * dataWidth;
      const y = point.y * dataHeight;

      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = point.class === 0 ? '#ef4444' : '#3b82f6';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

  }, [dataPoints, predictions, tree, showSplits]);

  // Draw tree visualization
  useEffect(() => {
    const canvas = treeCanvasRef.current;
    if (!canvas || !tree) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, treeWidth, treeHeight);

    const nodeRadius = 30;
    const levelHeight = 100;
    const startY = 50;

    // Calculate node positions
    const calculatePositions = (node, depth = 0, xMin = 0, xMax = treeWidth) => {
      if (!node) return [];

      const x = (xMin + xMax) / 2;
      const y = startY + depth * levelHeight;

      const positions = [{ node, x, y, depth }];

      if (node.type === 'internal') {
        const mid = (xMin + xMax) / 2;
        positions.push(...calculatePositions(node.left, depth + 1, xMin, mid));
        positions.push(...calculatePositions(node.right, depth + 1, mid, xMax));
      }

      return positions;
    };

    const positions = calculatePositions(tree);

    // Draw connections
    positions.forEach(pos => {
      if (pos.node.type === 'internal') {
        const leftChild = positions.find(p => p.node === pos.node.left);
        const rightChild = positions.find(p => p.node === pos.node.right);

        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 2;

        if (leftChild) {
          ctx.beginPath();
          ctx.moveTo(pos.x, pos.y + nodeRadius);
          ctx.lineTo(leftChild.x, leftChild.y - nodeRadius);
          ctx.stroke();

          // Label for left branch
          ctx.fillStyle = '#22c55e';
          ctx.font = '12px Arial';
          ctx.fillText('True', (pos.x + leftChild.x) / 2 - 15, (pos.y + leftChild.y) / 2);
        }

        if (rightChild) {
          ctx.beginPath();
          ctx.moveTo(pos.x, pos.y + nodeRadius);
          ctx.lineTo(rightChild.x, rightChild.y - nodeRadius);
          ctx.stroke();

          // Label for right branch
          ctx.fillStyle = '#ef4444';
          ctx.font = '12px Arial';
          ctx.fillText('False', (pos.x + rightChild.x) / 2 + 5, (pos.y + rightChild.y) / 2);
        }
      }
    });

    // Draw nodes
    positions.forEach(pos => {
      const isSelected = selectedNode === pos.node;

      // Draw node circle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, nodeRadius, 0, Math.PI * 2);

      if (pos.node.type === 'leaf') {
        ctx.fillStyle = pos.node.class === 0 ? '#fecaca' : '#bfdbfe';
      } else {
        ctx.fillStyle = isSelected ? '#6366f1' : '#e5e7eb';
      }

      ctx.fill();
      ctx.strokeStyle = isSelected ? '#4338ca' : '#9ca3af';
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.stroke();

      // Draw node text
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (pos.node.type === 'leaf') {
        ctx.fillText(`Class ${pos.node.class}`, pos.x, pos.y - 5);
        ctx.font = '10px Arial';
        ctx.fillText(`n=${pos.node.samples}`, pos.x, pos.y + 8);
      } else {
        const featureName = pos.node.feature === 'x' ? 'X' : 'Y';
        ctx.fillText(`${featureName} d ${pos.node.threshold.toFixed(2)}`, pos.x, pos.y - 8);
        ctx.font = '10px Arial';
        ctx.fillText(`n=${pos.node.samples}`, pos.x, pos.y + 5);

        if (showMetrics) {
          const impurityName = criterion === 'gini' ? 'gini' : 'entropy';
          ctx.fillText(`${impurityName}=${pos.node.impurity.toFixed(3)}`, pos.x, pos.y + 15);
        }
      }
    });

  }, [tree, selectedNode, showMetrics, criterion]);

  // Reset
  const reset = () => {
    setTree(null);
    setTreeDepth(0);
    setNumNodes(0);
    setNumLeaves(0);
    setAccuracy(0);
    setPredictions([]);
    setSelectedNode(null);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Decision Tree Playground
        </h2>
        <p className="text-gray-600">
          Learn the mathematics behind decision trees through interactive visualization
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Data Visualization */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Training Data & Decision Boundary</h3>
            <div className="flex gap-2">
              <button
                onClick={generateData}
                className="flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
              >
                <Plus className="w-4 h-4" />
                Generate
              </button>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentClass(0)}
                  className={`w-8 h-8 rounded ${currentClass === 0 ? 'ring-2 ring-gray-900' : ''}`}
                  style={{ backgroundColor: '#ef4444' }}
                />
                <button
                  onClick={() => setCurrentClass(1)}
                  className={`w-8 h-8 rounded ${currentClass === 1 ? 'ring-2 ring-gray-900' : ''}`}
                  style={{ backgroundColor: '#3b82f6' }}
                />
              </div>
            </div>
          </div>

          <canvas
            ref={dataCanvasRef}
            width={dataWidth}
            height={dataHeight}
            onClick={handleCanvasClick}
            className="border-2 border-gray-300 rounded-lg cursor-crosshair hover:border-blue-400 transition-colors w-full"
          />

          <div className="mt-3 text-sm text-gray-600">
            <span>Red = Class 0 | Blue = Class 1 | Click to add points</span>
          </div>
        </div>

        {/* Tree Visualization */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Decision Tree Structure</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSplits(!showSplits)}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm ${
                  showSplits ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                <Eye className="w-4 h-4" />
                Splits
              </button>
              <button
                onClick={() => setShowMetrics(!showMetrics)}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm ${
                  showMetrics ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                <TrendingDown className="w-4 h-4" />
                Metrics
              </button>
            </div>
          </div>

          <canvas
            ref={treeCanvasRef}
            width={treeWidth}
            height={treeHeight}
            className="border-2 border-gray-300 rounded-lg w-full"
          />

          <div className="mt-3 text-xs text-gray-600">
            <div className="flex gap-4">
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-200 rounded-full border-2 border-gray-400"></div>
                Internal node
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-200 rounded-full"></div>
                Leaf (Class 0)
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-200 rounded-full"></div>
                Leaf (Class 1)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mathematical Formulas */}
      <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
          <GitBranch className="w-5 h-5" />
          Mathematical Formulas
        </h3>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <div className="bg-white rounded p-3">
            <div className="font-semibold mb-2">Entropy (Information):</div>
            <div className="font-mono text-xs bg-gray-100 p-2 rounded mb-2">
              H(S) = -� p<sub>i</sub> � log<sub>2</sub>(p<sub>i</sub>)
            </div>
            <div className="text-xs text-gray-600">
              Measures the amount of disorder/uncertainty in the dataset
            </div>
          </div>

          <div className="bg-white rounded p-3">
            <div className="font-semibold mb-2">Gini Impurity:</div>
            <div className="font-mono text-xs bg-gray-100 p-2 rounded mb-2">
              Gini(S) = 1 - � p<sub>i</sub><sup>2</sup>
            </div>
            <div className="text-xs text-gray-600">
              Probability of incorrectly classifying a random element
            </div>
          </div>

          <div className="bg-white rounded p-3">
            <div className="font-semibold mb-2">Information Gain:</div>
            <div className="font-mono text-xs bg-gray-100 p-2 rounded mb-2">
              IG = H(parent) - [w<sub>L</sub>�H(left) + w<sub>R</sub>�H(right)]
            </div>
            <div className="text-xs text-gray-600">
              Reduction in entropy after splitting on an attribute
            </div>
          </div>

          <div className="bg-white rounded p-3">
            <div className="font-semibold mb-2">Split Selection:</div>
            <div className="font-mono text-xs bg-gray-100 p-2 rounded mb-2">
              best_split = argmax<sub>feature,threshold</sub> IG(feature, threshold)
            </div>
            <div className="text-xs text-gray-600">
              Choose split that maximizes information gain
            </div>
          </div>
        </div>

        <div className="mt-3 bg-white rounded p-3">
          <div className="font-semibold mb-2">Currently Using: {criterion === 'gini' ? 'Gini Impurity' : 'Entropy'}</div>
          <div className="text-xs text-gray-600">
            {criterion === 'gini'
              ? 'Gini is computationally efficient and works well in practice. Range: [0, 0.5] for binary classification.'
              : 'Entropy is theoretically motivated from information theory. Range: [0, 1] for binary classification.'}
          </div>
        </div>
      </div>

      {/* Algorithm Explanation */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-3">Decision Tree Learning Algorithm (CART)</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <div className="bg-white rounded p-3">
            <span className="font-bold">1. Start at root:</span> Use all training data
          </div>
          <div className="bg-white rounded p-3">
            <span className="font-bold">2. Find best split:</span> For each feature and threshold, calculate information gain
          </div>
          <div className="bg-white rounded p-3">
            <span className="font-bold">3. Split data:</span> Partition samples based on best feature/threshold
          </div>
          <div className="bg-white rounded p-3">
            <span className="font-bold">4. Recurse:</span> Repeat for left and right subsets
          </div>
          <div className="bg-white rounded p-3">
            <span className="font-bold">5. Stop when:</span> Max depth reached, all same class, or too few samples
          </div>
          <div className="bg-white rounded p-3">
            <span className="font-bold">6. Create leaf:</span> Assign majority class to leaf node
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Data Points</p>
          <p className="text-2xl font-bold text-blue-600">{dataPoints.length}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Tree Depth</p>
          <p className="text-2xl font-bold text-purple-600">{treeDepth}</p>
        </div>
        <div className="bg-indigo-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Total Nodes</p>
          <p className="text-2xl font-bold text-indigo-600">{numNodes}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Leaf Nodes</p>
          <p className="text-2xl font-bold text-green-600">{numLeaves}</p>
        </div>
        <div className="bg-emerald-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Accuracy</p>
          <p className="text-2xl font-bold text-emerald-600">
            {accuracy > 0 ? `${(accuracy * 100).toFixed(1)}%` : '-'}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={trainTree}
            disabled={dataPoints.length < minSamplesSplit}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-5 h-5" />
            Build Tree
          </button>

          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            Reset Tree
          </button>
        </div>

        {/* Hyperparameters */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Max Depth</span>
              <span className="text-sm text-gray-600">{maxDepth}</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={maxDepth}
              onChange={(e) => setMaxDepth(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
            <p className="text-xs text-gray-500 mt-1">Maximum depth of the tree</p>
          </div>

          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Min Samples Split</span>
              <span className="text-sm text-gray-600">{minSamplesSplit}</span>
            </label>
            <input
              type="range"
              min="2"
              max="20"
              step="1"
              value={minSamplesSplit}
              onChange={(e) => setMinSamplesSplit(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum samples to split a node</p>
          </div>

          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Split Criterion</span>
            </label>
            <select
              value={criterion}
              onChange={(e) => setCriterion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="gini">Gini Impurity</option>
              <option value="entropy">Entropy (Information Gain)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Metric to measure split quality</p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">=� How to use:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>" Click "Generate" to create sample data or click canvas to add points manually</li>
          <li>" Adjust max depth to control tree complexity (deeper = more complex)</li>
          <li>" Change min samples split to prevent overfitting (higher = simpler tree)</li>
          <li>" Toggle between Gini and Entropy to see different splitting criteria</li>
          <li>" Click "Build Tree" to train the decision tree on your data</li>
          <li>" Watch how the tree creates decision boundaries in the data space!</li>
          <li>" Enable "Splits" to see the actual decision boundaries on the data</li>
          <li>" Enable "Metrics" to see impurity values at each node</li>
        </ul>
      </div>
    </div>
  );
}

export default DecisionTreePlayground;
