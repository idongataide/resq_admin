// components/AssignOperatorModal.tsx
import React, { useState } from "react";
import { Modal, Button, Select, Spin } from "antd";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";
import { useProviders } from "@/hooks/useProvider";
import { assignBookingRequest } from "@/api/bookingsApi";



interface AssignOperatorModalProps {
  open: boolean;
  onClose: () => void;
  bookingId: string;
  onAssigned?: () => void;
}

interface Provider {
  provider_id: string;
  name: string;
}

const { Option } = Select;

const AssignOperatorModal: React.FC<AssignOperatorModalProps> = ({
  open,
  onClose,
  bookingId,
  onAssigned,
}) => {
  const [selectedProviderId, setSelectedProviderId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: providers, isLoading } = useProviders();
  const { mutate } = useSWRConfig();

  const handleAssign = async () => {
    if (!selectedProviderId) {
      toast.error("Please select a provider");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Assigning operator...");

    try {
      const payload = {
        booking_id: bookingId,
        provider_id: selectedProviderId,
      };

      const response = await assignBookingRequest(payload);

      if (response?.status === "ok") {
        toast.success("Operator assigned successfully!", { id: loadingToast });
        mutate(`/providers/${selectedProviderId}`); // Refresh provider data
        onAssigned?.();
        onClose();
      } else {
        toast.error(response?.message || "Failed to assign operator", { id: loadingToast });
      }
    } catch (error: any) {
      console.error("Assign error:", error);
      toast.error(error?.response?.data?.msg || error?.message || "Failed to assign operator", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={500}
      closeIcon={<FiX className="text-[#808D97]" />}
      destroyOnClose
    >
      <div className="bg-[#F3F5F9] px-4 py-6 mb-6">
        <h2 className="text-xl font-semibold text-[#000A0F]">Assign Operator</h2>
      </div>

      <div className="px-6 pb-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Spin />
          </div>
        ) : (
          <Select
            placeholder="Select ambulance provider"
            className="w-full"
            size="large"
            value={selectedProviderId || undefined}
            onChange={(value) => setSelectedProviderId(value)}
            notFoundContent="No providers available"
            loading={isLoading}
          >
            {providers?.map((provider: Provider) => (
              <Option key={provider.provider_id} value={provider.provider_id}>
                {provider.name}
              </Option>
            ))}
          </Select>
        )}

        {/* Buttons */}
        <div className="flex justify-between gap-4 pt-6 mt-4 border-t border-gray-200">
          <Button
            size="large"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full bg-[#F5EAEA]! text-[#DB4A47]! font-medium! border-none!"
          >
            Cancel
          </Button>

          <Button
            size="large"
            type="primary"
            onClick={handleAssign}
            loading={isSubmitting}
            disabled={!selectedProviderId || isSubmitting}
            className="w-full bg-[#DB4A47]! hover:bg-[#c63d3a]! border-none!"
          >
            Assign Operator
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AssignOperatorModal;