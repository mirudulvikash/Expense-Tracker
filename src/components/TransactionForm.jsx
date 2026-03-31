import React, { useState, useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { v4 as uuidv4 } from 'uuid';
import { Card } from './ui/Card';
import { Input, Label } from './ui/Input';
import { Button } from './ui/Button';
import { PlusCircle, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export const TransactionForm = () => {
  const { addTransaction } = useContext(GlobalContext);

  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');

  const categories = {
    income: ['Salary', 'Freelance', 'Investments', 'Gift', 'Other'],
    expense: ['Food', 'Housing', 'Transportation', 'Utilities', 'Shopping', 'Entertainment', 'Healthcare', 'Bills', 'Other']
  };

  const onSubmit = e => {
    e.preventDefault();
    if (!text || !amount || !category) return;

    const newTransaction = {
      id: uuidv4(),
      text,
      amount: type === 'expense' ? -Math.abs(Number(amount)) : Math.abs(Number(amount)),
      type,
      category,
      date: new Date().toISOString()
    };

    addTransaction(newTransaction);
    setText('');
    setAmount('');
    setCategory('');
  }

  return (
    <Card className="flex flex-col h-full !py-6 pb-2 min-h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-medium text-[#A3A3A3]">Add Transaction</h3>
        <button className="w-8 h-8 rounded-full bg-[#262626] flex items-center justify-center text-[#A3A3A3] hover:text-white transition-colors">
          <PlusCircle size={16} />
        </button>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-5 flex-1 mt-2">
        
        <div className="flex gap-2 bg-[#1A1A1A] p-1 rounded-full text-sm font-medium w-fit">
          <button
            type="button"
            className={`flex items-center gap-2 px-5 py-2 rounded-full transition shadow-sm ${type === 'expense' ? 'bg-[#EF4444] text-white' : 'text-[#A3A3A3] hover:text-white'}`}
            onClick={() => { setType('expense'); setCategory(''); }}
          >
            <ArrowDownLeft size={16} /> Expense
          </button>
          <button
            type="button"
            className={`flex items-center gap-2 px-5 py-2 rounded-full transition shadow-sm ${type === 'income' ? 'bg-[#22C55E] text-white' : 'text-[#A3A3A3] hover:text-white'}`}
            onClick={() => { setType('income'); setCategory(''); }}
          >
            <ArrowUpRight size={16} /> Income
          </button>
        </div>

        <div className="space-y-2 mt-2">
          <Label htmlFor="text" className="text-[#E5E5E5]">Title / Description</Label>
          <Input id="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. Groceries" required className="bg-black border-[#262626] text-white focus:ring-[#FACC15] h-12 rounded-xl" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount" className="text-[#E5E5E5]">Amount (₹)</Label>
          <Input id="amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required className="bg-black border-[#262626] text-white focus:ring-[#FACC15] h-12 rounded-xl" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="text-[#E5E5E5]">Category</Label>
          <select 
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="flex h-12 w-full rounded-xl border border-[#262626] bg-black px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FACC15] transition-colors"
          >
            <option value="" disabled>Select category</option>
            {categories[type].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex-1"></div>
        <Button type="submit" className="w-full mt-4 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold h-12 rounded-xl shadow-[0_4px_14px_0_rgba(250,204,21,0.2)]">
          <PlusCircle size={18} className="mr-2 inline" /> Add {type === 'expense' ? 'Expense' : 'Income'}
        </Button>
      </form>
    </Card>
  );
};
