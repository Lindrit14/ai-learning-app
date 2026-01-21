// src/components/playground/DecisionTreePlaygroundRefactored.jsx
import { useState, useRef } from 'react';
import { Play, RotateCcw, Plus, GitBranch, Eye, TrendingDown } from 'lucide-react';

// Custom hooks
import { useDecisionTree } from '../../hooks/useDecisionTree';
import { useTreeCanvas } from '../../hooks/useTreeCanvas';
import { useDataCanvas } from '../../hooks/useDataCanvas';

// UI Components
import { TreeControls } from '../decisionTree/TreeControls';
import { TreeStats } from '../decisionTree/TreeStats';

// Constants
import {
  CANVAS_CONFIG,
  DEFAULT_HYPERPARAMETERS,
  DATA_GENERATION,
} from '../../utils/constants/decisionTreeConstants';

function DecisionTreePlayground() {
  // Canvas refs
  const treeCanvasRef = useRef(null);
  const dataCanvasRef = useRef(null);

  // Data state
  const [dataPoints, setDataPoints] = useState([]);
  const [currentClass, setCurrentClass] = useState(0);

  // Hyperparameters
  const [maxDepth, setMaxDepth] = useState(DEFAULT_HYPERPARAMETERS.MAX_DEPTH);
  const [minSamplesSplit, setMinSamplesSplit] = useState(DEFAULT_HYPERPARAMETERS.MIN_SAMPLES_SPLIT);
  const [criterion, setCriterion] = useState(DEFAULT_HYPERPARAMETERS.CRITERION);

  // Visualization state
  const [selectedNode, setSelectedNode] = useState(null);
  const [showSplits, setShowSplits] = useState(true);
  const [showMetrics, setShowMetrics] = useState(true);

  // Decision tree logic (custom hook)
  const {
    tree,
    treeDepth,
    numNodes,
    numLeaves,
    accuracy,
    predictions,
    train,
    reset: resetTree,
  } = useDecisionTree(dataPoints, { maxDepth, minSamplesSplit, criterion });

  // Canvas rendering (custom hooks)
  useTreeCanvas(tree, treeCanvasRef, { selectedNode, showMetrics, criterion });
  useDataCanvas(dataPoints, dataCanvasRef, { predictions, tree, showSplits });

  // Generate sample data
  const generateData = () => {
    const newPoints = [];
    const { POINTS_PER_CLASS, CLASS_0_RANGE, CLASS_1_RANGE } = DATA_GENERATION;

    // Class 0
    for (let i = 0; i < POINTS_PER_CLASS; i++) {
      const x = Math.random() * (CLASS_0_RANGE.x[1] - CLASS_0_RANGE.x[0]) + CLASS_0_RANGE.x[0];
      const y = Math.random() * (CLASS_0_RANGE.y[1] - CLASS_0_RANGE.y[0]) + CLASS_0_RANGE.y[0];
      newPoints.push({ x, y, class: 0 });
    }

    // Class 1
    for (let i = 0; i < POINTS_PER_CLASS; i++) {
      const x = Math.random() * (CLASS_1_RANGE.x[1] - CLASS_1_RANGE.x[0]) + CLASS_1_RANGE.x[0];
      const y = Math.random() * (CLASS_1_RANGE.y[1] - CLASS_1_RANGE.y[0]) + CLASS_1_RANGE.y[0];
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

    const x = clickX / CANVAS_CONFIG.DATA_WIDTH;
    const y = clickY / CANVAS_CONFIG.DATA_HEIGHT;

    if (x < 0 || x > 1 || y < 0 || y > 1) return;

    setDataPoints([...dataPoints, { x, y, class: currentClass }]);
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
            width={CANVAS_CONFIG.DATA_WIDTH}
            height={CANVAS_CONFIG.DATA_HEIGHT}
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
            width={CANVAS_CONFIG.TREE_WIDTH}
            height={CANVAS_CONFIG.TREE_HEIGHT}
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
              H(S) = -Σ p<sub>i</sub> × log<sub>2</sub>(p<sub>i</sub>)
            </div>
            <div className="text-xs text-gray-600">
              Measures the amount of disorder/uncertainty in the dataset
            </div>
          </div>

          <div className="bg-white rounded p-3">
            <div className="font-semibold mb-2">Gini Impurity:</div>
            <div className="font-mono text-xs bg-gray-100 p-2 rounded mb-2">
              Gini(S) = 1 - Σ p<sub>i</sub><sup>2</sup>
            </div>
            <div className="text-xs text-gray-600">
              Probability of incorrectly classifying a random element
            </div>
          </div>

          <div className="bg-white rounded p-3">
            <div className="font-semibold mb-2">Information Gain:</div>
            <div className="font-mono text-xs bg-gray-100 p-2 rounded mb-2">
              IG = H(parent) - [w<sub>L</sub>×H(left) + w<sub>R</sub>×H(right)]
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
      <div className="mb-6">
        <TreeStats
          dataPointsCount={dataPoints.length}
          treeDepth={treeDepth}
          numNodes={numNodes}
          numLeaves={numLeaves}
          accuracy={accuracy}
        />
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={train}
            disabled={dataPoints.length < minSamplesSplit}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-5 h-5" />
            Build Tree
          </button>

          <button
            onClick={resetTree}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            Reset Tree
          </button>
        </div>

        {/* Hyperparameters */}
        <TreeControls
          maxDepth={maxDepth}
          setMaxDepth={setMaxDepth}
          minSamplesSplit={minSamplesSplit}
          setMinSamplesSplit={setMinSamplesSplit}
          criterion={criterion}
          setCriterion={setCriterion}
        />
      </div>

      {/* Info */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">📚 How to use:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click "Generate" to create sample data or click canvas to add points manually</li>
          <li>• Adjust max depth to control tree complexity (deeper = more complex)</li>
          <li>• Change min samples split to prevent overfitting (higher = simpler tree)</li>
          <li>• Toggle between Gini and Entropy to see different splitting criteria</li>
          <li>• Click "Build Tree" to train the decision tree on your data</li>
          <li>• Watch how the tree creates decision boundaries in the data space!</li>
          <li>• Enable "Splits" to see the actual decision boundaries on the data</li>
          <li>• Enable "Metrics" to see impurity values at each node</li>
        </ul>
      </div>
    </div>
  );
}

export default DecisionTreePlayground;
