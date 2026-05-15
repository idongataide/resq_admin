import { axiosAPIInstance } from "./interceptor";



export const getOperatorRevenue = async (endpoint: string, params?: any) => {
  try {
    return await axiosAPIInstance
      .get(endpoint, { params })
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};



export const getStakeholderRevenue = async (endpoint: string, params?: any) => {
  try {
    return await axiosAPIInstance
      .get(endpoint, { params })
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const getRemittedRevenue = async (endpoint: string, params?: any) => {
  try {
    return await axiosAPIInstance
      .get(endpoint, { params })
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};