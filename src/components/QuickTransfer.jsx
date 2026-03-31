import React from 'react';
import { Card } from './ui/Card';
import { ArrowUpRight } from 'lucide-react';

export const QuickTransfer = () => {
  const users = [
    { id: 1, name: 'Alex', img: 'https://ui-avatars.com/api/?name=Alex&background=EAB308&color=000' },
    { id: 2, name: 'Sam', img: 'https://ui-avatars.com/api/?name=Sam&background=EC4899&color=fff' },
    { id: 3, name: 'Jordan', img: 'https://ui-avatars.com/api/?name=Jordan&background=3B82F6&color=fff' },
    { id: 4, name: 'Riley', img: 'https://ui-avatars.com/api/?name=Riley&background=10B981&color=fff' },
  ];

  return (
    <Card className="flex flex-col h-full justify-between pb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Quick Transfer</h3>
        <button className="w-8 h-8 rounded-full bg-[#262626] flex items-center justify-center text-[#A3A3A3] hover:text-white transition-colors">
          <ArrowUpRight size={16} />
        </button>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex -space-x-4">
          {users.map(user => (
            <div key={user.id} className="w-12 h-12 rounded-full border-2 border-[#1a1a1a] overflow-hidden">
              <img src={user.img} alt={user.name} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 ml-auto">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        </button>
      </div>
    </Card>
  );
};
