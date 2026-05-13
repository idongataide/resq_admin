import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaPhone,
  FaHashtag,
  FaMapMarkerAlt,
  FaEdit,
  FaArrowLeft
} from "react-icons/fa";
import { Button, Spin } from "antd";
import Images from "@/components/images";
import UpdateProviderModal from "./EditModal";
import { useSingleProvider } from "@/hooks/useProvider";

interface Provider {
  provider_id: string;
  name: string;
  reg_number: string;
  email: string;
  phone_number: string;
  location: string;
  contact_person: string;
  location_cordinate?: {
    type: string;
    coordinates: [number, number];
  };
  account_status: number;
  suspend_reason: string;
  unsuspend_date: string;
  unsuspend_time: string;
  gender: string;
  position: string;
  account_type: string;
  createdAt: string;
  updatedAt: string;
}

const ProviderDetails = () => {
  const { provider_id } = useParams<{ provider_id: string }>();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const { provider, isLoading, mutate } = useSingleProvider(provider_id);

  // Format coordinates
  const formatCoordinates = (location_cordinate?: Provider['location_cordinate']) => {
    if (!location_cordinate?.coordinates) return 'N/A';
    const [lng, lat] = location_cordinate.coordinates;
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  // Handle edit success
  const handleEditSuccess = () => {
    mutate(); // Revalidate the SWR data
    setIsEditModalOpen(false);
  };



  // Handle loading state
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  // Handle no provider found
  if (!provider) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <p className="text-gray-500">Provider not found</p>
      </div>
    );
  }

  return (
    <>
      {/* Back Button */}
      <div className="mb-4">
        <Button
          icon={<FaArrowLeft />}
          onClick={() => navigate('/service-providers')}
          className="flex items-center gap-2 bg-transparent! border-none! text-[#354959] hover:text-[#DB4A47]!"
        >
          Back to Providers
        </Button>
      </div>

      <div className="w-full bg-[#F9FAFB] rounded-xl border border-gray-200">
        <div className="p-6 pl-0">
          {/* 12 Column Grid */}
          <div className="grid grid-cols-12 gap-8">

            {/* Profile Image - 4 columns */}
            <div className="col-span-12 md:col-span-3">
              <div className="w-full h-60 rounded-xl overflow-hidden">
                <img
                  src={Images.ambulance}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Details - 8 columns */}
            <div className="col-span-12 md:col-span-9">
              
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-[#000A0F] capitalize">
                  {provider.name}
                </h2>

                <div className="flex items-center gap-3">
                  <Button
                    icon={<FaPhone className="text-[#DB4A47]" />}
                    className="rounded-lg bg-[#FDF6F6]! border-none!"
                    onClick={() => window.location.href = `tel:${provider.phone_number}`}
                  />
                  <Button
                    icon={<FaEnvelope className="text-[#DB4A47]" />}
                    className="rounded-lg bg-[#FDF6F6]! border-none!"
                    onClick={() => window.location.href = `mailto:${provider.email}`}
                  />
                  <Button
                    icon={<FaEdit />}
                    className="rounded-lg bg-[#FFF1F1]! text-[#DB4A47]! border-none!"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    Edit Profile
                  </Button>
                </div>
              </div>

              <div className="border-t border-gray-200 mb-6" />

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                
                {/* Column 1 */}
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <FaHashtag className="mt-1 text-gray-500" />
                    <div>
                      <p className="text-gray-500">Provider Name</p>
                      <p className="font-medium text-[#000A0F]">
                        {provider.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="mt-1 text-gray-500" />
                    <div>
                      <p className="text-gray-500">Address</p>
                      <p className="font-medium text-[#000A0F]">
                        {provider.location || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <FaHashtag className="mt-1 text-gray-500" />
                    <div>
                      <p className="text-gray-500">Reg. Number</p>
                      <p className="font-medium text-[#000A0F]">
                        {provider.reg_number}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FaPhone className="mt-1 text-gray-500" />
                    <div>
                      <p className="text-gray-500">Phone</p>
                      <p className="font-medium text-[#000A0F]">
                        {provider.phone_number}
                      </p>
                    </div>
                  </div>

                </div>

                {/* Column 3 */}
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <FaHashtag className="mt-1 text-gray-500" />
                    <div>
                      <p className="text-gray-500">Coordinates</p>
                      <p className="font-medium text-[#000A0F]">
                        {formatCoordinates(provider.location_cordinate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FaEnvelope className="mt-1 text-gray-500" />
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium text-[#000A0F]">
                        {provider.email}
                      </p>
                    </div>
                  </div>

               
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Provider Modal */}
      <UpdateProviderModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onProviderUpdated={handleEditSuccess}
        provider={provider}
      />
    </>
  );
};

export default ProviderDetails;