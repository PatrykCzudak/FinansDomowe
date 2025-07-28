import { Settings, CreditCard, TrendingUp, PieChart, PiggyBank } from "lucide-react";
import { useLocation } from "wouter";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [, navigate] = useLocation();

  const tabs = [
    { id: "admin", label: "Admin/Budżet", icon: Settings, path: "/admin" },
    { id: "expenses", label: "Wydatki", icon: CreditCard, path: "/expenses" },
    { id: "savings", label: "Cele Oszczędnościowe", icon: PiggyBank, path: "/savings" },
    { id: "summary", label: "Podsumowanie", icon: TrendingUp, path: "/summary" },
    { id: "investments", label: "Inwestycje", icon: PieChart, path: "/investments" },
  ];

  const handleTabClick = (tab: typeof tabs[0]) => {
    onTabChange(tab.id);
    navigate(tab.path);
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="mr-2 h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
