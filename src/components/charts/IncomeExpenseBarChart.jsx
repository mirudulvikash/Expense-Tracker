import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '../ui/Card';

export const IncomeExpenseBarChart = ({ data }) => {
  return (
    <Card className="bg-[#1a1a1a] border-[#262626] h-full flex flex-col p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white tracking-tight">Income vs Expense</h3>
        <p className="text-sm text-[#A3A3A3]">Monthly comparison</p>
      </div>
      <div className="flex-1 w-full min-h-[300px] relative">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#A3A3A3" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              padding={{ left: 10, right: 10 }}
            />
            <YAxis 
              stroke="#A3A3A3" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#000', borderColor: '#262626', borderRadius: '12px', color: '#fff' }}
              itemStyle={{ fontWeight: 'bold' }}
              labelStyle={{ color: '#A3A3A3', marginBottom: '8px' }}
              cursor={{ fill: '#262626', opacity: 0.4 }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
            <Bar dataKey="income" name="Income" fill="#22C55E" radius={[4, 4, 0, 0]} maxBarSize={40} animationDuration={1500} />
            <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={40} animationDuration={1500} />
          </BarChart>
        </ResponsiveContainer>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
             <p className="text-[#A3A3A3]">No data for selected period</p>
          </div>
        )}
      </div>
    </Card>
  );
};
