// src/data/topics.js

export const topics = {
  // ===== ML BASICS =====
  'linear-regression': {
    id: 'linear-regression',
    title: 'Lineare Regression',
    subtitle: 'Vorhersage mit linearen Beziehungen',
    pathId: 'ml-basics',
    duration: '45 min',
    hasPlayground: true,
    description: 'Lerne wie lineare Regression funktioniert und wie Modelle trainiert werden, um Zusammenhänge zwischen Variablen zu erkennen.',
    theory: {
      introduction: `
Lineare Regression ist einer der grundlegendsten Machine Learning Algorithmen. 
Das Ziel ist es, eine Gerade (oder Hyperebene) zu finden, die am besten durch die Datenpunkte passt.

**Formel:** y = mx + b
- m = Steigung (slope)
- b = y-Achsenabschnitt (intercept)
- x = Eingabevariable
- y = Vorhersage
      `,
      keyPoints: [
        'Supervised Learning Algorithmus',
        'Funktioniert bei linearen Beziehungen',
        'Minimiert den Mean Squared Error (MSE)',
        'Einfach zu interpretieren'
      ],
      mathematics: `
**Loss Function (MSE):**
L = (1/n) * Σ(y_pred - y_actual)²

Das Ziel ist es, die Parameter m und b so zu finden, dass L minimal wird.
      `
    },
    playgroundConfig: {
      component: 'LinearRegressionPlayground',
      defaultParams: {
        dataPoints: 50,
        noise: 0.5,
        learningRate: 0.01,
        epochs: 100
      },
      interactiveElements: [
        'Datenpunkte generieren',
        'Noise-Level anpassen',
        'Training starten/stoppen',
        'Learning Rate ändern'
      ]
    },
    resources: [
      { type: 'video', title: '3Blue1Brown - Linear Regression', url: '#' },
      { type: 'article', title: 'Sklearn Documentation', url: '#' }
    ],
    nextTopics: ['classification', 'gradient-descent']
  },

  'classification': {
    id: 'classification',
    title: 'Klassifikation',
    subtitle: 'Kategorien vorhersagen mit Logistic Regression',
    pathId: 'ml-basics',
    duration: '50 min',
    hasPlayground: true,
    description: 'Verstehe wie Klassifikationsalgorithmen funktionieren und wie Entscheidungsgrenzen entstehen.',
    theory: {
      introduction: `
Klassifikation ist die Aufgabe, Datenpunkte in vordefinierte Kategorien einzuteilen.
Logistic Regression ist ein grundlegender Klassifikationsalgorithmus, trotz des Namens.

**Sigmoid-Funktion:** σ(x) = 1 / (1 + e^(-x))
Diese Funktion mappt beliebige Werte auf den Bereich [0, 1], was als Wahrscheinlichkeit interpretiert werden kann.
      `,
      keyPoints: [
        'Binäre und Multi-Class Klassifikation',
        'Entscheidungsgrenzen visualisieren',
        'Probabilistische Vorhersagen',
        'Cross-Entropy Loss'
      ]
    },
    playgroundConfig: {
      component: 'ClassificationPlayground',
      defaultParams: {
        classes: 2,
        pointsPerClass: 30,
        decisionBoundary: true
      }
    },
    nextTopics: ['decision-trees', 'perceptron']
  },

  'k-means': {
    id: 'k-means',
    title: 'K-Means Clustering',
    subtitle: 'Unsupervised Learning zum Gruppieren',
    pathId: 'ml-basics',
    duration: '40 min',
    hasPlayground: true,
    description: 'Lerne wie K-Means automatisch Gruppen in Daten findet – ohne Labels.',
    theory: {
      introduction: `
K-Means ist ein Clustering-Algorithmus, der Datenpunkte in K Gruppen (Cluster) einteilt.

**Algorithmus:**
1. Wähle K zufällige Zentroide
2. Weise jeden Punkt dem nächsten Zentroid zu
3. Berechne neue Zentroide als Mittelwert der zugewiesenen Punkte
4. Wiederhole 2-3 bis Konvergenz
      `,
      keyPoints: [
        'Unsupervised Learning',
        'Anzahl K muss vorgegeben werden',
        'Iterativer Algorithmus',
        'Sensitiv zu Initialisierung'
      ]
    },
    playgroundConfig: {
      component: 'KMeansPlayground',
      defaultParams: {
        k: 3,
        maxIterations: 20,
        showIterations: true
      }
    },
    nextTopics: ['neural-networks']
  },

  // ===== NEURAL NETWORKS =====
  'perceptron': {
    id: 'perceptron',
    title: 'Das Perzeptron',
    subtitle: 'Das einfachste neuronale Netzwerk',
    pathId: 'neural-networks',
    duration: '45 min',
    hasPlayground: true,
    description: 'Verstehe die Grundbausteine neuronaler Netze: das einzelne Neuron.',
    theory: {
      introduction: `
Das Perzeptron ist das einfachste künstliche Neuron. Es nimmt mehrere Eingaben,
gewichtet sie, summiert alles auf und wendet eine Aktivierungsfunktion an.

**Formel:** y = φ(Σ(w_i * x_i) + b)
- w_i = Gewichte
- x_i = Eingaben
- b = Bias
- φ = Aktivierungsfunktion
      `,
      keyPoints: [
        'Grundbaustein von Neural Networks',
        'Linear separierbare Probleme',
        'Inspiration aus Biologie',
        'Basis für Multi-Layer Networks'
      ]
    },
    playgroundConfig: {
      component: 'PerceptronPlayground',
      defaultParams: {
        inputs: 2,
        showWeights: true,
        problem: 'AND'
      }
    },
    nextTopics: ['activation-functions', 'backpropagation']
  },

  'backpropagation': {
    id: 'backpropagation',
    title: 'Backpropagation',
    subtitle: 'Wie neuronale Netze lernen',
    pathId: 'neural-networks',
    duration: '60 min',
    hasPlayground: true,
    description: 'Der Algorithmus, der Deep Learning möglich macht.',
    theory: {
      introduction: `
Backpropagation ist der Algorithmus, mit dem neuronale Netze ihre Gewichte anpassen.
Es nutzt die Chain Rule aus der Differentialrechnung, um Gradienten durch das Netzwerk zurückzupropagieren.

**Grundidee:**
1. Forward Pass: Berechne Output
2. Berechne Loss
3. Backward Pass: Berechne Gradienten
4. Update Weights
      `,
      keyPoints: [
        'Nutzt Chain Rule',
        'Efficient für viele Layer',
        'Kernalgorithmus von Deep Learning',
        'Ermöglicht Ende-zu-Ende Training'
      ]
    },
    playgroundConfig: {
      component: 'BackpropagationPlayground',
      defaultParams: {
        networkStructure: [2, 3, 1],
        visualizeGradients: true
      }
    },
    nextTopics: ['multi-layer-networks', 'gradient-descent']
  },

  // ===== OPTIMIZATION =====
  'gradient-descent': {
    id: 'gradient-descent',
    title: 'Gradient Descent',
    subtitle: 'Der Optimierungsalgorithmus',
    pathId: 'optimization',
    duration: '50 min',
    hasPlayground: true,
    description: 'Verstehe wie Modelle durch Gradientenabstieg optimiert werden.',
    theory: {
      introduction: `
Gradient Descent ist ein iterativer Optimierungsalgorithmus zur Minimierung einer Funktion.

**Update Rule:** w = w - α * ∇L(w)
- w = Parameter (Gewichte)
- α = Learning Rate
- ∇L = Gradient der Loss-Funktion

Der Gradient zeigt in die Richtung des steilsten Anstiegs – wir gehen in die entgegengesetzte Richtung.
      `,
      keyPoints: [
        'Batch vs. Stochastic vs. Mini-Batch',
        'Learning Rate ist kritisch',
        'Lokale vs. globale Minima',
        'Basis für alle modernen Optimizer'
      ]
    },
    playgroundConfig: {
      component: 'GradientDescentPlayground',
      defaultParams: {
        learningRate: 0.1,
        batchSize: 32,
        visualize3D: true
      }
    },
    nextTopics: ['momentum', 'adam-optimizer']
  }
};

// Hilfsfunktionen
export const getTopicById = (id) => {
  return topics[id];
};

export const getTopicsByPath = (pathId) => {
  return Object.values(topics).filter(topic => topic.pathId === pathId);
};

export const getNextTopic = (currentTopicId) => {
  const current = topics[currentTopicId];
  if (!current || !current.nextTopics || current.nextTopics.length === 0) {
    return null;
  }
  return topics[current.nextTopics[0]];
};