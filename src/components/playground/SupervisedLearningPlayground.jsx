// src/components/playground/SupervisedLearningPlayground.jsx
import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Play, Pause, RotateCcw, Plus, Trash2, Settings } from 'lucide-react';

function SupervisedLearningPlayground() {
  const canvasRef = useRef(null);
  
  // Algorithm selection
  const [algorithm, setAlgorithm] = useState('linear'); // linear, logistic, neural
  
  // Data points
  const [dataPoints, setDataPoints] = useState([]);
  const [currentClass, setCurrentClass] = useState(0); // For classification
  
  // Model
  const [model, setModel] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  
  // Model parameters (for visualization)
  const [weights, setWeights] = useState([]);
  const [bias, setBias] = useState(0);
  
  // Predictions
  const [predictions, setPredictions] = useState([]);
  
  // Hyperparameters
  const [learningRate, setLearningRate] = useState(0.1);
  const [batchSize, setBatchSize] = useState(32);
  const [hiddenUnits, setHiddenUnits] = useState(4);
  
  // Canvas settings
  const width = 600;
  const height = 400;
  const padding = 40;

  // Initialize model based on algorithm
  const initializeModel = () => {
    if (model) {
      model.dispose();
    }

    let newModel;
    
    switch (algorithm) {
      case 'linear':
        // Linear Regression: y = wx + b
        newModel = tf.sequential();
        newModel.add(tf.layers.dense({ 
          units: 1, 
          inputShape: [2],
          useBias: true 
        }));
        newModel.compile({
          optimizer: tf.train.sgd(learningRate),
          loss: 'meanSquaredError'
        });
        break;
        
      case 'logistic':
        // Logistic Regression: y = sigmoid(wx + b)
        newModel = tf.sequential();
        newModel.add(tf.layers.dense({ 
          units: 1, 
          inputShape: [2],
          activation: 'sigmoid',
          useBias: true 
        }));
        newModel.compile({
          optimizer: tf.train.sgd(learningRate),
          loss: 'binaryCrossentropy',
          metrics: ['accuracy']
        });
        break;
        
      case 'neural':
        // Neural Network with hidden layer
        newModel = tf.sequential();
        newModel.add(tf.layers.dense({ 
          units: hiddenUnits, 
          inputShape: [2],
          activation: 'relu',
          useBias: true 
        }));
        newModel.add(tf.layers.dense({ 
          units: 1, 
          activation: 'sigmoid',
          useBias: true 
        }));
        newModel.compile({
          optimizer: tf.train.adam(learningRate),
          loss: 'binaryCrossentropy',
          metrics: ['accuracy']
        });
        break;
    }
    
    setModel(newModel);
    setEpoch(0);
    setLoss(0);
    setAccuracy(0);
    setPredictions([]);
  };

  // Initialize on mount and algorithm change
  useEffect(() => {
    initializeModel();
    return () => {
      if (model) model.dispose();
    };
  }, [algorithm, learningRate, hiddenUnits]);

  // Generate data
  const generateData = () => {
    const newPoints = [];
    
    if (algorithm === 'linear') {
      // Linear regression data
      for (let i = 0; i < 50; i++) {
        const x = Math.random();
        const y = 0.5 * x + 0.3 + (Math.random() - 0.5) * 0.2;
        newPoints.push({ 
          x, 
          y: Math.max(0, Math.min(1, y)), 
          class: 0 
        });
      }
    } else {
      // Classification data - two classes
      // Class 0 (red)
      for (let i = 0; i < 25; i++) {
        const x = Math.random() * 0.5;
        const y = Math.random() * 0.5;
        newPoints.push({ x, y, class: 0 });
      }
      // Class 1 (blue)
      for (let i = 0; i < 25; i++) {
        const x = 0.5 + Math.random() * 0.5;
        const y = 0.5 + Math.random() * 0.5;
        newPoints.push({ x, y, class: 1 });
      }
    }
    
    setDataPoints(newPoints);
    reset();
  };

  // Add point on click
  const handleCanvasClick = (e) => {
    if (isTraining) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    const x = (clickX - padding) / (width - 2 * padding);
    const y = 1 - ((clickY - padding) / (height - 2 * padding));
    
    if (x < 0 || x > 1 || y < 0 || y > 1) return;
    
    setDataPoints([...dataPoints, { x, y, class: currentClass }]);
  };

  // Reset
  const reset = () => {
    setIsTraining(false);
    setEpoch(0);
    setLoss(0);
    setAccuracy(0);
    setPredictions([]);
    initializeModel();
  };

  // Train one epoch
  const trainEpoch = async () => {
    if (!model || dataPoints.length < 2) return;

    const xs = tf.tensor2d(dataPoints.map(p => [p.x, p.y]));
    const ys = algorithm === 'linear'
      ? tf.tensor2d(dataPoints.map(p => [p.y]))
      : tf.tensor2d(dataPoints.map(p => [p.class]));

    const history = await model.fit(xs, ys, {
      epochs: 1,
      batchSize: Math.min(batchSize, dataPoints.length),
      verbose: 0
    });

    const currentLoss = history.history.loss[0];
    setLoss(currentLoss);
    
    if (algorithm !== 'linear' && history.history.acc) {
      setAccuracy(history.history.acc[0]);
    }

    setEpoch(prev => prev + 1);

    // Extract weights for visualization
    const modelWeights = model.getWeights();
    if (modelWeights.length > 0) {
      const w = await modelWeights[0].array();
      const b = await modelWeights[1].array();
      setWeights(w);
      setBias(b[0]);
    }

    // Generate predictions for visualization
    await generatePredictions();

    xs.dispose();
    ys.dispose();
  };

  // Generate predictions for decision boundary/regression line
  const generatePredictions = async () => {
    if (!model) return;

    const gridSize = 50;
    const predPoints = [];

    for (let i = 0; i <= gridSize; i++) {
      for (let j = 0; j <= gridSize; j++) {
        const x = i / gridSize;
        const y = j / gridSize;
        
        const input = tf.tensor2d([[x, y]]);
        const pred = model.predict(input);
        const predValue = (await pred.data())[0];
        
        predPoints.push({ x, y, value: predValue });
        
        input.dispose();
        pred.dispose();
      }
    }

    setPredictions(predPoints);
  };

  // Training loop
  useEffect(() => {
    if (!isTraining) return;

    const timer = setTimeout(() => {
      trainEpoch();
    }, 50);

    return () => clearTimeout(timer);
  }, [isTraining, epoch]);

  // Convert to canvas coordinates
  const toCanvasX = (x) => x * (width - 2 * padding) + padding;
  const toCanvasY = (y) => (1 - y) * (height - 2 * padding) + padding;

  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);

    // Draw background predictions (decision boundary/regression surface)
    if (predictions.length > 0) {
      predictions.forEach(pred => {
        const x = toCanvasX(pred.x);
        const y = toCanvasY(pred.y);
        
        if (algorithm === 'linear') {
          // For regression, show prediction as intensity
          const intensity = Math.floor(pred.value * 255);
          ctx.fillStyle = `rgba(100, 100, 255, ${pred.value * 0.3})`;
        } else {
          // For classification, show decision boundary
          const prob = pred.value;
          if (prob < 0.45 || prob > 0.55) {
            const color = prob > 0.5 ? 'rgba(100, 150, 255, 0.2)' : 'rgba(255, 100, 100, 0.2)';
            ctx.fillStyle = color;
          } else {
            ctx.fillStyle = 'rgba(255, 255, 0, 0.3)'; // Decision boundary
          }
        }
        ctx.fillRect(x - 3, y - 3, 6, 6);
      });
    }

    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = padding; i < width - padding; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, padding);
      ctx.lineTo(i, height - padding);
      ctx.stroke();
    }
    for (let i = padding; i < height - padding; i += 50) {
      ctx.beginPath();
      ctx.moveTo(padding, i);
      ctx.lineTo(width - padding, i);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // Draw data points
    dataPoints.forEach(point => {
      const x = toCanvasX(point.x);
      const y = toCanvasY(point.y);
      
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      
      if (algorithm === 'linear') {
        ctx.fillStyle = '#3b82f6';
      } else {
        ctx.fillStyle = point.class === 0 ? '#ef4444' : '#3b82f6';
      }
      
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Labels
    ctx.fillStyle = '#374151';
    ctx.font = '14px Arial';
    ctx.fillText('x₁', width - padding + 10, height - padding + 5);
    ctx.fillText('x₂', padding - 5, padding - 10);

  }, [dataPoints, predictions, algorithm]);

  // Get activation function formula
  const getFormulaDisplay = () => {
    switch (algorithm) {
      case 'linear':
        return {
          title: 'Linear Regression',
          formula: 'ŷ = w₁x₁ + w₂x₂ + b',
          loss: 'MSE = (1/n)Σ(y - ŷ)²'
        };
      case 'logistic':
        return {
          title: 'Logistic Regression',
          formula: 'ŷ = σ(w₁x₁ + w₂x₂ + b)',
          activation: 'σ(z) = 1 / (1 + e⁻ᶻ)',
          loss: 'BCE = -[y log(ŷ) + (1-y)log(1-ŷ)]'
        };
      case 'neural':
        return {
          title: 'Neural Network',
          formula: 'ŷ = σ(W₂·ReLU(W₁x + b₁) + b₂)',
          activation: 'ReLU(z) = max(0, z)',
          loss: 'BCE = -[y log(ŷ) + (1-y)log(1-ŷ)]'
        };
    }
  };

  const formulaDisplay = getFormulaDisplay();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Supervised Learning Playground
        </h2>
        <p className="text-gray-600">
          Trainiere verschiedene ML-Modelle mit TensorFlow.js und beobachte wie sie lernen
        </p>
      </div>

      {/* Algorithm Selection */}
      <div className="mb-6 bg-gray-50 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Algorithmus auswählen:
        </label>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => {
              setAlgorithm('linear');
              reset();
            }}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              algorithm === 'linear'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            <div className="text-left">
              <div>Linear Regression</div>
              <div className="text-xs opacity-75">Continuous Output</div>
            </div>
          </button>
          <button
            onClick={() => {
              setAlgorithm('logistic');
              reset();
            }}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              algorithm === 'logistic'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            <div className="text-left">
              <div>Logistic Regression</div>
              <div className="text-xs opacity-75">Binary Classification</div>
            </div>
          </button>
          <button
            onClick={() => {
              setAlgorithm('neural');
              reset();
            }}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              algorithm === 'neural'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            <div className="text-left">
              <div>Neural Network</div>
              <div className="text-xs opacity-75">Non-linear Boundary</div>
            </div>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Canvas */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Data & Visualization</h3>
            <div className="flex gap-2">
              <button
                onClick={generateData}
                disabled={isTraining}
                className="flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Generate
              </button>
              {algorithm !== 'linear' && (
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
              )}
            </div>
          </div>
          
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            onClick={handleCanvasClick}
            className="border-2 border-gray-300 rounded-lg cursor-crosshair hover:border-blue-400 transition-colors w-full"
          />
          
          <div className="mt-3 text-sm text-gray-600">
            {algorithm === 'linear' ? (
              <span>Blue dots = data points | Blue overlay = predictions</span>
            ) : (
              <span>Red = Class 0 | Blue = Class 1 | Yellow = Decision Boundary</span>
            )}
          </div>
        </div>

        {/* Math & Parameters */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Mathematical Model</h3>
          
          <div className="space-y-4">
            {/* Formula */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">{formulaDisplay.title}</h4>
              <div className="space-y-2 text-sm">
                <div className="bg-white rounded p-2 font-mono text-xs">
                  {formulaDisplay.formula}
                </div>
                {formulaDisplay.activation && (
                  <div className="bg-white rounded p-2 font-mono text-xs">
                    {formulaDisplay.activation}
                  </div>
                )}
                <div className="bg-white rounded p-2 font-mono text-xs text-red-700">
                  Loss: {formulaDisplay.loss}
                </div>
              </div>
            </div>

            {/* Current Weights */}
            {weights.length > 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">Current Parameters</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>w₁:</span>
                    <span className="font-mono">{weights[0]?.[0]?.toFixed(4) || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>w₂:</span>
                    <span className="font-mono">{weights[1]?.[0]?.toFixed(4) || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>b:</span>
                    <span className="font-mono">{bias?.toFixed(4) || 0}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Gradient Descent Explanation */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">Gradient Descent Update</h4>
              <div className="text-sm text-green-800 space-y-2">
                <div className="bg-white rounded p-2 font-mono text-xs">
                  w ← w - α · ∂L/∂w
                </div>
                <div className="space-y-1 text-xs">
                  <div><strong>α:</strong> Learning Rate = {learningRate}</div>
                  <div><strong>∂L/∂w:</strong> Gradient (computed by backprop)</div>
                  <div><strong>Goal:</strong> Minimize Loss Function</div>
                </div>
              </div>
            </div>

            {/* Model Architecture (for Neural Network) */}
            {algorithm === 'neural' && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-900 mb-2">Network Architecture</h4>
                <div className="text-sm text-orange-800">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span>Input Layer:</span>
                    <span className="font-mono">2 neurons (x₁, x₂)</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span>Hidden Layer:</span>
                    <span className="font-mono">{hiddenUnits} neurons (ReLU)</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span>Output Layer:</span>
                    <span className="font-mono">1 neuron (Sigmoid)</span>
                  </div>
                </div>
              </div>
            )}
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
          <p className="text-sm text-gray-600 mb-1">Epoch</p>
          <p className="text-2xl font-bold text-purple-600">{epoch}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Loss</p>
          <p className="text-2xl font-bold text-red-600">
            {loss > 0 ? loss.toFixed(4) : '-'}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">
            {algorithm === 'linear' ? 'MSE' : 'Accuracy'}
          </p>
          <p className="text-2xl font-bold text-green-600">
            {algorithm === 'linear' 
              ? (loss > 0 ? loss.toFixed(4) : '-')
              : (accuracy > 0 ? `${(accuracy * 100).toFixed(1)}%` : '-')}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Status</p>
          <p className="text-lg font-bold text-gray-600">
            {isTraining ? '🔄 Training' : epoch > 0 ? '✅ Ready' : '⏸️ Not Started'}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setIsTraining(!isTraining)}
            disabled={dataPoints.length < 2}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              isTraining
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
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
            Reset Model
          </button>

          <button
            onClick={() => {
              setDataPoints([]);
              reset();
            }}
            className="flex items-center gap-2 px-6 py-3 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-all"
          >
            <Trash2 className="w-5 h-5" />
            Clear All
          </button>
        </div>

        {/* Hyperparameters */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Learning Rate (α)</span>
              <span className="text-sm text-gray-600">{learningRate.toFixed(3)}</span>
            </label>
            <input
              type="range"
              min="0.001"
              max="1.0"
              step="0.001"
              value={learningRate}
              onChange={(e) => setLearningRate(parseFloat(e.target.value))}
              disabled={isTraining}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Batch Size</span>
              <span className="text-sm text-gray-600">{batchSize}</span>
            </label>
            <input
              type="range"
              min="1"
              max="64"
              step="1"
              value={batchSize}
              onChange={(e) => setBatchSize(parseInt(e.target.value))}
              disabled={isTraining}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50"
            />
          </div>

          {algorithm === 'neural' && (
            <div>
              <label className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Hidden Units</span>
                <span className="text-sm text-gray-600">{hiddenUnits}</span>
              </label>
              <input
                type="range"
                min="2"
                max="16"
                step="1"
                value={hiddenUnits}
                onChange={(e) => setHiddenUnits(parseInt(e.target.value))}
                disabled={isTraining}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50"
              />
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 How to use:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click "Generate" to create random data or click on canvas to add points</li>
          <li>• {algorithm !== 'linear' && 'Select class (red/blue) before adding points'}</li>
          <li>• Click "Start Training" to train the model with gradient descent</li>
          <li>• Watch the {algorithm === 'linear' ? 'regression line' : 'decision boundary'} form!</li>
          <li>• Adjust hyperparameters to see their effect on training</li>
        </ul>
      </div>
    </div>
  );
}

export default SupervisedLearningPlayground;