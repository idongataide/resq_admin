import { axiosAPIInstance } from "./interceptor";

// ============== Emergency Fees (Original) ==============
export const getFees = async () => {
  try {
    return await axiosAPIInstance
      .get(`settings/fees`)
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
      .post(`/settings/fees`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const updateFee = async (feeId: string, data: { amount: string; name: string; amount_type: string; }) => {
  try {
    return await axiosAPIInstance
      .put(`/settings/fees/${feeId}`, data)
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
      .delete(`/settings/fees/${feeId}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

// ============== Non-Emergency Fees ==============
export const getNonEmergencyFees = async () => {
  try {
    return await axiosAPIInstance
      .get(`/settings/non-emergency-fees/`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const addNonEmergencyFee = async (data: any) => {
  try {
    return await axiosAPIInstance
      .post(`/settings/non-emergency-fees/`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const updateNonEmergencyFee = async (feeId: string, data: { amount: string; name: string; amount_type: string; }) => {
  try {
    return await axiosAPIInstance
      .put(`/settings/non-emergency-fees/${feeId}`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const deleteNonEmergencyFee = async (feeId: string) => {
  try {
    return await axiosAPIInstance
      .delete(`/settings/non-emergency-fees/${feeId}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

// ============== Emergency Stakeholders (Original) ==============
export const getStakeholders = async () => {
  try {
    return await axiosAPIInstance
      .get(`/settings/stakeholders`)
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
  amount: string;
  amount_type: string;
}) => {
  try {
    return await axiosAPIInstance
      .post(`/settings/stakeholders`, data)
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
      .put(`/settings/stakeholders/${stakeholderId}`, data)
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
      .delete(`/settings/stakeholders/${stakeholderId}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

// ============== Non-Emergency Stakeholders ==============
export const getNonEmergencyStakeholders = async () => {
  try {
    return await axiosAPIInstance
      .get(`/settings/non-emergency-stakeholders`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const getNonEmergencyStakeholderById = async (stakeholderId: string) => {
  try {
    return await axiosAPIInstance
      .get(`/settings/non-emergency-stakeholders/${stakeholderId}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const addNonEmergencyStakeholder = async (data: { 
  name: string;
  bank_name: string;
  bank_code: string;
  account_number: string;
  account_name: string;
  amount: string;
  amount_type: string;
}) => {
  try {
    return await axiosAPIInstance
      .post(`/settings/non-emergency-stakeholders`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const updateNonEmergencyStakeholder = async (stakeholderId: string, data: { 
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
      .put(`/settings/non-emergency-stakeholders/${stakeholderId}`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const deleteNonEmergencyStakeholder = async (stakeholderId: string) => {
  try {
    return await axiosAPIInstance
      .delete(`/settings/non-emergency-stakeholders/${stakeholderId}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

// ============== Business Process ==============
export const getBisProcess = async (
  data: { doc_name: string },
  mode: 'add' | 'edit' = 'add',
  bizId?: string
) => {
  try {
    if (mode === 'edit' && bizId) {
      return await axiosAPIInstance
        .put(`/settings/biz-process/${bizId}`, data)
        .then((res) => {
          return res?.data;
        });
    } else {
      return await axiosAPIInstance
        .post(`/settings/biz-process`, data)
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
      .get(`/settings/biz-process`)
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
      .delete(`/settings/biz-process/${bizId}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};