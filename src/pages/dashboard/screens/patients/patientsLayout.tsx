import React from "react";
import Patients from "./patientsList";
import PatientMetrics from "./patientsStats";

const PatientsLayout: React.FC = () => {
    return (
        <>
        <div className="w-full p-6">
         

            {/* Patient Metrics Cards */}
            <div className="mb-6">
                <PatientMetrics />
            </div>
            
            {/* Patients Table */}
            <div className="mt-4">
                <Patients />
            </div>
        </div>
        </>
    );
};

export default PatientsLayout;