import { Wallet, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { MonthSelector } from "@/components/ui/month-selector";
import { useMonthContext } from "@/contexts/month-context";

export default function Header() {
  const { selectedMonth, setSelectedMonth } = useMonthContext();

  return (
    <header className="bg-background border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="bg-primary text-primary-foreground rounded-lg p-2 mr-3">
              <Wallet className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-semibold">Budżet Domowy</h1>
          </div>
          <div className="flex items-center space-x-4">
            <MonthSelector 
              value={selectedMonth} 
              onChange={setSelectedMonth} 
            />
            <ThemeToggle />
            <Button variant="ghost" size="sm">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
