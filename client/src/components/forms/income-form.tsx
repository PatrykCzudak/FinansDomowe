import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBudget } from "@/hooks/use-budget";
import { insertIncomeSchema, type Income } from "@shared/schema";
import { z } from "zod";

const formSchema = insertIncomeSchema.extend({
  amount: z.string().min(1, "Kwota jest wymagana"),
});

type FormData = z.infer<typeof formSchema>;

interface IncomeFormProps {
  income?: Income | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function IncomeForm({ income, onSuccess, onCancel }: IncomeFormProps) {
  const { createIncome, updateIncome } = useBudget();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: income?.name || "",
      amount: income?.amount || "",
      frequency: income?.frequency || "monthly",
      date: income?.date || new Date().toISOString().slice(0, 10),
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (income) {
        await updateIncome.mutateAsync({ id: income.id, data });
      } else {
        await createIncome.mutateAsync(data);
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to save income:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa źródła przychodu</FormLabel>
              <FormControl>
                <Input placeholder="np. Wynagrodzenie" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kwota (zł)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Częstotliwość</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz częstotliwość" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="monthly">Miesięcznie</SelectItem>
                  <SelectItem value="weekly">Tygodniowo</SelectItem>
                  <SelectItem value="yearly">Rocznie</SelectItem>
                  <SelectItem value="one-time">Jednorazowo</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data otrzymania</FormLabel>
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
            disabled={createIncome.isPending || updateIncome.isPending}
          >
            {income ? "Zapisz zmiany" : "Dodaj przychód"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
