import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Wallet, Calendar, PiggyBank } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import BudgetChart from "@/components/charts/budget-chart";
import CategoryChart from "@/components/charts/category-chart";
import TrendsChart from "@/components/charts/trends-chart";
import { Progress } from "@/components/ui/progress";
import { useMonthContext } from "@/contexts/month-context";
import type { Category, Expense, Income } from "@shared/schema";

export default function SummaryPage() {
  const { data: categories = [] } = useQuery<Category[]>({ queryKey: ["/api/categories"] });
  const { data: expenses = [] } = useQuery<Expense[]>({ queryKey: ["/api/expenses"] });
  const { data: incomes = [] } = useQuery<Income[]>({ queryKey: ["/api/incomes"] });
  const { selectedMonth } = useMonthContext();

  const monthlyExpenses = expenses.filter(expense => expense.date.startsWith(selectedMonth));
  
  const totalMonthlyExpenses = monthlyExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  const totalIncome = incomes.reduce((sum, income) => sum + parseFloat(income.amount), 0);
  const totalBudget = categories.reduce((sum, category) => sum + parseFloat(category.budget), 0);
  const remainingBudget = totalBudget - totalMonthlyExpenses;
  const [year, month] = selectedMonth.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const currentDay = selectedMonth === new Date().toISOString().slice(0, 7) 
    ? new Date().getDate() 
    : daysInMonth;
  const dailyAverage = totalMonthlyExpenses / currentDay;
  const savings = totalIncome - totalMonthlyExpenses;

  const getCategoryExpenses = (categoryId: string) => {
    return monthlyExpenses
      .filter(expense => expense.categoryId === categoryId)
      .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  };

  const getCategoryById = (id: string) => categories.find(cat => cat.id === id);

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Wydatki w miesiącu</p>
                <p className="text-2xl font-bold">{totalMonthlyExpenses.toFixed(2)} zł</p>
                <p className="text-sm text-green-600">{new Date(`${selectedMonth}-01`).toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' })}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <CreditCard className="text-blue-600 dark:text-blue-400 h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pozostały budżet</p>
                <p className="text-2xl font-bold">{remainingBudget.toFixed(2)} zł</p>
                <p className="text-sm text-green-600">{totalBudget > 0 ? ((remainingBudget / totalBudget) * 100).toFixed(1) : 0}% budżetu</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <Wallet className="text-green-600 dark:text-green-400 h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Średni wydatek dzienny</p>
                <p className="text-2xl font-bold">{dailyAverage.toFixed(2)} zł</p>
                <p className="text-sm text-muted-foreground">W wybranym miesiącu</p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-full">
                <Calendar className="text-orange-600 dark:text-orange-400 h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Oszczędności</p>
                <p className="text-2xl font-bold">{savings.toFixed(2)} zł</p>
                <p className="text-sm text-green-600">W wybranym miesiącu</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                <PiggyBank className="text-purple-600 dark:text-purple-400 h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Budżet vs Rzeczywiste wydatki</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <BudgetChart categories={categories} expenses={monthlyExpenses} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Wydatki wg kategorii</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <CategoryChart categories={categories} expenses={monthlyExpenses} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Spending Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Trendy wydatków (ostatnie 6 miesięcy)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <TrendsChart expenses={expenses} />
          </div>
        </CardContent>
      </Card>

      {/* Category Progress Bars */}
      <Card>
        <CardHeader>
          <CardTitle>Wykorzystanie budżetu wg kategorii</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {categories.map((category) => {
              const spent = getCategoryExpenses(category.id);
              const budget = parseFloat(category.budget);
              const percentage = budget > 0 ? (spent / budget) * 100 : 0;
              
              return (
                <div key={category.id}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    <span className="text-sm text-gray-500">{spent.toFixed(2)} zł / {budget.toFixed(2)} zł</span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className="w-full h-3"
                    style={{ 
                      background: `${category.color}20`,
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% wykorzystania</p>
                </div>
              );
            })}
            {categories.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                Brak kategorii do wyświetlenia. Dodaj kategorie w zakładce Admin/Budżet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
