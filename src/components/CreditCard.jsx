import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { Card } from './ui/Card';
import { formatCurrency } from '../utils/helpers';

export const CreditCard = () => {
  const { userProfile } = useContext(GlobalContext);
  const loanAmount = userProfile?.loanAmount || 0;

  return (
    <Card className="bg-gradient-to-br from-teal-400 to-[#1a1a1a] p-0 overflow-hidden relative h-48 sm:h-56">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1a1a1a]/30 to-[#1a1a1a]/80"></div>
      <div className="relative z-10 p-6 flex flex-col justify-between h-full w-full">
        <div>
          <h3 className="text-xl font-medium text-white mb-1">Loan Amount</h3>
          <p className="text-4xl font-semibold text-white tracking-tight">{formatCurrency(loanAmount)}</p>
        </div>
        
        <div className="flex justify-between items-end mt-4">
          <div className="flex gap-4 text-white/90 text-lg">
            <span>*435</span>
            <span>08/32</span>
          </div>
          <div className="text-3xl font-bold italic text-white tracking-widest">
            LOAN
          </div>
        </div>
      </div>
    </Card>
  );
};
