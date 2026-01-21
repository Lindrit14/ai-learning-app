// src/components/decisionTree/TreeStats.jsx
// Statistics display for decision tree

export function TreeStats({
  dataPointsCount,
  treeDepth,
  numNodes,
  numLeaves,
  accuracy
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div className="bg-blue-50 rounded-lg p-4">
        <p className="text-sm text-gray-600 mb-1">Data Points</p>
        <p className="text-2xl font-bold text-blue-600">{dataPointsCount}</p>
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
  );
}
