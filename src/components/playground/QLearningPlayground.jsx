// src/components/playground/QLearningPlayground.jsx
import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Play, Pause, RotateCcw, Zap, Award, Target } from 'lucide-react';

function QLearningPlayground() {
  // Grid settings
  const gridSize = 5;
  const cellSize = 80;
  const canvasWidth = gridSize * cellSize;
  const canvasHeight = gridSize * cellSize;
  
  const canvasRef = useRef(null);
  
  // Agent state
  const [agentPos, setAgentPos] = useState({ x: 0, y: 0 });
  const [goalPos] = useState({ x: 4, y: 4 });
  const [obstacles] = useState([
    { x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 1 }
  ]);
  
  // Q-Learning parameters
  const [qTable, setQTable] = useState({});
  const [learningRate, setLearningRate] = useState(0.1);
  const [discountFactor, setDiscountFactor] = useState(0.9);
  const [epsilon, setEpsilon] = useState(1.0);
  const [epsilonDecay] = useState(0.995);
  
  // Training state
  const [isTraining, setIsTraining] = useState(false);
  const [episode, setEpisode] = useState(0);
  const [totalReward, setTotalReward] = useState(0);
  const [stepCount, setStepCount] = useState(0);
  const [rewardHistory, setRewardHistory] = useState([]);
  const [currentAction, setCurrentAction] = useState(null);
  
  // Actions: 0=UP, 1=RIGHT, 2=DOWN, 3=LEFT
  const actions = ['↑', '→', '↓', '←'];
  const actionVectors = [
    { x: 0, y: -1 },  // UP
    { x: 1, y: 0 },   // RIGHT
    { x: 0, y: 1 },   // DOWN
    { x: -1, y: 0 }   // LEFT
  ];

  // Initialize Q-Table
  useEffect(() => {
    const newQTable = {};
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const state = `${x},${y}`;
        newQTable[state] = [0, 0, 0, 0]; // Q-values for each action
      }
    }
    setQTable(newQTable);
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

  // Get reward for a position
  const getReward = (pos) => {
    if (pos.x === goalPos.x && pos.y === goalPos.y) {
      return 100; // Goal reward
    }
    if (obstacles.some(obs => obs.x === pos.x && obs.y === pos.y)) {
      return -100; // Obstacle penalty
    }
    return -1; // Step penalty
  };

  // Choose action (epsilon-greedy)
  const chooseAction = (state, currentEpsilon) => {
    if (Math.random() < currentEpsilon) {
      // Exploration: random action
      return Math.floor(Math.random() * 4);
    } else {
      // Exploitation: best action
      const qValues = qTable[state] || [0, 0, 0, 0];
      return qValues.indexOf(Math.max(...qValues));
    }
  };

  // Get next position after action
  const getNextPosition = (pos, action) => {
    const vector = actionVectors[action];
    return {
      x: pos.x + vector.x,
      y: pos.y + vector.y
    };
  };

  // Update Q-value using Q-Learning formula
  const updateQValue = (state, action, reward, nextState) => {
    const currentQ = qTable[state][action];
    const maxNextQ = Math.max(...(qTable[nextState] || [0, 0, 0, 0]));
    
    // Q-Learning formula: Q(s,a) = Q(s,a) + α[r + γ*max(Q(s',a')) - Q(s,a)]
    const newQ = currentQ + learningRate * (reward + discountFactor * maxNextQ - currentQ);
    
    const newQTable = { ...qTable };
    newQTable[state] = [...newQTable[state]];
    newQTable[state][action] = newQ;
    
    return newQTable;
  };

  // Run one step of Q-Learning
  const runStep = async () => {
    const currentState = getStateKey(agentPos);
    
    // Choose action
    const action = chooseAction(currentState, epsilon);
    setCurrentAction(action);
    
    // Get next position
    const nextPos = getNextPosition(agentPos, action);
    
    // Check if valid move
    let actualNextPos = nextPos;
    let reward = -1;
    
    if (isValidPosition(nextPos)) {
      actualNextPos = nextPos;
      reward = getReward(nextPos);
    } else {
      // Stay in place if invalid move
      actualNextPos = agentPos;
      reward = -10; // Penalty for hitting wall/obstacle
    }
    
    const nextState = getStateKey(actualNextPos);
    
    // Update Q-Table
    const newQTable = updateQValue(currentState, action, reward, nextState);
    setQTable(newQTable);
    
    // Update agent position
    setAgentPos(actualNextPos);
    setTotalReward(prev => prev + reward);
    setStepCount(prev => prev + 1);
    
    // Check if reached goal
    if (actualNextPos.x === goalPos.x && actualNextPos.y === goalPos.y) {
      return true; // Episode complete
    }
    
    return false;
  };

  // Run one episode
  const runEpisode = async () => {
    setAgentPos({ x: 0, y: 0 });
    setTotalReward(0);
    setStepCount(0);
    
    let episodeComplete = false;
    let steps = 0;
    const maxSteps = 50;
    
    while (!episodeComplete && steps < maxSteps) {
      episodeComplete = await runStep();
      steps++;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setEpisode(prev => prev + 1);
    setEpsilon(prev => Math.max(0.01, prev * epsilonDecay));
    setRewardHistory(prev => [...prev, totalReward].slice(-20));
  };

  // Training loop
  useEffect(() => {
    if (!isTraining) return;
    
    const timer = setTimeout(() => {
      runEpisode();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [isTraining, episode]);

  // Reset everything
  const reset = () => {
    setIsTraining(false);
    setAgentPos({ x: 0, y: 0 });
    setEpisode(0);
    setTotalReward(0);
    setStepCount(0);
    setEpsilon(1.0);
    setRewardHistory([]);
    setCurrentAction(null);
    
    // Reset Q-Table
    const newQTable = {};
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const state = `${x},${y}`;
        newQTable[state] = [0, 0, 0, 0];
      }
    }
    setQTable(newQTable);
  };

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw grid
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    for (let i = 0; i <= gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvasHeight);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvasWidth, i * cellSize);
      ctx.stroke();
    }
    
    // Draw obstacles
    obstacles.forEach(obs => {
      ctx.fillStyle = '#374151';
      ctx.fillRect(obs.x * cellSize + 2, obs.y * cellSize + 2, cellSize - 4, cellSize - 4);
    });
    
    // Draw goal
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(
      goalPos.x * cellSize + cellSize / 2,
      goalPos.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Draw goal star
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★', goalPos.x * cellSize + cellSize / 2, goalPos.y * cellSize + cellSize / 2);
    
    // Draw Q-values as arrows in each cell
    ctx.font = '12px Arial';
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const state = `${x},${y}`;
        const qValues = qTable[state] || [0, 0, 0, 0];
        const maxQ = Math.max(...qValues);
        const bestAction = qValues.indexOf(maxQ);
        
        // Skip obstacles and goal
        if (obstacles.some(obs => obs.x === x && obs.y === y)) continue;
        if (x === goalPos.x && y === goalPos.y) continue;
        
        // Draw best action arrow
        if (maxQ > 0) {
          ctx.fillStyle = '#3b82f6';
          ctx.font = 'bold 20px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(
            actions[bestAction],
            x * cellSize + cellSize / 2,
            y * cellSize + cellSize / 2
          );
        }
      }
    }
    
    // Draw agent
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(
      agentPos.x * cellSize + cellSize / 2,
      agentPos.y * cellSize + cellSize / 2,
      cellSize / 4,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Draw agent face
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🤖', agentPos.x * cellSize + cellSize / 2, agentPos.y * cellSize + cellSize / 2);
    
  }, [agentPos, qTable, obstacles, goalPos]);

  // Get best Q-value for display
  const getBestQValue = (state) => {
    const qValues = qTable[state] || [0, 0, 0, 0];
    return Math.max(...qValues);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Q-Learning Playground
        </h2>
        <p className="text-gray-600">
          Watch the agent learn to navigate from start (🤖) to goal (★) using Q-Learning reinforcement learning!
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Canvas */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Environment</h3>
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className="border-2 border-gray-300 rounded-lg"
          />
          <div className="mt-3 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 rounded-full"></div>
              <span>Agent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              <span>Goal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-700"></div>
              <span>Obstacle</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600 font-bold text-xl">↑</span>
              <span>Policy</span>
            </div>
          </div>
        </div>

        {/* Q-Table Sample */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Q-Table (Current Position)</h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="mb-3">
              <span className="text-sm font-medium text-gray-700">
                State: ({agentPos.x}, {agentPos.y})
              </span>
            </div>
            <div className="space-y-2">
              {actions.map((action, idx) => {
                const state = getStateKey(agentPos);
                const qValue = qTable[state]?.[idx] || 0;
                const isCurrentAction = currentAction === idx;
                const isBestAction = qValue === Math.max(...(qTable[state] || [0, 0, 0, 0]));
                
                return (
                  <div key={idx} className={`flex items-center justify-between p-2 rounded ${
                    isCurrentAction ? 'bg-blue-100 border-2 border-blue-400' : 'bg-white'
                  }`}>
                    <span className="font-medium">
                      {action} {isBestAction && qValue > 0 && '⭐'}
                    </span>
                    <span className={`font-mono ${qValue > 0 ? 'text-green-600' : qValue < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                      {qValue.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* Q-Learning Formula */}
            <div className="mt-4 pt-4 border-t border-gray-300">
              <p className="text-xs font-semibold text-gray-700 mb-2">Q-Learning Update:</p>
              <div className="bg-white p-2 rounded text-xs font-mono border border-gray-200">
                Q(s,a) ← Q(s,a) + α[r + γ·max Q(s',a') - Q(s,a)]
              </div>
              <div className="mt-2 text-xs text-gray-600 space-y-1">
                <div>α (alpha) = {learningRate} - Learning Rate</div>
                <div>γ (gamma) = {discountFactor} - Discount Factor</div>
                <div>ε (epsilon) = {epsilon.toFixed(3)} - Exploration Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Episode</p>
          <p className="text-2xl font-bold text-blue-600">{episode}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Total Reward</p>
          <p className="text-2xl font-bold text-green-600">{totalReward.toFixed(0)}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Steps</p>
          <p className="text-2xl font-bold text-purple-600">{stepCount}</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Epsilon</p>
          <p className="text-2xl font-bold text-orange-600">{epsilon.toFixed(3)}</p>
        </div>
        <div className="bg-pink-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Best Q</p>
          <p className="text-2xl font-bold text-pink-600">
            {getBestQValue(getStateKey(agentPos)).toFixed(2)}
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
            onClick={runEpisode}
            disabled={isTraining}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Zap className="w-5 h-5" />
            Run 1 Episode
          </button>

          <button
            onClick={reset}
            disabled={isTraining}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>

        {/* Hyperparameters */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Learning Rate (α)
              </span>
              <span className="text-sm text-gray-600">{learningRate.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="0.01"
              max="1.0"
              step="0.01"
              value={learningRate}
              onChange={(e) => setLearningRate(parseFloat(e.target.value))}
              disabled={isTraining}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Discount Factor (γ)
              </span>
              <span className="text-sm text-gray-600">{discountFactor.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="0.1"
              max="0.99"
              step="0.01"
              value={discountFactor}
              onChange={(e) => setDiscountFactor(parseFloat(e.target.value))}
              disabled={isTraining}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-semibold text-purple-900 mb-2">🎓 How Q-Learning Works:</h3>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• Agent starts at top-left, goal is bottom-right ★</li>
          <li>• Agent learns by trial and error (exploration vs exploitation)</li>
          <li>• Q-Table stores "quality" values for each state-action pair</li>
          <li>• Blue arrows show the learned optimal policy</li>
          <li>• Epsilon (ε) controls exploration: high = more random, low = more greedy</li>
          <li>• Rewards: Goal = +100, Obstacle = -100, Step = -1</li>
        </ul>
      </div>
    </div>
  );
}

export default QLearningPlayground;