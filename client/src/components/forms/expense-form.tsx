import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBudget } from "@/hooks/use-budget";
import { useMonthContext } from "@/contexts/month-context";
import { insertExpenseSchema, type Expense, type Category } from "@shared/schema";
import { z } from "zod";

const formSchema = insertExpenseSchema.extend({
  amount: z.string().min(1, "Kwota jest wymagana"),
});

type FormData = z.infer<typeof formSchema>;

interface ExpenseFormProps {
  expense?: Expense | null;
  categories: Category[];
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ExpenseForm({ expense, categories, onSuccess, onCancel }: ExpenseFormProps) {
  const { createExpense, updateExpense } = useBudget();
  const { selectedMonth } = useMonthContext();
  
  // Ustaw domyślną datę na pierwszy dzień wybranego miesiąca dla nowych wydatków
  const getDefaultDate = () => {
    if (expense) return expense.date;
    return `${selectedMonth}-01`;
  };
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: expense?.description || "",
      amount: expense?.amount || "",
      categoryId: expense?.categoryId || "",
      date: getDefaultDate(),
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (expense) {
        await updateExpense.mutateAsync({ id: expense.id, data });
      } else {
        await createExpense.mutateAsync(data);
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to save expense:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategoria</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz kategorię" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Opis</FormLabel>
              <FormControl>
                <Input placeholder="Opis wydatku" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data</FormLabel>
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
            disabled={createExpense.isPending || updateExpense.isPending}
          >
            {expense ? "Zapisz zmiany" : "Dodaj wydatek"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
