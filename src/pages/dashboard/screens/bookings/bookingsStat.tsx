import Images from "@/components/images";
import React from "react";
import { useBookingCounts } from "@/hooks/useBookings";
import { Spin } from "antd";

const BookingMetrics: React.FC = () => {
  const { data: counts, isLoading } = useBookingCounts();

  const bookingMetrics = [
    {
      id: 'total',
      title: 'Total Bookings',
      value: counts?.total_req?.toLocaleString() || '0',
      bgColor: '#F6F8F9'
    },
    {
      id: 'pending',
      title: 'Pending Bookings',
      value: counts?.total_pending?.toLocaleString() || '0',
      bgColor: '#FFF7E8'
    },
    {
      id: 'ongoing',
      title: 'Ongoing Bookings',
      value: counts?.total_ongoing?.toLocaleString() || '0',
      bgColor: '#FDF6F6'
    },
    {
      id: 'completed',
      title: 'Completed Bookings',
      value: counts?.total_completed?.toLocaleString() || '0',
      bgColor: '#F8FEF5'
    },
  {
      id: 'cancelled',
      title: 'Cancelled Bookings',
      value: counts?.total_cancelled?.toLocaleString() || '0',
      bgColor: '#FEE9E7'
    },
    {
      id: 'incoming',
      title: 'Incoming Bookings',
      value: counts?.total_incoming?.toLocaleString() || '0',
      bgColor: '#e7fbfe'
    }
  ];

  return (
    <>
      <div className="w-full">
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 mb-6 bg-[#FFFFFF] p-4 rounded-lg">
          {bookingMetrics.map((metric) => (
            <div 
              key={metric.id} 
              className="rounded-lg p-4"
              style={{ backgroundColor: metric.bgColor }}
            >
              <div className="rounded-full bg-[#fff] p-2 w-10 h-10 flex items-center justify-center mb-3">
                <img src={Images.icon.siren} alt="bookings" />
              </div>  
              <div className="text-sm text-[#354959] mb-1">{metric.title}</div>
              <div className="text-2xl text-[#354959] font-semibold">
                {isLoading ? (
                  <Spin size="small" />
                ) : (
                  metric.value
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BookingMetrics;