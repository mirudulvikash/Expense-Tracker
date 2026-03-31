import React, { useContext, useState, useMemo } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { Card } from './ui/Card';
import { ChevronDown, Trash2 } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

export const TransactionList = () => {
  const { transactions, deleteTransaction } = useContext(GlobalContext);
  const [filterType, setFilterType] = useState('all'); // 'all', 'income', 'expense'

  const filteredTransactions = useMemo(() => {
    let result = transactions;
    if (filterType !== 'all') {
      result = result.filter(t => t.type === filterType);
    }
    return result;
  }, [transactions, filterType]);

  return (
    <Card className="flex flex-col h-full !py-6 pb-2 min-h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2 bg-[#1A1A1A] p-1 rounded-full text-sm font-medium">
          <button 
            onClick={() => setFilterType('all')} 
            className={`px-4 py-1.5 rounded-full transition shadow-sm ${filterType === 'all' ? 'bg-[#FACC15] text-black' : 'text-[#A3A3A3] hover:text-white'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilterType('income')}
            className={`px-4 py-1.5 rounded-full transition shadow-sm ${filterType === 'income' ? 'bg-[#FACC15] text-black' : 'text-[#A3A3A3] hover:text-white'}`}
          >
            Income
          </button>
          <button 
            onClick={() => setFilterType('expense')}
            className={`px-4 py-1.5 rounded-full transition shadow-sm ${filterType === 'expense' ? 'bg-[#FACC15] text-black' : 'text-[#A3A3A3] hover:text-white'}`}
          >
            Spending
          </button>
        </div>
        <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black hover:bg-gray-100 transition-colors shadow">
          <ChevronDown size={16} />
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-6 mt-4 overflow-y-auto pr-1">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-[#A3A3A3]">No transactions found.</div>
        ) : (
          filteredTransactions.map(t => (
            <div key={t.id} className="group flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-white"
                >
                  <img src={`https://logo.clearbit.com/${t.text.toLowerCase().split(' ')[0]}.com`} alt={t.text} className="w-6 h-6 object-contain" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = t.text.charAt(0).toUpperCase() }} />
                </div>
                <div>
                  <h4 className="text-[#E5E5E5] font-medium text-lg capitalize">{t.text}</h4>
                  <p className="text-xs text-[#A3A3A3]">{new Date(t.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`font-semibold text-lg ${t.amount < 0 ? 'text-[#EF4444]' : 'text-[#22C55E]'}`}>
                  {t.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(t.amount))}
                </div>
                <button 
                  onClick={() => deleteTransaction(t.id)}
                  className="p-1.5 text-[#A3A3A3] hover:text-red-500 rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
