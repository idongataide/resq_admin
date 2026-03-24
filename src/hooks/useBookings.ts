import useSWR from "swr";
import { getBookings, getBookingCounts, getBookingById } from  "@/api/bookingsApi";


export const useBookings = () => {
  const { data, isLoading, mutate } = useSWR(
    "/bookings",
    () => getBookings(),
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

export const useBookingCounts = () => {
  const { data, isLoading, mutate } = useSWR(
    "/bookings/?component=count-status",
    () => getBookingCounts(),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    data: data?.status === 'ok' ? data?.data : null,
    isLoading,
    mutate,
  };
};

export const useBooking = (booking_id: string | undefined) => {
  const { data, isLoading, mutate } = useSWR(
    booking_id ? `/bookings/${booking_id}` : null,
    () => booking_id ? getBookingById(booking_id) : null,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    booking: data?.status === 'ok' ? data?.data : null,
    isLoading,
    mutate,
  };
};