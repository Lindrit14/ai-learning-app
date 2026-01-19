// src/pages/QLearningTest.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import QLearningPlayground from '../components/playground/QLearningPlayground';

function QLearningTest() {
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
            Q-Learning Reinforcement Learning
          </h1>
          <p className="text-gray-600">
            Interaktive Visualisierung von Q-Learning mit Live Q-Table Updates
          </p>
        </div>

        {/* Theory Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Was ist Q-Learning?
          </h2>
          <div className="prose max-w-none text-gray-700 space-y-4">
            <p>
              Q-Learning ist ein <strong>Reinforcement Learning</strong> Algorithmus, der einem Agenten 
              beibringt, optimale Entscheidungen in einer Umgebung zu treffen.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-bold text-gray-900 mb-2">Kernkonzepte:</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong>Agent:</strong> Der Lerner/Entscheider (🤖 roter Kreis)
                </li>
                <li>
                  <strong>Environment:</strong> Das Grid mit Hindernissen und Ziel
                </li>
                <li>
                  <strong>State (s):</strong> Position des Agenten (x, y)
                </li>
                <li>
                  <strong>Action (a):</strong> Bewegung (↑, →, ↓, ←)
                </li>
                <li>
                  <strong>Reward (r):</strong> Feedback von der Umgebung (+100 für Ziel, -100 für Hindernis, -1 pro Schritt)
                </li>
                <li>
                  <strong>Q-Value Q(s,a):</strong> Erwarteter zukünftiger Reward für Aktion a in State s
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-900 mb-3">Q-Learning Update Formel:</h3>
              <div className="bg-white p-3 rounded font-mono text-sm border border-blue-300 mb-3">
                Q(s, a) ← Q(s, a) + α [r + γ · max Q(s', a') - Q(s, a)]
              </div>
              
              <div className="space-y-2 text-sm text-blue-900">
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <strong>Q(s, a):</strong>
                  <span>Q-Wert für State s und Aktion a</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <strong>α (alpha):</strong>
                  <span>Learning Rate (0.1 = 10% des Fehlers wird gelernt)</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <strong>r:</strong>
                  <span>Reward für diese Aktion</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <strong>γ (gamma):</strong>
                  <span>Discount Factor (wie wichtig sind zukünftige Rewards?)</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <strong>s':</strong>
                  <span>Nächster State nach Aktion</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <strong>max Q(s',a'):</strong>
                  <span>Bester Q-Wert im nächsten State</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-bold text-purple-900 mb-2">Epsilon-Greedy Strategy (ε):</h3>
              <p className="text-sm text-purple-800 mb-2">
                Balance zwischen <strong>Exploration</strong> (neue Wege ausprobieren) und 
                <strong>Exploitation</strong> (beste bekannte Aktion wählen).
              </p>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Mit Wahrscheinlichkeit ε: <strong>Random</strong> Aktion (Exploration)</li>
                <li>• Mit Wahrscheinlichkeit (1-ε): <strong>Best</strong> Aktion aus Q-Table (Exploitation)</li>
                <li>• ε startet bei 1.0 (100% random) und sinkt über Zeit auf ~0.01</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Playground */}
        <QLearningPlayground />

        {/* Learning Objectives */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            🎓 Lernziele
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Verstehen:</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>✓ Wie Q-Learning die Q-Table aufbaut</li>
                <li>✓ Bedeutung von Learning Rate (α)</li>
                <li>✓ Rolle des Discount Factors (γ)</li>
                <li>✓ Exploration vs. Exploitation (ε)</li>
                <li>✓ Wie Rewards das Lernen beeinflussen</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Beobachten:</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>✓ Q-Werte werden größer zum Ziel hin</li>
                <li>✓ Pfeile zeigen die gelernte Policy</li>
                <li>✓ Agent vermeidet Hindernisse</li>
                <li>✓ Epsilon sinkt → mehr Exploitation</li>
                <li>✓ Reward steigt über Episodes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Experimentation Guide */}
        <div className="mt-8 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            🧪 Experimentiere!
          </h2>
          <div className="space-y-3 text-gray-700">
            <div className="bg-white rounded-lg p-3 border border-orange-200">
              <strong>1. Standard Training:</strong>
              <p className="text-sm mt-1">Starte Training und beobachte wie die Pfeile (Policy) entstehen</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-orange-200">
              <strong>2. Hohe Learning Rate (α = 0.9):</strong>
              <p className="text-sm mt-1">Agent lernt schneller, aber kann instabil werden</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-orange-200">
              <strong>3. Niedriger Discount Factor (γ = 0.3):</strong>
              <p className="text-sm mt-1">Agent bevorzugt sofortige Rewards, plant nicht weit voraus</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-orange-200">
              <strong>4. Hoher Discount Factor (γ = 0.99):</strong>
              <p className="text-sm mt-1">Agent plant weit in die Zukunft, lernt optimale Pfade</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QLearningTest;