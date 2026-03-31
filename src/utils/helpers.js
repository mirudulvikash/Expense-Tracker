export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const exportToCSV = (transactions) => {
  if (transactions.length === 0) return;
  const headers = ['Date', 'Category', 'Type', 'Amount', 'Description'];
  const rows = transactions.map(t => [
    new Date(t.date).toLocaleDateString(),
    t.category,
    t.type,
    t.amount,
    t.text
  ]);

  const csvContent = "data:text/csv;charset=utf-8," 
    + headers.join(',') + "\n"
    + rows.map(e => e.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "transactions_backup.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getCategoryDistribution = (transactions) => {
  const expenses = transactions.filter(t => t.type === 'expense');
  const dataMap = expenses.reduce((acc, current) => {
    acc[current.category] = (acc[current.category] || 0) + Math.abs(current.amount);
    return acc;
  }, {});
  
  return Object.keys(dataMap).map((key) => ({
    name: key,
    value: dataMap[key]
  }));
};

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
