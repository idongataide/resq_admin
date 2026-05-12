import React from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import BookingMetrics from "./bookingsStat";
import { Tabs } from "antd";

const BookingLayouts: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getActiveKey = () => {
    if (location.pathname === "/bookings/schedule") return "non-emergency";
    if (location.pathname === "/bookings/emergency") return "emergency";
    return "all";
  };
  
  const handleTabChange = (key: string) => {
    if (key === "non-emergency") {
      navigate("/bookings/schedule");
    } else if (key === "emergency") {
      navigate("/bookings/emergency");
    } else {
      navigate("/bookings");
    }
  };
  
  const tabItems = [
    { key: "all", label: "All Booking" },
    { key: "emergency", label: "Emergency Bookings" },
    { key: "non-emergency", label: "Non-Emergency" },
  ];
  
  return (
    <div className="w-full p-6">
      <div className="mb-6">
        <BookingMetrics />
      </div>
      
      <div className="mt-4">
        <Tabs
          activeKey={getActiveKey()}
          onChange={handleTabChange}
          items={tabItems}
          className="custom-tab-bar"
          tabBarStyle={{ marginBottom: 14 }}
          tabBarGutter={12}
        />
        <Outlet />
      </div>
    </div>
  );
};

export default BookingLayouts;