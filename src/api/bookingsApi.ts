import { axiosAPIInstance } from "./interceptor";

// Get all bookings
export const getBookings = async (booking_type?: string) => {
  try {
    const query = booking_type ? `?booking_type=${booking_type}` : "";
    return await axiosAPIInstance
      .get(`/bookings${query}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

// Get booking counts
export const getBookingCounts = async () => {
  try {
    return await axiosAPIInstance
      .get(`/bookings/?component=count-status`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

// Get single booking
export const getBookingById = async (booking_id: string) => {
  try {
    return await axiosAPIInstance
      .get(`/bookings/${booking_id}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

// Accept booking
export const acceptBooking = async (data: {
  booking_id: string;
  hospital_id?: string;
  booking_reason?: string;
}) => {
  try {
    return await axiosAPIInstance
      .post(`/bookings/accept-request`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

// Cancel booking
export const cancelBooking = async (data: {
  booking_id: string;
  reason?: string;
}) => {
  try {
    return await axiosAPIInstance
      .post(`/bookings/cancel-request`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};


export const assignBookingRequest = async (data: {
  booking_id: string;
  provider_id: string;
}) => {
  try {
    return await axiosAPIInstance
      .post(`/bookings/assign-request`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};


export const updateBookingLocation = async (data: {
  booking_id: string;
  pickup_address?: string;
  dropoff_address?: string;
  start_coord?: {
    latitude: number;
    longitude: number;
  };
  end_coord?: {
    latitude: number;
    longitude: number;
  };
}) => {
  try {
    const response = await axiosAPIInstance.post("/bookings/update-location", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getBookingTimeline = async (booking_id: string) => {
  try {
    const response = await axiosAPIInstance.get(`/bookings/${booking_id}/timeline`);
    return response.data;
  } catch (error) {
    throw error;
  }
};