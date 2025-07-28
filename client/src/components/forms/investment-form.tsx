import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBudget } from "@/hooks/use-budget";
import { insertInvestmentSchema, type Investment } from "@shared/schema";
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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

        <FormField
          control={form.control}
          name="symbol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Symbol/Ticker</FormLabel>
              <FormControl>
                <Input placeholder="np. AAPL, BTC, itp." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pełna nazwa</FormLabel>
              <FormControl>
                <Input placeholder="np. Apple Inc." {...field} />
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
              <FormLabel>Cena zakupu (zł)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
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
            {investment ? "Zapisz zmiany" : "Dodaj inwestycję"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
