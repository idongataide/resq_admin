import React, { useState } from "react";
import BookingMetrics from "./bookingsStat";
import BookingList from "./bookingList";
import { Tabs } from "antd";



const BookingLayouts: React.FC = () => {
const [activeTab, setActiveTab] = useState("bookingList");

    const tabItems = [
    {
      key: "bookingList",
      label: "All Booking",
      children: <BookingList bookingType={undefined} />,
    },
    {
      key: "emmergency",
      label: "Emmergency Bookings",
      children: <BookingList bookingType="emergency" />,
    },
    {
      key: "non-emmergency",
      label: "Non-Emergency",
      children: <BookingList bookingType="non-emergency" />,
    },
  ];
    return (
        <>
        <div className="w-full p-6">
         

            {/* Patient Metrics Cards */}
            <div className="mb-6">
                <BookingMetrics />
            </div>
            
            {/* Patients Table */}
            <div className="mt-4">
                
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems}
                    className="custom-tab-bar "
                    tabBarStyle={{
                    marginBottom: 14,
                    }}
                    tabBarGutter={12}
                />
            </div>
        </div>
        </>
    );
};

export default BookingLayouts;

