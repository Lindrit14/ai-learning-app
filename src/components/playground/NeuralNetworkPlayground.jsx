// src/components/playground/NeuralNetworkPlayground.jsx
import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Play, Pause, RotateCcw, Plus, Brain, Zap, Eye, TrendingUp } from 'lucide-react';

function NeuralNetworkPlayground() {
  // Canvas refs
  const networkCanvasRef = useRef(null);
  const dataCanvasRef = useRef(null);

  // Network architecture
  const [inputSize] = useState(2);
  const [hiddenLayers, setHiddenLayers] = useState([4, 3]);
  const [outputSize] = useState(1);

  // Model and training
  const [model, setModel] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  // Data
  const [dataPoints, setDataPoints] = useState([]);
  const [currentClass, setCurrentClass] = useState(0);

  // Hyperparameters
  const [learningRate, setLearningRate] = useState(0.1);
  const [activationFunction, setActivationFunction] = useState('relu');
  const [batchSize, setBatchSize] = useState(16);

  // Network visualization
  const [networkWeights, setNetworkWeights] = useState([]);
  const [activations, setActivations] = useState([]);
  const [selectedNeuron, setSelectedNeuron] = useState(null);
  const [showWeights, setShowWeights] = useState(true);
  const [showActivations, setShowActivations] = useState(true);

  // Forward pass details
  const [forwardPassDetails, setForwardPassDetails] = useState(null);
  const [predictions, setPredictions] = useState([]);

  // Canvas settings
  const dataWidth = 400;
  const dataHeight = 400;
  const networkWidth = 600;
  const networkHeight = 500;

  // Initialize model
  const initializeModel = () => {
    if (model) {
      model.dispose();
    }

    const newModel = tf.sequential();

    // Input layer is implicit in first hidden layer
    // Add hidden layers
    hiddenLayers.forEach((units, idx) => {
      newModel.add(tf.layers.dense({
        units: units,
        inputShape: idx === 0 ? [inputSize] : undefined,
        activation: activationFunction,
        kernelInitializer: 'glorotNormal'
      }));
    });

    // Output layer
    newModel.add(tf.layers.dense({
      units: outputSize,
      activation: 'sigmoid'
    }));

    // Compile
    newModel.compile({
      optimizer: tf.train.adam(learningRate),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    setModel(newModel);
    setEpoch(0);
    setLoss(0);
    setAccuracy(0);
    extractWeights(newModel);
  };

  // Initialize on mount
  useEffect(() => {
    initializeModel();
    generateData();
    return () => {
      if (model) model.dispose();
    };
  }, []);

  // Reinitialize when architecture or activation changes
  useEffect(() => {
    if (model) {
      initializeModel();
    }
  }, [hiddenLayers, activationFunction, learningRate]);

  // Extract weights from model
  const extractWeights = async (m) => {
    if (!m) return;

    const weights = [];
    const modelWeights = m.getWeights();

    for (let i = 0; i < modelWeights.length; i += 2) {
      const w = await modelWeights[i].array();
      const b = await modelWeights[i + 1].array();
      weights.push({ weights: w, biases: b });
    }

    setNetworkWeights(weights);
  };

  // Generate sample data
  const generateData = () => {
    const newPoints = [];

    // Generate circular pattern for binary classification
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const r = Math.random() * 0.3 + 0.1;
      const x = 0.5 + r * Math.cos(angle);
      const y = 0.5 + r * Math.sin(angle);
      newPoints.push({ x, y, class: 0 });
    }

    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const r = Math.random() * 0.2 + 0.5;
      const x = 0.5 + r * Math.cos(angle);
      const y = 0.5 + r * Math.sin(angle);
      newPoints.push({ x, y, class: 1 });
    }

    setDataPoints(newPoints);
  };

  // Add point on canvas click
  const handleCanvasClick = (e) => {
    if (isTraining) return;

    const canvas = dataCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const x = clickX / dataWidth;
    const y = clickY / dataHeight;

    if (x < 0 || x > 1 || y < 0 || y > 1) return;

    setDataPoints([...dataPoints, { x, y, class: currentClass }]);
  };

  // Compute forward pass with activations
  const computeForwardPass = async (input) => {
    if (!model) return null;

    const layers = [];
    let currentActivation = tf.tensor2d([input]);

    layers.push({
      name: 'Input',
      values: input,
      output: input
    });

    // Go through each layer
    for (let i = 0; i < model.layers.length; i++) {
      const layer = model.layers[i];
      currentActivation = layer.apply(currentActivation);
      const values = await currentActivation.array();

      layers.push({
        name: `Layer ${i + 1}`,
        activation: layer.activation?.getClassName() || 'linear',
        values: values[0],
        output: values[0]
      });
    }

    return layers;
  };

  // Train one epoch
  const trainEpoch = async () => {
    if (!model || dataPoints.length < 2) return;

    const xs = tf.tensor2d(dataPoints.map(p => [p.x, p.y]));
    const ys = tf.tensor2d(dataPoints.map(p => [p.class]));

    const history = await model.fit(xs, ys, {
      epochs: 1,
      batchSize: Math.min(batchSize, dataPoints.length),
      verbose: 0
    });

    const currentLoss = history.history.loss[0];
    setLoss(currentLoss);

    if (history.history.acc) {
      setAccuracy(history.history.acc[0]);
    }

    setEpoch(prev => prev + 1);

    // Extract updated weights
    await extractWeights(model);

    // Generate predictions
    await generatePredictions();

    // Compute forward pass for a sample point
    if (dataPoints.length > 0) {
      const samplePoint = dataPoints[0];
      const fpDetails = await computeForwardPass([samplePoint.x, samplePoint.y]);
      setForwardPassDetails(fpDetails);
      setActivations(fpDetails?.map(l => l.values) || []);
    }

    xs.dispose();
    ys.dispose();
  };

  // Generate predictions for decision boundary
  const generatePredictions = async () => {
    if (!model) return;

    const gridSize = 30;
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

  // Reset
  const reset = () => {
    setIsTraining(false);
    setEpoch(0);
    setLoss(0);
    setAccuracy(0);
    setPredictions([]);
    setActivations([]);
    setForwardPassDetails(null);
    initializeModel();
  };

  // Draw data canvas
  useEffect(() => {
    const canvas = dataCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, dataWidth, dataHeight);

    // Draw predictions (decision boundary)
    if (predictions.length > 0) {
      predictions.forEach(pred => {
        const x = pred.x * dataWidth;
        const y = pred.y * dataHeight;
        const prob = pred.value;

        const color = prob > 0.5
          ? `rgba(100, 150, 255, ${(prob - 0.5) * 0.6})`
          : `rgba(255, 100, 100, ${(0.5 - prob) * 0.6})`;

        ctx.fillStyle = color;
        ctx.fillRect(x - 7, y - 7, 14, 14);
      });
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

  }, [dataPoints, predictions]);

  // Draw network visualization
  useEffect(() => {
    const canvas = networkCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, networkWidth, networkHeight);

    // Calculate layer positions
    const architecture = [inputSize, ...hiddenLayers, outputSize];
    const maxNeurons = Math.max(...architecture);
    const layerSpacing = networkWidth / (architecture.length + 1);
    const neuronRadius = 15;

    const layerPositions = architecture.map((size, layerIdx) => {
      const neurons = [];
      const startY = (networkHeight - (size * 50)) / 2;

      for (let i = 0; i < size; i++) {
        neurons.push({
          x: layerSpacing * (layerIdx + 1),
          y: startY + i * 50 + 25,
          layerIdx,
          neuronIdx: i
        });
      }

      return neurons;
    });

    // Draw connections (weights)
    if (showWeights && networkWeights.length > 0) {
      networkWeights.forEach((layer, layerIdx) => {
        const fromNeurons = layerPositions[layerIdx];
        const toNeurons = layerPositions[layerIdx + 1];

        layer.weights.forEach((neuronWeights, fromIdx) => {
          neuronWeights.forEach((weight, toIdx) => {
            const from = fromNeurons[fromIdx];
            const to = toNeurons[toIdx];

            const absWeight = Math.abs(weight);
            const opacity = Math.min(absWeight, 1);
            const color = weight > 0 ? `rgba(34, 197, 94, ${opacity})` : `rgba(239, 68, 68, ${opacity})`;

            ctx.strokeStyle = color;
            ctx.lineWidth = Math.max(0.5, absWeight * 3);
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
          });
        });
      });
    }

    // Draw neurons
    layerPositions.forEach((neurons, layerIdx) => {
      neurons.forEach((neuron, neuronIdx) => {
        const isSelected = selectedNeuron &&
          selectedNeuron.layer === layerIdx &&
          selectedNeuron.neuron === neuronIdx;

        // Get activation value if available
        let activation = 0;
        if (showActivations && activations.length > layerIdx) {
          if (Array.isArray(activations[layerIdx])) {
            activation = activations[layerIdx][neuronIdx] || 0;
          } else {
            activation = activations[layerIdx] || 0;
          }
        }

        // Draw neuron
        ctx.beginPath();
        ctx.arc(neuron.x, neuron.y, neuronRadius, 0, Math.PI * 2);

        if (showActivations && epoch > 0) {
          const intensity = Math.max(0, Math.min(1, activation));
          ctx.fillStyle = `rgba(59, 130, 246, ${0.2 + intensity * 0.8})`;
        } else {
          ctx.fillStyle = isSelected ? '#3b82f6' : '#e5e7eb';
        }

        ctx.fill();
        ctx.strokeStyle = isSelected ? '#1d4ed8' : '#9ca3af';
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.stroke();

        // Draw activation value
        if (showActivations && epoch > 0 && activation !== 0) {
          ctx.fillStyle = '#1f2937';
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(activation.toFixed(2), neuron.x, neuron.y + 4);
        }
      });
    });

    // Draw layer labels
    ctx.fillStyle = '#374151';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';

    ctx.fillText('Input', layerSpacing, 20);
    hiddenLayers.forEach((_, idx) => {
      ctx.fillText(`Hidden ${idx + 1}`, layerSpacing * (idx + 2), 20);
    });
    ctx.fillText('Output', layerSpacing * (architecture.length), 20);

  }, [networkWeights, activations, selectedNeuron, showWeights, showActivations, epoch]);

  // Add/Remove hidden layer
  const addHiddenLayer = () => {
    setHiddenLayers([...hiddenLayers, 3]);
  };

  const removeHiddenLayer = () => {
    if (hiddenLayers.length > 1) {
      setHiddenLayers(hiddenLayers.slice(0, -1));
    }
  };

  const updateHiddenLayerSize = (idx, size) => {
    const newLayers = [...hiddenLayers];
    newLayers[idx] = parseInt(size);
    setHiddenLayers(newLayers);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Neural Network Playground
        </h2>
        <p className="text-gray-600">
          Erkunde interaktiv wie Neuronale Netzwerke lernen und die Mathematik dahinter
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Data Visualization */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Training Data</h3>
            <div className="flex gap-2">
              <button
                onClick={generateData}
                disabled={isTraining}
                className="flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm disabled:opacity-50"
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

        {/* Network Visualization */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Network Architecture</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowWeights(!showWeights)}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm ${
                  showWeights ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                <Eye className="w-4 h-4" />
                Weights
              </button>
              <button
                onClick={() => setShowActivations(!showActivations)}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm ${
                  showActivations ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                <Zap className="w-4 h-4" />
                Activations
              </button>
            </div>
          </div>

          <canvas
            ref={networkCanvasRef}
            width={networkWidth}
            height={networkHeight}
            className="border-2 border-gray-300 rounded-lg w-full"
          />

          <div className="mt-3 text-xs text-gray-600">
            <div className="flex gap-4">
              <span className="flex items-center gap-1">
                <div className="w-3 h-1 bg-green-500"></div>
                Positive weights
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-1 bg-red-500"></div>
                Negative weights
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                High activation
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Network Architecture Controls */}
      <div className="mb-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-semibold text-purple-900 mb-3">Network Architecture</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Input Layer:</span>
            <span className="text-sm font-mono bg-white px-3 py-1 rounded">{inputSize} neurons</span>
          </div>

          {hiddenLayers.map((size, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-sm font-medium">Hidden Layer {idx + 1}:</span>
              <input
                type="number"
                min="1"
                max="10"
                value={size}
                onChange={(e) => updateHiddenLayerSize(idx, e.target.value)}
                disabled={isTraining}
                className="w-20 px-3 py-1 border border-purple-300 rounded text-sm font-mono disabled:opacity-50"
              />
            </div>
          ))}

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Output Layer:</span>
            <span className="text-sm font-mono bg-white px-3 py-1 rounded">{outputSize} neuron</span>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={addHiddenLayer}
              disabled={isTraining || hiddenLayers.length >= 4}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Layer
            </button>
            <button
              onClick={removeHiddenLayer}
              disabled={isTraining || hiddenLayers.length <= 1}
              className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50 text-sm"
            >
              Remove Layer
            </button>
          </div>
        </div>
      </div>

      {/* Forward Pass Details */}
      {forwardPassDetails && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-3">
            <Brain className="w-5 h-5 inline mr-2" />
            Forward Pass (Sample Point)
          </h3>
          <div className="space-y-2">
            {forwardPassDetails.map((layer, idx) => (
              <div key={idx} className="bg-white rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">{layer.name}</span>
                  {layer.activation && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {layer.activation}
                    </span>
                  )}
                </div>
                <div className="font-mono text-xs text-gray-700">
                  {Array.isArray(layer.values) ? (
                    <div className="flex flex-wrap gap-2">
                      {layer.values.map((val, i) => (
                        <span key={i} className="bg-gray-100 px-2 py-1 rounded">
                          [{i}]: {val.toFixed(4)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span>{layer.values?.toFixed(4) || 'N/A'}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mathematical Formulas */}
      <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-900 mb-3">Mathematical Formulas</h3>
        <div className="space-y-3 text-sm">
          <div className="bg-white rounded p-3">
            <div className="font-semibold mb-2">Forward Pass (Layer i):</div>
            <div className="font-mono text-xs bg-gray-100 p-2 rounded mb-2">
              z<sub>i</sub> = W<sub>i</sub> ∑ a<sub>i-1</sub> + b<sub>i</sub>
            </div>
            <div className="font-mono text-xs bg-gray-100 p-2 rounded">
              a<sub>i</sub> = {activationFunction}(z<sub>i</sub>)
            </div>
          </div>

          <div className="bg-white rounded p-3">
            <div className="font-semibold mb-2">Activation Functions:</div>
            <div className="space-y-1 font-mono text-xs">
              {activationFunction === 'relu' && (
                <div className="bg-gray-100 p-2 rounded">
                  ReLU(z) = max(0, z)
                </div>
              )}
              {activationFunction === 'sigmoid' && (
                <div className="bg-gray-100 p-2 rounded">
                  √(z) = 1 / (1 + e<sup>-z</sup>)
                </div>
              )}
              {activationFunction === 'tanh' && (
                <div className="bg-gray-100 p-2 rounded">
                  tanh(z) = (e<sup>z</sup> - e<sup>-z</sup>) / (e<sup>z</sup> + e<sup>-z</sup>)
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded p-3">
            <div className="font-semibold mb-2">Backpropagation (Gradient Descent):</div>
            <div className="font-mono text-xs bg-gray-100 p-2 rounded mb-2">
              L/W<sub>i</sub> = L/a<sub>i</sub> ∑ a<sub>i</sub>/z<sub>i</sub> ∑ z<sub>i</sub>/W<sub>i</sub>
            </div>
            <div className="font-mono text-xs bg-gray-100 p-2 rounded">
              W<sub>i</sub> ê W<sub>i</sub> - ± ∑ L/W<sub>i</sub>
            </div>
          </div>

          <div className="bg-white rounded p-3">
            <div className="font-semibold mb-2">Loss Function (Binary Cross-Entropy):</div>
            <div className="font-mono text-xs bg-gray-100 p-2 rounded">
              L = -[y ∑ log(w) + (1-y) ∑ log(1-w)]
            </div>
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
          <p className="text-sm text-gray-600 mb-1">Accuracy</p>
          <p className="text-2xl font-bold text-green-600">
            {accuracy > 0 ? `${(accuracy * 100).toFixed(1)}%` : '-'}
          </p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Parameters</p>
          <p className="text-2xl font-bold text-orange-600">
            {model ? model.countParams() : 0}
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
            Reset Network
          </button>
        </div>

        {/* Hyperparameters */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Learning Rate (±)</span>
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
              <span className="text-sm font-medium text-gray-700">Activation Function</span>
            </label>
            <select
              value={activationFunction}
              onChange={(e) => setActivationFunction(e.target.value)}
              disabled={isTraining}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
            >
              <option value="relu">ReLU</option>
              <option value="sigmoid">Sigmoid</option>
              <option value="tanh">Tanh</option>
            </select>
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
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">=° How to use:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>" Click "Generate" to create sample data or click canvas to add points manually</li>
          <li>" Adjust network architecture by changing hidden layer sizes or adding/removing layers</li>
          <li>" Toggle "Weights" to see connection strengths (green = positive, red = negative)</li>
          <li>" Toggle "Activations" to see neuron activation levels during training</li>
          <li>" Watch the decision boundary form as the network learns!</li>
          <li>" Experiment with different activation functions (ReLU, Sigmoid, Tanh)</li>
          <li>" Adjust learning rate and batch size to see their effect on training</li>
        </ul>
      </div>
    </div>
  );
}

export default NeuralNetworkPlayground;
