import { getPatientById, getPatients } from "@/api/patientsApi";
import useSWR from "swr";

export const usePatients = (component?: string) => {
  const { data, isLoading, mutate } = useSWR(
    component ? `/providers/patients/?component=${component}` : "/providers/patients/",
    () => getPatients(component),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    data: data?.status === 'ok' ? data?.data : [],
    isLoading,
    mutate,
  };
};

export const usePatient = (patient_id: string | undefined) => {
  const { data, isLoading, mutate } = useSWR(
    patient_id ? `/providers/patients/${patient_id}` : null,
    () => patient_id ? getPatientById(patient_id) : null,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    patient: data?.status === 'ok' ? data?.data : null,
    isLoading,
    mutate,
  };
};


// New hook for fetching patient counts
export const usePatientsCount = () => {
  const { data, isLoading, mutate } = useSWR(
    "/providers/patients/?component=count",
    () => getPatients('count'),
    {
      revalidateOnFocus: false,
    }
  );


  return {
    data: data?.status === 'ok' ? data?.data : { total: 0, active: 0, inactive: 0 },
    isLoading,
    mutate,
  };
};