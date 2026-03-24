import React from "react";
import {
  FiCalendar,
  FiPhone,
  FiNavigation,
  FiEdit,
  FiChevronUp,
  FiEye,
} from "react-icons/fi";
import { Button } from "antd";

interface PatientData {
  blood_group?: string;
  current_medications?: string;
  allegies?: string;
  chronic_illness?: string;
  disabilities?: string;
}

interface PatientsHealthDetailsProps {
  patient: PatientData | null;
}

const PatientsHealthDetails: React.FC<PatientsHealthDetailsProps> = ({ patient }) => {
  // Default values if patient data is not available
  const healthData = {
    blood_group: patient?.blood_group || 'N/A',
    current_medications: patient?.current_medications || 'None',
    allegies: patient?.allegies || 'None',
    chronic_illness: patient?.chronic_illness || 'None',
    disabilities: patient?.disabilities || 'None',
  };

  return (
    <>
      <div className="w-full max-w-2xl rounded-2xl shadow-sm bg-white overflow-hidden mt-3!">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#FDF6F6] px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center rounded-md bg-red-100">
              <FiNavigation className="w-4 h-4 text-[#DB4A47]" />
            </div>
            <h2 className="text-sm font-semibold tracking-wide text-[#000A0F] uppercase">
              Health Details
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Button
              type="text"
              className="text-[#DB4A47]! flex items-center font-medium! gap-2"
            >
              <FiEye className="w-4 h-4 text-[#DB4A47]" />
              View Medical Report
            </Button>

            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
              <FiChevronUp className="w-4 h-4 text-[#DB4A47]" />
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 text-sm text-[#808D97]">
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <FiCalendar className="w-4 h-4 text-[#808D97] mt-1" />
                <div>
                  <p className="text-[#808D97]">Blood Type</p>
                  <p className="font-medium text-[#000A0F]">{healthData.blood_group}</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <FiPhone className="w-4 h-4 text-[#808D97] mt-1" />
                <div>
                  <p className="text-[#808D97]">Current Medications</p>
                  <p className="font-medium text-[#000A0F]">{healthData.current_medications}</p>
                </div>
              </div>                    
            </div>
          </div>

          {/* Emergency Notes */}
          <div className="flex items-center gap-4">
            <div className="mt-8 bg-[#F5F6F7] rounded-xl p-5 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FiEdit className="w-4 h-4 text-[#354959]" />
                <p className="text-[#354959] font-medium">Allergies</p>
              </div>
              <p className="text-sm text-[#000A0F] leading-relaxed">
                {healthData.allegies}
              </p>
            </div>
            <div className="mt-8 bg-[#F5F6F7] rounded-xl p-5 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FiEdit className="w-4 h-4 text-[#354959]" />
                <p className="text-[#354959] font-medium">Chronic Illness</p>
              </div>
              <p className="text-sm text-[#000A0F] leading-relaxed">
                {healthData.chronic_illness}
              </p>
            </div>
          </div>

          {/* Disabilities (if available) */}
          {healthData.disabilities !== 'None' && (
            <div className="mt-4 bg-[#F5F6F7] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <FiEdit className="w-4 h-4 text-[#354959]" />
                <p className="text-[#354959] font-medium">Disabilities</p>
              </div>
              <p className="text-sm text-[#000A0F] leading-relaxed">
                {healthData.disabilities}
              </p>
            </div>
          )}
        </div>
      </div>
    </> 
  );
};

export default PatientsHealthDetails;