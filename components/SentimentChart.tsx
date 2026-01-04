import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface SentimentChartProps {
  score: number; // 0 to 100
}

export const SentimentChart: React.FC<SentimentChartProps> = ({ score }) => {
  const data = [
    { name: 'Positive', value: score },
    { name: 'Negative', value: 100 - score },
  ];

  const COLORS = ['#0d9488', '#e2e8f0']; // Teal-600 and Slate-200

  return (
    <div className="h-16 w-16 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={15}
            outerRadius={25}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', fontSize: '12px', padding: '4px' }}
             itemStyle={{ color: '#000' }}
             formatter={(value: number) => [`${value}%`, '']}
             separator=""
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-teal-800">
        {score}
      </div>
    </div>
  );
};