import { axiosAPIInstance } from "./interceptor";

export const getProviders = async () => {
  try {
    return await axiosAPIInstance
      .get(`/providers`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const addProvider = async (data: any) => {
  try {
    return await axiosAPIInstance
      .post(`providers`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const deleteProvider = async (provider_id: string) => {
  try {
    return await axiosAPIInstance
      .delete(`/providers/${provider_id}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const updateProvider = async (provider_id: string, data: any) => {
  try {
    return await axiosAPIInstance
      .put(`/providers/${provider_id}`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const getSingleProvider = async (provider_id: string) => {
  try {
    return await axiosAPIInstance
      .get(`/providers/${provider_id}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const getProviderAmbulances = async (provider_id: string) => {
  try {
    return await axiosAPIInstance
      .get(`/providers/ambulances?provider_id=${provider_id}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};


// Update ambulance status (activate/suspend)
export const updateAmbulanceStatus = async (
  ambulance_id: string, 
  data: { 
    status: "1" | "2"; // "1"=activate, "2"=suspend
    reason?: string; // required when status is "2"
  }
) => {
  try {
    return await axiosAPIInstance
      .put(`/providers/ambulances/${ambulance_id}`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const getProviderAmbulanceLeads = async (provider_id: string) => {
  try {
    return await axiosAPIInstance
      .get(`/providers/lead-lists?provider_id=${provider_id}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};
