import React from "react";
import {
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
  FaVenusMars,
  FaHashtag
} from "react-icons/fa";
import { Button, Spin } from "antd";
import Images from "@/components/images";

interface PatientData {
  full_name?: string;
  phone_number?: string;
  email?: string;
  gender?: string;
  dob?: string;
  createdAt?: string;
  customer_id?: string;
  avatar?: string;
}

interface PatientsInfoProps {
  patient: PatientData | null;
  isLoading?: boolean;
}

const PatientsInfo: React.FC<PatientsInfoProps> = ({ patient, isLoading }) => {
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Format date with time for registration
  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).replace(',', ' ·');
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-2xl p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="w-full bg-white rounded-2xl p-6 text-center">
        <p className="text-gray-500">Patient not found</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row gap-6 items-start">

        {/* Profile Image */}
        <div className="w-full sm:w-40 sm:h-40 lg:w-45 lg:h-45 rounded-xl overflow-hidden bg-gray-200 flex items-center justify-center mx-auto sm:mx-0">
          <img
            src={patient.avatar || Images.ambulance}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex-1 w-full">

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-semibold text-[#000A0F]">
              {patient.full_name || 'N/A'}
            </h2>

            <div className="flex items-center gap-3 flex-wrap w-full sm:w-auto">
              <Button className="rounded-xl px-3 py-2 bg-[#FDF6F6] flex-1 sm:flex-none">
                <FaPhone className="w-4 h-4 text-[#DB4A47]" />
              </Button>

              <Button
                type="primary"
                className="text-white rounded-xl px-4 py-2 flex items-center gap-2 flex-1 sm:flex-none justify-center"
              >
                <FaEnvelope className="w-4 h-4" />
                Chat with User
              </Button>
            </div>
          </div>

          <div className="border-t border-gray-200 my-4" />

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 text-sm">

            {/* Patient ID */}
            <div className="flex items-start gap-2">
              <FaHashtag className="mt-1 text-gray-500 flex-shrink-0" />
              <div>
                <p className="text-gray-500">Patient ID</p>
                <p className="font-medium">
                  {patient.customer_id?.slice(-8).toUpperCase() || 'N/A'}
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="flex items-start gap-2">
              <FaPhone className="mt-1 text-gray-500 flex-shrink-0" />
              <div>
                <p className="text-gray-500">Contact</p>
                <p className="font-medium">{patient.phone_number || 'N/A'}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-2">
              <FaEnvelope className="mt-1 text-gray-500 flex-shrink-0" />
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-medium">{patient.email || 'N/A'}</p>
              </div>
            </div>

            {/* Gender */}
            <div className="flex items-start gap-2">
              <FaVenusMars className="mt-1 text-gray-500 flex-shrink-0" />
              <div>
                <p className="text-gray-500">Gender</p>
                <p className="font-medium">
                  {patient.gender || 'Not specified'}
                </p>
              </div>
            </div>

            {/* Date of Birth */}
            <div className="flex items-start gap-2">
              <FaCalendarAlt className="mt-1 text-gray-500 flex-shrink-0" />
              <div>
                <p className="text-gray-500">Date of Birth</p>
                <p className="font-medium">
                  {patient.dob ? formatDate(patient.dob) : 'N/A'}
                </p>
              </div>
            </div>

            {/* Registration Date */}
            <div className="flex items-start gap-2">
              <FaCalendarAlt className="mt-1 text-gray-500 flex-shrink-0" />
              <div>
                <p className="text-gray-500">Reg. Date & Time</p>
                <p className="font-medium">
                  {formatDateTime(patient.createdAt)}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientsInfo;