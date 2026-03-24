import { axiosAPIInstance } from "./interceptor";


export const getActivity = async () => {
  try {
    return await axiosAPIInstance
      .get(`/accounts/activity-logs`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};