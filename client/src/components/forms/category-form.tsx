import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useBudget } from "@/hooks/use-budget";
import { insertCategorySchema, type Category } from "@shared/schema";
import { z } from "zod";

const formSchema = insertCategorySchema.extend({
  budget: z.string().min(1, "Budget jest wymagany"),
});

type FormData = z.infer<typeof formSchema>;

interface CategoryFormProps {
  category?: Category | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CategoryForm({ category, onSuccess, onCancel }: CategoryFormProps) {
  const { createCategory, updateCategory } = useBudget();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      color: category?.color || "#3B82F6",
      budget: category?.budget || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (category) {
        await updateCategory.mutateAsync({ id: category.id, data });
      } else {
        await createCategory.mutateAsync(data);
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to save category:", error);
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
              <FormLabel>Nazwa kategorii</FormLabel>
              <FormControl>
                <Input placeholder="np. Żywność" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kolor</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-2">
                  <Input type="color" {...field} className="w-16 h-10" />
                  <Input {...field} placeholder="#3B82F6" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Miesięczny limit (zł)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
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
            disabled={createCategory.isPending || updateCategory.isPending}
          >
            {category ? "Zapisz zmiany" : "Dodaj kategorię"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
