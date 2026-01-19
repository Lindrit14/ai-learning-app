// src/data/learningPaths.js

export const learningPaths = [
  {
    id: 'ml-basics',
    title: 'Machine Learning Grundlagen',
    description: 'Verstehe supervised und unsupervised Learning durch interaktive Beispiele',
    icon: '🤖',
    color: 'from-blue-500 to-cyan-500',
    topics: ['linear-regression', 'classification', 'k-means', 'decision-trees', 'overfitting'],
    duration: '4 Stunden',
    difficulty: 'Anfänger',
    prerequisites: [],
    learningGoals: [
      'Unterschied zwischen supervised und unsupervised Learning verstehen',
      'Lineare und logistische Regression anwenden können',
      'Clustering-Algorithmen verstehen',
      'Overfitting erkennen und vermeiden'
    ]
  },
  {
    id: 'neural-networks',
    title: 'Neural Networks',
    description: 'Von einfachen Perzeptrons bis zu Deep Learning Architekturen',
    icon: '🧠',
    color: 'from-purple-500 to-pink-500',
    topics: [
      'perceptron',
      'activation-functions',
      'backpropagation',
      'multi-layer-networks',
      'cnn-basics',
      'dropout',
      'batch-normalization'
    ],
    duration: '6 Stunden',
    difficulty: 'Fortgeschritten',
    prerequisites: ['ml-basics'],
    learningGoals: [
      'Aufbau und Funktion von Neuronen verstehen',
      'Backpropagation nachvollziehen können',
      'Verschiedene Aktivierungsfunktionen kennen',
      'CNNs für Bildverarbeitung verstehen',
      'Regularisierungstechniken anwenden'
    ]
  },
  {
    id: 'optimization',
    title: 'Optimierung & Training',
    description: 'Gradient Descent, Overfitting vermeiden und Modelle verbessern',
    icon: '📈',
    color: 'from-orange-500 to-red-500',
    topics: [
      'gradient-descent',
      'learning-rate',
      'momentum',
      'adam-optimizer',
      'regularization',
      'cross-validation'
    ],
    duration: '3 Stunden',
    difficulty: 'Mittel',
    prerequisites: ['ml-basics'],
    learningGoals: [
      'Gradient Descent Varianten verstehen',
      'Learning Rate optimal einstellen',
      'Verschiedene Optimizer vergleichen',
      'L1/L2 Regularisierung anwenden',
      'Cross-Validation durchführen'
    ]
  }
];

// Hilfsfunktionen
export const getLearningPathById = (id) => {
  return learningPaths.find(path => path.id === id);
};

export const getPathsByDifficulty = (difficulty) => {
  return learningPaths.filter(path => path.difficulty === difficulty);
};

export const getTotalTopics = () => {
  return learningPaths.reduce((sum, path) => sum + path.topics.length, 0);
};