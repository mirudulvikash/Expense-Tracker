import React, { useContext, useMemo } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { Card } from './ui/Card';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpRight } from 'lucide-react';
import { getCategoryDistribution } from '../utils/helpers';

export const BudgetBarChart = () => {
  const data = [
    { name: 'Jan', val1: 4000, val2: 2400 },
    { name: 'Feb', val1: 3000, val2: 1398 },
    { name: 'Mar', val1: 2000, val2: 9800 },
    { name: 'Apr', val1: 2780, val2: 3908 },
    { name: 'May', val1: 1890, val2: 4800 },
    { name: 'Jun', val1: 2390, val2: 3800 },
  ];

  return (
    <Card className="h-full flex flex-col pt-6 pb-2 px-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-medium text-white">Budget</h3>
        <div className="flex items-center gap-2">
          <span className="text-[#A3A3A3] text-sm hidden sm:inline-block">Monthly</span>
          <button className="w-8 h-8 rounded-full bg-[#262626] flex items-center justify-center text-[#A3A3A3] hover:text-white transition-colors">
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={28} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#A3A3A3', fontSize: 12 }} dy={10} />
            <Tooltip cursor={{fill: '#262626'}} contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333' }} />
            <Bar dataKey="val1" stackId="a" fill="#FACC15" radius={[0, 0, 4, 4]} />
            <Bar dataKey="val2" stackId="a" fill="#FEF08A" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export const TopSpendingChart = () => {
  const { transactions } = useContext(GlobalContext);

  const data = useMemo(() => {
    let dist = getCategoryDistribution(transactions);
    // filter to top 4 for the UI
    dist.sort((a,b) => b.value - a.value);
    return dist.slice(0, 4);
  }, [transactions]);
  
  const totalExpenses = data.reduce((acc, item) => acc + item.value, 0);
  const highestPercentage = totalExpenses > 0 && data.length > 0 ? Math.round((data[0].value / totalExpenses) * 100) : 0;
  
  const COLORS = ['#22C55E', '#3B82F6', '#F97316', '#EAB308'];

  return (
    <Card className="flex flex-col h-full !py-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-medium text-[#A3A3A3]">Top Spending</h3>
        <button className="w-8 h-8 rounded-full bg-[#262626] flex items-center justify-center text-[#A3A3A3] hover:text-white transition-colors">
          <ArrowUpRight size={16} />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col justify-center gap-6 relative">
        <div className="h-32 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={60}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-white tracking-tight">{highestPercentage}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-2 px-4">
          {data.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
              <span className="text-xs text-[#A3A3A3] truncate pr-2">{entry.name}</span>
            </div>
          ))}
          {data.length === 0 && <span className="text-xs text-[#A3A3A3] col-span-2 text-center">No expenses recorded</span>}
        </div>
      </div>
    </Card>
  );
};
