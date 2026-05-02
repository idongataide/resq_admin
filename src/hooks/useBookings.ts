import useSWR from "swr";
import { getBookings, getBookingCounts, getBookingById } from  "@/api/bookingsApi";


export const useBookings = (booking_type?: string) => {
  const swrKey = booking_type ? `/bookings?booking_type=${booking_type}` : "/bookings";
  const { data, isLoading, mutate } = useSWR(
    swrKey,
    () => getBookings(booking_type),
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