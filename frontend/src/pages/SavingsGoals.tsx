import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Plus, Target, TrendingUp } from 'lucide-react'
import { useToast } from '../hooks/use-toast'

interface SavingsGoal {
  id: string
  name: string
  description?: string
  target_amount: number
  current_amount: number
  target_date?: string
  category: string
  color: string
  is_active: boolean
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

export default function SavingsGoals() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    target_amount: '',
    target_date: '',
    category: 'personal',
    color: '#3B82F6'
  })
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: savingsGoals = [] } = useQuery<SavingsGoal[]>({
    queryKey: ['savings-goals'],
    queryFn: () => fetchApi('/api/savings-goals')
  })

  const createGoalMutation = useMutation({
    mutationFn: (data: any) => postApi('/api/savings-goals', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-goals'] })
      setIsDialogOpen(false)
      setFormData({
        name: '',
        description: '',
        target_amount: '',
        target_date: '',
        category: 'personal',
        color: '#3B82F6'
      })
      toast({ title: 'Sukces', description: 'Cel oszczędnościowy został dodany' })
    },
    onError: () => {
      toast({ title: 'Błąd', description: 'Nie udało się dodać celu', variant: 'destructive' })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createGoalMutation.mutate({
      ...formData,
      target_amount: parseFloat(formData.target_amount),
      target_date: formData.target_date || null
    })
  }

  const calculateProgress = (goal: SavingsGoal) => {
    return goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0
  }

  const getDaysLeft = (targetDate: string) => {
    const today = new Date()
    const target = new Date(targetDate)
    const diffTime = target.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const categoryLabels: Record<string, string> = {
    personal: 'Osobiste',
    travel: 'Podróże',
    emergency: 'Fundusz awaryjny',
    education: 'Edukacja',
    home: 'Dom',
    car: 'Samochód',
    other: 'Inne'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cele oszczędnościowe</h2>
          <p className="text-muted-foreground">Śledź swoje cele finansowe</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Dodaj cel
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dodaj nowy cel oszczędnościowy</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nazwa celu</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="np. Wakacje, Nowy laptop"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Opis (opcjonalny)</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Krótki opis celu"
                />
              </div>
              
              <div>
                <Label htmlFor="target_amount">Docelowa kwota (PLN)</Label>
                <Input
                  id="target_amount"
                  type="number"
                  step="0.01"
                  value={formData.target_amount}
                  onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="target_date">Data osiągnięcia (opcjonalna)</Label>
                <Input
                  id="target_date"
                  type="date"
                  value={formData.target_date}
                  onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="category">Kategoria</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="color">Kolor</Label>
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={createGoalMutation.isPending}>
                {createGoalMutation.isPending ? 'Dodawanie...' : 'Dodaj cel'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Goals Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {savingsGoals.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Brak celów oszczędnościowych</h3>
              <p className="text-muted-foreground text-center mb-4">
                Zacznij planować swoją przyszłość finansową dodając pierwszy cel
              </p>
            </CardContent>
          </Card>
        ) : (
          savingsGoals.map((goal) => {
            const progress = calculateProgress(goal)
            const isCompleted = progress >= 100
            const daysLeft = goal.target_date ? getDaysLeft(goal.target_date) : null
            
            return (
              <Card key={goal.id} className="relative overflow-hidden">
                <div 
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: goal.color }}
                />
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{goal.name}</span>
                    {isCompleted && <span className="text-green-600 text-sm">✓</span>}
                  </CardTitle>
                  {goal.description && (
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Postęp</span>
                      <span>{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(progress, 100)}%`,
                          backgroundColor: goal.color
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Zebrano:</span>
                      <span className="font-medium">
                        {goal.current_amount.toLocaleString('pl-PL', { minimumFractionDigits: 2 })} zł
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Cel:</span>
                      <span className="font-medium">
                        {goal.target_amount.toLocaleString('pl-PL', { minimumFractionDigits: 2 })} zł
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Pozostało:</span>
                      <span className="font-medium">
                        {Math.max(0, goal.target_amount - goal.current_amount).toLocaleString('pl-PL', { minimumFractionDigits: 2 })} zł
                      </span>
                    </div>
                  </div>
                  
                  {goal.target_date && (
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Do końca:</span>
                        <span className={`text-sm font-medium ${
                          daysLeft !== null && daysLeft < 0 
                            ? 'text-red-600' 
                            : daysLeft !== null && daysLeft < 30 
                            ? 'text-yellow-600' 
                            : 'text-green-600'
                        }`}>
                          {daysLeft !== null && (
                            daysLeft < 0 
                              ? `${Math.abs(daysLeft)} dni po terminie`
                              : `${daysLeft} dni`
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-2">
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                      {categoryLabels[goal.category] || goal.category}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}