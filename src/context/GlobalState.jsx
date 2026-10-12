import React, { createContext, useReducer, useEffect, useState, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:5000';

// Helper to get current month key (YYYY-MM)
const getCurrentMonthKey = () => new Date().toISOString().slice(0, 7);

// Default mock data for Guest User experience
const DEFAULT_GUEST_TRANSACTIONS = [
  { id: 'guest-tx-1', title: 'Monthly Salary', text: 'Monthly Salary', amount: 65000, type: 'income', category: 'Salary', date: new Date().toISOString().slice(0, 10) },
  { id: 'guest-tx-2', title: 'Apartment Rent', text: 'Apartment Rent', amount: -18000, type: 'expense', category: 'Housing', date: new Date().toISOString().slice(0, 10) },
  { id: 'guest-tx-3', title: 'Grocery Shopping', text: 'Grocery Shopping', amount: -4250, type: 'expense', category: 'Food', date: new Date().toISOString().slice(0, 10) },
  { id: 'guest-tx-4', title: 'Freelance UI Design', text: 'Freelance UI Design', amount: 15000, type: 'income', category: 'Freelance', date: new Date().toISOString().slice(0, 10) },
  { id: 'guest-tx-5', title: 'Electricity & Internet', text: 'Electricity & Internet', amount: -2100, type: 'expense', category: 'Utilities', date: new Date().toISOString().slice(0, 10) },
  { id: 'guest-tx-6', title: 'Dining & Entertainment', text: 'Dining & Entertainment', amount: -1450, type: 'expense', category: 'Entertainment', date: new Date().toISOString().slice(0, 10) }
];

// Helper to normalize transaction object from backend to UI expectations
const formatTransaction = (tx) => {
  const rawDate = tx.date || tx.created_at || new Date().toISOString();
  return {
    ...tx,
    text: tx.text || tx.title || '',
    title: tx.title || tx.text || '',
    amount: Number(tx.amount),
    date: typeof rawDate === 'string' ? rawDate.slice(0, 10) : new Date(rawDate).toISOString().slice(0, 10)
  };
};

// Helper to normalize user profile object
const formatUserProfile = (data) => {
  if (!data) return {
    id: null,
    name: 'Guest User',
    firstName: 'Guest',
    lastName: 'User',
    email: '',
    avatar: 'https://ui-avatars.com/api/?name=Guest+User&background=FACC15&color=000&size=150',
    avatar_url: 'https://ui-avatars.com/api/?name=Guest+User&background=FACC15&color=000&size=150',
    loanAmount: 0,
    base_loan: 0,
    isGuest: false
  };

  const name = data.name || 'User';
  const nameParts = name.trim().split(' ');
  const firstName = data.firstName || nameParts[0] || 'User';
  const lastName = data.lastName || nameParts.slice(1).join(' ') || '';
  const avatar_url = data.avatar_url || data.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FACC15&color=000&size=150`;
  const base_loan = Number(data.base_loan ?? data.loanAmount ?? 0);

  return {
    ...data,
    name,
    firstName,
    lastName,
    email: data.email || '',
    avatar: avatar_url,
    avatar_url,
    loanAmount: base_loan,
    base_loan,
    isGuest: Boolean(data.isGuest)
  };
};

const initialState = {
  transactions: [],
  budgets: {},
  userProfile: formatUserProfile(null)
};

// eslint-disable-next-line react-refresh/only-export-components
export const GlobalContext = createContext(initialState);

// Reducer
const AppReducer = (state, action) => {
  switch(action.type) {
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(transaction => transaction.id !== action.payload)
      };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions]
      };
    case 'SET_BUDGETS':
      return {
        ...state,
        budgets: action.payload
      };
    case 'SET_BUDGET': {
      const monthKey = action.payload.month_year || action.payload.month || getCurrentMonthKey();
      const amount = Number(action.payload.target_amount ?? action.payload.amount);
      return {
        ...state,
        budgets: {
          ...state.budgets,
          [monthKey]: amount
        }
      };
    }
    case 'SET_USER_PROFILE':
      return {
        ...state,
        userProfile: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        transactions: [],
        budgets: {},
        userProfile: formatUserProfile(null)
      };
    default:
      return state;
  }
};

// Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('token') || localStorage.getItem('authToken') || '');
  const [isGuest, setIsGuest] = useState(() => localStorage.getItem('isGuest') === 'true');

  // Helper to fetch user data using a given token or current authToken
  const fetchUserData = useCallback(async (token) => {
    const activeToken = token || authToken;
    if (!activeToken) {
      dispatch({ type: 'LOGOUT' });
      return;
    }

    const headers = {
      'Authorization': `Bearer ${activeToken}`,
      'Content-Type': 'application/json'
    };

    try {
      const [txRes, budgetRes, profileRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/transactions`, { headers }),
        fetch(`${API_BASE_URL}/api/budgets`, { headers }),
        fetch(`${API_BASE_URL}/api/profile`, { headers })
      ]);

      if (txRes.ok) {
        const data = await txRes.json();
        const formatted = data.map(formatTransaction);
        dispatch({ type: 'SET_TRANSACTIONS', payload: formatted });
      } else {
        console.error('Failed to fetch transactions from server:', txRes.statusText);
      }

      if (budgetRes.ok) {
        const budgetData = await budgetRes.json();
        const budgetMap = {};
        budgetData.forEach(item => {
          budgetMap[item.month_year] = Number(item.target_amount);
        });
        dispatch({ type: 'SET_BUDGETS', payload: budgetMap });
      } else {
        console.error('Failed to fetch budgets from server:', budgetRes.statusText);
      }

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        const formattedProfile = formatUserProfile({
          ...profileData,
          base_loan: Number(profileData.base_loan) || 0,
          isGuest: false
        });
        dispatch({ type: 'SET_USER_PROFILE', payload: formattedProfile });
      } else {
        console.error('Failed to fetch user profile from server:', profileRes.statusText);
      }
    } catch (err) {
      console.error('Error in data fetch (transactions/budgets/profile):', err);
    }
  }, [authToken]);

  // Guest login action
  const loginAsGuest = useCallback(() => {
    localStorage.setItem('isGuest', 'true');
    setIsGuest(true);

    let savedTransactions = [];
    try {
      const stored = localStorage.getItem('guest_transactions');
      savedTransactions = stored ? JSON.parse(stored) : DEFAULT_GUEST_TRANSACTIONS;
    } catch {
      savedTransactions = DEFAULT_GUEST_TRANSACTIONS;
    }
    localStorage.setItem('guest_transactions', JSON.stringify(savedTransactions));
    dispatch({ type: 'SET_TRANSACTIONS', payload: savedTransactions.map(formatTransaction) });

    const currentMonthKey = getCurrentMonthKey();
    let savedBudgets = { [currentMonthKey]: 35000 };
    try {
      const storedBudgets = localStorage.getItem('guest_budgets');
      if (storedBudgets) savedBudgets = JSON.parse(storedBudgets);
    } catch {
      // fallback
    }
    dispatch({ type: 'SET_BUDGETS', payload: savedBudgets });

    let savedProfile = {
      id: 'guest',
      name: 'Guest User',
      firstName: 'Guest',
      lastName: 'User',
      email: 'guest@expenseflow.demo',
      avatar: 'https://ui-avatars.com/api/?name=Guest+User&background=FACC15&color=000&size=150',
      avatar_url: 'https://ui-avatars.com/api/?name=Guest+User&background=FACC15&color=000&size=150',
      loanAmount: 25000,
      base_loan: 25000,
      isGuest: true
    };
    try {
      const storedProfile = localStorage.getItem('guest_profile');
      if (storedProfile) savedProfile = { ...savedProfile, ...JSON.parse(storedProfile) };
    } catch {
      // fallback
    }
    dispatch({ type: 'SET_USER_PROFILE', payload: formatUserProfile(savedProfile) });
    return { success: true };
  }, []);

  useEffect(() => {
    if (authToken) {
      fetchUserData(authToken);
    } else if (isGuest) {
      loginAsGuest();
    } else {
      dispatch({ type: 'LOGOUT' });
    }
  }, [authToken, isGuest, fetchUserData, loginAsGuest]);

  // Auth Actions
  async function loginUser(credentials) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to log in' };
      }

      localStorage.removeItem('isGuest');
      setIsGuest(false);
      localStorage.setItem('token', data.token);
      localStorage.setItem('authToken', data.token);
      setAuthToken(data.token);

      if (data.user) {
        dispatch({ type: 'SET_USER_PROFILE', payload: formatUserProfile({ ...data.user, isGuest: false }) });
      }

      fetchUserData(data.token);
      return { success: true, user: data.user };
    } catch (err) {
      console.error('Error in loginUser:', err);
      return { success: false, error: 'Network error or server unreachable' };
    }
  }

  async function signupUser(userData) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to sign up' };
      }

      // Do NOT set authToken or log in immediately - user will be redirected to /login
      return { success: true, user: data.user };
    } catch (err) {
      console.error('Error in signupUser:', err);
      return { success: false, error: 'Network error or server unreachable' };
    }
  }

  function logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('isGuest');
    setIsGuest(false);
    setAuthToken('');
    dispatch({ type: 'LOGOUT' });
  }

  // Data Actions with Guest Support & Authorization header
  async function deleteTransaction(id) {
    if (isGuest) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
      const updated = state.transactions.filter(t => t.id !== id);
      localStorage.setItem('guest_transactions', JSON.stringify(updated));
      return;
    }

    if (!authToken) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        dispatch({ type: 'DELETE_TRANSACTION', payload: id });
      } else {
        console.error('Failed to delete transaction:', res.statusText);
      }
    } catch (err) {
      console.error('Error in deleteTransaction request:', err);
    }
  }

  async function addTransaction(transaction) {
    if (isGuest) {
      const newTx = formatTransaction({
        id: 'guest-tx-' + Date.now(),
        title: transaction.title || transaction.text || 'Expense',
        amount: Number(transaction.amount),
        type: transaction.type,
        category: transaction.category,
        date: transaction.date || new Date().toISOString()
      });
      dispatch({ type: 'ADD_TRANSACTION', payload: newTx });
      const updated = [newTx, ...state.transactions];
      localStorage.setItem('guest_transactions', JSON.stringify(updated));
      return;
    }

    if (!authToken) return;
    try {
      const payload = {
        title: transaction.title || transaction.text,
        amount: Number(transaction.amount),
        type: transaction.type,
        category: transaction.category,
        date: transaction.date || new Date().toISOString()
      };

      const res = await fetch(`${API_BASE_URL}/api/transactions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const newTx = await res.json();
        const formattedTx = formatTransaction(newTx);
        dispatch({ type: 'ADD_TRANSACTION', payload: formattedTx });
      } else {
        console.error('Failed to add transaction:', res.statusText);
      }
    } catch (err) {
      console.error('Error in addTransaction request:', err);
    }
  }

  async function setBudget(newAmount) {
    const month_year = getCurrentMonthKey();
    const rawVal = typeof newAmount === 'object' && newAmount !== null ? (newAmount.target_amount ?? newAmount.amount) : newAmount;
    const target_amount = Number(rawVal);

    if (isGuest) {
      dispatch({
        type: 'SET_BUDGET',
        payload: {
          month_year,
          target_amount
        }
      });
      const updatedBudgets = { ...state.budgets, [month_year]: target_amount };
      localStorage.setItem('guest_budgets', JSON.stringify(updatedBudgets));
      return;
    }

    if (!authToken) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/budgets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          month_year,
          target_amount
        })
      });

      if (res.ok) {
        const record = await res.json();
        dispatch({
          type: 'SET_BUDGET',
          payload: {
            month_year: record.month_year,
            target_amount: Number(record.target_amount)
          }
        });
      } else {
        console.error('Failed to update budget on server:', res.statusText);
      }
    } catch (err) {
      console.error('Error in setBudget request:', err);
    }
  }

  async function updateUserProfile(profileData) {
    if (isGuest) {
      const updatedProfile = formatUserProfile({
        ...state.userProfile,
        ...profileData,
        isGuest: true
      });
      dispatch({ type: 'SET_USER_PROFILE', payload: updatedProfile });
      localStorage.setItem('guest_profile', JSON.stringify(updatedProfile));
      return;
    }

    if (!authToken) return;
    try {
      const name = profileData.name || `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim() || 'User';
      const avatar_url = profileData.avatar_url || profileData.avatar || '';
      const base_loan = Number(profileData.base_loan ?? profileData.loanAmount ?? 0);

      const payload = {
        name,
        avatar_url,
        base_loan
      };

      const res = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const updatedRow = await res.json();
        const formatted = formatUserProfile({
          ...updatedRow,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          email: profileData.email || updatedRow.email,
          base_loan: Number(updatedRow.base_loan),
          isGuest: false
        });
        dispatch({ type: 'SET_USER_PROFILE', payload: formatted });
      } else {
        console.error('Failed to update user profile on server:', res.statusText);
      }
    } catch (err) {
      console.error('Profile Update Error:', err);
    }
  }

  async function deleteAccount() {
    if (isGuest) {
      localStorage.removeItem('isGuest');
      localStorage.removeItem('guest_transactions');
      localStorage.removeItem('guest_budgets');
      localStorage.removeItem('guest_profile');
      setIsGuest(false);
      dispatch({ type: 'LOGOUT' });
      return true;
    }

    if (!authToken) return false;
    try {
      const res = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        logoutUser();
        return true;
      } else {
        console.error('Failed to delete account:', res.statusText);
        return false;
      }
    } catch (err) {
      console.error('Account Deletion Error:', err);
      return false;
    }
  }

  async function updatePassword(currentPassword, newPassword) {
    if (isGuest) {
      return { success: false, error: 'Password changes are disabled in Guest mode. Please create an account.' };
    }

    if (!authToken) return { success: false, error: 'Not authenticated' };
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/update-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();

      if (res.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error || 'Failed to update password' };
      }
    } catch (err) {
      console.error('Update Password Error:', err);
      return { success: false, error: 'Network error or server unreachable' };
    }
  }

  // Get budget for a specific month or default
  const getBudgetForMonth = (monthKey = null) => {
    const key = monthKey || getCurrentMonthKey();
    return state.budgets[key] !== undefined ? state.budgets[key] : 2500;
  };

  return (
    <GlobalContext.Provider value={{
      authToken,
      isGuest,
      loginAsGuest,
      transactions: state.transactions,
      budgets: state.budgets,
      budget: getBudgetForMonth(),
      getBudgetForMonth,
      userProfile: state.userProfile,
      loginUser,
      signupUser,
      logoutUser,
      deleteAccount,
      updatePassword,
      deleteTransaction,
      addTransaction,
      setBudget,
      updateUserProfile,
      updateProfile: updateUserProfile,
      saveProfile: updateUserProfile
    }}>
      {children}
    </GlobalContext.Provider>
  );
};
