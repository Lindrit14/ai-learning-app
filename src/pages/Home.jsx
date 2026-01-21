import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Target, ChevronRight, Play, TrendingUp, GitBranch } from 'lucide-react';



function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Section */}
        <div className='flex flex-col gap-3  '>

         <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                🤖 Q-Learning Reinforcement Learning
              </h3>
              <p className="text-gray-700 mb-4">
                Beobachte wie ein Agent lernt durch Trial & Error mit Q-Learning!
              </p>
              <p className="text-gray-700 mb-4">
                Interner Kommentar: Hier ist der Playground fertig. 
              </p>
              <Link
                to="/qlearning-test"
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
              >
                Play
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Lineare Regression */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Play className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Lineare Regression
              </h3>
              <p className="text-gray-700 mb-4">
                Teste das Linear Regression Playground!
              </p>
              <Link 
                to="/playground-test"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Playground testen
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
        

        

        {/* 8-Puzzle Demo */}
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                🧩 8-Puzzle mit A* Search
              </h3>
              <p className="text-gray-700 mb-4">
                Vergleiche Hamming vs Manhattan Heuristiken! Lerne über Admissibility & Effective Branching Factor!
              </p>
              <Link 
                to="/eight-puzzle-test"
                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
              >
                8-Puzzle testen
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>




{/* Supervised Learning Demo */}
        <div className="bg-pink-50 border border-pink-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                ⚠️ Baustelle ⚠️
              </h1>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                📊 Supervised Learning
              </h3>
              <p className="text-gray-700 mb-4">
                Trainiere Linear Regression, Logistic Regression & Neural Networks mit TensorFlow.js live!
              </p>
              <Link 
                to="/supervised-learning-test"
                className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors"
              >
                Supervised Learning testen
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>




       

        {/* Neural Network Demo */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                ⚠️ Baustelle ⚠️
              </h1>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                🧠 Neural Network Deep Learning
              </h3>
              <p className="text-gray-700 mb-4">
                Erkunde interaktiv Neuronale Netzwerke! Visualisiere Neuronen, Gewichte, Aktivierungen und lerne die Mathematik dahinter!
              </p>
              <Link
                to="/neural-network-test"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Neural Network testen
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Decision Tree Demo */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <GitBranch className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                ⚠️ Baustelle ⚠️
              </h1>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                🌳 Decision Trees
              </h3>
              <p className="text-gray-700 mb-4">
                Lerne Entropy, Gini Impurity und Information Gain! Visualisiere wie Decision Trees den Feature-Raum aufteilen!
              </p>
              <Link
                to="/decision-tree-test"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Decision Tree testen
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>




      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                ⚠️ Baustelle ⚠️
              </h1>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Graph Search Algorithmen
              </h3>
              <p className="text-gray-700 mb-4">
                Lerne BFS, DFS, UCS, A* und mehr!
              </p>
              <Link 
                to="/graph-search-test"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Graph Search testen
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>


      </div>
    </div>
    </div>
  );
}

export default Home;