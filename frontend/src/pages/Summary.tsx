import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

interface Category {
  id: string
  name: string
  color: string
  budget: number
}

interface Expense {
  id: string
  description: string
  amount: number
  category_id: string
  date: string
}

interface Investment {
  id: string
  symbol: string
  name: string
  type: string
  quantity: number
  purchase_price: number
  current_price?: number
}

async function fetchApi(endpoint: string) {
  const response = await fetch(`http://localhost:8000${endpoint}`)
  if (!response.ok) throw new Error('Network response was not ok')
  return response.json()
}

export default function Summary() {
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => fetchApi('/api/categories')
  })

  const { data: expenses = [] } = useQuery<Expense[]>({
    queryKey: ['expenses'],
    queryFn: () => fetchApi('/api/expenses')
  })

  const { data: investments = [] } = useQuery<Investment[]>({
    queryKey: ['investments'],
    queryFn: () => fetchApi('/api/investments')
  })

  // Calculate current month expenses by category
  const currentMonth = new Date().toISOString().slice(0, 7)
  const monthlyExpenses = expenses.filter(expense => 
    expense.date.startsWith(currentMonth)
  )

  const expensesByCategory = categories.map(category => {
    const categoryExpenses = monthlyExpenses.filter(expense => expense.category_id === category.id)
    const totalSpent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    
    return {
      name: category.name,
      budget: category.budget,
      spent: totalSpent,
      remaining: Math.max(0, category.budget - totalSpent),
      color: category.color,
      percentage: category.budget > 0 ? (totalSpent / category.budget) * 100 : 0
    }
  })

  // Investment allocation data
  const investmentsByType = investments.reduce((acc: Record<string, number>, investment) => {
    const value = (investment.current_price || investment.purchase_price) * investment.quantity
    acc[investment.type] = (acc[investment.type] || 0) + value
    return acc
  }, {})

  const investmentData = Object.entries(investmentsByType).map(([type, value]) => ({
    name: type,
    value: value,
    percentage: investments.length > 0 ? (value / Object.values(investmentsByType).reduce((a, b) => a + b, 0)) * 100 : 0
  }))

  const typeColors: Record<string, string> = {
    stock: '#3B82F6',
    etf: '#10B981',
    bond: '#F59E0B',
    crypto: '#EF4444',
    fund: '#8B5CF6'
  }

  // Budget vs spending chart data
  const budgetData = expensesByCategory.map(category => ({
    category: category.name,
    budget: category.budget,
    spent: category.spent,
    remaining: category.remaining
  }))

  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0)
  const totalSpent = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0)
  const totalInvestmentValue = investments.reduce((sum, inv) => {
    return sum + (inv.current_price || inv.purchase_price) * inv.quantity
  }, 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Podsumowanie</h2>
        <p className="text-muted-foreground">Przegląd Twoich finansów w tym miesiącu</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Budżet miesięczny</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBudget.toLocaleString('pl-PL')} zł</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Wydano w tym miesiącu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSpent.toLocaleString('pl-PL')} zł</div>
            <p className="text-xs text-muted-foreground">
              {totalBudget > 0 ? `${((totalSpent / totalBudget) * 100).toFixed(1)}% budżetu` : ''}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Wartość inwestycji</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvestmentValue.toLocaleString('pl-PL')} zł</div>
            <p className="text-xs text-muted-foreground">{investments.length} pozycji</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Budget vs Spending Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Budżet vs Wydatki</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="category" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip formatter={(value) => `${Number(value).toLocaleString('pl-PL')} zł`} />
                <Legend />
                <Bar dataKey="budget" fill="#e5e7eb" name="Budżet" />
                <Bar dataKey="spent" fill="#3b82f6" name="Wydano" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Investment Allocation */}
        <Card>
          <CardHeader>
            <CardTitle>Alokacja inwestycji</CardTitle>
          </CardHeader>
          <CardContent>
            {investmentData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={investmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} (${percentage.toFixed(1)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {investmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={typeColors[entry.name] || '#8884d8'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${Number(value).toLocaleString('pl-PL')} zł`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Brak danych o inwestycjach
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Category Details */}
      <Card>
        <CardHeader>
          <CardTitle>Szczegóły kategorii</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expensesByCategory.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">
                      {category.spent.toLocaleString('pl-PL')} / {category.budget.toLocaleString('pl-PL')} zł
                    </div>
                    <div className={`text-xs ${category.percentage > 100 ? 'text-red-600' : 'text-muted-foreground'}`}>
                      {category.percentage.toFixed(1)}% budżetu
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      category.percentage > 100 ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ 
                      width: `${Math.min(category.percentage, 100)}%`,
                      backgroundColor: category.percentage > 100 ? '#ef4444' : category.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}