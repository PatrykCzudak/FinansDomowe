import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Home, DollarSign, TrendingUp, Target, PieChart, BarChart3 } from 'lucide-react'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Investments from './pages/Investments'
import SavingsGoals from './pages/SavingsGoals'
import Summary from './pages/Summary'
import RiskAnalysis from './pages/RiskAnalysis'
import { Toaster } from './components/ui/toaster'
import './App.css'

function Navigation() {
  const location = useLocation()
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/expenses', label: 'Wydatki', icon: DollarSign },
    { path: '/investments', label: 'Inwestycje', icon: TrendingUp },
    { path: '/savings', label: 'Cele oszczędnościowe', icon: Target },
    { path: '/summary', label: 'Podsumowanie', icon: PieChart },
    { path: '/risk', label: 'Analiza ryzyka', icon: BarChart3 },
  ]

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Budget Manager</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/investments" element={<Investments />} />
            <Route path="/savings" element={<SavingsGoals />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/risk" element={<RiskAnalysis />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  )
}

export default App