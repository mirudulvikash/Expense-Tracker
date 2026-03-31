import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';

export const TrendLineChart = ({ data, dataKey = 'amount' }) => {
  return (
    <Card className="bg-[#1a1a1a] border-[#262626] h-full flex flex-col p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white tracking-tight">Spending Trend</h3>
        <p className="text-sm text-[#A3A3A3]">Your expenses over the selected period</p>
      </div>
      <div className="flex-1 w-full min-h-[300px] relative">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FACC15" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#FACC15" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
            <XAxis 
              dataKey="date" 
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
              itemStyle={{ color: '#FACC15', fontWeight: 'bold' }}
              labelStyle={{ color: '#A3A3A3', marginBottom: '8px' }}
              formatter={(value) => [`₹${value}`, 'Expense']}
              cursor={{ stroke: '#262626', strokeWidth: 2 }}
            />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke="#FACC15" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorAmount)" 
              activeDot={{ r: 6, fill: '#000', stroke: '#FACC15', strokeWidth: 2 }}
              animationDuration={1500}
            />
          </AreaChart>
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
