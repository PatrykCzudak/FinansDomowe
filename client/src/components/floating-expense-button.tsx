import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ExpenseForm from "@/components/forms/expense-form";
import type { Category } from "@shared/schema";

export default function FloatingExpenseButton() {
  const [open, setOpen] = useState(false);
  
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full p-0 shadow-lg hover:shadow-xl transition-shadow z-50"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Szybki Wydatek</DialogTitle>
        </DialogHeader>
        <ExpenseForm 
          categories={categories} 
          onCancel={() => setOpen(false)}
          onSuccess={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
}