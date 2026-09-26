import React, { createContext, useReducer, useEffect } from 'react';

const API_BASE_URL = 'https://expense-tracker-backend-mz0a.onrender.com';

// Helper to get current month key (YYYY-MM)
const getCurrentMonthKey = () => new Date().toISOString().slice(0, 7);

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

// Helper to normalize user profile object from backend
const formatUserProfile = (data) => {
  if (!data) return {
    id: 1,
    name: 'Guest User',
    firstName: 'Guest',
    lastName: 'User',
    email: 'guest@expenseflow.app',
    avatar: 'https://ui-avatars.com/api/?name=Guest&background=EAB308&color=000&size=150',
    avatar_url: 'https://ui-avatars.com/api/?name=Guest&background=EAB308&color=000&size=150',
    loanAmount: 0,
    base_loan: 0
  };

  const name = data.name || 'Guest User';
  const nameParts = name.trim().split(' ');
  const firstName = data.firstName || nameParts[0] || 'Guest';
  const lastName = data.lastName || nameParts.slice(1).join(' ') || 'User';
  const avatar_url = data.avatar_url || data.avatar || 'https://ui-avatars.com/api/?name=Guest&background=EAB308&color=000&size=150';
  const base_loan = Number(data.base_loan ?? data.loanAmount ?? 0);

  return {
    ...data,
    name,
    firstName,
    lastName,
    email: data.email || 'guest@expenseflow.app',
    avatar: avatar_url,
    avatar_url,
    loanAmount: base_loan,
    base_loan
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
    default:
      return state;
  }
}

// Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // Fetch transactions, budgets, and user profile from backend on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txRes, budgetRes, profileRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/transactions`),
          fetch(`${API_BASE_URL}/api/budgets`),
          fetch(`${API_BASE_URL}/api/profile`)
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
          const formattedProfile = formatUserProfile(profileData);
          dispatch({ type: 'SET_USER_PROFILE', payload: formattedProfile });
        } else {
          console.error('Failed to fetch user profile from server:', profileRes.statusText);
        }
      } catch (err) {
        console.error('Error in initial data fetch (transactions/budgets/profile):', err);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // Actions
  async function deleteTransaction(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/transactions/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        dispatch({ type: 'DELETE_TRANSACTION', payload: id });
      } else {
        console.error('Failed to delete transaction:', res.statusText);
      }
    } catch (err) {
      console.error('Error in deleteTransaction request:', err);
      console.error(err);
    }
  }

  async function addTransaction(transaction) {
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
      console.error(err);
    }
  }

  async function setBudget(newAmount) {
    const month_year = new Date().toISOString().slice(0, 7);
    const rawVal = typeof newAmount === 'object' && newAmount !== null ? (newAmount.target_amount ?? newAmount.amount) : newAmount;
    const target_amount = Number(rawVal);

    try {
      const res = await fetch(`${API_BASE_URL}/api/budgets`, {
        method: 'POST',
        headers: {
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
      console.error(err);
    }
  }

  async function updateUserProfile(profile) {
    try {
      const name = profile.name || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Guest User';
      const avatar_url = profile.avatar_url || profile.avatar || '';
      const base_loan = Number(profile.base_loan ?? profile.loanAmount ?? 0);

      const res = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          avatar_url,
          base_loan
        })
      });

      if (res.ok) {
        const updatedRow = await res.json();
        const formatted = formatUserProfile({
          ...updatedRow,
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email || updatedRow.email
        });
        dispatch({ type: 'SET_USER_PROFILE', payload: formatted });
      } else {
        console.error('Failed to update user profile on server:', res.statusText);
      }
    } catch (err) {
      console.error('Error in updateUserProfile request:', err);
      console.error(err);
    }
  }

  // Get budget for a specific month or default
  const getBudgetForMonth = (monthKey = null) => {
    const key = monthKey || getCurrentMonthKey();
    return state.budgets[key] !== undefined ? state.budgets[key] : 2500;
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
      updateUserProfile,
      updateProfile: updateUserProfile,
      saveProfile: updateUserProfile
    }}>
      {children}
    </GlobalContext.Provider>
  );
};
