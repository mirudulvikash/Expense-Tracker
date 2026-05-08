import React, { createContext, useReducer, useEffect } from 'react';

// Helper to get current month key (YYYY-MM)
const getCurrentMonthKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

const defaultTransactions = [];

const initialState = {
  transactions: JSON.parse(localStorage.getItem('transactions')) || defaultTransactions,
  budgets: JSON.parse(localStorage.getItem('budgets')) || {}, // { '2024-05': 2500 }
  userProfile: JSON.parse(localStorage.getItem('userProfile')) || {
    firstName: 'Guest',
    lastName: 'User',
    email: 'guest@expenseflow.app',
    avatar: 'https://ui-avatars.com/api/?name=Guest&background=EAB308&color=000&size=150',
    loanAmount: 0
  }
};

// eslint-disable-next-line react-refresh/only-export-components
export const GlobalContext = createContext(initialState);

// Reducer
const AppReducer = (state, action) => {
  switch(action.type) {
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

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(state.transactions));
    localStorage.setItem('budgets', JSON.stringify(state.budgets));
    localStorage.setItem('userProfile', JSON.stringify(state.userProfile));
  }, [state]);

  // Actions
  function deleteTransaction(id) {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  }

  function addTransaction(transaction) {
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
  }

  function setBudget(amount, month = null) {
    dispatch({ type: 'SET_BUDGET', payload: { amount, month } });
  }

  function updateUserProfile(profile) {
    dispatch({ type: 'SET_USER_PROFILE', payload: profile });
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
      deleteTransaction,
      addTransaction,
      setBudget,
      updateUserProfile
    }}>
      {children}
    </GlobalContext.Provider>
  );
};
