// src/pages/PlaygroundTest.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import LinearRegressionPlayground from '../components/playground/LinearRegressionPlayground';

function PlaygroundTest() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Startseite
        </Link>

        {/* Page Header */}
       


      {/* Playground */}
        <LinearRegressionPlayground />


        {/* Theory Section (Optional) */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Was ist Lineare Regression?
          </h2>
          <div className="prose max-w-none text-gray-700">
            <p className="mb-4">
              Lineare Regression ist einer der grundlegendsten Machine Learning Algorithmen. 
              Das Ziel ist es, eine Gerade zu finden, die am besten durch die Datenpunkte passt.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="font-mono text-sm">
                <strong>Formel:</strong> y = m·x + b
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• <strong>m</strong> = Steigung (slope)</li>
                <li>• <strong>b</strong> = y-Achsenabschnitt (intercept)</li>
                <li>• <strong>x</strong> = Eingabewert</li>
                <li>• <strong>y</strong> = Vorhersage</li>
              </ul>
            </div>

            <p className="mb-4">
              Der Algorithmus nutzt <strong>Gradient Descent</strong>, um die besten Werte 
              für m und b zu finden. Dabei wird der <strong>Mean Squared Error (MSE)</strong> minimiert.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="font-mono text-sm text-blue-900">
                <strong>Loss Function (MSE):</strong> L = (1/n) · Σ(y_pred - y_actual)²
              </p>
            </div>
          </div>
        </div>

        

        {/* Explanation Section */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            🎓 Lernziele
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Verstehen:</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>✓ Wie Gradient Descent funktioniert</li>
                <li>✓ Einfluss der Learning Rate</li>
                <li>✓ Was der MSE-Loss bedeutet</li>
                <li>✓ Wie sich die Linie anpasst</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Experimentieren:</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>✓ Verschiedene Datenmuster testen</li>
                <li>✓ Learning Rate variieren</li>
                <li>✓ Wenige vs. viele Datenpunkte</li>
                <li>✓ Outlier hinzufügen</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaygroundTest;