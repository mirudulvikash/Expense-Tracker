import React, { createContext, useReducer, useEffect } from 'react';
import { supabase } from '../utils/supabase';

// Helper to get current month key (YYYY-MM)
const getCurrentMonthKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

const defaultTransactions = [];

const initialState = {
  transactions: defaultTransactions,
  budgets: {},
  userProfile: {
    firstName: 'Guest',
    lastName: 'User',
    email: 'guest@expenseflow.app',
    avatar: 'https://ui-avatars.com/api/?name=Guest&background=EAB308&color=000&size=150',
    loanAmount: 0
  },
  isLoading: true
};

export const GlobalContext = createContext(initialState);

// Reducer
const AppReducer = (state, action) => {
  switch(action.type) {
    case 'SET_INITIAL_DATA':
      return {
        ...state,
        transactions: action.payload.transactions,
        budgets: action.payload.budgets,
        userProfile: action.payload.userProfile || initialState.userProfile,
        isLoading: false
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
    case 'SET_BUDGET': {
      const monthKey = action.payload.month || getCurrentMonthKey();
      return {
        ...state,
        budgets: {
          ...state.budgets,
          [monthKey]: action.payload.amount
        }
      };
    }
    case 'SET_USER_PROFILE':
      return {
        ...state,
        userProfile: action.payload
      };
    default:
      return state;
  }
}

// Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // Fetch initial data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Profile for generic guest
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', 'guest@expenseflow.app')
          .single();

        // Fetch Transactions
        const { data: txs } = await supabase
          .from('transactions')
          .select('*')
          .order('date', { ascending: false });

        // Fetch Budgets
        const { data: bgs } = await supabase
          .from('budgets')
          .select('*');

        const budgetsObj = {};
        if (bgs) {
          bgs.forEach(b => {
             budgetsObj[b.month_key] = b.amount;
          });
        }

        dispatch({ type: 'SET_INITIAL_DATA', payload: {
          transactions: txs || [],
          budgets: budgetsObj,
          userProfile: profile ? {
            firstName: profile.first_name,
            lastName: profile.last_name,
            email: profile.email,
            avatar: profile.avatar,
            loanAmount: profile.loan_amount
          } : initialState.userProfile
        }});
      } catch(error) {
        console.error("Error fetching from Supabase:", error);
        dispatch({ type: 'SET_INITIAL_DATA', payload: initialState });
      }
    };
    
    fetchData();
  }, []);

  // Actions
  async function deleteTransaction(id) {
    // Optimistic UI update
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    await supabase.from('transactions').delete().eq('id', id);
  }

  async function addTransaction(transaction) {
    // Optimistic UI update
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
    await supabase.from('transactions').insert([{
      id: transaction.id,
      text: transaction.text,
      amount: transaction.amount,
      type: transaction.type,
      date: transaction.date || new Date().toISOString()
    }]);
  }

  async function setBudget(amount, month = null) {
    const monthKey = month || getCurrentMonthKey();
    
    // Optimistic UI update
    dispatch({ type: 'SET_BUDGET', payload: { amount, month: monthKey } });
    
    // Upsert budget
    await supabase.from('budgets').upsert({
      month_key: monthKey,
      amount: amount
    }, { onConflict: 'month_key' });
  }

  async function updateUserProfile(profile) {
    // Optimistic UI update
    dispatch({ type: 'SET_USER_PROFILE', payload: profile });
    
    // Update profile
    await supabase.from('profiles').update({
      first_name: profile.firstName,
      last_name: profile.lastName,
      avatar: profile.avatar,
      loan_amount: profile.loanAmount
    }).eq('email', profile.email);
  }

  // Get budget for a specific month or default
  const getBudgetForMonth = (monthKey = null) => {
    const key = monthKey || getCurrentMonthKey();
    return state.budgets[key] || 2500; // Default budget if not set
  };

  return (
    <GlobalContext.Provider value={{
      transactions: state.transactions,
      budgets: state.budgets,
      budget: getBudgetForMonth(), // Expose current month's budget for convenience
      getBudgetForMonth,
      userProfile: state.userProfile,
      isLoading: state.isLoading,
      deleteTransaction,
      addTransaction,
      setBudget,
      updateUserProfile
    }}>
      {children}
    </GlobalContext.Provider>
  );
};
