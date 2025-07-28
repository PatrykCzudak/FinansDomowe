import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Area, ComposedChart } from 'recharts';

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
  const binCount = 30;
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
      frequency: count / returns.length
    };
  });

  // Calculate VaR and ES as percentages
  const var95Pct = var95 / data[data.length - 1]?.portfolioValue * 100 || 0;
  const var99Pct = var99 / data[data.length - 1]?.portfolioValue * 100 || 0;
  const es95Pct = es95 / data[data.length - 1]?.portfolioValue * 100 || 0;
  const es99Pct = es99 / data[data.length - 1]?.portfolioValue * 100 || 0;

  return (
    <div className="space-y-6">
      {/* Cumulative P&L Chart */}
      <div className="h-80">
        <h4 className="text-lg font-semibold mb-4">Skumulowane Zyski/Straty Portfolio</h4>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString('pl-PL', { month: 'short', day: 'numeric' })}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
            />
            <Tooltip 
              labelFormatter={(value) => `Data: ${new Date(value).toLocaleDateString('pl-PL')}`}
              formatter={([value]: [number]) => [`${(value * 100).toFixed(2)}%`, 'Zwrot']}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="cumulativeReturns" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Skumulowane zwroty"
              dot={false}
            />
            <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="2 2" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* P&L Distribution with VaR and ES */}
      <div className="h-80">
        <h4 className="text-lg font-semibold mb-4">Rozkład Zwrotów z VaR i Expected Shortfall</h4>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={histogram}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="binCenter"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value.toFixed(1)}%`}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
            />
            <Tooltip 
              formatter={([value]: [number]) => [`${(value * 100).toFixed(2)}%`, 'Częstość']}
              labelFormatter={(value) => `Zwrot: ${value.toFixed(1)}%`}
            />
            <Legend />
            
            {/* Histogram bars */}
            <Area
              type="stepAfter"
              dataKey="frequency"
              stroke="#60a5fa"
              fill="#dbeafe"
              fillOpacity={0.6}
              name="Rozkład zwrotów"
            />
            
            {/* VaR 95% line */}
            <ReferenceLine 
              x={-var95Pct} 
              stroke="#f59e0b" 
              strokeWidth={3}
              strokeDasharray="5 5"
              label={{ value: "VaR 95%", position: "top" }}
            />
            
            {/* VaR 99% line */}
            <ReferenceLine 
              x={-var99Pct} 
              stroke="#ef4444" 
              strokeWidth={3}
              strokeDasharray="5 5"
              label={{ value: "VaR 99%", position: "top" }}
            />
            
            {/* ES 95% line */}
            <ReferenceLine 
              x={-es95Pct} 
              stroke="#f97316" 
              strokeWidth={2}
              strokeDasharray="8 2"
              label={{ value: "ES 95%", position: "bottom" }}
            />
            
            {/* ES 99% line */}
            <ReferenceLine 
              x={-es99Pct} 
              stroke="#dc2626" 
              strokeWidth={2}
              strokeDasharray="8 2"
              label={{ value: "ES 99%", position: "bottom" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend for risk metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-1 bg-amber-500" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%, 0 100%, 100% 100%)' }}></div>
          <span className="text-sm font-medium">VaR 95%: -{var95Pct.toFixed(1)}%</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-1 bg-red-500" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%, 0 100%, 100% 100%)' }}></div>
          <span className="text-sm font-medium">VaR 99%: -{var99Pct.toFixed(1)}%</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-1 bg-orange-500" style={{ borderStyle: 'dashed', borderWidth: '1px 0' }}></div>
          <span className="text-sm font-medium">ES 95%: -{es95Pct.toFixed(1)}%</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-1 bg-red-600" style={{ borderStyle: 'dashed', borderWidth: '1px 0' }}></div>
          <span className="text-sm font-medium">ES 99%: -{es99Pct.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}