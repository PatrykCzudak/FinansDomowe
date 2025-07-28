import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBudget } from "@/hooks/use-budget";
import { insertInvestmentSchema, type Investment } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Search, Loader2 } from "lucide-react";
import { z } from "zod";

const formSchema = insertInvestmentSchema.extend({
  quantity: z.string().min(1, "Ilość jest wymagana"),
  purchasePrice: z.string().min(1, "Cena zakupu jest wymagana"),
});

type FormData = z.infer<typeof formSchema>;

interface InvestmentFormProps {
  investment?: Investment | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function InvestmentForm({ investment, onSuccess, onCancel }: InvestmentFormProps) {
  const { createInvestment, updateInvestment } = useBudget();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedTicker, setSelectedTicker] = useState(investment?.symbol || "");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: investment?.symbol || "",
      name: investment?.name || "",
      type: investment?.type || "",
      quantity: investment?.quantity || "",
      purchasePrice: investment?.purchasePrice || "",
      purchaseDate: investment?.purchaseDate || new Date().toISOString().split('T')[0],
    },
  });

  // Search symbols mutation
  const searchMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await apiRequest("GET", `/api/search/${encodeURIComponent(query)}`);
      return response.json();
    },
    onSuccess: (data) => {
      setSearchResults(data || []);
    }
  });

  // Get current price mutation
  const getPriceMutation = useMutation({
    mutationFn: async (symbol: string) => {
      const response = await apiRequest("GET", `/api/prices/${symbol}`);
      return response.json();
    },
    onSuccess: (data) => {
      form.setValue("purchasePrice", data.price.toString());
    }
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchMutation.mutate(searchQuery.trim());
    }
  };

  const handleTickerSelect = (result: any) => {
    setSelectedTicker(result.symbol);
    form.setValue("symbol", result.symbol);
    form.setValue("name", result.shortname || result.longname || result.symbol);
    
    // Pobierz aktualną cenę
    getPriceMutation.mutate(result.symbol);
    
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleTypeChange = (type: string) => {
    form.setValue("type", type);
    // Reset selected ticker when type changes
    setSelectedTicker("");
    form.setValue("symbol", "");
    form.setValue("name", "");
    form.setValue("purchasePrice", "");
    setSearchResults([]);
  };

  // Filter search results based on selected type
  const getFilteredResults = () => {
    const selectedType = form.watch("type");
    if (!selectedType || !searchResults.length) return searchResults;

    return searchResults.filter(result => {
      const typeDisp = result.typeDisp?.toLowerCase() || "";
      
      switch (selectedType) {
        case 'akcje':
          return typeDisp.includes('equity') || typeDisp.includes('stock') || 
                 (!typeDisp.includes('etf') && !typeDisp.includes('fund') && !typeDisp.includes('bond'));
        case 'etf':
          return typeDisp.includes('etf') || typeDisp.includes('fund');
        case 'obligacje':
          return typeDisp.includes('bond');
        case 'kryptowaluty':
          return typeDisp.includes('crypto') || typeDisp.includes('coin');
        default:
          return true;
      }
    });
  };

  const getPlaceholderForType = (type: string) => {
    switch (type) {
      case 'akcje':
        return 'AAPL, MSFT, GOOGL';
      case 'etf':
        return 'SPY, VTI, QQQ';
      case 'obligacje':
        return 'TLT, IEF, BND';
      case 'kryptowaluty':
        return 'BTC-USD, ETH-USD';
      case 'nieruchomości':
        return 'REITs: VNQ, IYR';
      default:
        return 'ticker';
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (investment) {
        await updateInvestment.mutateAsync({ id: investment.id, data });
      } else {
        await createInvestment.mutateAsync(data);
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to save investment:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Typ instrumentu</FormLabel>
              <Select onValueChange={handleTypeChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz typ" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="akcje">Akcje</SelectItem>
                  <SelectItem value="etf">ETF</SelectItem>
                  <SelectItem value="obligacje">Obligacje</SelectItem>
                  <SelectItem value="kryptowaluty">Kryptowaluty</SelectItem>
                  <SelectItem value="nieruchomości">Nieruchomości</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Ticker Search - Only show if type is selected */}
        {form.watch("type") && (
          <div className="space-y-3">
            <FormLabel>Wyszukaj ticker ({form.watch("type")})</FormLabel>
            <div className="flex space-x-2">
              <Input
                placeholder={`Wpisz symbol dla ${form.watch("type")} (np. ${getPlaceholderForType(form.watch("type"))})`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleSearch}
                disabled={searchMutation.isPending || !searchQuery.trim()}
                variant="outline"
              >
                {searchMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Search Results */}
            {getFilteredResults().length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-2">
                <p className="text-sm text-gray-600 mb-2">Znalezione tickery dla {form.watch("type")}:</p>
                {getFilteredResults().map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                    onClick={() => handleTickerSelect(result)}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{result.symbol}</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{result.exchange}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Selected Ticker */}
            {selectedTicker && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-blue-900">Ticker: {selectedTicker}</span>
                  {getPriceMutation.isPending && (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <FormField
          control={form.control}
          name="symbol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Symbol/Ticker</FormLabel>
              <FormControl>
                <Input placeholder="Wybierz z listy powyżej" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ilość</FormLabel>
              <FormControl>
                <Input type="number" step="0.00000001" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="purchasePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cena zakupu (USD)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="Cena zostanie pobrana automatycznie" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="purchaseDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data zakupu</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Anuluj
          </Button>
          <Button 
            type="submit" 
            disabled={createInvestment.isPending || updateInvestment.isPending}
          >
            {investment ? "Zaktualizuj" : "Dodaj"}
          </Button>
        </div>
      </form>
    </Form>
  );
}