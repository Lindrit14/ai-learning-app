// src/components/playground/LinearRegressionPlayground.jsx
import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Play, Pause, RotateCcw, Plus, Trash2 } from 'lucide-react';

function LinearRegressionPlayground() {
  const canvasRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(0);
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState(null);
  
  // Hyperparameters
  const [learningRate, setLearningRate] = useState(0.1);
  const maxEpochs = 300;

  // Canvas settings
  const width = 600;
  const height = 400;
  const padding = 40;

  // Initialize model
  useEffect(() => {
    const newModel = tf.sequential();
    newModel.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    newModel.compile({
      optimizer: tf.train.sgd(learningRate),
      loss: 'meanSquaredError'
    });
    setModel(newModel);

    return () => {
      if (newModel) {
        newModel.dispose();
      }
    };
  }, []);

  // Update optimizer when learning rate changes
  useEffect(() => {
    if (model && !isTraining) {
      model.compile({
        optimizer: tf.train.sgd(learningRate),
        loss: 'meanSquaredError'
      });
    }
  }, [learningRate]);

  // Generate random points
  const generatePoints = () => {
    const count = 35;
    const newPoints = [];
    const trueSlope = 0.5;
    const trueIntercept = 0.2;
    
    for (let i = 0; i < count; i++) {
      const x = Math.random();
      const trueY = trueSlope * x + trueIntercept;
      const noise = (Math.random() - 0.5) * 0.2;
      const y = trueY + noise;
      
      newPoints.push({ 
        x: Math.max(0, Math.min(1, x)),
        y: Math.max(0, Math.min(1, y))
      });
    }
    
    setPoints(newPoints);
    resetModel();
  };

  // Add point on canvas click
  const handleCanvasClick = (e) => {
    if (isTraining) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Convert canvas coordinates to normalized coordinates (0-1)
    const x = (clickX - padding) / (width - 2 * padding);
    const y = 1 - ((clickY - padding) / (height - 2 * padding));
    
    // Boundary check
    if (x < 0 || x > 1 || y < 0 || y > 1) {
      return;
    }
    
    setPoints([...points, { x, y }]);
  };

  // Reset model
  const resetModel = () => {
    if (model) {
      // Re-initialize model weights
      const newModel = tf.sequential();
      newModel.add(tf.layers.dense({ units: 1, inputShape: [1] }));
      newModel.compile({
        optimizer: tf.train.sgd(learningRate),
        loss: 'meanSquaredError'
      });
      
      // Dispose old model
      model.dispose();
      setModel(newModel);
    }
    
    setEpoch(0);
    setLoss(0);
    setIsTraining(false);
    setPredictions(null);
  };

  // Train one epoch
  const trainOneEpoch = async () => {
    if (points.length === 0 || !model) return;

    // Prepare data
    const xs = tf.tensor2d(points.map(p => [p.x]));
    const ys = tf.tensor2d(points.map(p => [p.y]));

    // Train for one epoch
    const history = await model.fit(xs, ys, {
      epochs: 1,
      verbose: 0
    });

    const currentLoss = history.history.loss[0];
    setLoss(currentLoss);
    setEpoch(prev => prev + 1);

    // Make predictions for the line
    const xPred = tf.linspace(0, 1, 100);
    const yPred = model.predict(xPred.reshape([100, 1]));
    
    const xPredData = await xPred.data();
    const yPredData = await yPred.data();
    
    const predPoints = Array.from(xPredData).map((x, i) => ({
      x,
      y: yPredData[i]
    }));
    
    setPredictions(predPoints);

    // Cleanup tensors
    xs.dispose();
    ys.dispose();
    xPred.dispose();
    yPred.dispose();
  };

  // Training loop
  useEffect(() => {
    if (!isTraining || epoch >= maxEpochs) {
      if (epoch >= maxEpochs) {
        setIsTraining(false);
      }
      return;
    }

    const timer = setTimeout(() => {
      trainOneEpoch();
    }, 50);

    return () => clearTimeout(timer);
  }, [isTraining, epoch, points, model]);

  // Convert normalized coordinates to canvas coordinates
  const toCanvasX = (x) => x * (width - 2 * padding) + padding;
  const toCanvasY = (y) => (1 - y) * (height - 2 * padding) + padding;

  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, width, height);

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
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // Draw prediction line (TensorFlow.js predictions)
    if (predictions && predictions.length > 0) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      predictions.forEach((point, i) => {
        const x = toCanvasX(point.x);
        const y = toCanvasY(point.y);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
    }

    // Draw data points
    points.forEach(point => {
      const x = toCanvasX(point.x);
      const y = toCanvasY(point.y);
      
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = '#b91c1c';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw labels
    ctx.fillStyle = '#374151';
    ctx.font = '14px sans-serif';
    ctx.fillText('X', width - padding + 15, height - padding + 5);
    ctx.fillText('Y', padding - 5, padding - 15);

  }, [points, predictions, width, height, padding]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Linear Regression Playground
        </h2>
        <p className="text-gray-600">
          Powered by TensorFlow.js - Klicke auf die Canvas um Punkte hinzuzufügen oder generiere zufällige Daten.
        </p>
      </div>

      {/* Canvas */}
      <div className="mb-6 flex justify-center">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onClick={handleCanvasClick}
          className="border-2 border-gray-300 rounded-lg cursor-crosshair hover:border-blue-400 transition-colors"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Datenpunkte</p>
          <p className="text-2xl font-bold text-gray-900">{points.length}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Epoch</p>
          <p className="text-2xl font-bold text-blue-600">{epoch}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Status</p>
          <p className="text-lg font-bold text-purple-600">
            {isTraining ? '🔄 Training...' : epoch > 0 ? '✅ Fertig' : '⏸️ Bereit'}
          </p>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Loss (MSE)</p>
          <p className="text-2xl font-bold text-red-600">
            {loss > 0 ? loss.toFixed(4) : '-'}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={generatePoints}
            disabled={isTraining}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
            Daten generieren
          </button>

          <button
            onClick={() => setIsTraining(!isTraining)}
            disabled={points.length === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isTraining
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isTraining ? (
              <>
                <Pause className="w-4 h-4" />
                Stoppen
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Training starten
              </>
            )}
          </button>

          <button
            onClick={resetModel}
            disabled={isTraining}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Model
          </button>

          <button
            onClick={() => {
              setPoints([]);
              resetModel();
            }}
            disabled={isTraining}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Alle löschen
          </button>
        </div>

        {/* Learning Rate Slider */}
        <div>
          <label className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Learning Rate (Optimizer)
            </span>
            <span className="text-sm text-gray-600">
              {learningRate.toFixed(3)}
            </span>
          </label>
          <input
            type="range"
            min="0.001"
            max="1.0"
            step="0.001"
            value={learningRate}
            onChange={(e) => setLearningRate(parseFloat(e.target.value))}
            disabled={isTraining}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.001</span>
            <span>1.0</span>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 TensorFlow.js Linear Regression:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Model:</strong> Sequential mit 1 Dense Layer (1 Unit)</li>
          <li>• <strong>Optimizer:</strong> SGD (Stochastic Gradient Descent)</li>
          <li>• <strong>Loss:</strong> Mean Squared Error (MSE)</li>
          <li>• <strong>Blaue Linie:</strong> Model Predictions von TensorFlow.js</li>
          <li>• <strong>Rote Punkte:</strong> Trainingsdaten</li>
        </ul>
      </div>
    </div>
  );
}

export default LinearRegressionPlayground;