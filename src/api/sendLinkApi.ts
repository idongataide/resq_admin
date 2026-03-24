import { axiosAPIInstance } from "./interceptor";

// api/sendLinkApi.js

export const sendLink = async (towingId :any , data:any) => {
  try {
    return await axiosAPIInstance
      .post(`towings/send-link/${towingId}`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};