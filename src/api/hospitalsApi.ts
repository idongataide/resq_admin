import { axiosAPIInstance } from "./interceptor";


export const getHospitals = async () => {
  try {
    return await axiosAPIInstance
      .get(`/providers/hospitals`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const addHospital = async (data : any) => {
  try {
    return await axiosAPIInstance
      .post(`providers/hospitals`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const deleteHospital = async (hospital_id: string) => {
  try {
    return await axiosAPIInstance
      .delete(`/providers/hospitals/${hospital_id}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const updateHospital = async (hospital_id: string, data: any) => {
  try {
    return await axiosAPIInstance
      .put(`/providers/hospitals/${hospital_id}`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};
