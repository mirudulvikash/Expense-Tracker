import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  UserCheck, 
  Sparkles, 
  ShieldCheck, 
  BarChart3, 
  ArrowRight, 
  LogIn, 
  Zap, 
  CheckCircle2, 
  CreditCard,
  PieChart
} from 'lucide-react';

export const GuestUser = () => {
  const { loginAsGuest } = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleStartGuest = () => {
    loginAsGuest();
    navigate('/');
  };

  const features = [
    {
      icon: <Zap className="text-[#FACC15]" size={22} />,
      title: "Instant Access, Zero Setup",
      description: "Jump straight into the app without creating an account, email confirmations, or remembering passwords."
    },
    {
      icon: <BarChart3 className="text-[#FACC15]" size={22} />,
      title: "Full Financial Dashboard",
      description: "Interactive visual charts, budget goal progress bars, and spending breakdown by categories."
    },
    {
      icon: <CreditCard className="text-[#FACC15]" size={22} />,
      title: "Transaction Simulator",
      description: "Add sample income and expenses, experiment with categories, and see your balance update in real time."
    },
    {
      icon: <ShieldCheck className="text-[#FACC15]" size={22} />,
      title: "Local Private Sandbox",
      description: "All changes are saved locally to your device's browser storage during your trial exploration."
    }
  ];

  return (
    <div 
      className="bg-cover bg-center bg-no-repeat relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-700"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1616077168079-7e84a4c65f88?q=80&w=1920&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px]"></div>

      <div className="w-full max-w-4xl relative z-10 my-8">
        <Card className="bg-[#141414]/95 backdrop-blur-xl shadow-[0_0_50px_rgba(250,204,21,0.12)] border border-[#262626] p-6 sm:p-10 rounded-2xl">
          
          {/* Header Badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FACC15]/10 border border-[#FACC15]/30 text-[#FACC15] text-xs font-semibold mb-4">
              <Sparkles size={14} />
              <span>Guest Sandbox Experience</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Explore <span className="text-[#FACC15]">ExpenseFlow</span> as Guest
            </h1>
            <p className="text-[#A3A3A3] text-sm sm:text-base max-w-xl mx-auto mt-3">
              Try out all financial analytics, monthly budget trackers, and transaction management features without signing up.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-xl bg-black/60 border border-[#262626] hover:border-[#FACC15]/40 transition-all flex items-start gap-4"
              >
                <div className="p-2.5 rounded-lg bg-[#1f1f1f] border border-[#2f2f2f] shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-base mb-1">{feature.title}</h3>
                  <p className="text-[#A3A3A3] text-xs sm:text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Note Banner */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#FACC15]/5 border border-[#FACC15]/20 text-[#E5E5E5] text-xs sm:text-sm mb-8">
            <CheckCircle2 size={18} className="text-[#FACC15] shrink-0" />
            <span>
              Preloaded with realistic demo income, housing, and grocery data so you can test every chart immediately!
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#262626]">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link 
                to="/login"
                className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-[#A3A3A3] hover:text-white bg-[#1a1a1a] hover:bg-[#262626] border border-[#2e2e2e] rounded-xl transition-all w-full sm:w-auto"
              >
                <LogIn size={16} />
                Back to Sign In
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Button 
                onClick={handleStartGuest}
                className="w-full sm:w-auto h-12 px-8 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold text-base rounded-xl shadow-[0_4px_20px_rgba(250,204,21,0.25)] hover:shadow-[0_6px_25px_rgba(250,204,21,0.35)] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <UserCheck size={18} />
                <span>Launch Dashboard as Guest</span>
                <ArrowRight size={18} />
              </Button>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-xs text-[#737373]">
              Ready to keep permanent records?{' '}
              <Link to="/signup" className="text-white hover:text-[#FACC15] font-semibold transition-colors underline">
                Create a free account
              </Link>
            </p>
          </div>

        </Card>
      </div>
    </div>
  );
};
