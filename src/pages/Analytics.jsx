import React, { useState, useContext, useMemo } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { Card } from '../components/ui/Card';
import { TrendLineChart } from '../components/charts/TrendLineChart';
import { CategoryDonutChart } from '../components/charts/CategoryDonutChart';
import { IncomeExpenseBarChart } from '../components/charts/IncomeExpenseBarChart';
import { Calendar, Filter, BrainCircuit, TrendingUp, TrendingDown, Wallet, Activity } from 'lucide-react';
import { subDays, subMonths, isAfter, format, parseISO, startOfMonth, startOfWeek, endOfMonth } from 'date-fns';

export const Analytics = () => {
  const { transactions } = useContext(GlobalContext);

  const [dateRange, setDateRange] = useState('30d');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Available categories for dropdown
  const allCategories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.category));
    return Array.from(cats);
  }, [transactions]);

  // Derived filtered transactions based on active filters
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];
    const now = new Date();

    // 1. Date filter
    if (dateRange !== 'all') {
      let thresholdDate;
      if (dateRange === '7d') thresholdDate = subDays(now, 7);
      else if (dateRange === '30d') thresholdDate = subDays(now, 30);
      else if (dateRange === '6m') thresholdDate = subMonths(now, 6);
      
      if (thresholdDate) {
        filtered = filtered.filter(t => isAfter(new Date(t.date), thresholdDate));
      }
    }

    // 2. Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === typeFilter);
    }

    // 3. Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }

    return filtered;
  }, [transactions, dateRange, typeFilter, categoryFilter]);

  // Insights & Aggregations
  const { 
    totalIncome, 
    totalExpense, 
    savingsRate, 
    categoryData, 
    trendData, 
    barData,
    highestCategory,
    lowestCategory,
    averageDailyExpense
  } = useMemo(() => {
    let income = 0;
    let expense = 0;
    const catMap = {};
    const trendMap = {};
    const monthMap = {};

    filteredTransactions.forEach(t => {
      if (t.type === 'income') {
        income += t.amount;
      } else {
        const absAmount = Math.abs(t.amount);
        expense += absAmount;
        catMap[t.category] = (catMap[t.category] || 0) + absAmount;
      }

      // Format based on span
      const dateObj = new Date(t.date);
      const dayKey = format(dateObj, 'MMM dd');
      const monthKey = format(dateObj, 'MMM yyyy');

      // For TrendLineChart (Daily expenses)
      if (t.type === 'expense') {
        trendMap[dayKey] = (trendMap[dayKey] || 0) + Math.abs(t.amount);
      }

      // For BarChart (Monthly Comparison)
      if (!monthMap[monthKey]) monthMap[monthKey] = { income: 0, expense: 0 };
      if (t.type === 'income') monthMap[monthKey].income += t.amount;
      else monthMap[monthKey].expense += Math.abs(t.amount);
    });

    const savings = income - expense;
    const sRate = income > 0 ? ((savings / income) * 100).toFixed(1) : 0;

    // Convert Object Maps to Arrays for Recharts
    const catArray = Object.keys(catMap).map(k => ({ name: k, value: catMap[k] })).sort((a, b) => b.value - a.value);
    
    // Sort Date strings natively using parseISO might be tricky due to formatting, but assuming chronological insert 
    // or sorting by actual date if possible. We assume the map iteration retains acceptable chronological order of grouped string keys for now.
    const trendArray = Object.keys(trendMap).map(k => ({ date: k, amount: trendMap[k] }));
    const barArray = Object.keys(monthMap).map(k => ({ name: k, ...monthMap[k] }));

    // Insights logic
    const highestCat = catArray.length > 0 ? catArray[0].name : 'N/A';
    const lowestCat = catArray.length > 0 ? catArray[catArray.length - 1].name : 'N/A';
    
    let daysDiff = 30;
    if (dateRange === '7d') daysDiff = 7;
    if (dateRange === '6m') daysDiff = 180;
    if (dateRange === 'all') daysDiff = 365; // approximation

    const avgDaily = (expense / daysDiff).toFixed(2);

    return {
      totalIncome: income,
      totalExpense: expense,
      savingsRate: sRate,
      categoryData: catArray,
      trendData: trendArray,
      barData: barArray,
      highestCategory: highestCat,
      lowestCategory: lowestCat,
      averageDailyExpense: avgDaily
    };
  }, [filteredTransactions, dateRange]);

  // Smart Insight AI Message Generator (mocked based on actual data)
  const generateInsightMessage = () => {
    if (filteredTransactions.length === 0) return "Not enough data to generate insights.";
    
    if (savingsRate > 20) {
      return `Awesome! You are saving ${savingsRate}% of your income. Keep up the solid financial habits!`;
    } else if (highestCategory !== 'N/A' && totalExpense > 0) {
      return `Attention! A significant portion of your budget was spent on ${highestCategory}. Consider reviewing these expenses.`;
    } else if (savingsRate < 0) {
      return `Warning! Your expenses currently exceed your income. Time to tighten the belt.`;
    }
    return "Your spending seems stable, but always look for ways to optimize your budget.";
  };

  return (
    <div className="animate-in fade-in duration-500 pb-12 h-full flex flex-col space-y-8">
      
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Activity className="text-[#FACC15]" /> Analytics 
          </h1>
          <p className="text-[#A3A3A3] mt-1">Deep dive into your financial metrics</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-[#1a1a1a] p-2 rounded-2xl border border-[#262626]">
          {/* Date Range Dropdown */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black rounded-xl border border-[#262626]">
            <Calendar size={16} className="text-[#A3A3A3]" />
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent text-sm text-white focus:outline-none cursor-pointer"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="6m">Last 6 Months</option>
              <option value="all">All Time</option>
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black rounded-xl border border-[#262626]">
            <Filter size={16} className="text-[#A3A3A3]" />
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-sm text-white focus:outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {allCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Type Toggles */}
          <div className="flex bg-black rounded-xl p-1 border border-[#262626]">
            {['all', 'income', 'expense'].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all ${
                  typeFilter === t 
                    ? 'bg-[#262626] text-[#FACC15]' 
                    : 'text-[#A3A3A3] hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Insights Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-[#1a1a1a] border-[#262626] p-4 flex flex-col justify-between hover:border-[#FACC15]/30 transition-colors">
          <p className="text-xs text-[#A3A3A3] font-medium uppercase mb-1">Highest Spends</p>
          <div className="flex items-end justify-between">
            <h4 className="text-xl font-bold text-white truncate max-w-[120px]">{highestCategory}</h4>
            <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500"><TrendingUp size={16} /></div>
          </div>
        </Card>
        
        <Card className="bg-[#1a1a1a] border-[#262626] p-4 flex flex-col justify-between hover:border-[#FACC15]/30 transition-colors">
          <p className="text-xs text-[#A3A3A3] font-medium uppercase mb-1">Lowest Spends</p>
          <div className="flex items-end justify-between">
            <h4 className="text-xl font-bold text-white truncate max-w-[120px]">{lowestCategory}</h4>
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500"><TrendingDown size={16} /></div>
          </div>
        </Card>

        <Card className="bg-[#1a1a1a] border-[#262626] p-4 flex flex-col justify-between hover:border-[#FACC15]/30 transition-colors">
          <p className="text-xs text-[#A3A3A3] font-medium uppercase mb-1">Avg Daily Exp</p>
          <div className="flex items-end justify-between">
            <h4 className="text-xl font-bold text-white">₹{averageDailyExpense}</h4>
            <div className="w-8 h-8 rounded-full bg-[#262626] flex items-center justify-center text-[#A3A3A3]"><Calendar size={16} /></div>
          </div>
        </Card>

        <Card className="bg-[#1a1a1a] border-[#262626] p-4 flex flex-col justify-between hover:border-[#FACC15]/30 transition-colors">
           <p className="text-xs text-[#A3A3A3] font-medium uppercase mb-1">Savings Rate</p>
           <div className="flex items-end justify-between">
             <h4 className="text-xl font-bold text-white">{savingsRate}%</h4>
             <div className="w-8 h-8 rounded-full bg-[#FACC15]/10 flex items-center justify-center text-[#FACC15]"><Wallet size={16} /></div>
           </div>
        </Card>
      </div>

      {/* Smart Insight AI Message */}
      <div className="relative overflow-hidden rounded-2xl bg-[#FACC15]/10 border border-[#FACC15]/20 p-5 flex items-start gap-4 shadow-[0_0_30px_rgba(250,204,21,0.05)] w-full">
         <div className="absolute top-0 left-0 w-1 h-full bg-[#FACC15]"></div>
         <div className="w-10 h-10 rounded-full bg-[#FACC15]/20 flex items-center justify-center text-[#FACC15] shrink-0">
           <BrainCircuit size={20} className="animate-pulse" />
         </div>
         <div className="flex-1">
           <h4 className="text-[#FACC15] font-semibold text-sm mb-1 tracking-wide">SMART INSIGHTS</h4>
           <p className="text-white md:text-lg">{generateInsightMessage()}</p>
         </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <TrendLineChart data={trendData} />
        </div>
        <div className="lg:col-span-1">
          <CategoryDonutChart data={categoryData} />
        </div>
        <div className="lg:col-span-1">
          <IncomeExpenseBarChart data={barData} />
        </div>
      </div>

    </div>
  );
};
