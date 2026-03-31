import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const LandingPage = () => {
  return (
    <div className="min-h-[80vh] flex flex-col md:flex-row items-center justify-between gap-12 animate-in fade-in duration-700">
      <div className="flex-1 space-y-8 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a1a1a] border border-[#262626] text-sm text-[#FACC15] font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FACC15] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FACC15]"></span>
          </span>
          The Ultimate Expense Flow
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
          Master Your <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FACC15] to-[#EAB308]">Finances.</span>
        </h1>
        <p className="text-xl text-[#A3A3A3] max-w-lg leading-relaxed">
          Track expenses, manage your wealth, and achieve your financial goals with premium insights and neo-brutalist simplicity.
        </p>
        <div className="flex items-center gap-4 pt-4">
          <Link to="/login">
            <Button className="h-14 px-8 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold text-lg rounded-xl shadow-[0_4px_14px_0_rgba(250,204,21,0.2)] hover:shadow-[0_6px_20px_0_rgba(250,204,21,0.3)] transition-all">
              Sign In
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="h-14 px-8 bg-[#1a1a1a] hover:bg-[#262626] text-white font-bold text-lg rounded-xl border border-[#262626] hover:border-[#FACC15] transition-all">
              Create Account
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex-1 w-full max-w-xl relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#FACC15] to-[#EAB308] rounded-2xl blur opacity-20 animate-pulse"></div>
        <div className="relative rounded-2xl overflow-hidden border border-[#262626] shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop" 
            alt="Finance Presentation" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
