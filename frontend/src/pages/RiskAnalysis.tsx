import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { AlertTriangle, Calculator, TrendingDown } from 'lucide-react'
import { useToast } from '../hooks/use-toast'

interface RiskResult {
  var95: number
  var99: number
  expectedShortfall95: number
  expectedShortfall99: number
  volatility: number
  sharpe_ratio: number
  max_drawdown: number
  beta: number
  currentValue: number
  confidenceLevel: number
  timeHorizon: number
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

export default function RiskAnalysis() {
  const [confidence, setConfidence] = useState('95')
  const [timeHorizon, setTimeHorizon] = useState('1')
  const [riskResult, setRiskResult] = useState<RiskResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const { toast } = useToast()

  const { data: investments = [] } = useQuery({
    queryKey: ['investments'],
    queryFn: () => fetchApi('/api/investments')
  })

  const calculateRisk = async () => {
    if (investments.length === 0) {
      toast({
        title: 'Brak inwestycji',
        description: 'Dodaj inwestycje aby przeprowadzić analizę ryzyka',
        variant: 'destructive'
      })
      return
    }

    setIsCalculating(true)
    try {
      const result = await postApi('/api/risk/var-calculation', {
        confidence_level: parseFloat(confidence) / 100,
        time_horizon: parseInt(timeHorizon)
      })
      setRiskResult(result)
      toast({
        title: 'Sukces',
        description: 'Analiza ryzyka została przeprowadzona'
      })
    } catch (error) {
      toast({
        title: 'Błąd',
        description: 'Nie udało się przeprowadzić analizy ryzyka',
        variant: 'destructive'
      })
    } finally {
      setIsCalculating(false)
    }
  }

  const formatCurrency = (value: number) => {
    return Math.abs(value).toLocaleString('pl-PL', { minimumFractionDigits: 2 })
  }

  const formatPercentage = (value: number) => {
    return (value * 100).toFixed(2)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analiza ryzyka</h2>
        <p className="text-muted-foreground">Oceń ryzyko swojego portfolio inwestycyjnego</p>
      </div>

      {/* Calculation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <span>Parametry kalkulacji</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="confidence">Poziom ufności (%)</Label>
              <select
                id="confidence"
                value={confidence}
                onChange={(e) => setConfidence(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="90">90%</option>
                <option value="95">95%</option>
                <option value="99">99%</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="timeHorizon">Horyzont czasowy (dni)</Label>
              <Input
                id="timeHorizon"
                type="number"
                min="1"
                max="30"
                value={timeHorizon}
                onChange={(e) => setTimeHorizon(e.target.value)}
              />
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={calculateRisk} 
                disabled={isCalculating || investments.length === 0}
                className="w-full"
              >
                {isCalculating ? 'Obliczanie...' : 'Oblicz ryzyko'}
              </Button>
            </div>
          </div>
          
          {investments.length === 0 && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                <p className="text-yellow-800 dark:text-yellow-200">
                  Dodaj inwestycje aby móc przeprowadzić analizę ryzyka
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Risk Results */}
      {riskResult && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* VaR Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingDown className="h-5 w-5 text-red-500" />
                <span>Value at Risk (VaR)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
                <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                  VaR 95% ({riskResult.timeHorizon} dni)
                </h4>
                <p className="text-2xl font-bold text-red-600">
                  -{formatCurrency(riskResult.var95)} zł
                </p>
                <p className="text-sm text-red-800 dark:text-red-200 mt-2">
                  Maksymalna oczekiwana strata z prawdopodobieństwem 5%
                </p>
              </div>
              
              <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-lg border-l-4 border-red-600">
                <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                  VaR 99% ({riskResult.timeHorizon} dni)
                </h4>
                <p className="text-2xl font-bold text-red-700">
                  -{formatCurrency(riskResult.var99)} zł
                </p>
                <p className="text-sm text-red-800 dark:text-red-200 mt-2">
                  Maksymalna oczekiwana strata z prawdopodobieństwem 1%
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Expected Shortfall */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <span>Expected Shortfall (ES)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-500">
                <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                  ES 95% ({riskResult.timeHorizon} dni)
                </h4>
                <p className="text-2xl font-bold text-orange-600">
                  -{formatCurrency(riskResult.expectedShortfall95)} zł
                </p>
                <p className="text-sm text-orange-800 dark:text-orange-200 mt-2">
                  Średnia strata gdy przekroczony zostanie VaR 95%
                </p>
              </div>
              
              <div className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-lg border-l-4 border-orange-600">
                <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                  ES 99% ({riskResult.timeHorizon} dni)
                </h4>
                <p className="text-2xl font-bold text-orange-700">
                  -{formatCurrency(riskResult.expectedShortfall99)} zł
                </p>
                <p className="text-sm text-orange-800 dark:text-orange-200 mt-2">
                  Średnia strata gdy przekroczony zostanie VaR 99%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Additional Risk Metrics */}
      {riskResult && (
        <Card>
          <CardHeader>
            <CardTitle>Dodatkowe metryki ryzyka</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Volatility ({formatPercentage(riskResult.volatility)}%)
                </h4>
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="mb-2">Roczna zmienność zwrotów:</p>
                  <ul className="space-y-1">
                    <li>• Akcje: 15-25% (typowe)</li>
                    <li>• Obligacje: 3-8%</li>
                    <li>• Kryptowaluty: 50-100%+</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  Sharpe Ratio ({riskResult.sharpe_ratio.toFixed(2)})
                </h4>
                <div className="text-sm text-green-800 dark:text-green-200">
                  <p className="mb-2">Efektywność risk-adjusted:</p>
                  <ul className="space-y-1">
                    <li>• Powyżej 1.0: Bardzo dobry</li>
                    <li>• 0.5-1.0: Dobry</li>
                    <li>• Poniżej 0.5: Słaby</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500">
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                  Max Drawdown ({formatPercentage(riskResult.max_drawdown)}%)
                </h4>
                <div className="text-sm text-purple-800 dark:text-purple-200">
                  <p className="mb-2">Największy spadek:</p>
                  <ul className="space-y-1">
                    <li>• Poniżej 10%: Niskie ryzyko</li>
                    <li>• 10-20%: Średnie ryzyko</li>
                    <li>• Powyżej 20%: Wysokie ryzyko</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  Beta ({riskResult.beta.toFixed(2)})
                </h4>
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <p className="mb-2">Korelacja z rynkiem:</p>
                  <ul className="space-y-1">
                    <li>• Beta = 1: Jak rynek</li>
                    <li>• Beta {'>'} 1: Bardziej ryzykowne</li>
                    <li>• Beta {'<'} 1: Mniej ryzykowne</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Portfolio Value */}
      {riskResult && (
        <Card>
          <CardHeader>
            <CardTitle>Wartość portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold">
                {formatCurrency(riskResult.currentValue)} zł
              </p>
              <p className="text-muted-foreground mt-2">
                Aktualna wartość analizowanego portfolio
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}