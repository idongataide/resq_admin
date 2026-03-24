// HospitalLayout.tsx
import React from "react";
import HospitalsTable from "./hospitalList";

const HospitalLayout: React.FC = () => {
    return (
        <>
        <div className="w-full p-6">
            {/* Teams Table */}
            <div className="mt-4">
                <HospitalsTable />
            </div>
        </div>
        </>
    );
};

export default HospitalLayout;