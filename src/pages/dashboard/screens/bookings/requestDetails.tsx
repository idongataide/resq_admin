// components/requestDetails.tsx
import { useState } from "react";
import {
  FiCalendar,
  FiPhone,
  FiMapPin,
  FiCreditCard,
  FiNavigation,
  FiHome,
  FiEdit,
  FiChevronUp,
} from "react-icons/fi";
import { Button } from "antd";
import UpdateLocationModal from "./UpdateLocationModal";

interface RequestDetailsProps {
  booking: any; 
  bookingType?: string;
}

const RequestDetails: React.FC<RequestDetailsProps> = ({ booking, bookingType }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Format date function
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).replace(',', ' ');
  };

  // Get state from address (simplified - you might want to parse this properly)
  const getStateFromAddress = (address: string) => {
    if (!address) return "N/A";
    const parts = address.split(',');
    return parts[parts.length - 2]?.trim() || parts[parts.length - 1]?.trim() || "N/A";
  };

  return (
    <>
      <div className="w-full max-w-5xl rounded-2xl shadow-xs bg-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#FDF6F6] px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center rounded-md bg-red-100">
              <FiNavigation className="w-4 h-4 text-[#DB4A47]" />
            </div>
            <h2 className="text-sm font-semibold tracking-wide text-[#808D97] uppercase">
              Request Details
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Button
              type="text"
              onClick={() => setIsModalOpen(true)}
              className="text-[#DB4A47]! flex items-center font-medium! gap-2"
            >
              <FiEdit className="w-4 h-4 text-[#DB4A47]" />
              Update Location
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
                  <p className="text-[#808D97]">Request Date & Time</p>
                  <p className="font-medium text-[#000A0F]">
                    {formatDate(booking.created_at)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiMapPin className="w-4 h-4 text-[#808D97] mt-1" />
                <div>
                  <p className="text-[#808D97]">State</p>
                  <p className="font-medium text-[#000A0F]">
                    {getStateFromAddress(booking.start_address)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiMapPin className="w-4 h-4 text-[#808D97] mt-1" />
                <div>
                  <p className="text-[#808D97]">Pickup Address</p>
                  <p className="font-medium text-[#000A0F]">
                    {booking.start_address || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiNavigation className="w-4 h-4 text-[#808D97] mt-1" />
                <div>
                  <p className="text-[#808D97]">Landmark</p>
                  <p className="font-medium text-[#000A0F]">
                    {booking.user_data?.landmark || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiNavigation className="w-4 h-4 text-[#808D97] mt-1" />
                <div>
                  <p className="text-[#808D97]">Apartment Direction</p>
                  <p className="font-medium text-[#000A0F]">
                    {booking.user_data?.house_description || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <FiPhone className="w-4 h-4 text-[#808D97] mt-1" />
                <div>
                  <p className="text-[#808D97]">Request Type</p>
                  <p className="font-medium text-[#000A0F]">
                    {bookingType === "non-emergency" ? "Non-Emergency" : "Emergency"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiPhone className="w-4 h-4 text-[#808D97] mt-1" />
                <div>
                  <p className="text-[#808D97]">Emergency Number</p>
                  <p className="font-medium text-[#000A0F]">
                    {booking.customer_data?.customer_phone || booking.phone_number || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiCreditCard className="w-4 h-4 text-[#808D97] mt-1" />
                <div>
                  <p className="text-[#808D97]">Payment Method</p>
                  <p className="font-medium text-[#000A0F] capitalize">
                    {booking.payment_method || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiHome className="w-4 h-4 text-[#808D97] mt-1" />
                <div>
                  <p className="text-[#808D97]">Drop Off</p>
                  <p className="font-medium text-[#000A0F]">
                    {booking.end_address || "N/A"}
                  </p>
                </div>
              </div>

              {/* <div className="flex items-start gap-3">
                <FiNavigation className="w-4 h-4 text-[#808D97] mt-1" />
                <div>
                  <p className="text-[#808D97]">Dropoff Coordinates</p>
                  <p className="font-medium text-[#000A0F]">
                    {booking.end_coord?.latitude && booking.end_coord?.longitude
                      ? `${booking.end_coord.latitude.toFixed(4)}, ${booking.end_coord.longitude.toFixed(4)}`
                      : "N/A"}
                  </p>
                </div>
              </div> */}
            </div>
          </div>

          {/* Emergency Notes */}
          <div className="mt-8 bg-[#F5F6F7] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <FiEdit className="w-4 h-4 text-[#354959]" />
              <p className="text-[#354959] font-medium">Emergency Notes</p>
            </div>
            <p className="text-sm text-[#000A0F] leading-relaxed">
              {booking.emergency_description || booking.special_requirements || "No notes provided"}
            </p>
          </div>
        </div>
      </div>

      {/* Update Location Modal */}
      <UpdateLocationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bookingId={booking.booking_id}
        initialData={{
          pickup_address: booking.start_address,
          dropoff_address: booking.end_address,
          start_coord: booking.start_coord,
          end_coord: booking.end_coord,
        }}
      />
    </>
  );
};

export default RequestDetails;