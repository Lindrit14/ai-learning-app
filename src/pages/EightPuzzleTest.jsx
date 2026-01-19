// src/pages/EightPuzzleTest.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import EightPuzzlePlayground from '../components/playground/EightPuzzlePlayground';

function EightPuzzleTest() {
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
            8-Puzzle Problem mit A* Search
          </h1>
          <p className="text-gray-600">
            Vergleiche Hamming vs Manhattan Heuristiken und lerne über Admissibility & Effective Branching Factor
          </p>
        </div>

        {/* Problem Definition */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Das 8-Puzzle Problem
          </h2>
          
          <div className="prose max-w-none text-gray-700 space-y-4">
            <p>
              Das 8-Puzzle besteht aus 8 nummerierten Kacheln in einem 3×3 Grid mit einem leeren Feld.
              Das Ziel ist es, von einer Startkonfiguration zur Zielkonfiguration zu gelangen.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-900 mb-2">Aktionsregeln:</h3>
              <div className="text-sm text-blue-800">
                <p className="mb-2">
                  <strong>Original:</strong> Eine Kachel kann vom Feld X zum Feld Y bewegt werden, 
                  wenn X adjacent zu Y ist UND Y leer ist.
                </p>
                
                <div className="bg-white rounded p-3 mt-3">
                  <strong>Relaxierte Probleme (für Heuristiken):</strong>
                  <ul className="mt-2 space-y-1 list-disc list-inside">
                    <li><strong>Relaxation 1:</strong> Eine Kachel kann zu jedem Feld bewegt werden (keine Adjacency)</li>
                    <li><strong>Relaxation 2:</strong> Eine Kachel kann zu jedem leeren Feld bewegt werden</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* State Space */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-bold text-purple-900 mb-2">State Space:</h3>
              <div className="text-sm text-purple-800 space-y-2">
                <div><strong>States:</strong> 9! / 2 = 181,440 erreichbare Konfigurationen</div>
                <div><strong>Initial State:</strong> Zufällige Anordnung (shuffled)</div>
                <div><strong>Goal State:</strong> [1,2,3,4,5,6,7,8,_]</div>
                <div><strong>Actions:</strong> UP, DOWN, LEFT, RIGHT (max. 4 pro State)</div>
                <div><strong>Branching Factor:</strong> ~2-4 (abhängig von Blank-Position)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Heuristics */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Heuristiken im Vergleich
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Hamming Distance */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-bold text-blue-900 mb-3">
                h₁: Hamming Distance
              </h3>
              
              <div className="text-sm text-blue-800 space-y-3">
                <div>
                  <strong>Definition:</strong> Anzahl der Kacheln, die nicht an ihrer Zielposition sind
                  (ignoriert leeres Feld)
                </div>
                
                <div className="bg-white rounded p-3 font-mono text-xs">
                  h₁(n) = |{'{'}tile : tile ≠ goal_position{'}'}|
                </div>

                <div>
                  <strong>Beispiel:</strong>
                  <div className="grid grid-cols-3 gap-1 w-32 mt-2 bg-white p-2 rounded">
                    <div className="bg-blue-200 p-2 text-center font-bold">1</div>
                    <div className="bg-red-200 p-2 text-center font-bold">3</div>
                    <div className="bg-red-200 p-2 text-center font-bold">2</div>
                    <div className="bg-blue-200 p-2 text-center font-bold">4</div>
                    <div className="bg-blue-200 p-2 text-center font-bold">5</div>
                    <div className="bg-blue-200 p-2 text-center font-bold">6</div>
                    <div className="bg-blue-200 p-2 text-center font-bold">7</div>
                    <div className="bg-blue-200 p-2 text-center font-bold">8</div>
                    <div className="bg-gray-300 p-2"></div>
                  </div>
                  <div className="mt-2 text-xs">
                    Rot = falsche Position → h₁ = 2
                  </div>
                </div>

                <div className="pt-2 border-t border-blue-300">
                  <strong>Eigenschaften:</strong>
                  <ul className="mt-1 space-y-1 list-disc list-inside">
                    <li>✅ Admissible (unterschätzt nie)</li>
                    <li>✅ Consistent</li>
                    <li>⚠️ Grobe Schätzung</li>
                    <li>⚠️ Ignoriert Distanz</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Manhattan Distance */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="text-lg font-bold text-purple-900 mb-3">
                h₂: Manhattan Distance
              </h3>
              
              <div className="text-sm text-purple-800 space-y-3">
                <div>
                  <strong>Definition:</strong> Summe der Manhattan-Distanzen jeder Kachel zu ihrer Zielposition
                </div>
                
                <div className="bg-white rounded p-3 font-mono text-xs">
                  h₂(n) = Σ |x_current - x_goal| + |y_current - y_goal|
                </div>

                <div>
                  <strong>Beispiel:</strong>
                  <div className="grid grid-cols-3 gap-1 w-32 mt-2 bg-white p-2 rounded">
                    <div className="bg-purple-200 p-2 text-center font-bold text-xs">1<br/>0</div>
                    <div className="bg-red-200 p-2 text-center font-bold text-xs">3<br/>1</div>
                    <div className="bg-red-200 p-2 text-center font-bold text-xs">2<br/>1</div>
                    <div className="bg-purple-200 p-2 text-center font-bold text-xs">4<br/>0</div>
                    <div className="bg-purple-200 p-2 text-center font-bold text-xs">5<br/>0</div>
                    <div className="bg-purple-200 p-2 text-center font-bold text-xs">6<br/>0</div>
                    <div className="bg-purple-200 p-2 text-center font-bold text-xs">7<br/>0</div>
                    <div className="bg-purple-200 p-2 text-center font-bold text-xs">8<br/>0</div>
                    <div className="bg-gray-300 p-2"></div>
                  </div>
                  <div className="mt-2 text-xs">
                    Zahlen = Distanz → h₂ = 0+1+1+0+0+0+0+0 = 2
                  </div>
                </div>

                <div className="pt-2 border-t border-purple-300">
                  <strong>Eigenschaften:</strong>
                  <ul className="mt-1 space-y-1 list-disc list-inside">
                    <li>✅ Admissible</li>
                    <li>✅ Consistent</li>
                    <li>✅ Genauere Schätzung</li>
                    <li>✅ Dominiert h₁</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Dominance */}
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-bold text-green-900 mb-2">Dominanz:</h3>
            <div className="text-sm text-green-800">
              <p className="mb-2">
                <strong>h₂ dominiert h₁:</strong> Für jeden State n gilt: h₂(n) ≥ h₁(n)
              </p>
              <div className="bg-white rounded p-3 font-mono text-xs">
                h₂(n) ≥ h₁(n) ≥ 0  für alle n
              </div>
              <p className="mt-2">
                <strong>Bedeutung:</strong> Manhattan Distance führt zu weniger expandierten Knoten und 
                ist somit effizienter als Hamming Distance!
              </p>
            </div>
          </div>
        </div>

        {/* Playground */}
        <EightPuzzlePlayground />

        {/* Admissibility */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Admissibility & Consistency
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-bold text-yellow-900 mb-2">Admissible Heuristik</h3>
              <div className="text-sm text-yellow-800 space-y-2">
                <div className="bg-white rounded p-3 font-mono text-xs">
                  h(n) ≤ h*(n)  für alle n
                </div>
                <p>
                  <strong>h*(n):</strong> Tatsächliche minimale Kosten von n zum Ziel
                </p>
                <p>
                  Eine admissible Heuristik <strong>überschätzt nie</strong> die tatsächlichen Kosten.
                </p>
                <div className="mt-2 pt-2 border-t border-yellow-300">
                  <strong>Garantie:</strong> A* mit admissible h findet optimale Lösung!
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-bold text-orange-900 mb-2">Consistent Heuristik</h3>
              <div className="text-sm text-orange-800 space-y-2">
                <div className="bg-white rounded p-3 font-mono text-xs">
                  h(n) ≤ c(n,a,n') + h(n')
                </div>
                <p>
                  <strong>c(n,a,n'):</strong> Kosten der Aktion a von n nach n'
                </p>
                <p>
                  Entspricht der <strong>Dreiecksungleichung</strong> in metrischen Räumen.
                </p>
                <div className="mt-2 pt-2 border-t border-orange-300">
                  <strong>Garantie:</strong> Consistent → Admissible<br/>
                  Consistent ist stärker als Admissible!
                </div>
              </div>
            </div>
          </div>

          {/* Proof */}
          <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-bold text-purple-900 mb-2">
              Beweis: Hamming & Manhattan sind admissible
            </h3>
            <div className="text-sm text-purple-800 space-y-3">
              <div>
                <strong>Hamming Distance (h₁):</strong>
                <p className="mt-1">
                  Jede falsch platzierte Kachel muss mindestens 1 Zug gemacht werden.
                  h₁ zählt nur die Anzahl → h₁ ≤ h* ✓
                </p>
              </div>
              <div>
                <strong>Manhattan Distance (h₂):</strong>
                <p className="mt-1">
                  Jede Kachel muss mindestens ihre Manhattan-Distanz bewegt werden
                  (keine diagonalen Züge möglich). h₂ summiert diese Distanzen → h₂ ≤ h* ✓
                </p>
              </div>
              <div className="bg-white rounded p-3">
                <strong>Wichtig:</strong> Beide Heuristiken ignorieren, dass andere Kacheln im Weg sein können.
                Deshalb unterschätzen sie (admissible) aber überschätzen nie!
              </div>
            </div>
          </div>
        </div>

        {/* Effective Branching Factor */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Effective Branching Factor (b*)
          </h2>

          <div className="prose max-w-none text-gray-700 space-y-4">
            <p>
              Der <strong>Effective Branching Factor b*</strong> ist ein Maß für die Effizienz einer Heuristik.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-900 mb-2">Definition:</h3>
              <div className="text-sm text-blue-800 space-y-3">
                <p>
                  Wenn A* insgesamt <strong>N</strong> Knoten generiert und die Lösung bei Tiefe <strong>d</strong> findet,
                  dann ist b* der Branching Factor eines uniformen Baums der Tiefe d mit N+1 Knoten:
                </p>
                
                <div className="bg-white rounded p-3 font-mono text-sm">
                  N + 1 = 1 + b* + b*² + b*³ + ... + b*^d
                </div>

                <p>
                  <strong>Vereinfacht:</strong> N ≈ b*^d
                </p>

                <div className="bg-blue-100 rounded p-3 mt-3">
                  <strong>Interpretation:</strong>
                  <ul className="mt-2 space-y-1 list-disc list-inside">
                    <li>Kleinerer b* = Effizientere Suche</li>
                    <li>b* nahe 1 = Sehr effizient (fast direkter Pfad)</li>
                    <li>b* ≈ echter Branching Factor = Keine Pruning-Effekt</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-bold text-green-900 mb-2">Vergleich der Heuristiken:</h3>
              <div className="text-sm text-green-800">
                <table className="w-full bg-white rounded">
                  <thead className="bg-green-200">
                    <tr>
                      <th className="px-4 py-2 text-left">Heuristik</th>
                      <th className="px-4 py-2 text-left">Typ. b*</th>
                      <th className="px-4 py-2 text-left">Knoten</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="px-4 py-2">Uninformiert (BFS)</td>
                      <td className="px-4 py-2 font-mono">~3.5</td>
                      <td className="px-4 py-2">Sehr viele</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">h₁ (Hamming)</td>
                      <td className="px-4 py-2 font-mono">~1.8</td>
                      <td className="px-4 py-2">Viele</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-bold">h₂ (Manhattan)</td>
                      <td className="px-4 py-2 font-mono font-bold">~1.3</td>
                      <td className="px-4 py-2 font-bold">Wenige ✓</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-gray-500">h* (Ideal)</td>
                      <td className="px-4 py-2 font-mono text-gray-500">1.0</td>
                      <td className="px-4 py-2 text-gray-500">Minimal</td>
                    </tr>
                  </tbody>
                </table>

                <p className="mt-3">
                  <strong>Fazit:</strong> Manhattan Distance ist deutlich effizienter als Hamming Distance!
                </p>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-bold text-purple-900 mb-2">Berechnung von b*:</h3>
              <div className="text-sm text-purple-800 space-y-2">
                <p>
                  Die Gleichung N = 1 + b* + b*² + ... + b*^d kann nicht direkt gelöst werden.
                  Wir nutzen <strong>Binary Search</strong>:
                </p>
                
                <div className="bg-white rounded p-3 font-mono text-xs">
{`while (high - low > ε) {
  mid = (low + high) / 2
  sum = b* + b*² + ... + b*^d
  
  if (sum < N) low = mid
  else high = mid
}

b* ≈ (low + high) / 2`}
                </div>
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
              <strong className="text-gray-900">Experiment 1: Hamming vs Manhattan</strong>
              <p className="text-sm text-gray-700 mt-2">
                1. Shuffle puzzle<br/>
                2. Löse mit h₁ (Hamming) → Notiere: Nodes Generated, b*<br/>
                3. Reset to Goal, Shuffle gleich<br/>
                4. Löse mit h₂ (Manhattan) → Notiere: Nodes Generated, b*<br/>
                5. Vergleiche! Manhattan sollte effizienter sein.
              </p>
            </div>

            <div className="bg-white rounded-lg p-4">
              <strong className="text-gray-900">Experiment 2: Admissibility prüfen</strong>
              <p className="text-sm text-gray-700 mt-2">
                1. Shuffle puzzle<br/>
                2. Notiere h₁ und h₂ Werte während der Suche<br/>
                3. Nach Lösung: h ≤ tatsächliche Schritte?<br/>
                4. Beide sollten admissible sein!
              </p>
            </div>

            <div className="bg-white rounded-lg p-4">
              <strong className="text-gray-900">Experiment 3: Dominanz beobachten</strong>
              <p className="text-sm text-gray-700 mt-2">
                1. Bei jedem State während Suche<br/>
                2. Vergleiche h₁ und h₂ Werte<br/>
                3. h₂ ≥ h₁ sollte immer gelten<br/>
                4. Manhattan ist stärkere Heuristik!
              </p>
            </div>

            <div className="bg-white rounded-lg p-4">
              <strong className="text-gray-900">Experiment 4: Effective Branching Factor</strong>
              <p className="text-sm text-gray-700 mt-2">
                1. Löse mehrere Puzzles mit beiden Heuristiken<br/>
                2. Durchschnittliche b* berechnen<br/>
                3. Manhattan sollte durchgehend niedrigere b* haben<br/>
                4. Typisch: h₁ ≈ 1.8, h₂ ≈ 1.3
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EightPuzzleTest;