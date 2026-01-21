// src/components/decisionTree/TreeControls.jsx
// Hyperparameter controls for decision tree

export function TreeControls({
  maxDepth,
  setMaxDepth,
  minSamplesSplit,
  setMinSamplesSplit,
  criterion,
  setCriterion
}) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {/* Max Depth */}
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

      {/* Min Samples Split */}
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

      {/* Criterion */}
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
  );
}
