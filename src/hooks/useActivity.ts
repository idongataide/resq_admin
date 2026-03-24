import useSWR from "swr";
import { getActivity } from "@/api/activityApi";

export const useActivity = () => {
    const { data, isLoading, mutate } = useSWR(
      `/operations/activity-logs/`,
      () => {
        return getActivity().then((res) => {
          return res?.data;
        });
      },
  
      {
        revalidateOnFocus: false,
      },
    );
  
    return { data, isLoading, mutate };
};