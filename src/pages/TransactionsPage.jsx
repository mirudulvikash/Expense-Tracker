import React from 'react';
import { TransactionList } from '../components/TransactionList';

export const TransactionsPage = () => {
  return (
    <div className="animate-in fade-in duration-500 pb-12 h-screen flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">All Transactions</h1>
        <p className="text-slate-400">Manage and export your financial history</p>
      </div>
      
      <div className="flex-1">
        <TransactionList />
      </div>
    </div>
  );
};
