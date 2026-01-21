// src/components/playground/QLearningPlayground.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, Zap, Brain, Shuffle } from 'lucide-react';

function QLearningPlayground() {
  // Grid configuration
  const gridSize = 5;
  const cellSize = 80;

  // Q-Learning parameters
  const [alpha, setAlpha] = useState(0.1);        // Learning rate
  const [gamma, setGamma] = useState(0.9);        // Discount factor
  const [epsilon, setEpsilon] = useState(1.0);    // Exploration rate
  const epsilonDecay = 0.995;
  const epsilonMin = 0.01;

  // Training state
  const [isTraining, setIsTraining] = useState(false);
  const [episode, setEpisode] = useState(0);
  const [step, setStep] = useState(0);
  const [totalReward, setTotalReward] = useState(0);
  const [episodeRewards, setEpisodeRewards] = useState([]);

  // Environment state
  const [agentPos, setAgentPos] = useState({ x: 0, y: 0 });
  const [goalPos] = useState({ x: 4, y: 4 });
  const [obstacles, setObstacles] = useState([
    { x: 1, y: 1 },
    { x: 2, y: 2 },
    { x: 3, y: 1 }
  ]);

  // Q-Table: Q[state][action]
  // state = "x,y", actions = ["up", "right", "down", "left"]
  const [qTable, setQTable] = useState({});

  // Action history for visualization
  const [actionHistory, setActionHistory] = useState([]);
  const [currentAction, setCurrentAction] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Selected cell for Q-value display
  const [selectedCell, setSelectedCell] = useState(null);

  const actions = ["up", "right", "down", "left"];
  const actionVectors = {
    "up": { dx: 0, dy: -1 },
    "right": { dx: 1, dy: 0 },
    "down": { dx: 0, dy: 1 },
    "left": { dx: -1, dy: 0 }
  };

  // Initialize Q-Table
  const initializeQTable = () => {
    const newQTable = {};
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const state = `${x},${y}`;
        newQTable[state] = {
          "up": 0,
          "right": 0,
          "down": 0,
          "left": 0
        };
      }
    }
    setQTable(newQTable);
  };

  // Initialize on mount
  useEffect(() => {
    initializeQTable();
  }, []);

  // Get state key
  const getStateKey = (pos) => `${pos.x},${pos.y}`;

  // Check if position is valid
  const isValidPosition = (pos) => {
    if (pos.x < 0 || pos.x >= gridSize || pos.y < 0 || pos.y >= gridSize) {
      return false;
    }
    return !obstacles.some(obs => obs.x === pos.x && obs.y === pos.y);
  };

  // Get next position
  const getNextPosition = (pos, action) => {
    const vector = actionVectors[action];
    return {
      x: pos.x + vector.dx,
      y: pos.y + vector.dy
    };
  };

  // Get reward
  const getReward = (pos) => {
    if (pos.x === goalPos.x && pos.y === goalPos.y) {
      return 100; // Goal reached
    }
    if (!isValidPosition(pos)) {
      return -100; // Hit obstacle or wall
    }
    return -1; // Step penalty
  };

  // Select action (epsilon-greedy)
  const selectAction = (state) => {
    if (Math.random() < epsilon) {
      // Exploration: random action
      return actions[Math.floor(Math.random() * actions.length)];
    } else {
      // Exploitation: best action
      const qValues = qTable[state];
      if (!qValues) return actions[0];

      let bestAction = actions[0];
      let bestValue = qValues[actions[0]];

      for (const action of actions) {
        if (qValues[action] > bestValue) {
          bestValue = qValues[action];
          bestAction = action;
        }
      }

      return bestAction;
    }
  };

  // Get best action for a state (for visualization)
  const getBestAction = (state) => {
    const qValues = qTable[state];
    if (!qValues) return null;

    let bestAction = actions[0];
    let bestValue = qValues[actions[0]];

    for (const action of actions) {
      if (qValues[action] > bestValue) {
        bestValue = qValues[action];
        bestAction = action;
      }
    }

    // Only return if value is significantly positive
    return bestValue > 0.1 ? bestAction : null;
  };

  // Q-Learning update
  const updateQValue = (state, action, reward, nextState) => {
    const currentQ = qTable[state][action];

    // Get max Q-value for next state
    let maxNextQ = 0;
    if (nextState && qTable[nextState]) {
      maxNextQ = Math.max(...actions.map(a => qTable[nextState][a]));
    }

    // Q-Learning formula: Q(s,a) ← Q(s,a) + α[r + γ·max Q(s',a') - Q(s,a)]
    const newQ = currentQ + alpha * (reward + gamma * maxNextQ - currentQ);

    setQTable(prev => ({
      ...prev,
      [state]: {
        ...prev[state],
        [action]: newQ
      }
    }));

    // Store update info for visualization
    setLastUpdate({
      state,
      action,
      currentQ,
      reward,
      maxNextQ,
      newQ,
      formula: `Q(${state},${action}) = ${currentQ.toFixed(2)} + ${alpha} * [${reward} + ${gamma} * ${maxNextQ.toFixed(2)} - ${currentQ.toFixed(2)}] = ${newQ.toFixed(2)}`
    });
  };

  // Run one step
  const runStep = () => {
    const currentState = getStateKey(agentPos);
    const action = selectAction(currentState);

    setCurrentAction(action);

    const nextPos = getNextPosition(agentPos, action);
    const isValid = isValidPosition(nextPos);
    const actualNextPos = isValid ? nextPos : agentPos;
    const reward = getReward(actualNextPos);
    const nextState = getStateKey(actualNextPos);

    // Update Q-Table
    updateQValue(currentState, action, reward, nextState);

    // Update agent position
    setAgentPos(actualNextPos);
    setTotalReward(prev => prev + reward);
    setStep(prev => prev + 1);

    // Add to action history
    setActionHistory(prev => [...prev.slice(-20), {
      state: currentState,
      action,
      reward,
      nextState,
      step: step
    }]);

    // Check if episode is done
    const isGoalReached = actualNextPos.x === goalPos.x && actualNextPos.y === goalPos.y;
    const isMaxSteps = step >= 100;

    if (isGoalReached || isMaxSteps) {
      // Episode finished
      setEpisodeRewards(prev => [...prev, totalReward]);
      setEpisode(prev => prev + 1);

      // Decay epsilon
      setEpsilon(prev => Math.max(epsilonMin, prev * epsilonDecay));

      // Reset for next episode
      setAgentPos({ x: 0, y: 0 });
      setTotalReward(0);
      setStep(0);
      setCurrentAction(null);
    }
  };

  // Training loop
  useEffect(() => {
    if (!isTraining) return;

    const timer = setTimeout(() => {
      runStep();
    }, 100);

    return () => clearTimeout(timer);
  }, [isTraining, agentPos, step, qTable]);

  // BFS to check if path exists from start to goal
  const hasPathToGoal = (obstacleList) => {
    const queue = [{ x: 0, y: 0 }];
    const visited = new Set();
    visited.add('0,0');

    while (queue.length > 0) {
      const current = queue.shift();

      // Check if we reached the goal
      if (current.x === goalPos.x && current.y === goalPos.y) {
        return true;
      }

      // Try all four directions
      for (const action of actions) {
        const vector = actionVectors[action];
        const next = {
          x: current.x + vector.dx,
          y: current.y + vector.dy
        };

        const key = `${next.x},${next.y}`;

        // Check if valid and not visited
        if (
          next.x >= 0 && next.x < gridSize &&
          next.y >= 0 && next.y < gridSize &&
          !obstacleList.some(obs => obs.x === next.x && obs.y === next.y) &&
          !visited.has(key)
        ) {
          visited.add(key);
          queue.push(next);
        }
      }
    }

    return false;
  };

  // Generate random obstacles with guaranteed path
  const randomizeObstacles = () => {
    let newObstacles = [];
    let attempts = 0;
    const maxAttempts = 100;

    do {
      newObstacles = [];
      const numObstacles = Math.floor(Math.random() * 6) + 3; // 3-8 obstacles

      for (let i = 0; i < numObstacles; i++) {
        let x, y;
        let isValid = false;

        // Try to find a valid position
        for (let j = 0; j < 50; j++) {
          x = Math.floor(Math.random() * gridSize);
          y = Math.floor(Math.random() * gridSize);

          // Don't place obstacle on start or goal
          const isStart = x === 0 && y === 0;
          const isGoal = x === goalPos.x && y === goalPos.y;
          const isDuplicate = newObstacles.some(obs => obs.x === x && obs.y === y);

          if (!isStart && !isGoal && !isDuplicate) {
            isValid = true;
            break;
          }
        }

        if (isValid) {
          newObstacles.push({ x, y });
        }
      }

      attempts++;
    } while (!hasPathToGoal(newObstacles) && attempts < maxAttempts);

    // If we couldn't find a valid configuration, use a simple safe one
    if (!hasPathToGoal(newObstacles)) {
      newObstacles = [
        { x: 1, y: 1 },
        { x: 3, y: 3 }
      ];
    }

    setObstacles(newObstacles);

    // Reset the agent and Q-table when obstacles change
    setIsTraining(false);
    setEpisode(0);
    setStep(0);
    setTotalReward(0);
    setEpisodeRewards([]);
    setAgentPos({ x: 0, y: 0 });
    setEpsilon(1.0);
    setActionHistory([]);
    setCurrentAction(null);
    setLastUpdate(null);
    setSelectedCell(null);
    initializeQTable();
  };

  // Reset everything
  const reset = () => {
    setIsTraining(false);
    setEpisode(0);
    setStep(0);
    setTotalReward(0);
    setEpisodeRewards([]);
    setAgentPos({ x: 0, y: 0 });
    setEpsilon(1.0);
    setActionHistory([]);
    setCurrentAction(null);
    setLastUpdate(null);
    initializeQTable();
  };

  // Get arrow for action
  const getActionArrow = (action) => {
    switch (action) {
      case "up": return "↑";
      case "right": return "→";
      case "down": return "↓";
      case "left": return "←";
      default: return "";
    }
  };

  // Get color for Q-value
  const getQColor = (value) => {
    if (value > 50) return "text-green-600 font-bold";
    if (value > 20) return "text-green-500";
    if (value > 0) return "text-blue-500";
    if (value > -10) return "text-gray-400";
    return "text-red-500";
  };

  // Handle cell click
  const handleCellClick = (x, y) => {
    setSelectedCell({ x, y });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Q-Learning Playground
        </h2>
        <p className="text-gray-600">
          Trainiere einen Agenten mit Q-Learning und beobachte die Q-Tabelle live!
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Grid Environment */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Environment & Agent</h3>
          <div className="inline-block border-4 border-gray-800 rounded-lg p-2 bg-gray-50">
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
              gap: '2px'
            }}>
              {Array.from({ length: gridSize }).map((_, y) =>
                Array.from({ length: gridSize }).map((_, x) => {
                  const isAgent = agentPos.x === x && agentPos.y === y;
                  const isGoal = goalPos.x === x && goalPos.y === y;
                  const isObstacle = obstacles.some(obs => obs.x === x && obs.y === y);
                  const isSelected = selectedCell && selectedCell.x === x && selectedCell.y === y;
                  const bestAction = getBestAction(`${x},${y}`);

                  return (
                    <div
                      key={`${x}-${y}`}
                      onClick={() => handleCellClick(x, y)}
                      className={`relative border-2 cursor-pointer transition-all ${
                        isSelected ? 'border-blue-500 border-4' : 'border-gray-300'
                      }`}
                      style={{
                        width: cellSize,
                        height: cellSize,
                        backgroundColor: isGoal ? '#86efac' : isObstacle ? '#1f2937' : '#ffffff'
                      }}
                    >
                      {/* Best action arrow */}
                      {bestAction && !isAgent && !isGoal && !isObstacle && (
                        <div className="absolute inset-0 flex items-center justify-center text-4xl text-blue-400 opacity-50">
                          {getActionArrow(bestAction)}
                        </div>
                      )}

                      {/* Agent */}
                      {isAgent && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-red-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white text-2xl">
                            🤖
                          </div>
                          {currentAction && (
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded text-sm font-bold">
                              {getActionArrow(currentAction)}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Goal */}
                      {isGoal && (
                        <div className="absolute inset-0 flex items-center justify-center text-4xl">
                          🎯
                        </div>
                      )}

                      {/* Coordinates */}
                      <div className="absolute top-1 left-1 text-xs text-gray-400">
                        {x},{y}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span>Agent 🤖</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-300 rounded"></div>
              <span>Goal 🎯</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-800 rounded"></div>
              <span>Obstacle</span>
            </div>
          </div>
        </div>

        {/* Q-Table Visualization */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Q-Table {selectedCell && `(${selectedCell.x},${selectedCell.y})`}</h3>

          {selectedCell ? (
            <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4">
              <div className="mb-3">
                <h4 className="font-bold text-purple-900">State: ({selectedCell.x}, {selectedCell.y})</h4>
              </div>

              <div className="space-y-2">
                {actions.map(action => {
                  const state = getStateKey(selectedCell);
                  const qValue = qTable[state]?.[action] || 0;
                  const isBest = getBestAction(state) === action;

                  return (
                    <div
                      key={action}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        isBest ? 'bg-green-200 border-2 border-green-500' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getActionArrow(action)}</span>
                        <span className="font-semibold capitalize">{action}</span>
                        {isBest && <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">BEST</span>}
                      </div>
                      <span className={`text-lg font-mono ${getQColor(qValue)}`}>
                        {qValue.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-8 text-center text-gray-500">
              <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Klicke auf eine Zelle im Grid um die Q-Werte zu sehen</p>
            </div>
          )}

          {/* Last Update Formula */}
          {lastUpdate && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-bold text-blue-900 mb-2">Latest Q-Update:</h4>
              <div className="space-y-2 text-sm">
                <div className="bg-white rounded p-2 font-mono text-xs overflow-x-auto">
                  Q({lastUpdate.state}, {lastUpdate.action}) = {lastUpdate.currentQ.toFixed(2)} + {alpha} × [
                  <span className="text-green-600">{lastUpdate.reward}</span> +
                  {gamma} × <span className="text-blue-600">{lastUpdate.maxNextQ.toFixed(2)}</span> -
                  {lastUpdate.currentQ.toFixed(2)}]
                </div>
                <div className="bg-green-100 rounded p-2 font-mono text-xs font-bold text-center">
                  New Q-Value = {lastUpdate.newQ.toFixed(2)}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><strong>Reward (r):</strong> {lastUpdate.reward}</div>
                  <div><strong>Max Q(s',a'):</strong> {lastUpdate.maxNextQ.toFixed(2)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Episode</p>
          <p className="text-2xl font-bold text-purple-600">{episode}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Steps</p>
          <p className="text-2xl font-bold text-blue-600">{step}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Total Reward</p>
          <p className={`text-2xl font-bold ${totalReward >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalReward}
          </p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Epsilon (ε)</p>
          <p className="text-2xl font-bold text-orange-600">{epsilon.toFixed(3)}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Position</p>
          <p className="text-lg font-bold text-red-600">({agentPos.x}, {agentPos.y})</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Status</p>
          <p className="text-lg font-bold text-gray-600">
            {isTraining ? '🔄 Training' : episode > 0 ? '✅ Ready' : '⏸️ Ready'}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setIsTraining(!isTraining)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              isTraining
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isTraining ? (
              <>
                <Pause className="w-5 h-5" />
                Stop Training
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Start Training
              </>
            )}
          </button>

          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>

          <button
            onClick={randomizeObstacles}
            disabled={isTraining}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all disabled:opacity-50"
          >
            <Shuffle className="w-5 h-5" />
            Randomize Walls
          </button>

          <button
            onClick={runStep}
            disabled={isTraining}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all disabled:opacity-50"
          >
            <Zap className="w-5 h-5" />
            Single Step
          </button>
        </div>

        {/* Hyperparameters */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Learning Rate (α)</span>
              <span className="text-sm text-gray-600">{alpha.toFixed(3)}</span>
            </label>
            <input
              type="range"
              min="0.01"
              max="1.0"
              step="0.01"
              value={alpha}
              onChange={(e) => setAlpha(parseFloat(e.target.value))}
              disabled={isTraining}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Discount Factor (γ)</span>
              <span className="text-sm text-gray-600">{gamma.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="0.1"
              max="0.99"
              step="0.01"
              value={gamma}
              onChange={(e) => setGamma(parseFloat(e.target.value))}
              disabled={isTraining}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Initial Epsilon (ε)</span>
              <span className="text-sm text-gray-600">{epsilon.toFixed(3)}</span>
            </label>
            <input
              type="range"
              min="0.01"
              max="1.0"
              step="0.01"
              value={epsilon}
              onChange={(e) => setEpsilon(parseFloat(e.target.value))}
              disabled={isTraining}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {/* Action History */}
      {actionHistory.length > 0 && (
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Recent Actions</h3>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {actionHistory.slice(-10).reverse().map((item, idx) => (
              <div key={idx} className="text-sm flex items-center justify-between bg-white rounded px-3 py-2">
                <span>
                  <span className="font-mono text-xs text-gray-500">Step {item.step}:</span>{' '}
                  State <strong>{item.state}</strong> → Action <strong className="text-blue-600">{getActionArrow(item.action)}</strong>
                </span>
                <span className={`font-bold ${item.reward > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.reward > 0 ? '+' : ''}{item.reward}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 How to use:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click <strong>Start Training</strong> to watch the agent learn</li>
          <li>• Click <strong>Randomize Walls</strong> to generate a new maze layout with guaranteed path to goal</li>
          <li>• Click <strong>Single Step</strong> to step through one action at a time</li>
          <li>• Click on any grid cell to see its Q-values for all actions</li>
          <li>• Blue arrows show the learned policy (best action per state)</li>
          <li>• Watch epsilon (ε) decrease = agent explores less, exploits more</li>
          <li>• Adjust α, γ to see how they affect learning speed and quality</li>
        </ul>
      </div>
    </div>
  );
}

export default QLearningPlayground;
