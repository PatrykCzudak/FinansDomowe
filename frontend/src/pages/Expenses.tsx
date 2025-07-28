import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Plus, Trash2 } from 'lucide-react'
import { useToast } from '../hooks/use-toast'

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

async function deleteApi(endpoint: string) {
  const response = await fetch(`http://localhost:8000${endpoint}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Network response was not ok')
  return response.json()
}

export default function Expenses() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category_id: '',
    date: new Date().toISOString().split('T')[0]
  })
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: expenses = [] } = useQuery<Expense[]>({
    queryKey: ['expenses'],
    queryFn: () => fetchApi('/api/expenses')
  })

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => fetchApi('/api/categories')
  })

  const createExpenseMutation = useMutation({
    mutationFn: (data: any) => postApi('/api/expenses', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      setIsDialogOpen(false)
      setFormData({ description: '', amount: '', category_id: '', date: new Date().toISOString().split('T')[0] })
      toast({ title: 'Sukces', description: 'Wydatek został dodany' })
    },
    onError: () => {
      toast({ title: 'Błąd', description: 'Nie udało się dodać wydatku', variant: 'destructive' })
    }
  })

  const deleteExpenseMutation = useMutation({
    mutationFn: (id: string) => deleteApi(`/api/expenses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      toast({ title: 'Sukces', description: 'Wydatek został usunięty' })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createExpenseMutation.mutate({
      ...formData,
      amount: parseFloat(formData.amount)
    })
  }

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Brak kategorii'
  }

  const getCategoryColor = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.color || '#3B82F6'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Wydatki</h2>
          <p className="text-muted-foreground">Zarządzaj swoimi wydatkami</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Dodaj wydatek
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dodaj nowy wydatek</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="description">Opis</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Opis wydatku"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="amount">Kwota (PLN)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="category">Kategoria</Label>
                <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz kategorię" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={createExpenseMutation.isPending}>
                {createExpenseMutation.isPending ? 'Dodawanie...' : 'Dodaj wydatek'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historia wydatków</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenses.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Brak wydatków do wyświetlenia
              </p>
            ) : (
              expenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getCategoryColor(expense.category_id) }}
                    />
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {getCategoryName(expense.category_id)} • {new Date(expense.date).toLocaleDateString('pl-PL')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="font-medium text-lg">
                      -{expense.amount.toLocaleString('pl-PL')} zł
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteExpenseMutation.mutate(expense.id)}
                      disabled={deleteExpenseMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}