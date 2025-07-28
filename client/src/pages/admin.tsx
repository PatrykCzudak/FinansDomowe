import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useBudget } from "@/hooks/use-budget";
import CategoryForm from "@/components/forms/category-form";
import IncomeForm from "@/components/forms/income-form";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Category, Income } from "@shared/schema";

export default function AdminPage() {
  const { data: categories = [] } = useQuery<Category[]>({ queryKey: ["/api/categories"] });
  const { data: incomes = [] } = useQuery<Income[]>({ queryKey: ["/api/incomes"] });
  const { deleteCategory, deleteIncome } = useBudget();
  
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);

  const totalIncome = incomes.reduce((sum, income) => sum + parseFloat(income.amount), 0);
  const totalBudget = categories.reduce((sum, category) => sum + parseFloat(category.budget), 0);
  const remainingBudget = totalIncome - totalBudget;

  const handleDeleteCategory = async (id: string) => {
    if (confirm("Czy na pewno chcesz usunąć tę kategorię?")) {
      await deleteCategory.mutateAsync(id);
    }
  };

  const handleDeleteIncome = async (id: string) => {
    if (confirm("Czy na pewno chcesz usunąć to źródło przychodu?")) {
      await deleteIncome.mutateAsync(id);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleEditIncome = (income: Income) => {
    setEditingIncome(income);
    setShowIncomeForm(true);
  };

  const handleCategoryFormClose = () => {
    setShowCategoryForm(false);
    setEditingCategory(null);
  };

  const handleIncomeFormClose = () => {
    setShowIncomeForm(false);
    setEditingIncome(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Categories Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Kategorie wydatków</CardTitle>
          <Dialog open={showCategoryForm} onOpenChange={setShowCategoryForm}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingCategory(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Dodaj kategorię
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? "Edytuj kategorię" : "Dodaj kategorię"}
                </DialogTitle>
              </DialogHeader>
              <CategoryForm
                category={editingCategory}
                onSuccess={handleCategoryFormClose}
                onCancel={handleCategoryFormClose}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-3" 
                    style={{ backgroundColor: category.color }}
                  />
                  <div>
                    <span className="font-medium text-gray-900">{category.name}</span>
                    <p className="text-sm text-gray-500">Limit: {category.budget} zł</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEditCategory(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Income Sources */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Źródła przychodów</CardTitle>
          <Dialog open={showIncomeForm} onOpenChange={setShowIncomeForm}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-green-600 text-white hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Dodaj przychód
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingIncome ? "Edytuj przychód" : "Dodaj przychód"}
                </DialogTitle>
              </DialogHeader>
              <IncomeForm
                income={editingIncome}
                onSuccess={handleIncomeFormClose}
                onCancel={handleIncomeFormClose}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {incomes.map((income) => (
              <div key={income.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <span className="font-medium text-gray-900">{income.name}</span>
                  <p className="text-sm text-gray-500">{income.amount} zł / {income.frequency === 'monthly' ? 'miesiąc' : income.frequency}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEditIncome(income)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteIncome(income.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Budget Configuration */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Konfiguracja budżetu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Całkowity przychód</p>
                  <p className="text-2xl font-bold text-blue-700">{totalIncome.toFixed(2)} zł</p>
                </div>
                <TrendingUp className="text-blue-500 h-8 w-8" />
              </div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 font-medium">Planowane wydatki</p>
                  <p className="text-2xl font-bold text-orange-700">{totalBudget.toFixed(2)} zł</p>
                </div>
                <TrendingDown className="text-orange-500 h-8 w-8" />
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Pozostało do oszczędności</p>
                  <p className="text-2xl font-bold text-green-700">{remainingBudget.toFixed(2)} zł</p>
                </div>
                <PiggyBank className="text-green-500 h-8 w-8" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
