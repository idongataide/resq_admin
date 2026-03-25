// BookingDetailsLayouts.tsx
import React from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import UserProfile from "./userProfile";
import RequestDetails from "./requestDetails";
import HealthDetails from "./healthDetails";
import ProviderDetails from "./ProviderDetails";
import RouteDetails from "./RouteDetails";
import RequestTimeline from "./requestTimeline";
import InvoiceCard from "./invoiceDetails";
import RatingsReview from "./ratingReview";
import CareDetails from "./CareDetails";
import { useBooking } from "@/hooks/useBookings";

const BookingDetailsLayouts: React.FC = () => {
    const { booking_id } = useParams<{ booking_id: string }>();
    const { booking, isLoading } = useBooking(booking_id);

    if (isLoading) {
        return (
            <div className="w-full h-64 flex items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="w-full p-6 text-center">
                <p className="text-gray-500">Booking not found</p>
            </div>
        );
    }

    return (
        <>
        <div className="w-full p-6">
            <UserProfile booking={booking} />
            <div className="grid grid-cols-1 lg:grid-cols-7 mt-5 gap-5">
                <div className="col-span-1 lg:col-span-5">
                    <RequestDetails booking={booking as any} />
                    <HealthDetails booking={booking as any} />
                    <ProviderDetails booking={booking as any} />
                    <RouteDetails booking={booking as any} />
                    <RatingsReview booking={booking as any} />
                    <CareDetails booking={booking as any} />
                </div>
                <div className="col-span-1 lg:col-span-2">
                    <RequestTimeline booking={booking as any} />
                    <InvoiceCard booking={booking as any} />
                </div>
            </div>
        </div>
        </>
    );
};

export default BookingDetailsLayouts;