import { axiosAPIInstance } from "./interceptor";


export const getFees = async () => {
  try {
    return await axiosAPIInstance
      .get(`accounts/services`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};


export const addFees = async (data: any) => {
  try {
    return await axiosAPIInstance
      .post(`/accounts/services`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const updateFee = async (feeId: string, data: { amount: string; name: string; }) => {
  try {
    return await axiosAPIInstance
      .put(`/accounts/services/${feeId}`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};


export const deleteFee = async (feeId: string) => {
  try {
    return await axiosAPIInstance
      .delete(`/accounts/services/${feeId}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};


export const getStakeholders = async () => {
  try {
    return await axiosAPIInstance
      .get(`/accounts/stakeholders`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};


export const addStakeholder = async (data: { 
  name: string;
  bank_name: string;
  bank_code: string;
  account_number: string;
  account_name: string;
}) => {
  try {
    return await axiosAPIInstance
      .post(`/accounts/stakeholders`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const updateStakeholder = async (stakeholderId: string, data: { 
  name: string;
  bank_name: string;
  bank_code: string;
  account_number: string;
  account_name: string;
  amount: string;
  amount_type: 'percentage' | 'amount';
}) => {
  try {
    return await axiosAPIInstance
      .put(`/accounts/stakeholders/${stakeholderId}`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const deleteStakeholder = async (stakeholderId: string) => {
  try {
    return await axiosAPIInstance
      .delete(`/accounts/stakeholders/${stakeholderId}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};



export const getBisProcess = async (
  data: { doc_name: string },
  mode: 'add' | 'edit' = 'add',
  bizId?: string
) => {
  try {
    if (mode === 'edit' && bizId) {
      console.log(mode,'dsdsdsd')
      return await axiosAPIInstance
        .put(`/accounts/biz-process/${bizId}`, data)
        .then((res) => {
          return res?.data;
        });
    } else {
      return await axiosAPIInstance
        .post(`/accounts/biz-process`, data)
        .then((res) => {
          return res?.data;
        });
    }
  } catch (error) {
    return error;
  }
};

export const getBisProcessList = async () => {
  try {
    return await axiosAPIInstance
      .get(`/accounts/biz-process`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const deleteBisProcess = async (bizId: string) => {
  try {
    return await axiosAPIInstance
      .delete(`/accounts/biz-process/${bizId}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};