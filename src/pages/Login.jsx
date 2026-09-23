import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';
import { Link, useNavigate } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isFormValid = email && password;

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (isFormValid) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.email === email && user.password === password) {
          navigate('/profile');
          return;
        }
      }
      
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 -mt-[88px] animate-in fade-in duration-700">
      <Card className="w-full max-w-md bg-[#1a1a1a] shadow-[0_0_40px_rgba(250,204,21,0.05)] border border-[#262626]">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#FACC15] rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome Back</h2>
          <p className="text-[#A3A3A3]">Sign in to your ExpenseFlow account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#E5E5E5] font-medium">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black border-[#262626] text-white focus:ring-[#FACC15] h-12 rounded-xl px-4"
              required 
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-[#E5E5E5] font-medium">Password</Label>
              <Link to="#" className="text-xs text-[#FACC15] hover:underline">Forgot password?</Link>
            </div>
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black border-[#262626] text-white focus:ring-[#FACC15] h-12 rounded-xl px-4 pr-12 w-full"
                required 
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A3A3A3] hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <Button 
            type="submit" 
            disabled={!isFormValid}
            className="w-full h-12 mt-4 bg-[#FACC15] hover:bg-[#EAB308] disabled:opacity-50 disabled:hover:bg-[#FACC15] text-black font-bold text-lg rounded-xl shadow-[0_4px_14px_0_rgba(250,204,21,0.2)] hover:shadow-[0_6px_20px_0_rgba(250,204,21,0.3)] transition-all"
          >
            Sign In
          </Button>

          <p className="text-center text-sm text-[#A3A3A3] mt-6">
            Don't have an account? <Link to="/signup" className="text-white hover:text-[#FACC15] font-medium transition-colors">Sign up</Link>
          </p>
        </form>
      </Card>
    </div>
  );
};
