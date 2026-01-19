// src/components/layout/Header.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Menu, X, Home, BookOpen, Info } from 'lucide-react';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900">AI Learning Lab</h1>
              <p className="text-xs text-gray-500">FH Campus Wien</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link 
              to="/" 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'text-blue-600 bg-blue-50 font-medium' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link 
              to="/paths" 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/paths') 
                  ? 'text-blue-600 bg-blue-50 font-medium' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Alle Pfade
            </Link>
            <Link 
              to="/about" 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/about') 
                  ? 'text-blue-600 bg-blue-50 font-medium' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Info className="w-4 h-4" />
              Über
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-gray-700" />
            ) : (
              <Menu className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200 space-y-1">
            <Link 
              to="/" 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'text-blue-600 bg-blue-50 font-medium' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home className="w-5 h-5" />
              Home
            </Link>
            <Link 
              to="/paths" 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/paths') 
                  ? 'text-blue-600 bg-blue-50 font-medium' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <BookOpen className="w-5 h-5" />
              Alle Pfade
            </Link>
            <Link 
              to="/about" 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/about') 
                  ? 'text-blue-600 bg-blue-50 font-medium' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Info className="w-5 h-5" />
              Über
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;