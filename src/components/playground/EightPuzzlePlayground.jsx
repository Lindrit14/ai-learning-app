// src/components/playground/EightPuzzlePlayground.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Shuffle, Target, TrendingUp } from 'lucide-react';

function EightPuzzlePlayground() {
  // Puzzle state: 0 represents blank tile
  const goalState = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  
  const [currentState, setCurrentState] = useState([1, 2, 3, 4, 5, 6, 7, 8, 0]);
  const [heuristic, setHeuristic] = useState('manhattan'); // 'hamming' or 'manhattan'
  const [isRunning, setIsRunning] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  
  // A* search state
  const [openList, setOpenList] = useState([]);
  const [closedList, setClosedList] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);
  const [solutionPath, setSolutionPath] = useState([]);
  const [pathIndex, setPathIndex] = useState(0);
  
  // Statistics
  const [nodesGenerated, setNodesGenerated] = useState(0);
  const [nodesExpanded, setNodesExpanded] = useState(0);
  const [solutionDepth, setSolutionDepth] = useState(0);
  const [effectiveBranchingFactor, setEffectiveBranchingFactor] = useState(0);
  
  // Speed control
  const [speed, setSpeed] = useState(500);
  
  // Animation state
  const [animatingMove, setAnimatingMove] = useState(null);

  // Get blank position
  const getBlankPos = (state) => {
    const idx = state.indexOf(0);
    return { row: Math.floor(idx / 3), col: idx % 3 };
  };

  // Get position of tile value
  const getTilePos = (state, value) => {
    const idx = state.indexOf(value);
    return { row: Math.floor(idx / 3), col: idx % 3 };
  };

  // Manhattan distance between two positions
  const manhattanDistance = (pos1, pos2) => {
    return Math.abs(pos1.row - pos2.row) + Math.abs(pos1.col - pos2.col);
  };

  // Hamming distance (h1): number of misplaced tiles
  const hammingDistance = (state) => {
    let count = 0;
    for (let i = 0; i < 9; i++) {
      if (state[i] !== 0 && state[i] !== goalState[i]) {
        count++;
      }
    }
    return count;
  };

  // Manhattan distance (h2): sum of distances from goal
  const manhattanHeuristic = (state) => {
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      if (state[i] !== 0) {
        const currentPos = { row: Math.floor(i / 3), col: i % 3 };
        const goalPos = getTilePos(goalState, state[i]);
        sum += manhattanDistance(currentPos, goalPos);
      }
    }
    return sum;
  };

  // Get heuristic value
  const getHeuristic = (state) => {
    return heuristic === 'hamming' ? hammingDistance(state) : manhattanHeuristic(state);
  };

  // Get possible moves (adjacent to blank)
  const getPossibleMoves = (state) => {
    const blankIdx = state.indexOf(0);
    const blankPos = getBlankPos(state);
    const moves = [];

    // Up
    if (blankPos.row > 0) {
      const newState = [...state];
      const swapIdx = blankIdx - 3;
      [newState[blankIdx], newState[swapIdx]] = [newState[swapIdx], newState[blankIdx]];
      moves.push({ state: newState, action: 'UP', tile: state[swapIdx] });
    }

    // Down
    if (blankPos.row < 2) {
      const newState = [...state];
      const swapIdx = blankIdx + 3;
      [newState[blankIdx], newState[swapIdx]] = [newState[swapIdx], newState[blankIdx]];
      moves.push({ state: newState, action: 'DOWN', tile: state[swapIdx] });
    }

    // Left
    if (blankPos.col > 0) {
      const newState = [...state];
      const swapIdx = blankIdx - 1;
      [newState[blankIdx], newState[swapIdx]] = [newState[swapIdx], newState[blankIdx]];
      moves.push({ state: newState, action: 'LEFT', tile: state[swapIdx] });
    }

    // Right
    if (blankPos.col < 2) {
      const newState = [...state];
      const swapIdx = blankIdx + 1;
      [newState[blankIdx], newState[swapIdx]] = [newState[swapIdx], newState[blankIdx]];
      moves.push({ state: newState, action: 'RIGHT', tile: state[swapIdx] });
    }

    return moves;
  };

  // Check if state is goal
  const isGoalState = (state) => {
    return state.every((val, idx) => val === goalState[idx]);
  };

  // State to string for comparison
  const stateToString = (state) => state.join(',');

  // Shuffle puzzle
  const shufflePuzzle = () => {
    let state = [...goalState];
    
    // Make 50 random valid moves
    for (let i = 0; i < 50; i++) {
      const moves = getPossibleMoves(state);
      const randomMove = moves[Math.floor(Math.random() * moves.length)];
      state = randomMove.state;
    }
    
    setCurrentState(state);
    reset();
  };

  // Reset search
  const reset = () => {
    setIsRunning(false);
    setIsSolved(false);
    setOpenList([]);
    setClosedList([]);
    setCurrentNode(null);
    setSolutionPath([]);
    setPathIndex(0);
    setNodesGenerated(0);
    setNodesExpanded(0);
    setSolutionDepth(0);
    setEffectiveBranchingFactor(0);
    setAnimatingMove(null);
  };

  // Calculate effective branching factor
  const calculateEBF = (n, d) => {
    if (d === 0) return 0;
    
    // Binary search for b* such that b* + b*^2 + ... + b*^d = n
    let low = 1.0;
    let high = 10.0;
    const epsilon = 0.01;
    
    while (high - low > epsilon) {
      const mid = (low + high) / 2;
      let sum = 0;
      for (let i = 1; i <= d; i++) {
        sum += Math.pow(mid, i);
      }
      
      if (sum < n) {
        low = mid;
      } else {
        high = mid;
      }
    }
    
    return (low + high) / 2;
  };

  // A* search algorithm
  const startSearch = () => {
    if (isGoalState(currentState)) {
      setIsSolved(true);
      return;
    }

    const startNode = {
      state: currentState,
      g: 0,
      h: getHeuristic(currentState),
      f: getHeuristic(currentState),
      parent: null,
      action: null
    };

    setOpenList([startNode]);
    setClosedList([]);
    setNodesGenerated(1);
    setIsRunning(true);
  };

  // One step of A*
  const stepSearch = () => {
    if (openList.length === 0) {
      setIsRunning(false);
      return;
    }

    // Get node with lowest f
    openList.sort((a, b) => a.f - b.f);
    const current = openList.shift();
    
    setCurrentNode(current);
    setClosedList(prev => [...prev, stateToString(current.state)]);
    setNodesExpanded(prev => prev + 1);

    // Check if goal
    if (isGoalState(current.state)) {
      // Reconstruct path
      const path = [];
      let node = current;
      while (node) {
        path.unshift(node);
        node = node.parent;
      }
      
      setSolutionPath(path);
      setSolutionDepth(path.length - 1);
      setIsSolved(true);
      setIsRunning(false);
      
      // Calculate effective branching factor
      const ebf = calculateEBF(nodesGenerated, path.length - 1);
      setEffectiveBranchingFactor(ebf);
      
      return;
    }

    // Expand node
    const moves = getPossibleMoves(current.state);
    const newOpenList = [...openList];

    moves.forEach(move => {
      const stateStr = stateToString(move.state);
      
      // Skip if in closed list
      if (closedList.includes(stateStr)) return;
      
      const g = current.g + 1;
      const h = getHeuristic(move.state);
      const f = g + h;
      
      // Check if already in open list
      const existingIdx = newOpenList.findIndex(n => stateToString(n.state) === stateStr);
      
      if (existingIdx === -1) {
        // Add new node
        newOpenList.push({
          state: move.state,
          g,
          h,
          f,
          parent: current,
          action: move.action,
          tile: move.tile
        });
        setNodesGenerated(prev => prev + 1);
      } else if (g < newOpenList[existingIdx].g) {
        // Update if better path
        newOpenList[existingIdx] = {
          state: move.state,
          g,
          h,
          f,
          parent: current,
          action: move.action,
          tile: move.tile
        };
      }
    });

    setOpenList(newOpenList);
  };

  // Auto-step when running
  useEffect(() => {
    if (!isRunning) return;
    
    const timer = setTimeout(() => {
      stepSearch();
    }, speed);
    
    return () => clearTimeout(timer);
  }, [isRunning, openList, closedList, nodesGenerated]);

  // Animate solution
  useEffect(() => {
    if (!isSolved || solutionPath.length === 0) return;
    if (pathIndex >= solutionPath.length) return;
    
    const timer = setTimeout(() => {
      setCurrentState(solutionPath[pathIndex].state);
      if (pathIndex < solutionPath.length - 1) {
        setAnimatingMove(solutionPath[pathIndex + 1].tile);
      }
      setPathIndex(prev => prev + 1);
    }, 600);
    
    return () => clearTimeout(timer);
  }, [isSolved, solutionPath, pathIndex]);

  // Render puzzle
  const renderPuzzle = (state, showValues = true) => {
    return (
      <div className="grid grid-cols-3 gap-2 w-64 h-64 bg-gray-200 p-2 rounded-lg">
        {state.map((tile, idx) => {
          const isBlank = tile === 0;
          const isAnimating = animatingMove === tile;
          
          return (
            <div
              key={idx}
              className={`flex items-center justify-center text-2xl font-bold rounded-lg transition-all ${
                isBlank 
                  ? 'bg-gray-300' 
                  : isAnimating
                  ? 'bg-blue-400 text-white scale-110'
                  : 'bg-white text-gray-900 shadow-md'
              }`}
            >
              {!isBlank && showValues && tile}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          8-Puzzle Problem mit A*
        </h2>
        <p className="text-gray-600">
          Visualisiere A* Search mit verschiedenen Heuristiken (Hamming vs Manhattan Distance)
        </p>
      </div>

      {/* Heuristic Selection */}
      <div className="mb-6 bg-gray-50 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Heuristik auswählen:
        </label>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setHeuristic('hamming');
              reset();
            }}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
              heuristic === 'hamming'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            <div className="text-left">
              <div>h₁: Hamming Distance</div>
              <div className="text-xs opacity-75">Misplaced Tiles</div>
            </div>
          </button>
          <button
            onClick={() => {
              setHeuristic('manhattan');
              reset();
            }}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
              heuristic === 'manhattan'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            <div className="text-left">
              <div>h₂: Manhattan Distance</div>
              <div className="text-xs opacity-75">Sum of Distances</div>
            </div>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Puzzle Display */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Current State</h3>
            <button
              onClick={shufflePuzzle}
              disabled={isRunning}
              className="flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm disabled:opacity-50"
            >
              <Shuffle className="w-4 h-4" />
              Shuffle
            </button>
          </div>
          
          <div className="flex justify-center mb-4">
            {renderPuzzle(currentState)}
          </div>

          {/* Goal State */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Goal State:</h3>
            <div className="flex justify-center">
              <div className="scale-75 origin-top">
                {renderPuzzle(goalState)}
              </div>
            </div>
          </div>
        </div>

        {/* Heuristic Calculation */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Heuristic Values</h3>
          
          <div className="space-y-4">
            {/* Current State Heuristics */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Current State:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>h₁ (Hamming):</span>
                  <span className="font-bold">{hammingDistance(currentState)} misplaced tiles</span>
                </div>
                <div className="flex justify-between">
                  <span>h₂ (Manhattan):</span>
                  <span className="font-bold">{manhattanHeuristic(currentState)} total distance</span>
                </div>
                {currentNode && (
                  <>
                    <div className="border-t border-blue-300 my-2"></div>
                    <div className="flex justify-between">
                      <span>g (depth):</span>
                      <span className="font-bold">{currentNode.g}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>h (heuristic):</span>
                      <span className="font-bold">{currentNode.h}</span>
                    </div>
                    <div className="flex justify-between text-blue-800">
                      <span className="font-semibold">f = g + h:</span>
                      <span className="font-bold text-lg">{currentNode.f}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* A* Formula */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-2">A* Evaluation Function:</h4>
              <div className="bg-white p-3 rounded font-mono text-sm border border-purple-300 mb-2">
                f(n) = g(n) + h(n)
              </div>
              <div className="text-xs text-purple-800 space-y-1">
                <div><strong>g(n):</strong> Cost from start to n</div>
                <div><strong>h(n):</strong> Estimated cost from n to goal</div>
                <div><strong>f(n):</strong> Estimated total cost</div>
              </div>
            </div>

            {/* Open List Preview */}
            {openList.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-2">
                  Open List (Top 3):
                </h4>
                <div className="space-y-1 text-xs">
                  {openList.slice(0, 3).map((node, idx) => (
                    <div key={idx} className="bg-white rounded p-2 flex justify-between">
                      <span>Node {idx + 1}</span>
                      <span className="font-mono">
                        f={node.f} (g={node.g}, h={node.h})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Nodes Generated</p>
          <p className="text-2xl font-bold text-blue-600">{nodesGenerated}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Nodes Expanded</p>
          <p className="text-2xl font-bold text-purple-600">{nodesExpanded}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Solution Depth</p>
          <p className="text-2xl font-bold text-green-600">{solutionDepth || '-'}</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">EBF (b*)</p>
          <p className="text-2xl font-bold text-orange-600">
            {effectiveBranchingFactor ? effectiveBranchingFactor.toFixed(2) : '-'}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Open List Size</p>
          <p className="text-2xl font-bold text-gray-600">{openList.length}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              if (openList.length === 0 && !isSolved) {
                startSearch();
              } else {
                setIsRunning(!isRunning);
              }
            }}
            disabled={isSolved}
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
                {openList.length === 0 ? 'Start A*' : 'Continue'}
              </>
            )}
          </button>

          <button
            onClick={() => {
              if (openList.length === 0 && !isSolved) {
                startSearch();
              }
              stepSearch();
            }}
            disabled={isRunning || isSolved}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <SkipForward className="w-5 h-5" />
            Step
          </button>

          <button
            onClick={() => {
              reset();
              setCurrentState([...goalState]);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            Reset to Goal
          </button>
        </div>

        {/* Speed Control */}
        <div>
          <label className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Speed</span>
            <span className="text-sm text-gray-600">
              {speed < 300 ? 'Fast' : speed < 700 ? 'Medium' : 'Slow'}
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

      {/* Solution Found */}
      {isSolved && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-800 mb-2">
            <Target className="w-5 h-5" />
            <strong>Solution Found!</strong>
          </div>
          <div className="text-sm text-green-700 space-y-1">
            <div>Path Length: <strong>{solutionDepth} moves</strong></div>
            <div>Nodes Generated: <strong>{nodesGenerated}</strong></div>
            <div>Effective Branching Factor (b*): <strong>{effectiveBranchingFactor.toFixed(3)}</strong></div>
            <div className="mt-2 text-xs">
              Lower b* means more efficient search! Manhattan typically has lower b* than Hamming.
            </div>
          </div>
        </div>
      )}

      {/* EBF Explanation */}
      <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Effective Branching Factor (b*)
        </h3>
        <div className="text-sm text-orange-800 space-y-2">
          <div className="bg-white rounded p-2 font-mono text-xs">
            N = b* + b*² + b*³ + ... + b*^d
          </div>
          <div>
            <strong>N:</strong> Total nodes generated = {nodesGenerated}
          </div>
          <div>
            <strong>d:</strong> Solution depth = {solutionDepth}
          </div>
          <div>
            <strong>b*:</strong> Effective branching factor ≈ {effectiveBranchingFactor.toFixed(3)}
          </div>
          <div className="pt-2 border-t border-orange-300">
            Ein kleinerer b* bedeutet effizientere Suche. 
            Manhattan Distance hat typischerweise einen niedrigeren b* als Hamming Distance!
          </div>
        </div>
      </div>
    </div>
  );
}

export default EightPuzzlePlayground;