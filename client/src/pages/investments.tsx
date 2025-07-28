import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, TrendingUp, DollarSign, Percent, PiggyBank, RefreshCw, Bot } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useBudget } from "@/hooks/use-budget";
import InvestmentForm from "@/components/forms/investment-form";
import AllocationChart from "@/components/charts/allocation-chart";
import PerformanceChart from "@/components/charts/performance-chart";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Investment } from "@shared/schema";

export default function InvestmentsPage() {
  const { data: investments = [] } = useQuery<Investment[]>({ queryKey: ["/api/investments"] });
  const { deleteInvestment } = useBudget();
  
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
  const [showInvestmentForm, setShowInvestmentForm] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");

  const filteredInvestments = investments.filter(investment => 
    filterType === "all" || investment.type === filterType
  );

  const totalInvested = investments.reduce((sum, inv) => 
    sum + (parseFloat(inv.purchasePrice) * parseFloat(inv.quantity)), 0
  );

  const totalCurrentValue = investments.reduce((sum, inv) => 
    sum + (parseFloat(inv.currentPrice || inv.purchasePrice) * parseFloat(inv.quantity)), 0
  );

  const totalProfitLoss = totalCurrentValue - totalInvested;
  const totalROI = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

  const handleDeleteInvestment = async (id: string) => {
    if (confirm("Czy na pewno chcesz usunąć tę inwestycję?")) {
      await deleteInvestment.mutateAsync(id);
    }
  };

  const handleEditInvestment = (investment: Investment) => {
    setEditingInvestment(investment);
    setShowInvestmentForm(true);
  };

  const handleInvestmentFormClose = () => {
    setShowInvestmentForm(false);
    setEditingInvestment(null);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pl-PL');
  };

  const calculateProfitLoss = (investment: Investment) => {
    const purchaseValue = parseFloat(investment.purchasePrice) * parseFloat(investment.quantity);
    const currentValue = parseFloat(investment.currentPrice || investment.purchasePrice) * parseFloat(investment.quantity);
    const profitLoss = currentValue - purchaseValue;
    const percentage = purchaseValue > 0 ? (profitLoss / purchaseValue) * 100 : 0;
    return { profitLoss, percentage };
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "akcje": return "bg-blue-100 text-blue-800";
      case "etf": return "bg-green-100 text-green-800";
      case "obligacje": return "bg-yellow-100 text-yellow-800";
      case "kryptowaluty": return "bg-purple-100 text-purple-800";
      case "nieruchomości": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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
                <p className="text-sm text-gray-500">Potencjalne dywidendy</p>
                <p className="text-2xl font-bold text-gray-900">0.00 zł</p>
                <p className="text-sm text-gray-600">szacunkowe roczne</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <PiggyBank className="text-purple-600 h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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

            {/* AI Integration Placeholder */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
              <div className="flex items-center mb-2">
                <Bot className="text-purple-600 mr-2 h-5 w-5" />
                <span className="text-sm font-medium text-purple-800">AI Assistant (Wkrótce)</span>
              </div>
              <p className="text-xs text-purple-600">Automatyczne analizy portfolio i rekomendacje inwestycyjne</p>
            </div>
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
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Odśwież ceny
            </Button>
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
                          {investment.quantity}
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

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Wydajność portfolio (ostatnie 12 miesięcy)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <PerformanceChart investments={investments} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
