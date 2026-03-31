import React, { useState, useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { Eye, EyeOff } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';
import { Link, useNavigate } from 'react-router-dom';

export const Signup = () => {
  const { updateUserProfile, userProfile } = useContext(GlobalContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isFormValid = firstName && lastName && email && password && confirmPassword;

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (isFormValid) {
      updateUserProfile({
        ...userProfile,
        firstName,
        lastName,
        email,
        avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=EAB308&color=000&size=150`
      });
      // Save for auth flow
      localStorage.setItem('user', JSON.stringify({ firstName, lastName, email, password }));
      // Redirect to login after successful signup
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 -mt-[88px] animate-in fade-in duration-700">
      <Card className="w-full max-w-md bg-[#1a1a1a] shadow-[0_0_40px_rgba(250,204,21,0.05)] border border-[#262626]">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#FACC15] rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Create Account</h2>
          <p className="text-[#A3A3A3]">Join ExpenseFlow to start tracking</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="firstName" className="text-[#E5E5E5] font-medium">First Name</Label>
              <Input 
                id="firstName" 
                type="text" 
                placeholder="John" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-black border-[#262626] text-white focus:ring-[#FACC15] h-12 rounded-xl px-4 w-full"
                required 
              />
            </div>
            <div className="space-y-2 flex-1">
              <Label htmlFor="lastName" className="text-[#E5E5E5] font-medium">Last Name</Label>
              <Input 
                id="lastName" 
                type="text" 
                placeholder="Doe" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-black border-[#262626] text-white focus:ring-[#FACC15] h-12 rounded-xl px-4 w-full"
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#E5E5E5] font-medium">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black border-[#262626] text-white focus:ring-[#FACC15] h-12 rounded-xl px-4 w-full"
              required 
            />
          </div>

          <div className="grid grid-cols-1 gap-5">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#E5E5E5] font-medium">Password</Label>
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[#E5E5E5] font-medium">Confirm Password</Label>
              <div className="relative">
                <Input 
                  id="confirmPassword" 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-black border-[#262626] text-white focus:ring-[#FACC15] h-12 rounded-xl px-4 pr-12 w-full"
                  required 
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A3A3A3] hover:text-white transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <Button 
            type="submit" 
            disabled={!isFormValid}
            className="w-full h-12 mt-4 bg-[#FACC15] hover:bg-[#EAB308] disabled:opacity-50 disabled:hover:bg-[#FACC15] text-black font-bold text-lg rounded-xl shadow-[0_4px_14px_0_rgba(250,204,21,0.2)] hover:shadow-[0_6px_20px_0_rgba(250,204,21,0.3)] transition-all"
          >
            Sign Up
          </Button>

          <p className="text-center text-sm text-[#A3A3A3] mt-6">
            Already have an account? <Link to="/login" className="text-white hover:text-[#FACC15] font-medium transition-colors">Sign in</Link>
          </p>
        </form>
      </Card>
    </div>
  );
};
