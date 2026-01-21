// src/pages/GraphSearchTest.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import GraphSearchPlayground from '../components/playground/GraphSearchPlayground'; 

function GraphSearchTest() {
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
            Graph Search Algorithmen
          </h1>
          <p className="text-gray-600">
            Lerne BFS, DFS, UCS, Greedy Best-First und A* durch interaktive Visualisierung
          </p>
        </div>

        

        {/* Theory Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Was sind Suchalgorithmen?
          </h2>
          <div className="prose max-w-none text-gray-700 space-y-4">
            <p>
              Suchalgorithmen finden einen Pfad von einem <strong>Startknoten</strong> zu einem 
              <strong>Zielknoten</strong> in einem Graphen. Sie unterscheiden sich in der Art, 
              wie sie die Knoten explorieren.
            </p>

            {/* BFS */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-bold text-blue-900 mb-2">
                🔵 Breadth-First Search (BFS)
              </h3>
              <div className="text-sm text-blue-800 space-y-2">
                <p><strong>Strategie:</strong> Exploriere alle Nachbarn auf gleicher Tiefe, bevor du tiefer gehst</p>
                <p><strong>Datenstruktur:</strong> Queue (FIFO - First In, First Out)</p>
                <p><strong>Verwendung:</strong> Kürzester Pfad in ungewichteten Graphen</p>
                <div className="bg-white rounded p-2 font-mono text-xs">
                  Queue: [S] → [A, B] → [B, C, D] → [C, D, E] → ...
                </div>
                <div className="flex gap-4 mt-2">
                  <span>✅ Vollständig</span>
                  <span>✅ Optimal (ungewichtet)</span>
                  <span>⚠️ Speicher: O(b^d)</span>
                </div>
              </div>
            </div>

            {/* DFS */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="text-lg font-bold text-purple-900 mb-2">
                🟣 Depth-First Search (DFS)
              </h3>
              <div className="text-sm text-purple-800 space-y-2">
                <p><strong>Strategie:</strong> Gehe so tief wie möglich, backtrack wenn nötig</p>
                <p><strong>Datenstruktur:</strong> Stack (LIFO - Last In, First Out)</p>
                <p><strong>Verwendung:</strong> Topologische Sortierung, Zykluserkennung</p>
                <div className="bg-white rounded p-2 font-mono text-xs">
                  Stack: [S] → [A, B] → [A, D, E] → [A, D, G] → ...
                </div>
                <div className="flex gap-4 mt-2">
                  <span>⚠️ Nicht immer vollständig</span>
                  <span>❌ Nicht optimal</span>
                  <span>✅ Speicher: O(bd)</span>
                </div>
              </div>
            </div>

            {/* UCS */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-bold text-green-900 mb-2">
                🟢 Uniform Cost Search (UCS)
              </h3>
              <div className="text-sm text-green-800 space-y-2">
                <p><strong>Strategie:</strong> Expandiere immer den Knoten mit niedrigsten Pfadkosten g(n)</p>
                <p><strong>Datenstruktur:</strong> Priority Queue (sortiert nach g)</p>
                <p><strong>Verwendung:</strong> Kürzester Pfad in gewichteten Graphen</p>
                <div className="bg-white rounded p-2 font-mono text-xs">
                  PQueue: [S(0)] → [A(2), B(3)] → [B(3), C(4), D(5)] → ...
                </div>
                <div className="flex gap-4 mt-2">
                  <span>✅ Vollständig</span>
                  <span>✅ Optimal</span>
                  <span>⚠️ Langsam ohne Heuristik</span>
                </div>
              </div>
            </div>

            {/* GBFS */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-lg font-bold text-yellow-900 mb-2">
                🟡 Greedy Best-First Search (GBFS)
              </h3>
              <div className="text-sm text-yellow-800 space-y-2">
                <p><strong>Strategie:</strong> Expandiere den Knoten, der dem Ziel am nächsten erscheint h(n)</p>
                <p><strong>Datenstruktur:</strong> Priority Queue (sortiert nach h)</p>
                <p><strong>Verwendung:</strong> Schnelle Annäherung, nicht garantiert optimal</p>
                <div className="bg-white rounded p-2 font-mono text-xs">
                  PQueue: [S(h=7)] → [A(h=6), B(h=5)] → [B(h=5), C(h=4), D(h=3)] → ...
                </div>
                <div className="flex gap-4 mt-2">
                  <span>⚠️ Nicht immer vollständig</span>
                  <span>❌ Nicht optimal</span>
                  <span>✅ Oft schneller als UCS</span>
                </div>
              </div>
            </div>

            {/* A* */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-lg font-bold text-red-900 mb-2">
                🔴 A* Search
              </h3>
              <div className="text-sm text-red-800 space-y-2">
                <p><strong>Strategie:</strong> Kombiniere tatsächliche Kosten g(n) und Schätzung h(n)</p>
                <p><strong>Formel:</strong> f(n) = g(n) + h(n)</p>
                <p><strong>Datenstruktur:</strong> Priority Queue (sortiert nach f)</p>
                <p><strong>Verwendung:</strong> Optimalster informed search Algorithmus</p>
                <div className="bg-white rounded p-2 font-mono text-xs">
                  f(n) = g(n) + h(n)<br/>
                  PQueue: [S(0+7=7)] → [A(2+6=8), B(3+5=8)] → [B(3+5=8), C(4+4=8)] → ...
                </div>
                <div className="flex gap-4 mt-2">
                  <span>✅ Vollständig</span>
                  <span>✅ Optimal (bei admissible h)</span>
                  <span>✅ Optimal effizient</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Playground */}
        <GraphSearchPlayground />

        {/* Key Concepts */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            🔑 Wichtige Konzepte
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Uninformierte Suche:</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="bg-gray-50 rounded p-3">
                  <strong>BFS & DFS:</strong> Keine Ahnung wo das Ziel ist, systematische Exploration
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <strong>UCS:</strong> Nutzt Kantenkosten, aber keine Schätzung zum Ziel
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Informierte Suche:</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="bg-gray-50 rounded p-3">
                  <strong>GBFS:</strong> Nutzt Heuristik h(n) zur Schätzung der Distanz zum Ziel
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <strong>A*:</strong> Kombiniert g(n) + h(n) für optimale Balance
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2">Heuristik h(n):</h4>
            <p className="text-sm text-purple-800 mb-2">
              Eine Schätzfunktion die die "Entfernung" vom aktuellen Knoten zum Ziel schätzt.
            </p>
            <div className="text-sm text-purple-800 space-y-1">
              <div>• <strong>Admissible:</strong> h(n) ≤ tatsächliche Kosten (nie überschätzen)</div>
              <div>• <strong>Consistent:</strong> h(n) ≤ c(n,n') + h(n') (Dreiecksungleichung)</div>
              <div>• <strong>Beispiele:</strong> Euklidische Distanz, Manhattan Distanz</div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            📊 Algorithmen Vergleich
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Algorithmus</th>
                  <th className="px-4 py-2 text-left">Vollständig</th>
                  <th className="px-4 py-2 text-left">Optimal</th>
                  <th className="px-4 py-2 text-left">Zeit</th>
                  <th className="px-4 py-2 text-left">Speicher</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-4 py-3 font-medium">BFS</td>
                  <td className="px-4 py-3">✅ Ja</td>
                  <td className="px-4 py-3">✅ Ja*</td>
                  <td className="px-4 py-3">O(b^d)</td>
                  <td className="px-4 py-3">O(b^d)</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 font-medium">DFS</td>
                  <td className="px-4 py-3">⚠️ Nein</td>
                  <td className="px-4 py-3">❌ Nein</td>
                  <td className="px-4 py-3">O(b^m)</td>
                  <td className="px-4 py-3">O(bm)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">UCS</td>
                  <td className="px-4 py-3">✅ Ja</td>
                  <td className="px-4 py-3">✅ Ja</td>
                  <td className="px-4 py-3">O(b^(C*/ε))</td>
                  <td className="px-4 py-3">O(b^(C*/ε))</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 font-medium">GBFS</td>
                  <td className="px-4 py-3">⚠️ Nein</td>
                  <td className="px-4 py-3">❌ Nein</td>
                  <td className="px-4 py-3">O(b^m)</td>
                  <td className="px-4 py-3">O(b^m)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">A*</td>
                  <td className="px-4 py-3">✅ Ja</td>
                  <td className="px-4 py-3">✅ Ja**</td>
                  <td className="px-4 py-3">O(b^d)</td>
                  <td className="px-4 py-3">O(b^d)</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-xs text-gray-600 space-y-1">
            <div>* BFS optimal nur bei ungewichteten Graphen</div>
            <div>** A* optimal nur bei admissible Heuristik</div>
            <div>b = branching factor, d = depth, m = max depth, C* = optimale Kosten, ε = min. Kantenkosten</div>
          </div>
        </div>

        {/* Experimentation */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            🧪 Experimentiere!
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <strong className="text-gray-900">Vergleiche BFS vs DFS:</strong>
              <p className="text-sm text-gray-700 mt-2">
                Starte mit BFS, dann DFS auf gleichem Graphen. Beobachte den Unterschied in 
                Explorationsreihenfolge und Queue/Stack Verhalten.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <strong className="text-gray-900">UCS vs A*:</strong>
              <p className="text-sm text-gray-700 mt-2">
                Beide finden optimalen Pfad, aber A* expandiert weniger Knoten dank Heuristik. 
                Zähle die besuchten Knoten!
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <strong className="text-gray-900">GBFS Risiko:</strong>
              <p className="text-sm text-gray-700 mt-2">
                Greedy kann in lokale Minima laufen. Generiere zufällige Graphen und prüfe ob 
                GBFS suboptimale Pfade findet.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <strong className="text-gray-900">A* Heuristik:</strong>
              <p className="text-sm text-gray-700 mt-2">
                Die violetten h-Werte sind die Heuristik. Beobachte wie A* Knoten mit niedrigem 
                f=g+h bevorzugt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GraphSearchTest;