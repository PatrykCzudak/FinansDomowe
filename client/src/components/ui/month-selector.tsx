import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";

export interface MonthSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MonthSelector({ value, onChange }: MonthSelectorProps) {
  const months = [
    { value: "2024-01", label: "Styczeń 2024" },
    { value: "2024-02", label: "Luty 2024" },
    { value: "2024-03", label: "Marzec 2024" },
    { value: "2024-04", label: "Kwiecień 2024" },
    { value: "2024-05", label: "Maj 2024" },
    { value: "2024-06", label: "Czerwiec 2024" },
    { value: "2024-07", label: "Lipiec 2024" },
    { value: "2024-08", label: "Sierpień 2024" },
    { value: "2024-09", label: "Wrzesień 2024" },
    { value: "2024-10", label: "Październik 2024" },
    { value: "2024-11", label: "Listopad 2024" },
    { value: "2024-12", label: "Grudzień 2024" },
    { value: "2025-01", label: "Styczeń 2025" },
    { value: "2025-02", label: "Luty 2025" },
    { value: "2025-03", label: "Marzec 2025" },
    { value: "2025-04", label: "Kwiecień 2025" },
    { value: "2025-05", label: "Maj 2025" },
    { value: "2025-06", label: "Czerwiec 2025" },
    { value: "2025-07", label: "Lipiec 2025" },
    { value: "2025-08", label: "Sierpień 2025" },
    { value: "2025-09", label: "Wrzesień 2025" },
    { value: "2025-10", label: "Październik 2025" },
    { value: "2025-11", label: "Listopad 2025" },
    { value: "2025-12", label: "Grudzień 2025" },
  ];

  return (
    <div className="flex items-center space-x-2">
      <Calendar className="h-4 w-4 text-gray-500" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Wybierz miesiąc" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem key={month.value} value={month.value}>
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}