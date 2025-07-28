import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Clock, CheckCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function PriceUpdater() {
  const { toast } = useToast();

  const updatePricesMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/investments/update-prices");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Sukces",
        description: "Ceny zostały zaktualizowane",
      });
    },
    onError: () => {
      toast({
        title: "Błąd", 
        description: "Nie udało się zaktualizować cen",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <RefreshCw className="mr-2 h-5 w-5 text-blue-600" />
            Aktualizacja Cen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Automatyczna aktualizacja</p>
                  <p className="text-sm text-blue-700">Ceny są aktualizowane co 15 minut</p>
                </div>
              </div>
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            
            <Button
              onClick={() => updatePricesMutation.mutate()}
              disabled={updatePricesMutation.isPending}
              className="w-full"
            >
              {updatePricesMutation.isPending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Aktualizuję...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Aktualizuj wszystkie ceny
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}