import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Investment } from '@shared/schema';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

interface AllocationChartProps {
  investments: Investment[];
}

export default function AllocationChart({ investments }: AllocationChartProps) {
  const data = useMemo(() => {
    if (!investments || investments.length === 0) return [];

    const typeMap = new Map<string, number>();

    investments.forEach(investment => {
      const value = (investment.current_price || investment.purchase_price) * investment.quantity;
      const type = investment.symbol.includes('.') ? 'International' : 'Domestic';
      
      typeMap.set(type, (typeMap.get(type) || 0) + value);
    });

    return Array.from(typeMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }, [investments]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Brak inwestycji do wyświetlenia
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => [`${value.toFixed(2)} zł`, 'Wartość']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}