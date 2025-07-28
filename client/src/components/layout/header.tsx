import { Wallet, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Header() {
  const currentMonth = new Date().toLocaleDateString('pl-PL', { 
    year: 'numeric', 
    month: 'long' 
  });

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
            <Badge variant="secondary" className="bg-green-600 text-white dark:bg-green-700">
              {currentMonth}
            </Badge>
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
