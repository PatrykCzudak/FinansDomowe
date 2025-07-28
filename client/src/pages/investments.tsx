import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, TrendingUp, DollarSign, Percent, PiggyBank, RefreshCw, Bot, Search, ShoppingCart, AlertTriangle } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useBudget } from "@/hooks/use-budget";
import InvestmentForm from "@/components/forms/investment-form";
import AllocationChart from "@/components/charts/allocation-chart";
import PerformanceChart from "@/components/charts/performance-chart";
import ProfitLossChart from "@/components/charts/profit-loss-chart";
import AIAssistant from "@/components/ai/ai-assistant";
import RiskAnalysis from "@/components/risk/risk-analysis";
import PriceUpdater from "@/components/investment/price-updater";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import type { Investment, InvestmentSale } from "@shared/schema";

export default function InvestmentsPage() {
  const [showInvestmentForm, setShowInvestmentForm] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
  const [filterType, setFilterType] = useState("all");
  const [showSellDialog, setShowSellDialog] = useState(false);
  const [sellingInvestment, setSellingInvestment] = useState<Investment | null>(null);
  const [sellQuantity, setSellQuantity] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [performanceView, setPerformanceView] = useState<"history" | "chart">("history");

  const { data: investments = [], isLoading } = useQuery<Investment[]>({
    queryKey: ['/api/investments']
  });

  const { data: profitLossData } = useQuery<{ totalProfitLoss: number }>({
    queryKey: ['/api/portfolio/profit-loss']
  });

  const { data: investmentSales = [] } = useQuery<InvestmentSale[]>({
    queryKey: ['/api/investment-sales']
  });

  const { deleteInvestment } = useBudget();

  const sellInvestmentMutation = useMutation({
    mutationFn: ({ id, quantitySold, salePrice }: { id: string; quantitySold: number; salePrice: number }) =>
      apiRequest("POST", `/api/investments/${id}/sell`, { quantitySold, salePrice }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/investments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio/profit-loss"] });
      queryClient.invalidateQueries({ queryKey: ["/api/investment-sales"] });
      setShowSellDialog(false);
      setSellingInvestment(null);
      setSellQuantity("");
      setSellPrice("");
    }
  });

  const filteredInvestments = investments.filter(investment => 
    filterType === "all" || investment.type === filterType
  );

  const totalInvested = investments.reduce((sum, inv) => 
    sum + (parseFloat(inv.purchasePrice) * parseFloat(inv.quantity)), 0
  );

  const totalCurrentValue = investments.reduce((sum, inv) => {
    const currentPrice = parseFloat(inv.currentPrice || inv.purchasePrice);
    return sum + (currentPrice * parseFloat(inv.quantity));
  }, 0);

  const unrealizedProfitLoss = totalCurrentValue - totalInvested;
  const totalROI = totalInvested > 0 ? (unrealizedProfitLoss / totalInvested) * 100 : 0;
  const realizedProfitLoss = profitLossData?.totalProfitLoss || 0;
  const totalProfitLoss = unrealizedProfitLoss + realizedProfitLoss;

  const calculateProfitLoss = (investment: Investment) => {
    const purchaseValue = parseFloat(investment.purchasePrice) * parseFloat(investment.quantity);
    const currentValue = parseFloat(investment.currentPrice || investment.purchasePrice) * parseFloat(investment.quantity);
    const profitLoss = currentValue - purchaseValue;
    const percentage = purchaseValue > 0 ? (profitLoss / purchaseValue) * 100 : 0;
    
    return { profitLoss, percentage };
  };

  const handleEditInvestment = (investment: Investment) => {
    setEditingInvestment(investment);
    setShowInvestmentForm(true);
  };

  const handleDeleteInvestment = async (id: string) => {
    if (confirm("Czy na pewno chcesz usunąć tę inwestycję?")) {
      await deleteInvestment.mutateAsync(id);
    }
  };

  const handleInvestmentFormClose = () => {
    setShowInvestmentForm(false);
    setEditingInvestment(null);
  };

  const handleSellInvestment = (investment: Investment) => {
    setSellingInvestment(investment);
    setSellPrice(investment.currentPrice || investment.purchasePrice);
    setShowSellDialog(true);
  };

  const handleSellSubmit = () => {
    if (!sellingInvestment || !sellQuantity || !sellPrice) return;
    
    const quantity = parseFloat(sellQuantity);
    const price = parseFloat(sellPrice);
    
    if (quantity <= 0 || price <= 0 || quantity > parseFloat(sellingInvestment.quantity)) {
      alert("Nieprawidłowa ilość lub cena");
      return;
    }

    sellInvestmentMutation.mutate({
      id: sellingInvestment.id,
      quantitySold: quantity,
      salePrice: price
    });
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'akcje': return "bg-blue-100 text-blue-800";
      case 'etf': return "bg-green-100 text-green-800";
      case 'obligacje': return "bg-yellow-100 text-yellow-800";
      case 'kryptowaluty': return "bg-purple-100 text-purple-800";
      case 'nieruchomości': return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Ładowanie...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Wartość portfolio</p>
                <p className="text-2xl font-bold text-gray-900">{totalCurrentValue.toFixed(2)} zł</p>
                <p className={`text-sm ${totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalProfitLoss >= 0 ? '+' : ''}{totalProfitLoss.toFixed(2)} zł ({totalROI >= 0 ? '+' : ''}{totalROI.toFixed(1)}%)
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="text-green-600 h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Całkowita inwestycja</p>
                <p className="text-2xl font-bold text-gray-900">{totalInvested.toFixed(2)} zł</p>
                <p className="text-sm text-gray-600">{investments.length} instrumentów</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <DollarSign className="text-blue-600 h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">ROI</p>
                <p className={`text-2xl font-bold ${totalROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalROI >= 0 ? '+' : ''}{totalROI.toFixed(2)}%
                </p>
                <p className="text-sm text-gray-600">całkowity zwrot</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Percent className="text-green-600 h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Zrealizowane zyski/straty</p>
                <p className={`text-2xl font-bold ${realizedProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {realizedProfitLoss >= 0 ? '+' : ''}{realizedProfitLoss.toFixed(2)} zł
                </p>
                <p className="text-sm text-gray-600">ze sprzedanych pozycji</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <ShoppingCart className="text-orange-600 h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="portfolio" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="portfolio" className="flex items-center">
            <TrendingUp className="mr-2 h-4 w-4" />
            Portfolio
          </TabsTrigger>
          <TabsTrigger value="ai-assistant" className="flex items-center">
            <Bot className="mr-2 h-4 w-4" />
            AI Asystent
          </TabsTrigger>
          <TabsTrigger value="risk-analysis" className="flex items-center">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Ryzyko
          </TabsTrigger>
          <TabsTrigger value="market-data" className="flex items-center">
            <Search className="mr-2 h-4 w-4" />
            Dane Rynkowe
          </TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-8">
          {/* Add Investment & Portfolio Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add Investment Form */}
            <Card>
              <CardHeader>
                <CardTitle>Dodaj inwestycję</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Dialog open={showInvestmentForm} onOpenChange={setShowInvestmentForm}>
                  <DialogTrigger asChild>
                    <Button className="w-full" onClick={() => setEditingInvestment(null)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Dodaj inwestycję
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingInvestment ? "Edytuj inwestycję" : "Dodaj inwestycję"}
                      </DialogTitle>
                    </DialogHeader>
                    <InvestmentForm
                      investment={editingInvestment}
                      onSuccess={handleInvestmentFormClose}
                      onCancel={handleInvestmentFormClose}
                    />
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
            
            {/* Portfolio Allocation Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Alokacja portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <AllocationChart investments={investments} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Investment Holdings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Posiadane instrumenty</CardTitle>
              <div className="flex space-x-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Wszystkie typy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Wszystkie typy</SelectItem>
                    <SelectItem value="akcje">Akcje</SelectItem>
                    <SelectItem value="etf">ETF</SelectItem>
                    <SelectItem value="obligacje">Obligacje</SelectItem>
                    <SelectItem value="kryptowaluty">Kryptowaluty</SelectItem>
                    <SelectItem value="nieruchomości">Nieruchomości</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Instrument</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500">Typ</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500">Ilość</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500">Cena zakupu</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500">Cena aktualna</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500">Zysk/Strata</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500">Akcje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvestments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-gray-500">
                          Brak inwestycji do wyświetlenia
                        </td>
                      </tr>
                    ) : (
                      filteredInvestments.map((investment) => {
                        const { profitLoss, percentage } = calculateProfitLoss(investment);
                        return (
                          <tr key={investment.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div>
                                <span className="font-medium text-gray-900">{investment.symbol}</span>
                                <p className="text-sm text-gray-500">{investment.name}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Badge className={getTypeBadgeColor(investment.type)}>
                                {investment.type}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-right text-sm text-gray-900">
                              {parseFloat(investment.quantity).toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-right text-sm text-gray-900">
                              {investment.purchasePrice} zł
                            </td>
                            <td className="py-3 px-4 text-right text-sm text-gray-900">
                              {investment.currentPrice || investment.purchasePrice} zł
                            </td>
                            <td className="py-3 px-4 text-right">
                              <span className={`text-sm font-medium ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {profitLoss >= 0 ? '+' : ''}{profitLoss.toFixed(2)} zł ({percentage >= 0 ? '+' : ''}{percentage.toFixed(1)}%)
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex justify-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleSellInvestment(investment)}
                                  className="text-green-600 hover:text-green-800"
                                  title="Sprzedaj"
                                >
                                  <ShoppingCart className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditInvestment(investment)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteInvestment(investment.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Performance Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Wydajność portfolio</CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant={performanceView === "history" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPerformanceView("history")}
                >
                  Historia sprzedaży
                </Button>
                <Button
                  variant={performanceView === "chart" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPerformanceView("chart")}
                >
                  Wykres
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {performanceView === "history" ? (
                investmentSales.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    Brak historii sprzedaży
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-500">Instrument</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-500">Ilość</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-500">Cena sprzedaży</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-500">Wartość sprzedaży</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-500">Zysk/Strata</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-500">Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {investmentSales.map((sale) => (
                          <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div>
                                <span className="font-medium text-gray-900">{sale.investmentSymbol}</span>
                                <p className="text-sm text-gray-500">{sale.investmentName}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right text-sm text-gray-900">
                              {parseFloat(sale.quantitySold).toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-right text-sm text-gray-900">
                              {parseFloat(sale.salePrice).toFixed(2)} zł
                            </td>
                            <td className="py-3 px-4 text-right text-sm text-gray-900">
                              {parseFloat(sale.totalSaleValue).toFixed(2)} zł
                            </td>
                            <td className="py-3 px-4 text-right">
                              <span className={`text-sm font-medium ${parseFloat(sale.profitLoss) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {parseFloat(sale.profitLoss) >= 0 ? '+' : ''}{parseFloat(sale.profitLoss).toFixed(2)} zł
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right text-sm text-gray-900">
                              {new Date(sale.saleDate).toLocaleDateString('pl-PL')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">Łączne zrealizowane zyski/straty:</span>
                        <span className={`text-lg font-bold ${realizedProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {realizedProfitLoss >= 0 ? '+' : ''}{realizedProfitLoss.toFixed(2)} zł
                        </span>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div className="h-80">
                  <ProfitLossChart investmentSales={investmentSales} />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-assistant">
          <AIAssistant />
        </TabsContent>

        <TabsContent value="risk-analysis">
          <RiskAnalysis />
        </TabsContent>

        <TabsContent value="market-data">
          <PriceUpdater />
        </TabsContent>
      </Tabs>

      {/* Sell Investment Dialog */}
      <Dialog open={showSellDialog} onOpenChange={setShowSellDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sprzedaj inwestycję</DialogTitle>
          </DialogHeader>
          {sellingInvestment && (
            <div className="space-y-4">
              <div>
                <p className="font-medium">{sellingInvestment.symbol} - {sellingInvestment.name}</p>
                <p className="text-sm text-gray-600">Posiadane: {parseFloat(sellingInvestment.quantity).toFixed(2)} jednostek</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sell-quantity">Ilość do sprzedaży</Label>
                <Input
                  id="sell-quantity"
                  type="number"
                  step="0.01"
                  max={parseFloat(sellingInvestment.quantity)}
                  value={sellQuantity}
                  onChange={(e) => setSellQuantity(e.target.value)}
                  placeholder="Wprowadź ilość"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sell-price">Cena sprzedaży za jednostkę</Label>
                <Input
                  id="sell-price"
                  type="number"
                  step="0.01"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value)}
                  placeholder="Wprowadź cenę"
                />
              </div>
              
              {sellQuantity && sellPrice && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Podgląd transakcji:</p>
                  <p className="font-medium">
                    Wartość sprzedaży: {(parseFloat(sellQuantity) * parseFloat(sellPrice)).toFixed(2)} zł
                  </p>
                  <p className="font-medium">
                    Zysk/Strata: {
                      (parseFloat(sellQuantity) * parseFloat(sellPrice) - 
                       parseFloat(sellQuantity) * parseFloat(sellingInvestment.purchasePrice)).toFixed(2)
                    } zł
                  </p>
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowSellDialog(false)}>
                  Anuluj
                </Button>
                <Button 
                  onClick={handleSellSubmit}
                  disabled={sellInvestmentMutation.isPending || !sellQuantity || !sellPrice}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {sellInvestmentMutation.isPending ? "Sprzedawanie..." : "Sprzedaj"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}