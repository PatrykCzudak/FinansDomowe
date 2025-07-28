import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Plus, TrendingUp, TrendingDown, Trash2 } from 'lucide-react'
import { useToast } from '../hooks/use-toast'

interface Investment {
  id: string
  symbol: string
  name: string
  type: string
  quantity: number
  purchase_price: number
  current_price?: number
  purchase_date: string
}

async function fetchApi(endpoint: string) {
  const response = await fetch(`http://localhost:8000${endpoint}`)
  if (!response.ok) throw new Error('Network response was not ok')
  return response.json()
}

async function postApi(endpoint: string, data: any) {
  const response = await fetch(`http://localhost:8000${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Network response was not ok')
  return response.json()
}

export default function Investments() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    type: 'stock',
    quantity: '',
    purchase_price: '',
    purchase_date: new Date().toISOString().split('T')[0]
  })
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: investments = [] } = useQuery<Investment[]>({
    queryKey: ['investments'],
    queryFn: () => fetchApi('/api/investments')
  })

  const createInvestmentMutation = useMutation({
    mutationFn: (data: any) => postApi('/api/investments', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investments'] })
      setIsDialogOpen(false)
      setFormData({
        symbol: '',
        name: '',
        type: 'stock',
        quantity: '',
        purchase_price: '',
        purchase_date: new Date().toISOString().split('T')[0]
      })
      toast({ title: 'Sukces', description: 'Inwestycja została dodana' })
    },
    onError: () => {
      toast({ title: 'Błąd', description: 'Nie udało się dodać inwestycji', variant: 'destructive' })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createInvestmentMutation.mutate({
      ...formData,
      quantity: parseFloat(formData.quantity),
      purchase_price: parseFloat(formData.purchase_price)
    })
  }

  const calculateTotalValue = (investment: Investment) => {
    const price = investment.current_price || investment.purchase_price
    return price * investment.quantity
  }

  const calculateProfit = (investment: Investment) => {
    const currentValue = calculateTotalValue(investment)
    const purchaseValue = investment.purchase_price * investment.quantity
    return currentValue - purchaseValue
  }

  const calculateProfitPercentage = (investment: Investment) => {
    const profit = calculateProfit(investment)
    const purchaseValue = investment.purchase_price * investment.quantity
    return purchaseValue > 0 ? (profit / purchaseValue) * 100 : 0
  }

  const totalPortfolioValue = investments.reduce((sum, inv) => sum + calculateTotalValue(inv), 0)
  const totalProfit = investments.reduce((sum, inv) => sum + calculateProfit(inv), 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inwestycje</h2>
          <p className="text-muted-foreground">Zarządzaj swoim portfolio</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Dodaj inwestycję
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dodaj nową inwestycję</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="symbol">Symbol</Label>
                <Input
                  id="symbol"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                  placeholder="np. AAPL, MSFT"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="name">Nazwa</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nazwa spółki/instrumentu"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="type">Typ</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz typ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stock">Akcje</SelectItem>
                    <SelectItem value="etf">ETF</SelectItem>
                    <SelectItem value="bond">Obligacje</SelectItem>
                    <SelectItem value="crypto">Kryptowaluty</SelectItem>
                    <SelectItem value="fund">Fundusz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="quantity">Ilość</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.00001"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="0"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="purchase_price">Cena zakupu (PLN)</Label>
                <Input
                  id="purchase_price"
                  type="number"
                  step="0.01"
                  value={formData.purchase_price}
                  onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="purchase_date">Data zakupu</Label>
                <Input
                  id="purchase_date"
                  type="date"
                  value={formData.purchase_date}
                  onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={createInvestmentMutation.isPending}>
                {createInvestmentMutation.isPending ? 'Dodawanie...' : 'Dodaj inwestycję'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Portfolio Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wartość portfolio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPortfolioValue.toLocaleString('pl-PL', { minimumFractionDigits: 2 })} zł</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zysk/Strata</CardTitle>
            {totalProfit >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalProfit >= 0 ? '+' : ''}{totalProfit.toLocaleString('pl-PL', { minimumFractionDigits: 2 })} zł
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Liczba pozycji</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{investments.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Investments List */}
      <Card>
        <CardHeader>
          <CardTitle>Twoje inwestycje</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {investments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Brak inwestycji do wyświetlenia
              </p>
            ) : (
              investments.map((investment) => {
                const currentValue = calculateTotalValue(investment)
                const profit = calculateProfit(investment)
                const profitPercentage = calculateProfitPercentage(investment)
                
                return (
                  <div key={investment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium text-lg">{investment.symbol}</p>
                        <p className="text-sm text-muted-foreground">{investment.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {investment.quantity} szt. • {investment.type} • {new Date(investment.purchase_date).toLocaleDateString('pl-PL')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-1">
                      <div className="text-lg font-medium">
                        {currentValue.toLocaleString('pl-PL', { minimumFractionDigits: 2 })} zł
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Cena: {(investment.current_price || investment.purchase_price).toLocaleString('pl-PL', { minimumFractionDigits: 2 })} zł
                      </div>
                      <div className={`text-sm font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {profit >= 0 ? '+' : ''}{profit.toLocaleString('pl-PL', { minimumFractionDigits: 2 })} zł
                        ({profit >= 0 ? '+' : ''}{profitPercentage.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}