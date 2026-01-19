import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Target, ChevronRight, Play, TrendingUp } from 'lucide-react';



function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Learning Lab
          </h1>
          <p className="text-gray-600">
            Interaktive Lernumgebung für AI, ML und DL Konzepte
          </p>
        </div>

        {/* Quick Stats */}

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                🔍 Graph Search Algorithmen
              </h3>
              <p className="text-gray-700 mb-4">
                Lerne BFS, DFS, UCS, A* und mehr! Visualisiere wie Suchalgorithmen Pfade in Graphen finden!
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


        {/* Playground Demo */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Play className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                🎮 Playground Demo
              </h3>
              <p className="text-gray-700 mb-4">
                Teste das Linear Regression Playground und lerne interaktiv wie Machine Learning funktioniert!
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

{/* Supervised Learning Demo */}
        <div className="bg-pink-50 border border-pink-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
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
                Beobachte wie ein Agent lernt durch Trial & Error mit Q-Learning! Live Q-Table Updates!
              </p>
              <Link 
                to="/qlearning-test"
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
              >
                Q-Learning testen
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;