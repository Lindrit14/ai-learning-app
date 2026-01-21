// src/pages/NeuralNetworkTest.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import NeuralNetworkPlayground from '../components/playground/NeuralNetworkPlayground';

function NeuralNetworkTest() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Startseite
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Neural Network Deep Learning
          </h1>
          <p className="text-gray-600">
            Interaktive Visualisierung von Neuronalen Netzwerken mit Live-Training und Mathematik
          </p>
        </div>

        {/* Playground */}
        <NeuralNetworkPlayground />

        {/* Theory Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Was sind Neuronale Netzwerke?
          </h2>
          <div className="prose max-w-none text-gray-700 space-y-4">
            <p>
              Neuronale Netzwerke sind <strong>Machine Learning</strong> Modelle, die von der
              Struktur des menschlichen Gehirns inspiriert sind. Sie bestehen aus Schichten von
              künstlichen Neuronen, die durch gewichtete Verbindungen miteinander verbunden sind.
            </p>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-bold text-gray-900 mb-2">Kernkomponenten:</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong>Neuronen:</strong> Grundbausteine, die Eingaben verarbeiten und Ausgaben produzieren
                </li>
                <li>
                  <strong>Gewichte (Weights):</strong> Stärke der Verbindungen zwischen Neuronen
                </li>
                <li>
                  <strong>Bias:</strong> Verschiebungsparameter für jedes Neuron
                </li>
                <li>
                  <strong>Aktivierungsfunktion:</strong> Nicht-lineare Transformation (ReLU, Sigmoid, Tanh)
                </li>
                <li>
                  <strong>Layers (Schichten):</strong> Input, Hidden (versteckte), und Output Layer
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-900 mb-3">Forward Pass (Vorwärtsdurchlauf):</h3>

              <div className="space-y-3">
                <div>
                  <div className="bg-white p-3 rounded font-mono text-sm border border-blue-300 mb-2">
                    z = W · x + b
                  </div>
                  <div className="text-sm text-blue-900">
                    Berechne gewichtete Summe der Eingaben plus Bias
                  </div>
                </div>

                <div>
                  <div className="bg-white p-3 rounded font-mono text-sm border border-blue-300 mb-2">
                    a = activation(z)
                  </div>
                  <div className="text-sm text-blue-900">
                    Wende Aktivierungsfunktion an
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm text-blue-900">
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <strong>W:</strong>
                  <span>Gewichts-Matrix</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <strong>x:</strong>
                  <span>Eingabe-Vektor</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <strong>b:</strong>
                  <span>Bias-Vektor</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <strong>z:</strong>
                  <span>Vor-Aktivierung (gewichtete Summe)</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <strong>a:</strong>
                  <span>Aktivierung (Ausgabe des Neurons)</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-bold text-green-900 mb-3">Backpropagation (Rückwärtsdurchlauf):</h3>

              <p className="text-sm text-green-800 mb-3">
                Der Lernprozess: Fehler werden von hinten nach vorne durch das Netzwerk propagiert,
                um die Gewichte anzupassen.
              </p>

              <div className="space-y-2">
                <div className="bg-white p-3 rounded font-mono text-sm border border-green-300">
                  1. Berechne Loss (Fehler): L = Loss(ŷ, y)
                </div>
                <div className="bg-white p-3 rounded font-mono text-sm border border-green-300">
                  2. Berechne Gradienten: ∂L/∂W, ∂L/∂b
                </div>
                <div className="bg-white p-3 rounded font-mono text-sm border border-green-300">
                  3. Update Gewichte: W ← W - α·∂L/∂W
                </div>
              </div>

              <div className="mt-3 text-sm text-green-800">
                <strong>α (Alpha):</strong> Learning Rate - wie groß die Schritte beim Lernen sind
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-bold text-purple-900 mb-2">Aktivierungsfunktionen:</h3>

              <div className="space-y-3 text-sm">
                <div>
                  <div className="font-semibold text-purple-900">ReLU (Rectified Linear Unit):</div>
                  <div className="bg-white p-2 rounded font-mono text-xs mt-1 mb-1">
                    ReLU(z) = max(0, z)
                  </div>
                  <div className="text-purple-800">
                    Gibt z zurück wenn positiv, sonst 0. Sehr effizient und weit verbreitet.
                  </div>
                </div>

                <div>
                  <div className="font-semibold text-purple-900">Sigmoid:</div>
                  <div className="bg-white p-2 rounded font-mono text-xs mt-1 mb-1">
                    σ(z) = 1 / (1 + e^(-z))
                  </div>
                  <div className="text-purple-800">
                    Ausgabe zwischen 0 und 1. Gut für Wahrscheinlichkeiten.
                  </div>
                </div>

                <div>
                  <div className="font-semibold text-purple-900">Tanh (Hyperbolic Tangent):</div>
                  <div className="bg-white p-2 rounded font-mono text-xs mt-1 mb-1">
                    tanh(z) = (e^z - e^(-z)) / (e^z + e^(-z))
                  </div>
                  <div className="text-purple-800">
                    Ausgabe zwischen -1 und 1. Zentriert um 0.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-bold text-orange-900 mb-2">Loss Functions (Verlustfunktionen):</h3>

              <div className="space-y-2 text-sm">
                <div>
                  <div className="font-semibold text-orange-900">Binary Cross-Entropy:</div>
                  <div className="bg-white p-2 rounded font-mono text-xs mt-1 mb-1">
                    L = -[y·log(ŷ) + (1-y)·log(1-ŷ)]
                  </div>
                  <div className="text-orange-800">
                    Für binäre Klassifikation (2 Klassen)
                  </div>
                </div>

                <div className="text-orange-800">
                  Die Loss-Funktion misst wie weit die Vorhersagen vom echten Wert entfernt sind.
                  Das Ziel des Trainings ist es, diesen Loss zu minimieren.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Objectives */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            🎓 Lernziele
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Verstehen:</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>✓ Wie Neuronen Informationen verarbeiten</li>
                <li>✓ Rolle von Gewichten und Biases</li>
                <li>✓ Forward Pass und Backpropagation</li>
                <li>✓ Unterschiedliche Aktivierungsfunktionen</li>
                <li>✓ Wie das Netzwerk durch Gradienten lernt</li>
                <li>✓ Einfluss von Hyperparametern</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Beobachten:</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>✓ Gewichte werden während Training angepasst</li>
                <li>✓ Aktivierungen fließen durch das Netzwerk</li>
                <li>✓ Decision Boundary formt sich</li>
                <li>✓ Loss sinkt über Epochen</li>
                <li>✓ Effekt verschiedener Architekturen</li>
                <li>✓ Einfluss von Learning Rate</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Experimentation Guide */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            🧪 Experimentiere!
          </h2>
          <div className="space-y-3 text-gray-700">
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <strong>1. Einfaches Netzwerk:</strong>
              <p className="text-sm mt-1">
                Starte mit 1 Hidden Layer (4 Neuronen). Beobachte wie die Decision Boundary entsteht.
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <strong>2. Deep Network:</strong>
              <p className="text-sm mt-1">
                Füge mehr Hidden Layers hinzu (3-4 Layers). Beobachte wie das Netzwerk komplexere Muster lernt.
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <strong>3. Verschiedene Aktivierungsfunktionen:</strong>
              <p className="text-sm mt-1">
                Teste ReLU vs. Sigmoid vs. Tanh. Welche lernt am schnellsten?
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <strong>4. Learning Rate Experiment:</strong>
              <p className="text-sm mt-1">
                Sehr klein (0.001): Langsames Lernen. Sehr groß (0.9): Instabil. Finde das Optimum!
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <strong>5. Gewichte & Aktivierungen:</strong>
              <p className="text-sm mt-1">
                Toggle Weights/Activations während des Trainings. Beobachte wie sie sich ändern!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NeuralNetworkTest;
