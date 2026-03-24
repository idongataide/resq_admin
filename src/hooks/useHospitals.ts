
import { getHospitals } from "@/api/hospitalsApi";
import useSWR from "swr";


export const useHospitals = () => {
  const { data, isLoading, mutate } = useSWR(
    `/providers/hospitals/`,
    () => {
      return getHospitals().then((res) => {
        return res?.data;
      });
    },

    {
      revalidateOnFocus: false,
    },
  );

  return { data, isLoading, mutate };
};