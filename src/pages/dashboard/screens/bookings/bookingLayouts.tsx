import React from "react";
import BookingMetrics from "./bookingsStat";
import BookingList from "./bookingList";

const BookingLayouts: React.FC = () => {
    return (
        <>
        <div className="w-full p-6">
         

            {/* Patient Metrics Cards */}
            <div className="mb-6">
                <BookingMetrics />
            </div>
            
            {/* Patients Table */}
            <div className="mt-4">
                <BookingList />
            </div>
        </div>
        </>
    );
};

export default BookingLayouts;