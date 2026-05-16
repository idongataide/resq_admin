// hooks/revenue/useOperatorRevenue.ts
import useSWR from 'swr';
import { getOperatorRevenue, getStakeholderRevenue, getRemittedRevenue } from '@/api/revenueApi';

export const useOperatorRevenue = (params?: {
  isNonEmergency?: boolean;
  period?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
}) => {
  const { isNonEmergency, ...restParams } = params || {};
  
  // Choose endpoint based on emergency/non-emergency
  const endpoint = isNonEmergency 
    ? '/payments/schedule-stakeholder-revenue'
    : '/payments/daily-revenue-operator';

  const { data, isLoading, mutate } = useSWR(
    params ? [endpoint, restParams] : null,
    () => getOperatorRevenue(endpoint, restParams),
    {
      revalidateOnFocus: false,
    },
  );

  return { data: data?.data || [], summary: data?.summary, pagination: data?.pagination, isLoading, mutate };
};




export const useStakeholderRevenue = (params?: {
  isNonEmergency?: boolean;
  start_date?: string;
  end_date?: string;
  page?: number;
  item_per_page?: number;
}) => {
  const { isNonEmergency, ...restParams } = params || {};
  
  // Choose endpoint based on emergency/non-emergency
  const endpoint = isNonEmergency 
    ? '/payments/schedule-daily-revenue-operator'
    : '/payments/stakeholder-revenue';

  const { data, isLoading, mutate } = useSWR(
    params ? [endpoint, restParams] : null,
    () => getStakeholderRevenue(endpoint, restParams),
    {
      revalidateOnFocus: false,
    },
  );

  return { data: data?.data || [], summary: data?.summary, pagination: data?.pagination, isLoading, mutate };
};


export const useRemittedRevenue  = (params?: {
  isNonEmergency?: boolean;
  start_date?: string;
  end_date?: string;
  page?: number;
  item_per_page?: number;
}) => {
  const { isNonEmergency, ...restParams } = params || {};
  
  // Choose endpoint based on emergency/non-emergency
  const endpoint = isNonEmergency 
    ? '/payments/schedule-stakeholder-daily-revenue'
    : '/payments/stakeholder-daily-revenue';

  const { data, isLoading, mutate } = useSWR(
    params ? [endpoint, restParams] : null,
    () => getRemittedRevenue(endpoint, restParams),
    {
      revalidateOnFocus: false,
    },
  );

  return { data: data?.data || [], summary: data?.summary, pagination: data?.pagination, isLoading, mutate };
};