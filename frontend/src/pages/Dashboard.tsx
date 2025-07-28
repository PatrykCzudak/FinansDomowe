import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { DollarSign, TrendingUp, Target, PieChart } from 'lucide-react'

interface Category {
  id: string
  name: string
  color: string
  budget: number
}

interface Income {
  id: string
  name: string
  amount: number
  frequency: string
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
  quantity: number
  purchase_price: number
  current_price?: number
}

async function fetchApi(endpoint: string) {
  const response = await fetch(`http://localhost:8000${endpoint}`)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

export default function Dashboard() {
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => fetchApi('/api/categories')
  })

  const { data: incomes = [] } = useQuery<Income[]>({
    queryKey: ['incomes'],
    queryFn: () => fetchApi('/api/incomes')
  })

  const { data: expenses = [] } = useQuery<Expense[]>({
    queryKey: ['expenses'],
    queryFn: () => fetchApi('/api/expenses')
  })

  const { data: investments = [] } = useQuery<Investment[]>({
    queryKey: ['investments'],
    queryFn: () => fetchApi('/api/investments')
  })

  // Calculate totals
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0)
  
  const currentMonth = new Date().toISOString().slice(0, 7)
  const monthlyExpenses = expenses.filter(expense => 
    expense.date.startsWith(currentMonth)
  )
  const totalExpenses = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  
  const totalInvestmentValue = investments.reduce((sum, investment) => {
    const price = investment.current_price || investment.purchase_price
    return sum + (price * investment.quantity)
  }, 0)

  const totalBudget = categories.reduce((sum, category) => sum + category.budget, 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Przegląd Twoich finansów
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Miesięczne przychody
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalIncome.toLocaleString('pl-PL')} zł</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Wydatki w tym miesiącu
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExpenses.toLocaleString('pl-PL')} zł</div>
            <p className="text-xs text-muted-foreground">
              {totalBudget > 0 ? `${((totalExpenses / totalBudget) * 100).toFixed(1)}% budżetu` : ''}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Wartość inwestycji
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvestmentValue.toLocaleString('pl-PL')} zł</div>
            <p className="text-xs text-muted-foreground">
              {investments.length} pozycji
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Oszczędności
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalIncome - totalExpenses).toLocaleString('pl-PL')} zł</div>
            <p className="text-xs text-muted-foreground">
              Różnica przychody - wydatki
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Najnowsze wydatki</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyExpenses.slice(0, 5).map((expense) => {
                const category = categories.find(c => c.id === expense.category_id)
                return (
                  <div key={expense.id} className="flex items-center space-x-4">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category?.color || '#3B82F6' }}
                    />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {expense.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {category?.name || 'Brak kategorii'} • {new Date(expense.date).toLocaleDateString('pl-PL')}
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      -{expense.amount.toLocaleString('pl-PL')} zł
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top inwestycje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {investments.slice(0, 5).map((investment) => {
                const currentValue = (investment.current_price || investment.purchase_price) * investment.quantity
                const purchaseValue = investment.purchase_price * investment.quantity
                const profit = currentValue - purchaseValue
                const profitPercent = ((profit / purchaseValue) * 100)
                
                return (
                  <div key={investment.id} className="flex items-center space-x-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {investment.symbol}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {investment.quantity} szt.
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {currentValue.toLocaleString('pl-PL')} zł
                      </div>
                      <div className={`text-sm ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {profit >= 0 ? '+' : ''}{profitPercent.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}