import PatientsHealthDetails from "./PatientsHealthDetails";
import React, { useState } from "react";
import { Tabs } from "antd";
import { usePatient } from "@/hooks/usePatients";
import { useParams } from "react-router-dom";
import PatientsInfo from "./patientsInfo";

const PatientsDetails: React.FC = () => {
    const { patient_id } = useParams<{ patient_id: string }>();
    const { patient, isLoading } = usePatient(patient_id);
    const [activeTab, setActiveTab] = useState("Profile");

    const patientData = patient?.[0] || patient || null;

    const tabItems = [
        {
            key: "Profile",
            label: "Profile",
            children: <PatientsHealthDetails patient={patientData} />
        },
        {
            key: "RequestHistory",
            label: "Request History",
            children: <div>Request History Content</div>
        },       
    ];

    return (
        <>
            <div className="w-full p-6">
                {/* Patient Info Cards */}
                <div className="mb-6">
                    <PatientsInfo patient={patientData} isLoading={isLoading} />
                </div>
                
                {/* Tabs */}
                <div className="mt-4">
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        items={tabItems}
                        className="custom-tab-bar mt-3!"
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

export default PatientsDetails;