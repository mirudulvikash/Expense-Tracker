import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { GlobalContext, GlobalProvider } from './context/GlobalState';
import { Dashboard } from './pages/Dashboard';
import { TransactionsPage } from './pages/TransactionsPage';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Analytics } from './pages/Analytics';
import { LandingPage } from './pages/LandingPage';
import { Profile } from './pages/Profile';
import { LayoutDashboard, ReceiptText } from 'lucide-react';

const TopNav = () => {
  const location = useLocation();
  const { userProfile } = useContext(GlobalContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const isActive = (path) => location.pathname === path;

  // Don't show topnav on login, signup, or landing page
  if (location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/') return null;

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: <LayoutDashboard size={16} /> },
    { name: 'Analytics', path: '/analytics', icon: <ReceiptText size={16} /> },
    { name: 'Transaction', path: '/transactions', icon: <ReceiptText size={16} /> },
  ];

  return (
    <header className="w-full flex justify-center py-6 px-8 items-center bg-black">
      <div className="flex-1"></div>

      <nav className="flex items-center gap-1 bg-[#1a1a1a] rounded-full p-1.5 px-4 shadow-sm">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all font-medium text-sm
              ${isActive(item.path)
                ? 'bg-[#FACC15] text-black shadow-md font-semibold'
                : 'text-[#A3A3A3] hover:text-white'
              }
            `}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="flex-1 flex justify-end items-center gap-4 relative">
        <div className="relative">
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowMessages(false); }}
            className="w-10 h-10 rounded-full bg-[#1a1a1a] hover:bg-[#262626] flex items-center justify-center text-[#A3A3A3] transition-colors focus:ring-2 focus:ring-[#FACC15] outline-none"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          </button>
          {showNotifications && (
            <div className="absolute top-12 right-0 mt-2 w-64 bg-[#1a1a1a] border border-[#262626] rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <h4 className="text-white font-semibold mb-2 text-sm">Notifications</h4>
              <p className="text-xs text-[#A3A3A3]">You're all caught up! No new notifications right now.</p>
            </div>
          )}
        </div>

        <div className="relative">
          <button 
            onClick={() => { setShowMessages(!showMessages); setShowNotifications(false); }}
            className="w-10 h-10 rounded-full bg-[#1a1a1a] hover:bg-[#262626] flex items-center justify-center text-[#A3A3A3] transition-colors focus:ring-2 focus:ring-[#FACC15] outline-none"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
          </button>
          {showMessages && (
            <div className="absolute top-12 right-0 mt-2 w-64 bg-[#1a1a1a] border border-[#262626] rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <h4 className="text-white font-semibold mb-2 text-sm">Messages</h4>
              <p className="text-xs text-[#A3A3A3]">Your inbox is empty.</p>
            </div>
          )}
        </div>

        <Link to="/profile" className="w-10 h-10 rounded-full bg-brand-500 overflow-hidden ml-2 cursor-pointer border border-[#262626] hover:border-[#FACC15] transition-colors block">
          <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
        </Link>
      </div>
    </header>
  );
};

function App() {
  return (
    <GlobalProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-black text-white font-sans selection:bg-brand-500/30">
          <TopNav />
          <main className="flex-1 p-6 w-full max-w-[1400px] mx-auto">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/payment" element={<div className="text-slate-400">Payment page coming soon...</div>} />
              <Route path="/plan" element={<div className="text-slate-400">Plan page coming soon...</div>} />
              <Route path="/cards" element={<div className="text-slate-400">Cards page coming soon...</div>} />
              <Route path="/settings" element={<div className="text-slate-400">Settings page coming soon...</div>} />
            </Routes>
          </main>
        </div>
      </Router>
    </GlobalProvider>
  );
}

export default App;
