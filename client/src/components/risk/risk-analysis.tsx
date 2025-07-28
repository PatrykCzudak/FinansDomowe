import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Calculator, TrendingDown, BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import VaRChart from "@/components/charts/var-chart";
import type { Investment } from "@shared/schema";

interface RiskMetrics {
  var95: number;
  var99: number;
  expectedShortfall95: number;
  expectedShortfall99: number;
  beta: number;
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
}

export default function RiskAnalysis() {
  const { data: investments = [] } = useQuery<Investment[]>({ queryKey: ["/api/investments"] });
  const [confidence, setConfidence] = useState("95");
  const [timeHorizon, setTimeHorizon] = useState("1");
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null);
  const [calculating, setCalculating] = useState(false);

  // Generate mock historical data for charts
  const generateMockData = () => {
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 252); // 1 year of trading days
    
    let cumulativeReturn = 0;
    const portfolioValue = investments.reduce((sum, inv) => 
      sum + (parseFloat(inv.currentPrice || inv.purchasePrice) * parseFloat(inv.quantity)), 0) || 10000;
    
    for (let i = 0; i < 252; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      // Generate realistic daily returns (mean-reverting with volatility)
      const dailyReturn = (Math.random() - 0.5) * 0.04 + 0.0002; // ~1% daily volatility, slight positive drift
      cumulativeReturn += dailyReturn;
      
      data.push({
        date: date.toISOString(),
        portfolioValue: portfolioValue * (1 + cumulativeReturn),
        returns: dailyReturn,
        cumulativeReturns: cumulativeReturn
      });
    }
    
    return data;
  };

  const historicalData = generateMockData();

  const calculateVaR = async () => {
    setCalculating(true);
    
    // Simulate VaR calculation - in real app this would call backend
    setTimeout(() => {
      const portfolioValue = investments.reduce((sum, inv) => 
        sum + (parseFloat(inv.currentPrice || inv.purchasePrice) * parseFloat(inv.quantity)), 0);
      
      const mockMetrics: RiskMetrics = {
        var95: portfolioValue * 0.05 * Math.random() * 2,
        var99: portfolioValue * 0.08 * Math.random() * 2,
        expectedShortfall95: portfolioValue * 0.07 * Math.random() * 2,
        expectedShortfall99: portfolioValue * 0.11 * Math.random() * 2,
        beta: 0.8 + Math.random() * 0.6,
        sharpeRatio: Math.random() * 2,
        maxDrawdown: Math.random() * 0.3,
        volatility: 0.1 + Math.random() * 0.2
      };
      
      setRiskMetrics(mockMetrics);
      setCalculating(false);
    }, 2000);
  };

  const calculateExpectedShortfall = async () => {
    setCalculating(true);
    
    setTimeout(() => {
      const portfolioValue = investments.reduce((sum, inv) => 
        sum + (parseFloat(inv.currentPrice || inv.purchasePrice) * parseFloat(inv.quantity)), 0);
      
      const mockMetrics: RiskMetrics = {
        var95: portfolioValue * 0.04 * Math.random() * 2,
        var99: portfolioValue * 0.07 * Math.random() * 2,
        expectedShortfall95: portfolioValue * 0.08 * Math.random() * 2,
        expectedShortfall99: portfolioValue * 0.13 * Math.random() * 2,
        beta: 0.7 + Math.random() * 0.8,
        sharpeRatio: Math.random() * 1.8,
        maxDrawdown: Math.random() * 0.35,
        volatility: 0.12 + Math.random() * 0.18
      };
      
      setRiskMetrics(mockMetrics);
      setCalculating(false);
    }, 1500);
  };

  const portfolioValue = investments.reduce((sum, inv) => 
    sum + (parseFloat(inv.currentPrice || inv.purchasePrice) * parseFloat(inv.quantity)), 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Analiza Ryzyka Portfolio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Informacje o Portfolio</h3>
            <p className="text-blue-700">Całkowita wartość: <span className="font-bold">{portfolioValue.toFixed(2)} zł</span></p>
            <p className="text-blue-700">Liczba pozycji: <span className="font-bold">{investments.length}</span></p>
          </div>

          <Tabs defaultValue="var-es" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="var-es">VaR & Expected Shortfall</TabsTrigger>
              <TabsTrigger value="metrics">Metryki Ryzyka</TabsTrigger>
              <TabsTrigger value="stress">Test Stresu</TabsTrigger>
            </TabsList>

            <TabsContent value="var-es" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Value at Risk (VaR) & Expected Shortfall (ES)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="confidence">Poziom ufności (%)</Label>
                      <Input
                        id="confidence"
                        value={confidence}
                        onChange={(e) => setConfidence(e.target.value)}
                        placeholder="95"
                      />
                    </div>
                    <div>
                      <Label htmlFor="timeHorizon">Horyzont czasowy (dni)</Label>
                      <Input
                        id="timeHorizon"
                        value={timeHorizon}
                        onChange={(e) => setTimeHorizon(e.target.value)}
                        placeholder="1"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={calculateVaR} 
                    disabled={calculating}
                    className="w-full"
                  >
                    {calculating ? "Obliczanie..." : "Oblicz VaR i Expected Shortfall"}
                  </Button>

                  {riskMetrics && (
                    <div className="space-y-6">
                      {/* Risk Metrics Cards */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-red-50 rounded-lg">
                          <h4 className="font-semibold text-red-800">VaR 95%</h4>
                          <p className="text-xl font-bold text-red-600">
                            {riskMetrics.var95.toFixed(2)} zł
                          </p>
                          <p className="text-xs text-red-600">
                            Max strata 95%
                          </p>
                        </div>
                        <div className="p-4 bg-red-100 rounded-lg">
                          <h4 className="font-semibold text-red-800">VaR 99%</h4>
                          <p className="text-xl font-bold text-red-700">
                            {riskMetrics.var99.toFixed(2)} zł
                          </p>
                          <p className="text-xs text-red-700">
                            Max strata 99%
                          </p>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg">
                          <h4 className="font-semibold text-orange-800">ES 95%</h4>
                          <p className="text-xl font-bold text-orange-600">
                            {riskMetrics.expectedShortfall95.toFixed(2)} zł
                          </p>
                          <p className="text-xs text-orange-600">
                            Średnia w tail 5%
                          </p>
                        </div>
                        <div className="p-4 bg-orange-100 rounded-lg">
                          <h4 className="font-semibold text-orange-800">ES 99%</h4>
                          <p className="text-xl font-bold text-orange-700">
                            {riskMetrics.expectedShortfall99.toFixed(2)} zł
                          </p>
                          <p className="text-xs text-orange-700">
                            Średnia w tail 1%
                          </p>
                        </div>
                      </div>

                      {/* VaR Chart */}
                      <VaRChart 
                        data={historicalData}
                        var95={riskMetrics.var95}
                        var99={riskMetrics.var99}
                        es95={riskMetrics.expectedShortfall95}
                        es99={riskMetrics.expectedShortfall99}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Dodatkowe Metryki Ryzyka
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {riskMetrics ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-800">Beta</h4>
                        <p className="text-2xl font-bold text-blue-600">
                          {riskMetrics.beta.toFixed(2)}
                        </p>
                        <p className="text-sm text-blue-600">
                          Wrażliwość na ruchy rynku
                        </p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-semibold text-green-800">Sharpe Ratio</h4>
                        <p className="text-2xl font-bold text-green-600">
                          {riskMetrics.sharpeRatio.toFixed(2)}
                        </p>
                        <p className="text-sm text-green-600">
                          Stosunek zwrotu do ryzyka
                        </p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h4 className="font-semibold text-purple-800">Max Drawdown</h4>
                        <p className="text-2xl font-bold text-purple-600">
                          {(riskMetrics.maxDrawdown * 100).toFixed(1)}%
                        </p>
                        <p className="text-sm text-purple-600">
                          Maksymalny spadek wartości
                        </p>
                      </div>
                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <h4 className="font-semibold text-yellow-800">Volatility</h4>
                        <p className="text-2xl font-bold text-yellow-600">
                          {(riskMetrics.volatility * 100).toFixed(1)}%
                        </p>
                        <p className="text-sm text-yellow-600">
                          Zmienność zwrotów
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      Uruchom kalkulację VaR lub Expected Shortfall aby zobaczyć dodatkowe metryki
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stress" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Test Stresu</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Symulacja wpływu ekstremalnych warunków rynkowych na portfolio.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-red-50 rounded-lg">
                        <h4 className="font-semibold text-red-800">Krach 2008</h4>
                        <p className="text-xl font-bold text-red-600">-{(portfolioValue * 0.37).toFixed(0)} zł</p>
                        <p className="text-sm text-red-600">Spadek o 37%</p>
                      </div>
                      
                      <div className="p-4 bg-red-100 rounded-lg">
                        <h4 className="font-semibold text-red-800">COVID-19 Marzec 2020</h4>
                        <p className="text-xl font-bold text-red-600">-{(portfolioValue * 0.34).toFixed(0)} zł</p>
                        <p className="text-sm text-red-600">Spadek o 34%</p>
                      </div>
                      
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <h4 className="font-semibold text-orange-800">Korekta -20%</h4>
                        <p className="text-xl font-bold text-orange-600">-{(portfolioValue * 0.20).toFixed(0)} zł</p>
                        <p className="text-sm text-orange-600">Typowa korekta</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}