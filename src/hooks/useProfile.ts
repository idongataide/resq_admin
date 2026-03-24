
import { getProfile } from "@/api/profileApi";
import useSWR from "swr";


export const useAdminProfile = () => {
  const { data, isLoading, mutate } = useSWR(
    `/operations/profile/`,
    () => {
      return getProfile().then((res) => {
        return res?.data;
      });
    },

    {
      revalidateOnFocus: false,
    },
  );

  return { data, isLoading, mutate };
};


export const useAllBookingsCount = (countStatus: string = '0') => {
  const { data, isLoading, mutate } = useSWR(
    `/towings?component=${countStatus}`,
    () => {
             return 
    },
    {
      revalidateOnFocus: false,
    },
  );

  return { data, isLoading, mutate };
};
export const useRevenues = (countStatus: string = '0') => {
  const { data, isLoading, mutate } = useSWR(
    `/towings?component=${countStatus}`,
    () => {
             return 
    },
    {
      revalidateOnFocus: false,
    },
  );

  return { data, isLoading, mutate };
};