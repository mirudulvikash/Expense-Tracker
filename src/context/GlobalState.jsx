import React, { createContext, useReducer, useEffect } from 'react';

// Initial empty data
const defaultTransactions = [];

const initialState = {
  transactions: JSON.parse(localStorage.getItem('transactions')) || defaultTransactions,
  budget: JSON.parse(localStorage.getItem('budget')) || 2500,
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
    case 'SET_BUDGET':
      return {
        ...state,
        budget: action.payload
      };
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
    localStorage.setItem('budget', JSON.stringify(state.budget));
    localStorage.setItem('userProfile', JSON.stringify(state.userProfile));
  }, [state]);

  // Actions
  function deleteTransaction(id) {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  }

  function addTransaction(transaction) {
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
  }

  function setBudget(amount) {
    dispatch({ type: 'SET_BUDGET', payload: amount });
  }

  function updateUserProfile(profile) {
    dispatch({ type: 'SET_USER_PROFILE', payload: profile });
  }

  return (
    <GlobalContext.Provider value={{
      transactions: state.transactions,
      budget: state.budget,
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
