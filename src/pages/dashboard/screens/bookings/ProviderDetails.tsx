// components/ProviderDetails.tsx
import { useState } from "react";
import {
  FiUser,
  FiPhone,
  FiCalendar,
  FiTruck,
  FiChevronUp,
  FiCheckCircle,
  FiUserCheck,
} from "react-icons/fi";
import { FaEnvelope, FaPen } from "react-icons/fa";
import { Button, Spin } from "antd";
import AssignOperatorModal from "./AssignOperatorModal";
import { useSingleProvider } from "@/hooks/useProvider";
import { useSWRConfig } from "swr";

interface ProviderDetailsProps {
  booking: any; // Replace with your Booking type
}

const ProviderDetails: React.FC<ProviderDetailsProps> = ({ booking }) => {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  
  const { mutate } = useSWRConfig();
  
  // Get provider_id from booking
  const providerId = booking?.provider_id;
  const { provider, isLoading, mutate: mutateProvider } = useSingleProvider(providerId);

  // Get operation_status (default to 0 if not present)
  const operationStatus = booking?.operation_status ?? 0;

  // Format date function
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleAssigned = () => {
    mutate(`/bookings/${booking?.booking_id}`);
    mutate('/bookings');
    
    if (providerId) {
      mutateProvider();
    }
  };

  const providerDetails = {
    providerName: provider?.name || "Not Assigned",
    contact: provider?.phone_number || "N/A",
    email: provider?.email || "N/A",
    approvalDate: booking?.accepted_at 
      ? formatDate(booking.accepted_at)
      : "Not yet accepted",
    ambulancePlate: booking?.vehicle_plate || "N/A",
    colorModel: booking?.vehicle_model || "N/A",
    ambulanceLead: booking?.driver_name || "N/A",
    approvalReasons: booking?.booking_reason  || "No approval reasons provided",
  };

  const isProviderAssigned = !!providerId && !!provider;

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl rounded-2xl shadow-xs bg-white overflow-hidden mt-4 p-8 flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-5xl rounded-2xl shadow-xs bg-white overflow-hidden mt-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#FDF6F6] px-4 sm:px-6 py-4 gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center rounded-md bg-red-100 flex-shrink-0">
              <FiCheckCircle className="w-4 h-4 text-[#DB4A47]" />
            </div>
            <h2 className="text-sm font-semibold tracking-wide text-[#000A0F] uppercase">
              PROVIDER DETAILS
            </h2>
            {isProviderAssigned && operationStatus === 2 && (
              <span className="inline-flex items-center px-3 sm:px-4 py-1.5 bg-[#F8FEF5] rounded-full">
                <FiCheckCircle className="w-4 h-4 text-[#4EA507] mr-2 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-[#4EA507]">Assigned</span>
              </span>
            )}
            {operationStatus === 1 && (
              <span className="inline-flex items-center px-3 sm:px-4 py-1.5 bg-[#FFF7E8] rounded-full">
                <span className="w-2 h-2 bg-[#BB7F05] rounded-full mr-2"></span>
                <span className="text-xs sm:text-sm font-medium text-[#BB7F05]">Pending</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
            {/* Show Assign Operator for status 1 (Admin Accepted) */}
            {operationStatus === 1 && (
              <Button 
                onClick={() => setIsAssignModalOpen(true)}
                className="bg-[#DB4A47]! text-white! border-none! hover:bg-[#c63d3a]! text-xs sm:text-sm px-3 sm:px-4"
              >
                Assign Operator
              </Button>
            )}
            
            {/* Show Re-assign for status 2 (Assigned Operator) */}
            {operationStatus === 2 && isProviderAssigned && (
              <Button 
                onClick={() => setIsAssignModalOpen(true)}
                className="bg-[#DB4A47]! text-white! border-none! hover:bg-[#c63d3a]! text-xs sm:text-sm px-3 sm:px-4"
              >
                Re-assign
              </Button>
            )}
            
            {/* Show contact buttons when provider is assigned */}
            {operationStatus === 2 && isProviderAssigned && (
              <div className="flex items-center gap-2 sm:gap-3">
                {provider?.phone_number && (
                  <a href={`tel:${provider.phone_number}`} className="p-2 hover:bg-red-50 rounded-full transition-colors">
                    <FiPhone className="text-[#DB4A47] cursor-pointer hover:opacity-80 w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                )}
                {provider?.email && (
                  <a href={`mailto:${provider.email}`} className="p-2 hover:bg-red-50 rounded-full transition-colors">
                    <FaEnvelope className="text-[#DB4A47] cursor-pointer hover:opacity-80 w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                )}
              </div>
            )}
            
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center shadow-sm cursor-pointer hover:shadow-md transition-shadow">
              <FiChevronUp className="w-3 h-3 sm:w-4 sm:h-4 text-[#DB4A47]" />
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {provider?.account_status !== 0 && provider?.suspend_reason && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs sm:text-sm text-red-600">
                <span className="font-semibold">Suspended:</span> {provider.suspend_reason}
                {provider.unsuspend_date && ` (Expected to resume: ${new Date(provider.unsuspend_date).toLocaleDateString()})`}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-x-8 sm:gap-y-6 text-xs sm:text-sm text-[#808D97]">
            <div className="flex items-start gap-2 sm:gap-3">
              <FiUser className="w-4 h-4 sm:w-5 sm:h-5 text-[#808D97] mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[#808D97] text-xs sm:text-sm">Provider Name</p>
                <p className="font-medium text-[#000A0F] break-words">{providerDetails.providerName}</p>
              </div>
            </div>

            <div className="flex items-start gap-2 sm:gap-3">
              <FiPhone className="w-4 h-4 sm:w-5 sm:h-5 text-[#808D97] mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[#808D97] text-xs sm:text-sm">Contact</p>
                <p className="font-medium text-[#000A0F] break-words">{providerDetails.contact}</p>
              </div>
            </div>

            <div className="flex items-start gap-2 sm:gap-3">
              <FiCalendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#808D97] mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[#808D97] text-xs sm:text-sm">Approval Date & Time</p>
                <p className="font-medium text-[#000A0F] break-words">{providerDetails.approvalDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-2 sm:gap-3">
              <FiTruck className="w-4 h-4 sm:w-5 sm:h-5 text-[#808D97] mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[#808D97] text-xs sm:text-sm">Ambulance Plate</p>
                <p className="font-medium text-[#000A0F] break-words">{providerDetails.ambulancePlate}</p>
              </div>
            </div>

            <div className="flex items-start gap-2 sm:gap-3">
              <FiTruck className="w-4 h-4 sm:w-5 sm:h-5 text-[#808D97] mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[#808D97] text-xs sm:text-sm">Colour/Model</p>
                <p className="font-medium text-[#000A0F] break-words">{providerDetails.colorModel}</p>
              </div>
            </div>

            <div className="flex items-start gap-2 sm:gap-3">
              <FiUserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#808D97] mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[#808D97] text-xs sm:text-sm">Ambulance Lead Name</p>
                <p className="font-medium text-[#000A0F] break-words">{providerDetails.ambulanceLead}</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="bg-[#F5F6F7] rounded-xl p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <FaPen className="w-3 h-3 sm:w-4 sm:h-4 text-[#808D97] flex-shrink-0" />
                <p className="text-xs sm:text-sm text-[#354959] font-medium">Approval Reasons</p>
              </div>
              <p className="text-xs sm:text-sm text-[#000A0F] leading-relaxed break-words">
                {providerDetails.approvalReasons}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Assign Operator Modal */}
      <AssignOperatorModal
        open={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        bookingId={booking?.booking_id}
        onAssigned={handleAssigned}
      />
    </>
  );
};

export default ProviderDetails;