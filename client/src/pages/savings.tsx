import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { SavingsGoal, InsertSavingsGoal } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSavingsGoalSchema } from "@shared/schema";
import { z } from "zod";
import { Plus, Target, TrendingUp, Calendar, Trash2, PiggyBank } from "lucide-react";
import { format, differenceInDays, isAfter } from "date-fns";
import { pl } from "date-fns/locale";

const savingsGoalFormSchema = z.object({
  name: z.string().min(1, "Nazwa celu jest wymagana"),
  description: z.string().optional(),
  targetAmount: z.string().min(1, "Podaj kwotę celu"),
  category: z.string().min(1, "Wybierz kategorię"),
  color: z.string(),
  targetDate: z.string().optional(),
});

type SavingsGoalFormData = z.infer<typeof savingsGoalFormSchema>;

const goalCategories = [
  "Wakacje",
  "Samochód",
  "Dom/Mieszkanie",
  "Fundusz awaryjny",
  "Edukacja",
  "Emerytura",
  "Sprzęt elektroniczny",
  "Inne"
];

const goalColors = [
  "#3B82F6", // blue
  "#10B981", // emerald
  "#F59E0B", // amber
  "#EF4444", // red
  "#8B5CF6", // violet
  "#06B6D4", // cyan
  "#84CC16", // lime
  "#F97316", // orange
];

export default function SavingsPage() {
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAddSavingsDialog, setShowAddSavingsDialog] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  
  const queryClient = useQueryClient();

  const { data: goals = [], isLoading } = useQuery<SavingsGoal[]>({
    queryKey: ["/api/savings-goals"],
  });

  const createGoalMutation = useMutation({
    mutationFn: (data: SavingsGoalFormData) => {
      const processedData = {
        name: data.name,
        description: data.description || undefined,
        targetAmount: parseFloat(data.targetAmount).toString(),
        targetDate: data.targetDate || undefined,
        category: data.category,
        color: data.color,
      };
      return apiRequest("POST", "/api/savings-goals", processedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/savings-goals"] });
      setShowCreateDialog(false);
      form.reset();
    },
    onError: (error) => {
      console.error("Error creating savings goal:", error);
    },
  });

  const addSavingsMutation = useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) =>
      apiRequest("POST", `/api/savings-goals/${id}/add-savings`, { amount }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/savings-goals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/savings-transactions"] });
      setShowAddSavingsDialog(false);
      setAddAmount("");
      setSelectedGoal(null);
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/savings-goals/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/savings-goals"] });
    },
  });

  const form = useForm<SavingsGoalFormData>({
    resolver: zodResolver(savingsGoalFormSchema),
    defaultValues: {
      name: "",
      description: "",
      targetAmount: "",
      category: goalCategories[0],
      color: goalColors[0],
      targetDate: "",
    },
  });

  const onSubmit = (data: SavingsGoalFormData) => {
    console.log("Submitting savings goal:", data);
    createGoalMutation.mutate(data);
  };

  const handleAddSavings = () => {
    if (selectedGoal && addAmount) {
      addSavingsMutation.mutate({
        id: selectedGoal.id,
        amount: parseFloat(addAmount),
      });
    }
  };

  const calculateProgress = (current: string, target: string) => {
    const currentAmount = parseFloat(current);
    const targetAmount = parseFloat(target);
    return Math.min((currentAmount / targetAmount) * 100, 100);
  };

  const calculateMonthlySavings = (goal: SavingsGoal) => {
    if (!goal.targetDate) return null;
    
    const today = new Date();
    const targetDate = new Date(goal.targetDate);
    const daysLeft = differenceInDays(targetDate, today);
    const monthsLeft = Math.max(1, Math.ceil(daysLeft / 30));
    
    const remaining = parseFloat(goal.targetAmount) - parseFloat(goal.currentAmount);
    return Math.ceil(remaining / monthsLeft);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cele Oszczędnościowe</h1>
          <p className="text-muted-foreground">
            Planuj i śledź swoje cele finansowe
          </p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nowy Cel
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nowy Cel Oszczędnościowy</DialogTitle>
              <DialogDescription>
                Stwórz nowy cel i zacznij oszczędzać
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nazwa celu</FormLabel>
                      <FormControl>
                        <Input placeholder="np. Wakacje w Grecji" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opis (opcjonalnie)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Dodatkowe informacje o celu"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="targetAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kwota docelowa</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="5000"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="targetDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data docelowa</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="category"
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
                          {goalCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
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
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kolor</FormLabel>
                      <div className="flex gap-2">
                        {goalColors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`w-8 h-8 rounded-full border-2 ${
                              field.value === color ? "border-gray-900" : "border-gray-300"
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => field.onChange(color)}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={createGoalMutation.isPending}>
                    {createGoalMutation.isPending ? "Tworzę..." : "Stwórz Cel"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                  >
                    Anuluj
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {goals.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <PiggyBank className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Brak celów oszczędnościowych</h3>
            <p className="text-muted-foreground mb-4">
              Stwórz swój pierwszy cel i zacznij oszczędzać na to, co ważne
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Dodaj Pierwszy Cel
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            const monthlySavings = calculateMonthlySavings(goal);
            const isOverdue = goal.targetDate && isAfter(new Date(), new Date(goal.targetDate));
            
            return (
              <Card key={goal.id} className="relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 w-full h-2"
                  style={{ backgroundColor: goal.color }}
                />
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{goal.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {goal.category}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedGoal(goal);
                          setShowAddSavingsDialog(true);
                        }}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteGoalMutation.mutate(goal.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {goal.description && (
                    <CardDescription className="text-sm">
                      {goal.description}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">
                        {parseFloat(goal.currentAmount).toLocaleString("pl-PL")} zł
                      </span>
                      <span className="text-muted-foreground">
                        z {parseFloat(goal.targetAmount).toLocaleString("pl-PL")} zł
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                      {progress.toFixed(1)}% osiągnięto
                    </div>
                  </div>

                  {goal.targetDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span className={isOverdue ? "text-red-500" : ""}>
                        {format(new Date(goal.targetDate), "d MMM yyyy", { locale: pl })}
                        {isOverdue && " (przeterminowane)"}
                      </span>
                    </div>
                  )}

                  {monthlySavings && !isOverdue && (
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4" />
                      <span>
                        Miesięcznie: {monthlySavings.toLocaleString("pl-PL")} zł
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4" />
                    <span>
                      Pozostało: {(parseFloat(goal.targetAmount) - parseFloat(goal.currentAmount)).toLocaleString("pl-PL")} zł
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Savings Dialog */}
      <Dialog open={showAddSavingsDialog} onOpenChange={setShowAddSavingsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Dodaj Oszczędności</DialogTitle>
            <DialogDescription>
              Dodaj kwotę do celu: {selectedGoal?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Kwota</label>
              <Input
                type="number"
                step="0.01"
                placeholder="100.00"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleAddSavings}
                disabled={!addAmount || addSavingsMutation.isPending}
              >
                {addSavingsMutation.isPending ? "Dodaję..." : "Dodaj"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddSavingsDialog(false)}
              >
                Anuluj
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}