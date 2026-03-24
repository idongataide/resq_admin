import axios from 'axios';

const authTokens = localStorage.getItem("adminToken")
  ? JSON.parse(localStorage.getItem("adminToken")!)
  : null;

// Helper function to get userType from store
export const getUserType = () => {
  if (typeof window !== 'undefined') {
    try {
      const storeData = localStorage.getItem("navPaths");
      if (storeData) {
        const parsed = JSON.parse(storeData);
        return parsed?.state?.userType || "";
      }
    } catch (e) {
      console.error("Error reading userType from store:", e);
    }
  }
  return "";
};


// Helper function to get role from store
export const getRole = () => {
  if (typeof window !== 'undefined') {
    try {
      const storeData = localStorage.getItem("navPaths");
      if (storeData) {
        const parsed = JSON.parse(storeData);
        return parsed?.state?.role || "";
      }
    } catch (e) {
      // Ignore errors
    }
  }
  return "";
};

export const getTransactionsEndpoint = () => {
  const userType = getUserType();
  const role = getRole();
  return (userType === 'lastma' || role === 'lastma_admin') 
    ? '/payments/get-lastma-transactions' 
    : '/payments/get-transactions';
};

const walletAPIInstance = axios.create({
  baseURL: import.meta.env.VITE_WALLET_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(authTokens?.access && { 'Authorization': `Bearer ${authTokens.access}` }),
  },
});

export const TransactionList = async () => {
    try {
      const endpoint = getTransactionsEndpoint();
      
      return await walletAPIInstance
        .get(endpoint)
        .then((res) => {
          return res?.data;
        });
    } catch (error) {
      return error;
    }
};



export const getTransactionCount = async (operatorCount: string) => {
  try {
    const endpoint = getTransactionsEndpoint();
    
    return await walletAPIInstance
      .get(`${endpoint}?component=${operatorCount}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};