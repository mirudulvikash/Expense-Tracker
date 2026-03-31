import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { Card } from '../components/ui/Card';
import { BudgetBarChart, TopSpendingChart } from '../components/Charts';
import { TransactionForm } from '../components/TransactionForm';
import { CreditCard } from '../components/CreditCard';
import { TransactionList } from '../components/TransactionList';
import { ArrowUpRight, Building2 } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

export const Dashboard = () => {
  const { transactions, budget } = useContext(GlobalContext);

  const amounts = transactions.map(transaction => transaction.amount);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0);
  const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1);
  const total = income - expense;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
      
      {/* COLUMN 1 */}
      <div className="flex flex-col gap-6">
        {/* Total Balance */}
        <Card className="bg-gradient-to-br from-[#FEF08A] to-[#A3E635] text-black pt-6 px-6 pb-6 shadow-[0_0_40px_rgba(163,230,53,0.15)] relative overflow-hidden h-48 sm:h-56 flex flex-col justify-between">
          <div className="absolute top-4 right-4">
            <button className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white hover:bg-gray-800 transition-colors">
              <ArrowUpRight size={18} />
            </button>
          </div>
          <div>
            <h3 className="text-xl font-medium tracking-tight opacity-80 mb-2">Total Balance</h3>
            <p className="text-4xl lg:text-5xl tracking-tight font-semibold">
              {formatCurrency(total)}
            </p>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2 bg-black rounded-full p-1 pl-3 pr-4 shadow-sm w-max">
               <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-black">
                 <Building2 size={12} />
               </div>
               <span className="text-white text-xs font-medium">+20,0000</span>
             </div>
             
             <div className="absolute bottom-4 right-4">
                <button className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white hover:bg-gray-800 transition-colors mt-auto">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
             </div>
          </div>
        </Card>

        {/* Budget Chart */}
        <div className="flex-1 min-h-[300px]">
          <BudgetBarChart />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-6">
          <Card className="flex flex-col justify-between h-40 pt-4 pb-4 px-5">
            <div className="flex justify-between items-start">
               <div>
                 <h3 className="text-sm font-medium text-white">My Goal</h3>
                 <span className="text-[10px] text-[#FACC15] mt-1 inline-block">50% completed</span>
               </div>
               <button className="w-7 h-7 rounded-full bg-[#262626] flex items-center justify-center text-[#A3A3A3] hover:text-white transition-colors">
                  <ArrowUpRight size={14} />
               </button>
            </div>
            <p className="text-2xl font-semibold tracking-tight text-white mt-auto truncate">
              {formatCurrency(expense)} <span className="opacity-50 text-base font-normal">/ {formatCurrency(budget)}</span>
            </p>
          </Card>
          <Card className="flex flex-col justify-between h-40 pt-4 pb-4 px-5">
             <div className="flex justify-between items-start">
               <div>
                  <h3 className="text-sm font-medium text-white">Savings</h3>
                  <div className="mt-2 inline-flex items-center gap-1 bg-[#FACC15] text-black text-[10px] font-bold px-2 py-0.5 rounded shadow">
                    <span>50% UP</span>
                  </div>
               </div>
               <button className="w-7 h-7 rounded-full bg-[#262626] flex items-center justify-center text-[#A3A3A3] hover:text-white transition-colors">
                  <ArrowUpRight size={14} />
               </button>
            </div>
            <p className="text-2xl font-semibold tracking-tight text-white mt-auto truncate">
              {formatCurrency(total > 0 ? total : 0)}
            </p>
          </Card>
        </div>
      </div>

      {/* COLUMN 2 */}
      <div className="flex flex-col gap-6 ">
        
        {/* Income & Expense */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="flex flex-col justify-center h-[104px] pt-4 pb-4">
             <div className="flex justify-between items-start">
               <h3 className="text-lg text-[#E5E5E5]">Income</h3>
               <button className="w-8 h-8 rounded-full bg-[#262626] flex items-center justify-center text-[#A3A3A3] hover:text-white transition-colors">
                  <ArrowUpRight size={16} />
               </button>
            </div>
            <div className="flex items-end justify-between mt-2">
               <p className="text-2xl lg:text-3xl font-semibold tracking-tight text-white truncate pr-2">
                  {formatCurrency(income)}
               </p>
               <span className="bg-[#FACC15] text-black text-xs font-bold px-2 py-1 rounded-full shadow flex-shrink-0">+10%</span>
            </div>
          </Card>
          <Card className="flex flex-col justify-center h-[104px] pt-4 pb-4">
             <div className="flex justify-between items-start">
               <h3 className="text-lg text-[#E5E5E5]">Expanse</h3>
               <button className="w-8 h-8 rounded-full bg-[#262626] flex items-center justify-center text-[#A3A3A3] hover:text-white transition-colors">
                  <ArrowUpRight size={16} />
               </button>
            </div>
             <div className="flex items-end justify-between mt-2">
               <p className="text-2xl lg:text-3xl font-semibold tracking-tight text-white truncate pr-2">
                  {formatCurrency(expense)}
               </p>
               <span className="bg-[#FACC15] text-black text-xs font-bold px-2 py-1 rounded-full shadow flex-shrink-0">+15%</span>
            </div>
          </Card>
        </div>

        {/* Top Spending Donut Chart */}
        <div className="flex-1 min-h-[300px]">
          <TopSpendingChart />
        </div>

        {/* Transaction Form */}
        <div className="min-h-[300px]">
          <TransactionForm />
        </div>
      </div>

      {/* COLUMN 3 */}
      <div className="flex flex-col gap-6">
        {/* Credit Card Gradient */}
        <CreditCard />
        
        {/* Transactions List */}
        <div className="flex-1 bg-transparent min-h-[400px]">
          <TransactionList />
        </div>
      </div>

    </div>
  );
};
