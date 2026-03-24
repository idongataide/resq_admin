import { iLogin } from "@/interfaces/interface";

import { requestClient } from "./baseRequest";




export const login = async (data: iLogin) => {
  try {
     return await requestClient
     .post(`/auths/start-login`, data)
     .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const confirmLogin = async (data: any) => {
  try {
     return await requestClient
     .post(`/auths/complet-login`, data)
     .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const logout = async () => {
  return await requestClient.get(`v1/accounts/auth/logout/`).then((res) => {
    return res.data;
  });
};

export const changePassword = async (data:any) => {
  try {
    return await requestClient
      .post(`/auths/forgot-password`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const forgetPassword = async (data: { otp_request_id: string; otp: string; new_password: string }) => {
  try {
    return await requestClient
      .post(`/auths/reset-password`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};