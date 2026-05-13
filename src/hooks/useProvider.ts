import useSWR from "swr";
import { getProviders, getSingleProvider, getProviderServices, getProviderAmbulances, getProviderAmbulanceLeads } from "@/api/providerApi";

export const useProviders = () => {
  const { data, isLoading, mutate } = useSWR(
    "/providers",
    () => {
      return getProviders().then((res) => {
        return res?.data;
      });
    },
    {
      revalidateOnFocus: false,
    }
  );

  return { data, isLoading, mutate };
};

export const useSingleProvider = (provider_id: string | undefined) => {
  const { data, isLoading, error, mutate } = useSWR(
    provider_id ? `/providers/${provider_id}` : null,
    () => provider_id ? getSingleProvider(provider_id) : null,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      shouldRetryOnError: false,
    }
  );

  return {
    provider: data?.status === 'ok' ? data?.data : null,
    isLoading,
    error,
    mutate,
    isError: error || data?.status !== 'ok'
  };
};


export const useProviderAmbulances = (provider_id: string | undefined) => {
  const { data, isLoading, mutate } = useSWR(
    provider_id ? `/admins/providers/ambulances?provider_id=${provider_id}` : null,
    () => provider_id ? getProviderAmbulances(provider_id) : null,
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


export const useProviderAmbulanceLeads = (provider_id: string | undefined) => {
  const { data, isLoading, mutate } = useSWR(
    provider_id ? `/providers/lead-lists?provider_id=${provider_id}` : null,
    () => provider_id ? getProviderAmbulanceLeads(provider_id) : null,
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


export const useProviderServices = (provider_id: string | undefined) => {
  const { data, isLoading, mutate } = useSWR(
    provider_id ? `/providers/services?provider_id=${provider_id}` : null,
    () => provider_id ? getProviderServices(provider_id) : null,
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