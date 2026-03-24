import { axiosAPIInstance } from "./interceptor";

// Get all patients with optional component query param
export const getPatients = async (component?: string) => {
  try {
    const url = component 
      ? `/providers/patients/?component=${component}`
      : `/providers/patients/`;
    
    return await axiosAPIInstance
      .get(url)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};


export const getPatientById = async (patient_id: string) => {
  try {
    return await axiosAPIInstance
      .get(`/providers/patients/${patient_id}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

// Delete patient
export const deletePatient = async (patient_id: string) => {
  try {
    return await axiosAPIInstance
      .delete(`/providers/patients/${patient_id}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};