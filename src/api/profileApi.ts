import { axiosAPIInstance } from "./interceptor";


export const getProfile = async () => {
  try {
    return await axiosAPIInstance
      .get(`/operations/profile`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const updateProfile = async (submitData : any) => {
  try {
    return await axiosAPIInstance
      .put(`operations/profile`, submitData)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const updatePassword = async (data: {
  old_password: string;
  new_password: string;
}) => {
  try {
    return await axiosAPIInstance
      .post(`operations/account-password`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};
