import React, { useContext, useMemo } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { Card } from './ui/Card';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpRight } from 'lucide-react';
import { getCategoryDistribution } from '../utils/helpers';

const BudgetTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const expense = payload.find(p => p.dataKey === 'expense')?.value || 0;
  const remaining = payload.find(p => p.dataKey === 'remaining')?.value || 0;
  const exceeded = payload[0]?.payload?.exceeded;
  const goal = payload[0]?.payload?.goal;
  const pct = goal > 0 ? Math.round((expense / goal) * 100) : 0;
  return (
    <div style={{ backgroundColor: '#000', border: `1px solid ${exceeded ? '#EF4444' : '#333'}`, borderRadius: '12px', padding: '12px 16px' }}>
      <p style={{ color: '#A3A3A3', fontSize: '12px', marginBottom: '8px' }}>{label}</p>
      <p style={{ color: exceeded ? '#EF4444' : '#FACC15', fontWeight: 'bold', fontSize: '14px' }}>Spent: ₹{expense.toLocaleString('en-IN')}</p>
      <p style={{ color: '#A3A3A3', fontSize: '13px' }}>Goal: ₹{goal?.toLocaleString('en-IN')}</p>
      {exceeded ? (
        <p style={{ color: '#EF4444', fontSize: '13px', marginTop: '4px', fontWeight: 'bold' }}>⚠ Over by ₹{(expense - goal).toLocaleString('en-IN')}</p>
      ) : (
        <p style={{ color: '#22C55E', fontSize: '13px', marginTop: '4px' }}>{pct}% used · ₹{remaining.toLocaleString('en-IN')} left</p>
      )}
    </div>
  );
};

export const BudgetBarChart = () => {
  const { transactions, budget } = useContext(GlobalContext);

  const data = useMemo(() => {
    const monthMap = {};

    transactions.forEach(t => {
      if (t.type !== 'expense') return;
      const dateObj = new Date(t.date);
      const monthKey = dateObj.toLocaleString('default', { month: 'short' });
      const sortKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth()).padStart(2, '0')}`;

      if (!monthMap[sortKey]) {
        monthMap[sortKey] = { name: monthKey, expense: 0 };
      }
      monthMap[sortKey].expense += Math.abs(t.amount);
    });

    // Sort chronologically, take last 6 months, add remaining budget
    return Object.keys(monthMap)
      .sort()
      .slice(-6)
      .map(key => {
        const spent = monthMap[key].expense;
        const exceeded = spent > budget;
        const remaining = exceeded ? 0 : budget - spent;
        return { ...monthMap[key], remaining, exceeded, goal: budget };
      });
  }, [transactions, budget]);

  return (
    <Card className="h-full flex flex-col pt-6 pb-2 px-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium text-white">Budget</h3>
        <div className="flex items-center gap-2">
          <span className="text-[#A3A3A3] text-sm hidden sm:inline-block">Goal: ₹{budget.toLocaleString('en-IN')}</span>
          <button className="w-8 h-8 rounded-full bg-[#262626] flex items-center justify-center text-[#A3A3A3] hover:text-white transition-colors">
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FACC15]"></div>
          <span className="text-xs text-[#A3A3A3]">Spent</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#3F3F46]"></div>
          <span className="text-xs text-[#A3A3A3]">Remaining</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></div>
          <span className="text-xs text-[#A3A3A3]">Over Budget</span>
        </div>
      </div>
      
      <div className="flex-1 min-h-[200px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={32} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#A3A3A3', fontSize: 12 }} dy={10} />
              <Tooltip content={<BudgetTooltip />} cursor={{fill: 'transparent'}} />
              <Bar dataKey="expense" name="Spent" stackId="budget" radius={[0, 0, 4, 4]} animationDuration={1200}>
                {data.map((entry, index) => (
                  <Cell key={`spent-${index}`} fill={entry.exceeded ? '#EF4444' : '#FACC15'} />
                ))}
              </Bar>
              <Bar dataKey="remaining" name="Remaining" stackId="budget" radius={[4, 4, 0, 0]} animationDuration={1200}>
                {data.map((entry, index) => (
                  <Cell key={`rem-${index}`} fill={entry.exceeded ? '#7F1D1D' : '#3F3F46'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-[#A3A3A3] text-sm">Add expenses to see budget chart</p>
          </div>
        )}
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
