// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Home from './pages/Home';

import PlaygroundTest from './pages/PlaygroundTest';
import QLearningTest from './pages/QLearningTest';
import GraphSearchTest from './pages/GraphSearchTest';
import EightPuzzleTest from './pages/EightPuzzleTest';
import SupervisedLearningTest from './pages/SupervisedLearningTest';
import NeuralNetworkTest from './pages/NeuralNetworkTest';
import DecisionTreeTest from './pages/DecisionTreeTest';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/graph-search-test" element={<GraphSearchTest />} />
          <Route path="/playground-test" element={<PlaygroundTest />} />
          <Route path="/qlearning-test" element={<QLearningTest />} />
          <Route path="/eight-puzzle-test" element={<EightPuzzleTest />} />
          <Route path="/supervised-learning-test" element={<SupervisedLearningTest />} />
          <Route path="/neural-network-test" element={<NeuralNetworkTest />} />
          <Route path="/decision-tree-test" element={<DecisionTreeTest />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;