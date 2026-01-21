// src/pages/DecisionTreeTest.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import DecisionTreePlayground from '../components/playground/DecisionTreePlayground';

function DecisionTreeTest() {
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
            Decision Trees (Entscheidungsbäume)
          </h1>
          <p className="text-gray-600">
            Lerne die Mathematik hinter Decision Trees durch interaktive Visualisierung
          </p>
        </div>

        {/* Playground */}
        <DecisionTreePlayground />

        {/* Theory Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Was sind Decision Trees?
          </h2>
          <div className="prose max-w-none text-gray-700 space-y-4">
            <p>
              Decision Trees sind <strong>überwachte Lernalgorithmen</strong>, die Daten durch
              hierarchische Entscheidungen klassifizieren. Sie teilen den Feature-Raum rekursiv
              in Regionen auf, um Klassen zu trennen.
            </p>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-bold text-gray-900 mb-2">Kernkomponenten:</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong>Root Node (Wurzel):</strong> Oberster Knoten mit allen Trainingsdaten
                </li>
                <li>
                  <strong>Internal Nodes:</strong> Entscheidungsknoten mit Split-Bedingungen (z.B., "X ≤ 0.5")
                </li>
                <li>
                  <strong>Leaf Nodes (Blätter):</strong> Endknoten mit Klassenvorhersagen
                </li>
                <li>
                  <strong>Branches (Zweige):</strong> Verbindungen zwischen Knoten (True/False)
                </li>
                <li>
                  <strong>Splits:</strong> Aufteilung der Daten basierend auf Features
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-900 mb-3">Entropy (Entropie):</h3>

              <div className="space-y-3">
                <div>
                  <div className="bg-white p-3 rounded font-mono text-sm border border-blue-300 mb-2">
                    H(S) = -Σ p<sub>i</sub> × log<sub>2</sub>(p<sub>i</sub>)
                  </div>
                  <div className="text-sm text-blue-900">
                    Misst die Unordnung/Unsicherheit in einem Datensatz
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white p-2 rounded">
                    <strong>H = 0:</strong> Alle Samples gleiche Klasse (perfekt)
                  </div>
                  <div className="bg-white p-2 rounded">
                    <strong>H = 1:</strong> 50/50 Split (maximale Unsicherheit)
                  </div>
                </div>

                <div className="text-sm text-blue-900 space-y-1">
                  <div>
                    <strong>p<sub>i</sub>:</strong> Anteil der Samples der Klasse i
                  </div>
                  <div>
                    <strong>Σ:</strong> Summe über alle Klassen
                  </div>
                </div>
              </div>

              <div className="mt-3 bg-white p-3 rounded text-sm">
                <strong>Beispiel:</strong> 10 Samples: 7 Klasse 0, 3 Klasse 1
                <div className="font-mono text-xs mt-2 bg-gray-50 p-2 rounded">
                  p₀ = 7/10 = 0.7, p₁ = 3/10 = 0.3<br/>
                  H = -(0.7×log₂(0.7) + 0.3×log₂(0.3)) = 0.881
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-bold text-green-900 mb-3">Gini Impurity:</h3>

              <div className="space-y-3">
                <div>
                  <div className="bg-white p-3 rounded font-mono text-sm border border-green-300 mb-2">
                    Gini(S) = 1 - Σ p<sub>i</sub><sup>2</sup>
                  </div>
                  <div className="text-sm text-green-900">
                    Wahrscheinlichkeit einer falschen Klassifikation bei zufälliger Auswahl
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white p-2 rounded">
                    <strong>Gini = 0:</strong> Alle Samples gleiche Klasse (perfekt)
                  </div>
                  <div className="bg-white p-2 rounded">
                    <strong>Gini = 0.5:</strong> 50/50 Split (maximale Unreinheit)
                  </div>
                </div>
              </div>

              <div className="mt-3 bg-white p-3 rounded text-sm">
                <strong>Beispiel:</strong> 10 Samples: 7 Klasse 0, 3 Klasse 1
                <div className="font-mono text-xs mt-2 bg-gray-50 p-2 rounded">
                  p₀ = 0.7, p₁ = 0.3<br/>
                  Gini = 1 - (0.7² + 0.3²) = 1 - (0.49 + 0.09) = 0.42
                </div>
              </div>

              <div className="mt-3 bg-blue-100 border border-blue-300 p-3 rounded text-sm text-blue-900">
                <strong>💡 Gini vs. Entropy:</strong> Beide messen Unreinheit. Gini ist
                rechnerisch effizienter, Entropy hat theoretische Grundlage in der
                Informationstheorie. In der Praxis ergeben beide ähnliche Bäume.
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-bold text-purple-900 mb-3">Information Gain (Informationsgewinn):</h3>

              <div className="space-y-3">
                <div>
                  <div className="bg-white p-3 rounded font-mono text-sm border border-purple-300 mb-2">
                    IG = H(parent) - [w<sub>L</sub> × H(left) + w<sub>R</sub> × H(right)]
                  </div>
                  <div className="text-sm text-purple-900">
                    Reduktion der Entropie nach einem Split
                  </div>
                </div>

                <div className="text-sm text-purple-900 space-y-1">
                  <div>
                    <strong>H(parent):</strong> Entropie/Gini vor dem Split
                  </div>
                  <div>
                    <strong>w<sub>L</sub>, w<sub>R</sub>:</strong> Gewichte (Anteil Samples links/rechts)
                  </div>
                  <div>
                    <strong>H(left), H(right):</strong> Entropie/Gini der Kinderknoten
                  </div>
                </div>

                <div className="bg-white p-3 rounded text-sm">
                  <strong>Ziel:</strong> Maximiere Information Gain beim Split
                  <div className="mt-2 text-purple-900">
                    Der beste Split ist der mit dem <strong>höchsten Information Gain</strong>
                    - er reduziert die Unsicherheit am meisten!
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-bold text-orange-900 mb-3">CART Algorithmus:</h3>
              <div className="text-sm text-orange-900">
                <strong>C</strong>lassification <strong>A</strong>nd <strong>R</strong>egression
                <strong>T</strong>rees - der Standard-Algorithmus zum Aufbau von Decision Trees
              </div>

              <div className="space-y-2 mt-3">
                <div className="bg-white p-3 rounded text-sm">
                  <strong className="text-orange-900">Schritt 1: Start</strong>
                  <div className="text-gray-700 mt-1">Beginne mit allen Trainingsdaten in der Wurzel</div>
                </div>

                <div className="bg-white p-3 rounded text-sm">
                  <strong className="text-orange-900">Schritt 2: Best Split suchen</strong>
                  <div className="text-gray-700 mt-1">
                    Für jedes Feature und jeden Threshold: Berechne Information Gain
                  </div>
                  <div className="font-mono text-xs mt-2 bg-gray-50 p-2 rounded">
                    best_split = argmax<sub>feature,threshold</sub> IG(feature, threshold)
                  </div>
                </div>

                <div className="bg-white p-3 rounded text-sm">
                  <strong className="text-orange-900">Schritt 3: Split durchführen</strong>
                  <div className="text-gray-700 mt-1">Teile Daten in left (≤ threshold) und right (&gt; threshold)</div>
                </div>

                <div className="bg-white p-3 rounded text-sm">
                  <strong className="text-orange-900">Schritt 4: Rekursion</strong>
                  <div className="text-gray-700 mt-1">Wiederhole für linke und rechte Teilmenge</div>
                </div>

                <div className="bg-white p-3 rounded text-sm">
                  <strong className="text-orange-900">Schritt 5: Stopp-Kriterien</strong>
                  <div className="text-gray-700 mt-1 space-y-1">
                    <div>• Maximale Tiefe erreicht (max_depth)</div>
                    <div>• Zu wenige Samples (min_samples_split)</div>
                    <div>• Alle Samples gleiche Klasse</div>
                    <div>• Kein positiver Information Gain möglich</div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded text-sm">
                  <strong className="text-orange-900">Schritt 6: Leaf erstellen</strong>
                  <div className="text-gray-700 mt-1">Weise Mehrheitsklasse zu</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overfitting vs Generalization */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            ⚖️ Overfitting vs. Generalization
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-bold text-red-900 mb-2">❌ Overfitting (Überanpassung):</h3>
              <div className="text-sm text-red-800 space-y-2">
                <p>
                  Der Baum lernt die Trainingsdaten <strong>zu genau</strong> und
                  funktioniert schlecht auf neuen Daten.
                </p>
                <div className="bg-white rounded p-2">
                  <strong>Ursachen:</strong>
                  <ul className="mt-1 ml-4 list-disc">
                    <li>Baum zu tief (high max_depth)</li>
                    <li>Zu wenige Samples pro Split</li>
                    <li>Keine Regularisierung</li>
                  </ul>
                </div>
                <div className="bg-white rounded p-2">
                  <strong>Erkennbar an:</strong>
                  <ul className="mt-1 ml-4 list-disc">
                    <li>100% Training Accuracy</li>
                    <li>Niedrige Test Accuracy</li>
                    <li>Sehr komplexe Decision Boundary</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-bold text-green-900 mb-2">✅ Good Generalization:</h3>
              <div className="text-sm text-green-800 space-y-2">
                <p>
                  Der Baum lernt <strong>allgemeine Muster</strong> und funktioniert
                  gut auf neuen Daten.
                </p>
                <div className="bg-white rounded p-2">
                  <strong>Methoden:</strong>
                  <ul className="mt-1 ml-4 list-disc">
                    <li>max_depth limitieren (z.B., 3-5)</li>
                    <li>min_samples_split erhöhen (z.B., 10-20)</li>
                    <li>Pruning (Beschneiden des Baums)</li>
                  </ul>
                </div>
                <div className="bg-white rounded p-2">
                  <strong>Erkennbar an:</strong>
                  <ul className="mt-1 ml-4 list-disc">
                    <li>Ausgewogene Train/Test Accuracy</li>
                    <li>Einfache, interpretierbare Regeln</li>
                    <li>Glatte Decision Boundary</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-bold text-blue-900 mb-2">🎯 Bias-Variance Tradeoff:</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div className="bg-white rounded p-3">
                <strong>High Bias (Underfitting):</strong>
                <div className="mt-1">Baum zu simpel → ignoriert wichtige Muster</div>
              </div>
              <div className="bg-white rounded p-3">
                <strong>High Variance (Overfitting):</strong>
                <div className="mt-1">Baum zu komplex → lernt Rauschen</div>
              </div>
            </div>
          </div>
        </div>

        {/* Advantages & Disadvantages */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            ⚡ Vor- und Nachteile
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                <span className="text-xl">✅</span> Vorteile
              </h3>
              <div className="space-y-2 text-sm">
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <strong>Interpretierbar:</strong> Leicht zu verstehen und zu erklären
                </div>
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <strong>Keine Normalisierung:</strong> Features müssen nicht skaliert werden
                </div>
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <strong>Non-linear:</strong> Erfasst non-lineare Beziehungen automatisch
                </div>
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <strong>Mixed Data:</strong> Funktioniert mit numerischen und kategorialen Features
                </div>
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <strong>Feature Importance:</strong> Zeigt wichtigste Features
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                <span className="text-xl">❌</span> Nachteile
              </h3>
              <div className="space-y-2 text-sm">
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <strong>Overfitting:</strong> Neigung zur Überanpassung ohne Regularisierung
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <strong>Instabil:</strong> Kleine Datenänderungen → komplett anderer Baum
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <strong>Biased Splits:</strong> Bevorzugt Features mit vielen Werten
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <strong>Orthogonal:</strong> Nur achsenparallele Splits (X ≤ c oder Y ≤ c)
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <strong>Einzelbaum schwach:</strong> Random Forests oft besser
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-world Applications */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            🌍 Real-world Anwendungen
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">🏥 Medizinische Diagnose</h3>
              <div className="text-sm text-blue-800">
                Symptome → Krankheit vorhersagen. Interpretierbarkeit ist wichtig für Ärzte.
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">💳 Kreditrisiko</h3>
              <div className="text-sm text-green-800">
                Kundenmerkmale → Kredit genehmigen/ablehnen. Regulierung erfordert Erklärbarkeit.
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">📧 Email Filtering</h3>
              <div className="text-sm text-purple-800">
                Email-Features → Spam/nicht Spam. Schnelle Klassifikation wichtig.
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-900 mb-2">🎯 Customer Churn</h3>
              <div className="text-sm text-orange-800">
                Kundenverhalten → wird kündigen? Decision Trees für Segmentierung.
              </div>
            </div>
          </div>

          <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">🌲 Ensemble Methods:</h3>
            <div className="text-sm text-gray-700">
              Decision Trees sind die Basis für mächtige Ensemble-Methoden:
              <div className="grid md:grid-cols-3 gap-3 mt-3">
                <div className="bg-white rounded p-2 border">
                  <strong>Random Forest:</strong> Viele Bäume parallel
                </div>
                <div className="bg-white rounded p-2 border">
                  <strong>Gradient Boosting:</strong> Sequenzielle Bäume (XGBoost, LightGBM)
                </div>
                <div className="bg-white rounded p-2 border">
                  <strong>AdaBoost:</strong> Adaptive Gewichtung
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
                <li>✓ Wie Entropy und Gini Impurity berechnet werden</li>
                <li>✓ Was Information Gain bedeutet</li>
                <li>✓ CART Algorithmus (greedy split selection)</li>
                <li>✓ Unterschied Entropy vs. Gini</li>
                <li>✓ Rolle von max_depth und min_samples_split</li>
                <li>✓ Overfitting bei Decision Trees</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Beobachten:</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>✓ Wie der Baum den Feature-Raum aufteilt</li>
                <li>✓ Orthogonale (achsenparallele) Decision Boundaries</li>
                <li>✓ Baumtiefe beeinflusst Komplexität</li>
                <li>✓ Impurity-Werte sinken von Wurzel zu Blättern</li>
                <li>✓ Wie Hyperparameter den Baum formen</li>
                <li>✓ Training ist schnell (greedy, nicht iterativ)</li>
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
              <strong>1. Einfacher Baum (Depth 1-2):</strong>
              <p className="text-sm mt-1">
                Generiere Daten und baue einen flachen Baum. Beobachte wie nur wenige
                Splits gemacht werden → einfache Boundary, möglicherweise Underfitting.
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <strong>2. Tiefer Baum (Depth 8-10):</strong>
              <p className="text-sm mt-1">
                Erhöhe max_depth stark. Der Baum wird jeden Punkt perfekt klassifizieren →
                komplexe Boundary, wahrscheinlich Overfitting!
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <strong>3. Gini vs. Entropy:</strong>
              <p className="text-sm mt-1">
                Baue zwei identische Bäume mit verschiedenen Kriterien. Sind sie unterschiedlich?
                Meist sehr ähnlich! Gini ist schneller zu berechnen.
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <strong>4. Min Samples Split Effekt:</strong>
              <p className="text-sm mt-1">
                Setze min_samples_split auf 20. Der Baum macht weniger Splits → einfacher,
                robuster gegen Overfitting.
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <strong>5. Visualisierung nutzen:</strong>
              <p className="text-sm mt-1">
                Aktiviere "Splits" und "Metrics". Beobachte wie die Splits den Raum teilen
                und wie die Impurity-Werte sinken. Links von einem Split → True, Rechts → False.
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-green-200">
              <strong>6. Eigene Daten erstellen:</strong>
              <p className="text-sm mt-1">
                Klicke auf den Canvas um eigene Muster zu erstellen (z.B., XOR-Pattern).
                Decision Trees haben Schwierigkeiten mit diagonalen Mustern!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DecisionTreeTest;
