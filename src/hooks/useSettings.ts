import { getBanksList } from "@/api/banks";
import { getBisProcessList, getFees, getNonEmergencyFees, getNonEmergencyStakeholders, getStakeholders } from "@/api/settingsApi";
import useSWR from "swr";

export const useFees = () => {
  const { data, isLoading, mutate } = useSWR(
    '/accounts/services/fees',
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
  


export const useNonEmergencyStakeholders = () => {
  const { data, error, isLoading, mutate } = useSWR(
    '/admins/settings/non-emergency-stakeholders',
    getNonEmergencyStakeholders,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    data: data?.data || data,
    isLoading,
    isError: error,
    mutate,
  };
};


export const useNonEmergencyFees = () => {
  const { data, error, isLoading, mutate } = useSWR(
    '/admins/settings/non-emergency-fees',
    getNonEmergencyFees,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    data: data?.data || data,
    isLoading,
    isError: error,
    mutate,
  };
};
