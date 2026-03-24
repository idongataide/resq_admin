// api/adminApi.ts

import { axiosAPIInstance } from "./interceptor";


export const createAdminUser = async (data: {
  full_name: string;
  email: string;
  phone_number?: string;
  position: string;
  access_level: string;
}) => {
  try {
    const response = await axiosAPIInstance.post("/operations/user-admins", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAdminUser = async (auth_id: string, data: {
  full_name?: string;
  email?: string;
  phone_number?: string;
  position?: string;
  access_level?: string;
}) => {
  try {
    const response = await axiosAPIInstance.put(`/operations/user-admins/${auth_id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const suspendAdminUser = async (auth_id: string, reason: string) => {
  try {
    const response = await axiosAPIInstance.post(`/operations/user-admins/${auth_id}/suspend`, { reason });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAdminUsers = async () => {
  try {
    const response = await axiosAPIInstance.get("/operations/user-admins");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAdminUser = async (auth_id: string) => {
  try {
    const response = await axiosAPIInstance.delete(`/operations/user-admins/${auth_id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAdminUserStatus = async (auth_id: string, data: {
  status: number; // 1 = active, 2 = suspended
  reason?: string;
  unsuspend_date?: string;
}) => {
  try {
    const response = await axiosAPIInstance.put(`/admins/operations/user-admins/${auth_id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
