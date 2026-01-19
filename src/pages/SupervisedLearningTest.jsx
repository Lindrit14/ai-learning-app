// src/pages/SupervisedLearningTest.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SupervisedLearningPlayground from '../components/playground/SupervisedLearningPlayground';

function SupervisedLearningTest() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Startseite
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Supervised Learning mit TensorFlow.js
          </h1>
          <p className="text-gray-600">
            Verstehe Linear Regression, Logistic Regression und Neural Networks durch interaktive Visualisierung
          </p>
        </div>

        {/* Theory */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Was ist Supervised Learning?
          </h2>
          
          <div className="prose max-w-none text-gray-700 space-y-4">
            <p>
              <strong>Supervised Learning</strong> ist ein Machine Learning Paradigma, bei dem ein Modell 
              von gelabelten Daten lernt – d.h. wir haben Eingaben (X) und zugehörige Ausgaben (Y).
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-900 mb-2">Grundprinzip:</h3>
              <div className="bg-white rounded p-3 font-mono text-sm">
                Training Data: (X₁, Y₁), (X₂, Y₂), ..., (Xₙ, Yₙ)
                <br/>
                Goal: Learn function f : X → Y
                <br/>
                Test: Predict Y_new for unseen X_new
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-bold text-green-900 mb-2">Regression</h4>
                <p className="text-sm text-green-800">
                  <strong>Output:</strong> Continuous values (Real numbers)
                  <br/>
                  <strong>Examples:</strong> House prices, temperature, stock prices
                  <br/>
                  <strong>Loss:</strong> Mean Squared Error (MSE)
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-bold text-purple-900 mb-2">Classification</h4>
                <p className="text-sm text-purple-800">
                  <strong>Output:</strong> Discrete classes/categories
                  <br/>
                  <strong>Examples:</strong> Spam/Not Spam, Dog/Cat, Disease diagnosis
                  <br/>
                  <strong>Loss:</strong> Cross-Entropy
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Algorithms */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Algorithmen im Detail
          </h2>

          {/* Linear Regression */}
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-bold text-blue-900 mb-3">
                1️⃣ Linear Regression
              </h3>
              
              <div className="text-sm text-blue-800 space-y-3">
                <div>
                  <strong>Modell:</strong> Finde die beste Gerade durch die Datenpunkte
                </div>
                
                <div className="bg-white rounded p-3 space-y-2">
                  <div className="font-mono text-xs">
                    ŷ = w₁x₁ + w₂x₂ + b
                  </div>
                  <div className="text-xs">
                    • <strong>ŷ:</strong> Prediction (continuous output)
                    <br/>
                    • <strong>w₁, w₂:</strong> Weights (slope)
                    <br/>
                    • <strong>b:</strong> Bias (intercept)
                    <br/>
                    • <strong>x₁, x₂:</strong> Input features
                  </div>
                </div>

                <div>
                  <strong>Loss Function (Mean Squared Error):</strong>
                  <div className="bg-white rounded p-3 mt-2 font-mono text-xs">
                    L = (1/n) Σ(yᵢ - ŷᵢ)²
                  </div>
                  <p className="mt-2 text-xs">
                    Misst den durchschnittlichen quadratischen Fehler zwischen echten und vorhergesagten Werten
                  </p>
                </div>

                <div>
                  <strong>Gradient Descent Update:</strong>
                  <div className="bg-white rounded p-3 mt-2 font-mono text-xs">
                    w ← w - α · (2/n) Σ(ŷᵢ - yᵢ) · xᵢ
                    <br/>
                    b ← b - α · (2/n) Σ(ŷᵢ - yᵢ)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Logistic Regression */}
          <div className="mb-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="text-lg font-bold text-purple-900 mb-3">
                2️⃣ Logistic Regression
              </h3>
              
              <div className="text-sm text-purple-800 space-y-3">
                <div>
                  <strong>Modell:</strong> Binäre Klassifikation mit Sigmoid-Funktion
                </div>
                
                <div className="bg-white rounded p-3 space-y-2">
                  <div className="font-mono text-xs">
                    z = w₁x₁ + w₂x₂ + b
                    <br/>
                    ŷ = σ(z) = 1 / (1 + e⁻ᶻ)
                  </div>
                  <div className="text-xs">
                    • <strong>σ(z):</strong> Sigmoid function (maps to [0,1])
                    <br/>
                    • <strong>ŷ:</strong> Probability of class 1
                    <br/>
                    • <strong>Decision:</strong> Class 1 if ŷ > 0.5, else Class 0
                  </div>
                </div>

                <div>
                  <strong>Sigmoid Function Properties:</strong>
                  <div className="bg-white rounded p-3 mt-2 text-xs space-y-1">
                    • σ(0) = 0.5 (neutral)
                    <br/>
                    • σ(+∞) = 1 (confident Class 1)
                    <br/>
                    • σ(-∞) = 0 (confident Class 0)
                    <br/>
                    • Smooth, differentiable everywhere
                  </div>
                </div>

                <div>
                  <strong>Loss Function (Binary Cross-Entropy):</strong>
                  <div className="bg-white rounded p-3 mt-2 font-mono text-xs">
                    L = -(1/n) Σ[yᵢ log(ŷᵢ) + (1-yᵢ)log(1-ŷᵢ)]
                  </div>
                  <p className="mt-2 text-xs">
                    Straft falsche Klassifikationen exponentiell – hohe Konfidenz in falscher Klasse = hoher Loss
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Neural Network */}
          <div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-bold text-green-900 mb-3">
                3️⃣ Neural Network (Multi-Layer Perceptron)
              </h3>
              
              <div className="text-sm text-green-800 space-y-3">
                <div>
                  <strong>Modell:</strong> Non-linear Entscheidungsgrenzen durch Hidden Layer
                </div>
                
                <div className="bg-white rounded p-3 space-y-2">
                  <div className="font-mono text-xs">
                    h = ReLU(W₁x + b₁)    [Hidden Layer]
                    <br/>
                    ŷ = σ(W₂h + b₂)        [Output Layer]
                  </div>
                  <div className="text-xs">
                    • <strong>W₁:</strong> Weight matrix input → hidden
                    <br/>
                    • <strong>h:</strong> Hidden layer activations
                    <br/>
                    • <strong>ReLU:</strong> max(0, z) - Non-linear activation
                    <br/>
                    • <strong>W₂:</strong> Weight matrix hidden → output
                  </div>
                </div>

                <div>
                  <strong>ReLU Activation Function:</strong>
                  <div className="bg-white rounded p-3 mt-2 font-mono text-xs">
                    ReLU(z) = max(0, z) = {'{'}z if z > 0, else 0{'}'}
                  </div>
                  <p className="mt-2 text-xs">
                    <strong>Warum ReLU?</strong> Einfach, schnell, vermeidet vanishing gradients, fügt Non-Linearität hinzu
                  </p>
                </div>

                <div>
                  <strong>Backpropagation:</strong>
                  <div className="bg-white rounded p-3 mt-2 text-xs">
                    1. Forward Pass: Berechne Predictions
                    <br/>
                    2. Compute Loss: L = BCE(y, ŷ)
                    <br/>
                    3. Backward Pass: ∂L/∂W₂, ∂L/∂W₁ via Chain Rule
                    <br/>
                    4. Update: W ← W - α · ∂L/∂W
                  </div>
                </div>

                <div className="bg-green-100 rounded p-3">
                  <strong>Power of Hidden Layers:</strong>
                  <p className="text-xs mt-1">
                    Kann komplexe, non-lineare Entscheidungsgrenzen lernen (z.B. XOR-Problem).
                    Je mehr Neuronen, desto komplexere Patterns möglich!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Playground */}
        <SupervisedLearningPlayground />

        {/* Gradient Descent */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Gradient Descent: Der Lernalgorithmus
          </h2>

          <div className="prose max-w-none text-gray-700 space-y-4">
            <p>
              <strong>Gradient Descent</strong> ist der Optimierungsalgorithmus, der die Parameter (Weights & Bias) 
              so anpasst, dass der Loss minimiert wird.
            </p>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-bold text-orange-900 mb-2">Update Rule:</h3>
              <div className="bg-white rounded p-3 font-mono text-sm mb-3">
                θ ← θ - α · ∇L(θ)
              </div>
              <div className="text-sm text-orange-800 space-y-1">
                <div>• <strong>θ:</strong> Parameters (alle Weights & Biases)</div>
                <div>• <strong>α:</strong> Learning Rate (Schrittgröße)</div>
                <div>• <strong>∇L(θ):</strong> Gradient des Loss (Richtung des steilsten Anstiegs)</div>
                <div>• <strong>Minus:</strong> Gehe in entgegengesetzte Richtung (bergab)</div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-bold text-blue-900 mb-2">Batch Gradient Descent</h4>
                <p className="text-sm text-blue-800">
                  Nutzt <strong>alle</strong> Trainingsdaten pro Update
                  <br/><br/>
                  ✅ Stabil, smooth
                  <br/>
                  ❌ Langsam bei großen Datasets
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-bold text-purple-900 mb-2">Stochastic GD</h4>
                <p className="text-sm text-purple-800">
                  Nutzt <strong>einen</strong> Datenpunkt pro Update
                  <br/><br/>
                  ✅ Schnell, online learning
                  <br/>
                  ❌ Noisy, instabil
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-bold text-green-900 mb-2">Mini-Batch GD</h4>
                <p className="text-sm text-green-800">
                  Nutzt <strong>small batch</strong> (z.B. 32) pro Update
                  <br/><br/>
                  ✅ Best of both worlds
                  <br/>
                  ✅ Standard in der Praxis
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-bold text-yellow-900 mb-2">Learning Rate (α) - Kritischer Hyperparameter!</h3>
              <div className="text-sm text-yellow-800 space-y-2">
                <div>
                  <strong>Zu klein (α = 0.001):</strong> Lernen ist langsam, braucht viele Epochs
                </div>
                <div>
                  <strong>Optimal (α = 0.01-0.1):</strong> Schnelle, stabile Konvergenz
                </div>
                <div>
                  <strong>Zu groß (α = 1.0+):</strong> Overshooting, instabil, divergiert!
                </div>
                <div className="bg-white rounded p-2 mt-2">
                  <strong>Tipp:</strong> Starte mit 0.01-0.1 und passe an basierend auf Loss-Verlauf
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overfitting & Regularization */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Overfitting & Generalization
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-bold text-red-900 mb-2">⚠️ Overfitting</h3>
              <div className="text-sm text-red-800 space-y-2">
                <p>
                  <strong>Problem:</strong> Modell lernt Training Data auswendig, 
                  aber generalisiert schlecht auf neue Daten
                </p>
                <div className="bg-white rounded p-2 text-xs">
                  • Training Loss: sehr niedrig ✓
                  <br/>
                  • Test Loss: hoch ✗
                  <br/>
                  • Modell ist zu komplex
                </div>
                <p className="text-xs">
                  <strong>Erkennbar:</strong> Sehr komplexe Entscheidungsgrenzen, 
                  die sich um einzelne Punkte "schlängeln"
                </p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-bold text-green-900 mb-2">✅ Good Generalization</h3>
              <div className="text-sm text-green-800 space-y-2">
                <p>
                  <strong>Ziel:</strong> Modell lernt zugrundeliegende Pattern, 
                  nicht nur Noise
                </p>
                <div className="bg-white rounded p-2 text-xs">
                  • Training Loss: niedrig ✓
                  <br/>
                  • Test Loss: ähnlich niedrig ✓
                  <br/>
                  • Modell ist "gerade richtig"
                </div>
                <p className="text-xs">
                  <strong>Erreichen durch:</strong> Regularization, mehr Daten, 
                  einfacheres Modell, Early Stopping
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Experiments */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            🧪 Experimente
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <strong className="text-gray-900">Experiment 1: Linear vs Non-Linear</strong>
              <p className="text-sm text-gray-700 mt-2">
                1. Generiere linear separable Daten
                <br/>
                2. Trainiere Logistic Regression → funktioniert
                <br/>
                3. Manuell XOR-Pattern hinzufügen (click!)
                <br/>
                4. Logistic Regression scheitert, Neural Network lernt es!
              </p>
            </div>

            <div className="bg-white rounded-lg p-4">
              <strong className="text-gray-900">Experiment 2: Learning Rate Effect</strong>
              <p className="text-sm text-gray-700 mt-2">
                1. α = 0.001: Langsam, aber stabil
                <br/>
                2. α = 0.1: Schnelle Konvergenz (optimal)
                <br/>
                3. α = 0.5: Instabil, Loss springt
                <br/>
                4. α = 1.0: Divergiert, Loss explodiert!
              </p>
            </div>

            <div className="bg-white rounded-lg p-4">
              <strong className="text-gray-900">Experiment 3: Hidden Units</strong>
              <p className="text-sm text-gray-700 mt-2">
                1. Neural Network mit 2 Units: Zu einfach
                <br/>
                2. Mit 4-8 Units: Optimal für 2D data
                <br/>
                3. Mit 16 Units: Evtl. Overfitting
                <br/>
                4. Beobachte Decision Boundary Komplexität!
              </p>
            </div>

            <div className="bg-white rounded-lg p-4">
              <strong className="text-gray-900">Experiment 4: Batch Size</strong>
              <p className="text-sm text-gray-700 mt-2">
                1. Batch=1: Sehr noisy updates
                <br/>
                2. Batch=16-32: Smooth, standard
                <br/>
                3. Batch=64: Sehr smooth, aber evtl. zu smooth
                <br/>
                4. Mini-Batch ist meist optimal!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupervisedLearningTest;