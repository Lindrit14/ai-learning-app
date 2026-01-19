// src/components/playground/GraphSearchPlayground.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Shuffle, Info } from 'lucide-react';

function GraphSearchPlayground() {
  const canvasRef = useRef(null);
  
  // Algorithm selection
  const [algorithm, setAlgorithm] = useState('BFS'); // BFS, DFS, UCS, GBFS, A*
  
  // Graph structure
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [startNode, setStartNode] = useState(null);
  const [goalNode, setGoalNode] = useState(null);
  
  // Search state
  const [isRunning, setIsRunning] = useState(false);
  const [currentNode, setCurrentNode] = useState(null);
  const [visitedNodes, setVisitedNodes] = useState(new Set());
  const [frontier, setFrontier] = useState([]);
  const [exploredNodes, setExploredNodes] = useState(new Set());
  const [path, setPath] = useState([]);
  const [stepCount, setStepCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  // Data structures visualization
  const [queueStack, setQueueStack] = useState([]);
  const [costs, setCosts] = useState({});
  
  // Canvas settings
  const canvasWidth = 800;
  const canvasHeight = 500;
  const nodeRadius = 25;
  
  // Speed control
  const [speed, setSpeed] = useState(500);

  // Initialize default graph
  useEffect(() => {
    createDefaultGraph();
  }, []);

  // Create a default graph
  const createDefaultGraph = () => {
    const defaultNodes = [
      { id: 'S', x: 100, y: 250, label: 'Start', heuristic: 7 },
      { id: 'A', x: 250, y: 150, label: 'A', heuristic: 6 },
      { id: 'B', x: 250, y: 350, label: 'B', heuristic: 5 },
      { id: 'C', x: 400, y: 100, label: 'C', heuristic: 4 },
      { id: 'D', x: 400, y: 250, label: 'D', heuristic: 3 },
      { id: 'E', x: 400, y: 400, label: 'E', heuristic: 4 },
      { id: 'F', x: 550, y: 150, label: 'F', heuristic: 2 },
      { id: 'G', x: 550, y: 350, label: 'G', heuristic: 1 },
      { id: 'Z', x: 700, y: 250, label: 'Goal', heuristic: 0 }
    ];
    
    const defaultEdges = [
      { from: 'S', to: 'A', cost: 2 },
      { from: 'S', to: 'B', cost: 3 },
      { from: 'A', to: 'C', cost: 2 },
      { from: 'A', to: 'D', cost: 3 },
      { from: 'B', to: 'D', cost: 1 },
      { from: 'B', to: 'E', cost: 4 },
      { from: 'C', to: 'F', cost: 2 },
      { from: 'D', to: 'F', cost: 3 },
      { from: 'D', to: 'G', cost: 2 },
      { from: 'E', to: 'G', cost: 2 },
      { from: 'F', to: 'Z', cost: 3 },
      { from: 'G', to: 'Z', cost: 2 }
    ];
    
    setNodes(defaultNodes);
    setEdges(defaultEdges);
    setStartNode('S');
    setGoalNode('Z');
  };

  // Randomize graph
  const randomizeGraph = () => {
    const nodeCount = 8;
    const newNodes = [];
    const newEdges = [];
    
    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
      const x = 150 + (i % 4) * 180;
      const y = 150 + Math.floor(i / 4) * 200 + (Math.random() - 0.5) * 50;
      newNodes.push({
        id: String.fromCharCode(65 + i),
        x,
        y,
        label: String.fromCharCode(65 + i),
        heuristic: Math.floor(Math.random() * 10)
      });
    }
    
    // Create edges
    for (let i = 0; i < nodeCount - 1; i++) {
      const connections = Math.floor(Math.random() * 2) + 1;
      for (let j = 0; j < connections; j++) {
        const target = i + 1 + Math.floor(Math.random() * Math.min(3, nodeCount - i - 1));
        if (target < nodeCount) {
          newEdges.push({
            from: newNodes[i].id,
            to: newNodes[target].id,
            cost: Math.floor(Math.random() * 5) + 1
          });
        }
      }
    }
    
    setNodes(newNodes);
    setEdges(newEdges);
    setStartNode(newNodes[0].id);
    setGoalNode(newNodes[nodeCount - 1].id);
    reset();
  };

  // Reset search
  const reset = () => {
    setIsRunning(false);
    setCurrentNode(null);
    setVisitedNodes(new Set());
    setFrontier([]);
    setExploredNodes(new Set());
    setPath([]);
    setStepCount(0);
    setIsComplete(false);
    setQueueStack([]);
    setCosts({});
  };

  // Initialize search
  const initializeSearch = () => {
    reset();
    
    if (!startNode) return;
    
    const initialCosts = {};
    nodes.forEach(node => {
      initialCosts[node.id] = Infinity;
    });
    initialCosts[startNode] = 0;
    setCosts(initialCosts);
    
    const startNodeData = nodes.find(n => n.id === startNode);
    
    switch (algorithm) {
      case 'BFS':
        setFrontier([{ id: startNode, path: [startNode] }]);
        setQueueStack([startNode]);
        break;
      case 'DFS':
        setFrontier([{ id: startNode, path: [startNode] }]);
        setQueueStack([startNode]);
        break;
      case 'UCS':
        setFrontier([{ id: startNode, cost: 0, path: [startNode] }]);
        setQueueStack([`${startNode} (0)`]);
        break;
      case 'GBFS':
        setFrontier([{ 
          id: startNode, 
          heuristic: startNodeData.heuristic, 
          path: [startNode] 
        }]);
        setQueueStack([`${startNode} (h=${startNodeData.heuristic})`]);
        break;
      case 'A*':
        setFrontier([{ 
          id: startNode, 
          cost: 0, 
          heuristic: startNodeData.heuristic,
          f: startNodeData.heuristic,
          path: [startNode] 
        }]);
        setQueueStack([`${startNode} (f=0+${startNodeData.heuristic}=${startNodeData.heuristic})`]);
        break;
    }
    
    setCurrentNode(startNode);
  };

  // Get neighbors of a node
  const getNeighbors = (nodeId) => {
    return edges
      .filter(e => e.from === nodeId)
      .map(e => ({
        id: e.to,
        cost: e.cost,
        node: nodes.find(n => n.id === e.to)
      }));
  };

  // Execute one step of search
  const step = () => {
    if (frontier.length === 0 || isComplete) {
      setIsRunning(false);
      setIsComplete(true);
      return;
    }

    let current;
    let newFrontier = [...frontier];
    
    // Select next node based on algorithm
    switch (algorithm) {
      case 'BFS':
        current = newFrontier.shift(); // Queue (FIFO)
        break;
      case 'DFS':
        current = newFrontier.pop(); // Stack (LIFO)
        break;
      case 'UCS':
        newFrontier.sort((a, b) => a.cost - b.cost);
        current = newFrontier.shift();
        break;
      case 'GBFS':
        newFrontier.sort((a, b) => a.heuristic - b.heuristic);
        current = newFrontier.shift();
        break;
      case 'A*':
        newFrontier.sort((a, b) => a.f - b.f);
        current = newFrontier.shift();
        break;
    }

    setCurrentNode(current.id);
    setExploredNodes(prev => new Set([...prev, current.id]));
    setVisitedNodes(prev => new Set([...prev, current.id]));
    setStepCount(prev => prev + 1);

    // Check if goal reached
    if (current.id === goalNode) {
      setPath(current.path);
      setIsComplete(true);
      setIsRunning(false);
      return;
    }

    // Expand neighbors
    const neighbors = getNeighbors(current.id);
    
    neighbors.forEach(neighbor => {
      if (exploredNodes.has(neighbor.id)) return;
      
      const newPath = [...current.path, neighbor.id];
      
      switch (algorithm) {
        case 'BFS':
        case 'DFS':
          if (!newFrontier.some(n => n.id === neighbor.id)) {
            newFrontier.push({ id: neighbor.id, path: newPath });
          }
          break;
          
        case 'UCS':
          const newCost = current.cost + neighbor.cost;
          if (newCost < (costs[neighbor.id] || Infinity)) {
            setCosts(prev => ({ ...prev, [neighbor.id]: newCost }));
            newFrontier.push({ 
              id: neighbor.id, 
              cost: newCost, 
              path: newPath 
            });
          }
          break;
          
        case 'GBFS':
          if (!newFrontier.some(n => n.id === neighbor.id)) {
            newFrontier.push({ 
              id: neighbor.id, 
              heuristic: neighbor.node.heuristic, 
              path: newPath 
            });
          }
          break;
          
        case 'A*':
          const gCost = current.cost + neighbor.cost;
          const hCost = neighbor.node.heuristic;
          const fCost = gCost + hCost;
          
          if (gCost < (costs[neighbor.id] || Infinity)) {
            setCosts(prev => ({ ...prev, [neighbor.id]: gCost }));
            newFrontier.push({ 
              id: neighbor.id, 
              cost: gCost,
              heuristic: hCost,
              f: fCost,
              path: newPath 
            });
          }
          break;
      }
    });

    setFrontier(newFrontier);
    
    // Update queue/stack visualization
    const qsVis = newFrontier.map(item => {
      switch (algorithm) {
        case 'BFS':
        case 'DFS':
          return item.id;
        case 'UCS':
          return `${item.id} (${item.cost.toFixed(1)})`;
        case 'GBFS':
          return `${item.id} (h=${item.heuristic})`;
        case 'A*':
          return `${item.id} (f=${item.f.toFixed(1)})`;
        default:
          return item.id;
      }
    });
    setQueueStack(qsVis);
  };

  // Auto-step when running
  useEffect(() => {
    if (!isRunning) return;
    
    const timer = setTimeout(() => {
      step();
    }, speed);
    
    return () => clearTimeout(timer);
  }, [isRunning, frontier, stepCount]);

  // Draw graph on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw edges
    edges.forEach(edge => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      if (!fromNode || !toNode) return;
      
      const isInPath = path.length > 0 && 
        path.includes(edge.from) && 
        path.includes(edge.to) &&
        Math.abs(path.indexOf(edge.from) - path.indexOf(edge.to)) === 1;
      
      ctx.strokeStyle = isInPath ? '#10b981' : '#d1d5db';
      ctx.lineWidth = isInPath ? 4 : 2;
      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.stroke();
      
      // Draw cost
      const midX = (fromNode.x + toNode.x) / 2;
      const midY = (fromNode.y + toNode.y) / 2;
      ctx.fillStyle = '#374151';
      ctx.font = 'bold 12px Arial';
      ctx.fillRect(midX - 12, midY - 12, 24, 24);
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(edge.cost, midX, midY);
    });
    
    // Draw nodes
    nodes.forEach(node => {
      const isStart = node.id === startNode;
      const isGoal = node.id === goalNode;
      const isCurrent = node.id === currentNode;
      const isExplored = exploredNodes.has(node.id);
      const isInFrontier = frontier.some(f => f.id === node.id);
      const isInPath = path.includes(node.id);
      
      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
      
      if (isInPath) {
        ctx.fillStyle = '#10b981';
      } else if (isCurrent) {
        ctx.fillStyle = '#3b82f6';
      } else if (isExplored) {
        ctx.fillStyle = '#9ca3af';
      } else if (isInFrontier) {
        ctx.fillStyle = '#fbbf24';
      } else if (isStart) {
        ctx.fillStyle = '#10b981';
      } else if (isGoal) {
        ctx.fillStyle = '#ef4444';
      } else {
        ctx.fillStyle = '#e5e7eb';
      }
      
      ctx.fill();
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Node label
      ctx.fillStyle = isExplored || isCurrent || isInPath ? '#fff' : '#374151';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x, node.y);
      
      // Show costs for UCS and A*
      if ((algorithm === 'UCS' || algorithm === 'A*') && costs[node.id] !== undefined && costs[node.id] !== Infinity) {
        ctx.fillStyle = '#374151';
        ctx.font = '10px Arial';
        ctx.fillText(`g=${costs[node.id].toFixed(1)}`, node.x, node.y + nodeRadius + 12);
      }
      
      // Show heuristic for GBFS and A*
      if ((algorithm === 'GBFS' || algorithm === 'A*')) {
        ctx.fillStyle = '#7c3aed';
        ctx.font = '10px Arial';
        ctx.fillText(`h=${node.heuristic}`, node.x, node.y - nodeRadius - 8);
      }
    });
    
  }, [nodes, edges, currentNode, exploredNodes, frontier, path, costs, algorithm, startNode, goalNode]);

  const algorithmInfo = {
    'BFS': {
      name: 'Breadth-First Search',
      structure: 'Queue (FIFO)',
      complete: '✅ Yes',
      optimal: '✅ Yes (unweighted)',
      complexity: 'O(V + E)'
    },
    'DFS': {
      name: 'Depth-First Search',
      structure: 'Stack (LIFO)',
      complete: '⚠️ Not always',
      optimal: '❌ No',
      complexity: 'O(V + E)'
    },
    'UCS': {
      name: 'Uniform Cost Search',
      structure: 'Priority Queue (cost)',
      complete: '✅ Yes',
      optimal: '✅ Yes',
      complexity: 'O(b^d)'
    },
    'GBFS': {
      name: 'Greedy Best-First Search',
      structure: 'Priority Queue (heuristic)',
      complete: '⚠️ Not always',
      optimal: '❌ No',
      complexity: 'O(b^m)'
    },
    'A*': {
      name: 'A* Search',
      structure: 'Priority Queue (f = g + h)',
      complete: '✅ Yes',
      optimal: '✅ Yes (admissible h)',
      complexity: 'O(b^d)'
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Graph Search Algorithms
        </h2>
        <p className="text-gray-600">
          Visualisiere uninformierte und informierte Suchalgorithmen auf Graphen
        </p>
      </div>

      {/* Algorithm Selection */}
      <div className="mb-6 bg-gray-50 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Algorithmus auswählen:
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {Object.keys(algorithmInfo).map(algo => (
            <button
              key={algo}
              onClick={() => {
                setAlgorithm(algo);
                reset();
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                algorithm === algo
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {algo}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Canvas */}
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Graph Visualisierung</h3>
            <button
              onClick={randomizeGraph}
              className="flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
            >
              <Shuffle className="w-4 h-4" />
              Zufälliger Graph
            </button>
          </div>
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className="border-2 border-gray-300 rounded-lg w-full"
            style={{ maxWidth: '100%' }}
          />
          
          {/* Legend */}
          <div className="mt-3 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              <span>Start/Pfad</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 rounded-full"></div>
              <span>Ziel</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
              <span>Aktuell</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
              <span>Frontier</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
              <span>Besucht</span>
            </div>
          </div>
        </div>

        {/* Data Structures */}
        <div>
          <h3 className="text-lg font-semibold mb-3">
            {algorithm === 'BFS' ? 'Queue (FIFO)' : 
             algorithm === 'DFS' ? 'Stack (LIFO)' : 
             'Priority Queue'}
          </h3>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {queueStack.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  {algorithm === 'BFS' ? 'Queue' : algorithm === 'DFS' ? 'Stack' : 'Priority Queue'} ist leer
                </div>
              ) : (
                queueStack.map((item, idx) => (
                  <div 
                    key={idx}
                    className={`p-2 rounded ${
                      idx === 0 && algorithm !== 'DFS' ? 'bg-blue-100 border-2 border-blue-400' :
                      idx === queueStack.length - 1 && algorithm === 'DFS' ? 'bg-blue-100 border-2 border-blue-400' :
                      'bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm">{item}</span>
                      {((algorithm === 'BFS' || algorithm === 'UCS' || algorithm === 'GBFS' || algorithm === 'A*') && idx === 0) && (
                        <span className="text-xs text-blue-600">← Next</span>
                      )}
                      {algorithm === 'DFS' && idx === queueStack.length - 1 && (
                        <span className="text-xs text-blue-600">← Next</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Algorithm Info */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2">
              {algorithmInfo[algorithm].name}
            </h4>
            <div className="text-sm text-purple-800 space-y-1">
              <div><strong>Struktur:</strong> {algorithmInfo[algorithm].structure}</div>
              <div><strong>Vollständig:</strong> {algorithmInfo[algorithm].complete}</div>
              <div><strong>Optimal:</strong> {algorithmInfo[algorithm].optimal}</div>
              <div><strong>Komplexität:</strong> {algorithmInfo[algorithm].complexity}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Schritte</p>
          <p className="text-2xl font-bold text-blue-600">{stepCount}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Frontier Size</p>
          <p className="text-2xl font-bold text-yellow-600">{frontier.length}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Besucht</p>
          <p className="text-2xl font-bold text-gray-600">{exploredNodes.size}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Pfad Länge</p>
          <p className="text-2xl font-bold text-green-600">{path.length || '-'}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              if (!isRunning && frontier.length === 0 && !isComplete) {
                initializeSearch();
              }
              setIsRunning(!isRunning);
            }}
            disabled={isComplete && path.length > 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              isRunning
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                {frontier.length === 0 && !isComplete ? 'Start' : 'Fortsetzen'}
              </>
            )}
          </button>

          <button
            onClick={() => {
              if (frontier.length === 0 && !isComplete) {
                initializeSearch();
              }
              step();
            }}
            disabled={isRunning || isComplete}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <SkipForward className="w-5 h-5" />
            Ein Schritt
          </button>

          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>

        {/* Speed Control */}
        <div>
          <label className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Geschwindigkeit
            </span>
            <span className="text-sm text-gray-600">
              {speed < 300 ? 'Schnell' : speed < 700 ? 'Mittel' : 'Langsam'}
            </span>
          </label>
          <input
            type="range"
            min="100"
            max="1000"
            step="100"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>

      {/* Success Message */}
      {isComplete && path.length > 0 && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-800">
            <Info className="w-5 h-5" />
            <strong>Ziel erreicht!</strong>
          </div>
          <p className="text-sm text-green-700 mt-2">
            Pfad gefunden: {path.join(' → ')} (Länge: {path.length} Knoten, {stepCount} Schritte)
          </p>
        </div>
      )}
    </div>
  );
}

export default GraphSearchPlayground;