import React, { useContext, useState, useEffect, useRef } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';
import { User, Mail, Shield, Bell, Smartphone, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { budget, setBudget, userProfile, updateUserProfile, deleteAccount, updatePassword } = useContext(GlobalContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const storedUser = JSON.parse(localStorage.getItem('user')) || {};

  const [activeTab, setActiveTab] = useState('personal'); // 'personal', 'security', 'notifications'

  const [localProfile, setLocalProfile] = useState({
    firstName: storedUser.firstName || userProfile?.firstName || '',
    lastName: storedUser.lastName || userProfile?.lastName || '',
    email: storedUser.email || userProfile?.email || '',
    avatar: userProfile?.avatar || userProfile?.avatar_url || '',
    loanAmount: Number(userProfile?.base_loan ?? userProfile?.loanAmount) || 0,
    base_loan: Number(userProfile?.base_loan ?? userProfile?.loanAmount) || 0
  });

  // Security password state
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    if (userProfile) {
      const parsedLoan = Number(userProfile.base_loan ?? userProfile.loanAmount) || 0;
      setLocalProfile(prev => ({
        ...prev,
        firstName: userProfile.firstName || storedUser.firstName || prev.firstName,
        lastName: userProfile.lastName || storedUser.lastName || prev.lastName,
        email: userProfile.email || storedUser.email || prev.email,
        avatar: userProfile.avatar || userProfile.avatar_url || prev.avatar,
        loanAmount: parsedLoan,
        base_loan: parsedLoan
      }));
    }
  }, [userProfile]);

  const handleSave = async (e) => {
    e.preventDefault();
    const loanVal = Number(localProfile.base_loan ?? localProfile.loanAmount ?? 0);
    await updateUserProfile({
      ...localProfile,
      base_loan: loanVal,
      loanAmount: loanVal
    });
    const existingUser = JSON.parse(localStorage.getItem('user')) || {};
    localStorage.setItem('user', JSON.stringify({ 
      ...existingUser, 
      firstName: localProfile.firstName, 
      lastName: localProfile.lastName, 
      email: localProfile.email 
    }));
    alert("Profile settings saved successfully!");
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPassError('');

    if (newPass !== confirmPass) {
      const msg = "New password and confirm password do not match!";
      setPassError(msg);
      alert(msg);
      return;
    }

    setPassLoading(true);
    const res = await updatePassword(currPass, newPass);
    setPassLoading(false);

    if (res.success) {
      setCurrPass('');
      setNewPass('');
      setConfirmPass('');
      alert("Password updated successfully!");
    } else {
      setPassError(res.error || "Failed to update password");
      alert(res.error || "Failed to update password");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to permanently delete your account and all data? This cannot be undone.");
    if (confirmed) {
      const success = await deleteAccount();
      if (success) {
        navigate('/signup');
      } else {
        alert("Failed to delete account. Please try again.");
      }
    }
  };

  const handleStaticSave = (e) => {
    e.preventDefault();
    alert("Preferences updated!");
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === 'loanAmount' || id === 'base_loan') {
      const val = value === '' ? 0 : Number(value);
      setLocalProfile(prev => ({ ...prev, loanAmount: val, base_loan: val }));
    } else {
      setLocalProfile(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalProfile(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-3xl font-bold text-white tracking-tight">Account Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Avatar & Quick Info */}
        <Card className="lg:col-span-1 bg-[#1a1a1a] flex flex-col items-center pt-8 border-[#262626]">
          <div className="relative mb-6">
            <div className="w-28 h-28 rounded-full border-4 border-[#FACC15] overflow-hidden shadow-[0_0_20px_rgba(250,204,21,0.2)] cursor-pointer" onClick={() => fileInputRef.current.click()}>
              <img src={localProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <button 
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-black border border-[#262626] flex items-center justify-center text-[#FACC15] hover:bg-[#262626] transition-colors"
            >
              <User size={14} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">{localProfile.firstName} {localProfile.lastName}</h2>
          <p className="text-[#A3A3A3] text-sm mb-6">{localProfile.email}</p>
          
          <div className="w-full space-y-2 mb-4 flex flex-col">
            <button 
              onClick={() => setActiveTab('personal')}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${activeTab === 'personal' ? 'bg-[#262626] border-[#FACC15]/50 text-white' : 'bg-black border-[#262626] text-[#A3A3A3] hover:text-[#FACC15] hover:border-[#FACC15]/30'}`}
            >
              <User size={16} /> Personal Information
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${activeTab === 'security' ? 'bg-[#262626] border-[#FACC15]/50 text-white' : 'bg-black border-[#262626] text-[#A3A3A3] hover:text-[#FACC15] hover:border-[#FACC15]/30'}`}
            >
              <Shield size={16} /> Security Settings
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${activeTab === 'notifications' ? 'bg-[#262626] border-[#FACC15]/50 text-white' : 'bg-black border-[#262626] text-[#A3A3A3] hover:text-[#FACC15] hover:border-[#FACC15]/30'}`}
            >
              <Bell size={16} /> Notification Preferences
            </button>
          </div>
          
        </Card>

        {/* Right Column: Settings Form */}
        <Card className="lg:col-span-2 bg-[#1a1a1a] border-[#262626]">
          {activeTab === 'personal' && (
            <>
              <h3 className="text-xl font-semibold mb-6 text-white border-b border-[#262626] pb-4">Personal Information</h3>
              
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-[#E5E5E5]">First Name</Label>
                    <Input id="firstName" value={localProfile.firstName} onChange={handleChange} className="bg-black border-[#262626] h-11 rounded-lg focus:ring-[#FACC15]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-[#E5E5E5]">Last Name</Label>
                    <Input id="lastName" value={localProfile.lastName} onChange={handleChange} className="bg-black border-[#262626] h-11 rounded-lg focus:ring-[#FACC15]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#E5E5E5]">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-[#A3A3A3]" />
                    <Input type="email" id="email" value={localProfile.email} onChange={handleChange} className="bg-black border-[#262626] h-11 rounded-lg pl-10 focus:ring-[#FACC15]" />
                  </div>
                  <p className="text-xs text-[#A3A3A3] mt-1">Update your active session email address.</p>
                </div>
                
                <h3 className="text-xl font-semibold mb-2 mt-8 text-white border-b border-[#262626] pb-4">App Preferences</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="budget" className="text-[#E5E5E5] flex items-center justify-between">
                      Current Month Goal
                      <span className="text-xs bg-[#262626] px-2 py-1 rounded-md text-[#FACC15]">₹</span>
                    </Label>
                    <Input 
                      id="budget" 
                      type="number" 
                      value={budget} 
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="bg-black border-[#262626] h-11 rounded-lg focus:ring-[#FACC15]" 
                    />
                    <p className="text-xs text-[#A3A3A3] mt-1">Changing this only affects your goal for the current month.</p>
                  </div>
  
                  <div className="space-y-2">
                    <Label htmlFor="loanAmount" className="text-[#E5E5E5] flex items-center justify-between">
                      Base Loan Amount
                      <span className="text-xs bg-[#262626] px-2 py-1 rounded-md text-[#FACC15]">₹</span>
                    </Label>
                    <Input 
                      id="loanAmount" 
                      type="number" 
                      value={localProfile.base_loan !== undefined ? localProfile.base_loan : 0} 
                      onChange={handleChange}
                      className="bg-black border-[#262626] h-11 rounded-lg focus:ring-[#FACC15]" 
                    />
                    <p className="text-xs text-[#A3A3A3] mt-1">Tracks your current active loan.</p>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" className="bg-[#FACC15] hover:bg-[#EAB308] text-black font-semibold h-11 px-8 rounded-xl shadow-[0_4px_14px_0_rgba(250,204,21,0.2)]">
                    Save Changes
                  </Button>
                </div>
              </form>

              {/* Danger Zone: Delete Account (Exclusive to Personal Information view) */}
              <div className="mt-10 pt-6 border-t border-red-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-red-500 font-semibold text-base flex items-center gap-2">
                    <Trash2 size={16} /> Danger Zone
                  </h4>
                  <p className="text-xs text-[#A3A3A3]">Permanently remove your account, transactions, and budget data.</p>
                </div>
                <Button 
                  type="button" 
                  onClick={handleDeleteAccount} 
                  className="bg-red-600 hover:bg-red-700 text-white font-bold h-11 px-6 rounded-xl shadow-[0_4px_14px_0_rgba(220,38,38,0.3)] transition-all"
                >
                  Delete Account
                </Button>
              </div>
            </>
          )}

          {activeTab === 'security' && (
            <>
              <h3 className="text-xl font-semibold mb-6 text-white border-b border-[#262626] pb-4">Security Settings</h3>
              
              <form onSubmit={handleUpdatePassword} className="space-y-6" autoComplete="off">
                <div className="space-y-2">
                  <Label htmlFor="currPass" className="text-[#E5E5E5]">Current Password</Label>
                  <Input 
                    id="currPass" 
                    type="password" 
                    placeholder="••••••••" 
                    value={currPass}
                    onChange={(e) => setCurrPass(e.target.value)}
                    autoComplete="current-password"
                    className="bg-black border-[#262626] h-11 rounded-lg focus:ring-[#FACC15]" 
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="newPass" className="text-[#E5E5E5]">New Password</Label>
                    <Input 
                      id="newPass" 
                      type="password" 
                      placeholder="••••••••" 
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      autoComplete="new-password"
                      className="bg-black border-[#262626] h-11 rounded-lg focus:ring-[#FACC15]" 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPass" className="text-[#E5E5E5]">Confirm Password</Label>
                    <Input 
                      id="confirmPass" 
                      type="password" 
                      placeholder="••••••••" 
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      autoComplete="new-password"
                      className="bg-black border-[#262626] h-11 rounded-lg focus:ring-[#FACC15]" 
                      required
                    />
                  </div>
                </div>

                {passError && <p className="text-red-500 text-sm font-medium">{passError}</p>}

                <div className="flex items-center gap-4 p-4 mt-6 rounded-xl bg-black border border-[#262626]">
                   <div className="w-10 h-10 rounded-full bg-[#262626] flex items-center justify-center text-[#FACC15]">
                     <Smartphone size={20} />
                   </div>
                   <div className="flex-1">
                     <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                     <p className="text-xs text-[#A3A3A3]">Add an extra layer of security to your account</p>
                   </div>
                   <Button type="button" variant="outline" className="border-[#262626] text-[#A3A3A3] hover:text-white rounded-lg">
                      Enable
                   </Button>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={passLoading}
                    className="bg-[#FACC15] hover:bg-[#EAB308] disabled:opacity-50 text-black font-semibold h-11 px-8 rounded-xl shadow-[0_4px_14px_0_rgba(250,204,21,0.2)]"
                  >
                    {passLoading ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </form>
            </>
          )}

          {activeTab === 'notifications' && (
            <>
              <h3 className="text-xl font-semibold mb-6 text-white border-b border-[#262626] pb-4">Notification Preferences</h3>
              
              <form onSubmit={handleStaticSave} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-black border border-[#262626]">
                     <div>
                       <h4 className="text-white font-medium">Monthly Budget Alerts</h4>
                       <p className="text-xs text-[#A3A3A3]">Get notified when you exceed 80% of your budget</p>
                     </div>
                     <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#FACC15] rounded bg-[#262626] border-none cursor-pointer" />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-xl bg-black border border-[#262626]">
                     <div>
                       <h4 className="text-white font-medium">Weekly Summary Email</h4>
                       <p className="text-xs text-[#A3A3A3]">Receive a beautifully laid out summary every Sunday</p>
                     </div>
                     <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#FACC15] rounded bg-[#262626] border-none cursor-pointer" />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-black border border-[#262626]">
                     <div>
                       <h4 className="text-white font-medium">Suspicious Activity</h4>
                       <p className="text-xs text-[#A3A3A3]">Immediate alerts for unrecognized login IPs</p>
                     </div>
                     <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#FACC15] rounded bg-[#262626] border-none cursor-pointer" />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" className="bg-[#FACC15] hover:bg-[#EAB308] text-black font-semibold h-11 px-8 rounded-xl shadow-[0_4px_14px_0_rgba(250,204,21,0.2)]">
                    Save Preferences
                  </Button>
                </div>
              </form>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};
