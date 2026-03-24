import { getBanksList } from "@/api/banks";
import { getBisProcessList, getFees, getStakeholders } from "@/api/settingsApi";
import useSWR from "swr";

export const useFees = () => {
  const { data, isLoading, mutate } = useSWR(
    '/accounts/services',
    () => {
      return getFees().then((res) => {
        return res;
      });
    },
    {
      revalidateOnFocus: false,
    },
  );

  return { data: data || [], isLoading, mutate };
};


export const useBanksList = () => {
  const { data, isLoading, mutate } = useSWR(
    '/banks',
    () => {
      return getBanksList().then((res) => {
        return res?.data;
      });
    },
    {
      revalidateOnFocus: false,
    }
  );
  return { data, isLoading, mutate };
};


export const useStakeholders = () => {
  const { data, isLoading, mutate } = useSWR(
    `/settings/stakeholders`,
    () => {
      return getStakeholders().then((res) => {
        return res?.data;
      });
    },
    {
      revalidateOnFocus: false,
    },
  );

  return { data, isLoading, mutate };
};




export const useBusinessProcess = () => {
    const { data, isLoading, mutate } = useSWR(
      `/settings/biz-process/`,
      () => {
        return getBisProcessList().then((res) => {
          return res?.data;
        });
      },
  
      {
        revalidateOnFocus: false,
      },
    );
  
    return { data, isLoading, mutate };
};
  