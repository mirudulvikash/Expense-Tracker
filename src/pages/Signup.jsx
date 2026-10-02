import React, { useState, useContext } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';
import { Link, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';

export const Signup = () => {
  const { signupUser } = useContext(GlobalContext);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isFormValid = name && email && password && confirmPassword;

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (isFormValid) {
      setLoading(true);
      const res = await signupUser({ name, email, password });
      setLoading(false);

      if (res.success) {
        setStep(2);
      } else {
        setError(res.error || 'Failed to create account.');
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        alert('Account verified successfully! Please sign in.');
        navigate('/login');
      } else {
        setError(data.error || 'Failed to verify OTP');
      }
    } catch (err) {
      setLoading(false);
      setError('Network error');
    }
  };

  return (
    <div 
      className="bg-cover bg-center bg-no-repeat relative min-h-screen flex items-center justify-center p-6 animate-in fade-in duration-700"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1616077168079-7e84a4c65f88?q=80&w=1920&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black/70"></div>
      <Card className="w-full max-w-md bg-[#1a1a1a]/95 backdrop-blur-md shadow-[0_0_40px_rgba(250,204,21,0.1)] border border-[#262626] relative z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#FACC15] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(250,204,21,0.3)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
            {step === 1 ? 'Create Account' : 'Verify Email'}
          </h2>
          <p className="text-[#A3A3A3]">
            {step === 1 ? 'Join ExpenseFlow to start tracking' : 'Enter the OTP sent to your email'}
          </p>
        </div>

        {step === 1 ? (
        <form onSubmit={handleSignup} className="space-y-4" autoComplete="off">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#E5E5E5] font-medium">Full Name</Label>
            <Input 
              id="name" 
              type="text" 
              placeholder="John Doe" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
              className="bg-black/80 border-[#262626] text-white focus:ring-[#FACC15] h-12 rounded-xl px-4"
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#E5E5E5] font-medium">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="john.doe@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              className="bg-black/80 border-[#262626] text-white focus:ring-[#FACC15] h-12 rounded-xl px-4"
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#E5E5E5] font-medium">Password</Label>
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="bg-black/80 border-[#262626] text-white focus:ring-[#FACC15] h-12 rounded-xl px-4 pr-12 w-full"
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
                autoComplete="new-password"
                className="bg-black/80 border-[#262626] text-white focus:ring-[#FACC15] h-12 rounded-xl px-4 pr-12 w-full"
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

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <Button 
            type="submit" 
            disabled={!isFormValid || loading}
            className="w-full h-12 mt-4 bg-[#FACC15] hover:bg-[#EAB308] disabled:opacity-50 disabled:hover:bg-[#FACC15] text-black font-bold text-lg rounded-xl shadow-[0_4px_14px_0_rgba(250,204,21,0.2)] hover:shadow-[0_6px_20px_0_rgba(250,204,21,0.3)] transition-all"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>

          <p className="text-center text-sm text-[#A3A3A3] mt-6">
            Already have an account? <Link to="/login" className="text-white hover:text-[#FACC15] font-medium transition-colors">Sign in</Link>
          </p>
        </form>
        ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4" autoComplete="off">
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-[#E5E5E5] font-medium">One-Time Password</Label>
            <Input 
              id="otp" 
              type="text" 
              placeholder="123456" 
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              autoComplete="off"
              className="bg-black/80 border-[#262626] text-white focus:ring-[#FACC15] h-12 rounded-xl px-4 text-center tracking-widest text-lg"
              required 
              maxLength={6}
            />
          </div>
          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
          <Button 
            type="submit" 
            disabled={!otp || loading}
            className="w-full h-12 mt-4 bg-[#FACC15] hover:bg-[#EAB308] disabled:opacity-50 disabled:hover:bg-[#FACC15] text-black font-bold text-lg rounded-xl shadow-[0_4px_14px_0_rgba(250,204,21,0.2)] hover:shadow-[0_6px_20px_0_rgba(250,204,21,0.3)] transition-all"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Button>
        </form>
        )}
      </Card>
    </div>
  );
};
