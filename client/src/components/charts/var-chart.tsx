import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';

interface VaRChartProps {
  data: Array<{
    date: string;
    portfolioValue: number;
    returns: number;
    cumulativeReturns: number;
  }>;
  var95: number;
  var99: number;
  es95: number;
  es99: number;
}

export default function VaRChart({ data, var95, var99, es95, es99 }: VaRChartProps) {
  // Generate P&L distribution data for histogram
  const returns = data.map(d => d.returns).filter(r => !isNaN(r));
  const sortedReturns = [...returns].sort((a, b) => a - b);
  
  // Create histogram bins
  const binCount = 25;
  const minReturn = Math.min(...sortedReturns);
  const maxReturn = Math.max(...sortedReturns);
  const binWidth = (maxReturn - minReturn) / binCount;
  
  const histogram = Array.from({ length: binCount }, (_, i) => {
    const binStart = minReturn + i * binWidth;
    const binEnd = binStart + binWidth;
    const count = sortedReturns.filter(r => r >= binStart && r < binEnd).length;
    
    return {
      binStart: binStart * 100, // Convert to percentage
      binEnd: binEnd * 100,
      binCenter: (binStart + binWidth / 2) * 100,
      count,
      frequency: (count / returns.length) * 100 // Convert to percentage
    };
  });

  // Calculate VaR and ES as percentages for current portfolio value
  const currentValue = data[data.length - 1]?.portfolioValue || 10000;
  const var95Pct = -(var95 / currentValue) * 100;
  const var99Pct = -(var99 / currentValue) * 100;
  const es95Pct = -(es95 / currentValue) * 100;
  const es99Pct = -(es99 / currentValue) * 100;

  return (
    <div className="space-y-6">
      {/* P&L Histogram with VaR and ES */}
      <div className="h-96">
        <h4 className="text-lg font-semibold mb-4">Histogram P&L z VaR i Expected Shortfall</h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={histogram} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="binCenter"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value.toFixed(1)}%`}
              label={{ value: 'Zwroty (%)', position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value.toFixed(1)}%`}
              label={{ value: 'Częstość (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(2)}%`, 'Częstość']}
              labelFormatter={(value: number) => `Zwrot: ${value.toFixed(1)}%`}
            />
            <Legend />
            
            {/* Histogram bars */}
            <Bar
              dataKey="frequency"
              fill="#60a5fa"
              fillOpacity={0.7}
              name="Rozkład zwrotów"
            />
            
            {/* VaR 95% line */}
            <ReferenceLine 
              x={var95Pct} 
              stroke="#f59e0b" 
              strokeWidth={3}
              strokeDasharray="5 5"
              label="VaR 95%"
            />
            
            {/* VaR 99% line */}
            <ReferenceLine 
              x={var99Pct} 
              stroke="#ef4444" 
              strokeWidth={3}
              strokeDasharray="5 5"
              label="VaR 99%"
            />
            
            {/* ES 95% line */}
            <ReferenceLine 
              x={es95Pct} 
              stroke="#f97316" 
              strokeWidth={2}
              strokeDasharray="8 2"
              label="ES 95%"
            />
            
            {/* ES 99% line */}
            <ReferenceLine 
              x={es99Pct} 
              stroke="#dc2626" 
              strokeWidth={2}
              strokeDasharray="8 2"
              label="ES 99%"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend for risk metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-amber-500 relative">
            <div className="absolute inset-0 bg-amber-500" style={{ clipPath: 'polygon(0 25%, 100% 25%, 100% 75%, 0 75%)' }}></div>
          </div>
          <span className="text-sm font-medium">VaR 95%: {Math.abs(var95Pct).toFixed(1)}%</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-red-500 relative">
            <div className="absolute inset-0 bg-red-500" style={{ clipPath: 'polygon(0 25%, 100% 25%, 100% 75%, 0 75%)' }}></div>
          </div>
          <span className="text-sm font-medium">VaR 99%: {Math.abs(var99Pct).toFixed(1)}%</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 border-t-2 border-orange-500 border-dashed"></div>
          <span className="text-sm font-medium">ES 95%: {Math.abs(es95Pct).toFixed(1)}%</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 border-t-2 border-red-600 border-dashed"></div>
          <span className="text-sm font-medium">ES 99%: {Math.abs(es99Pct).toFixed(1)}%</span>
        </div>
      </div>

      {/* Risk Interpretation */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Interpretacja:</h5>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• <strong>VaR 95%:</strong> Prawdopodobieństwo straty większej niż {Math.abs(var95Pct).toFixed(1)}% wynosi 5%</li>
          <li>• <strong>VaR 99%:</strong> Prawdopodobieństwo straty większej niż {Math.abs(var99Pct).toFixed(1)}% wynosi 1%</li>
          <li>• <strong>ES:</strong> Oczekiwana strata w najgorszych scenariuszach (tail risk)</li>
        </ul>
      </div>
    </div>
  );
}