// DeleteFee.tsx
import React, { useState } from "react";
import { Modal, Button } from "antd";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { deleteFee, deleteNonEmergencyFee } from "@/api/settingsApi";
import { useSWRConfig } from "swr";
import Images from "@/components/images";
import { useSettingsType } from "@/hooks/useSettingsType";

interface Fee {
  fee_id: string;
  name?: string;
  // Add other properties if needed
}

interface DeleteFeeModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  fee: Fee | null;
}

const DeleteFeeModal: React.FC<DeleteFeeModalProps> = ({
  open,
  onClose,
  onSuccess,
  fee,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { mutate: globalMutate } = useSWRConfig();
  const { isNonEmergency } = useSettingsType();

  const handleDelete = async () => {
    if (!fee?.fee_id) {
      toast.error("Fee ID not found");
      return;
    }
    
    setIsDeleting(true);
    const loadingToast = toast.loading(
      isNonEmergency ? 'Deleting non-emergency cost point...' : 'Deleting cost point...'
    );

    try {
      let response;
      
      if (isNonEmergency) {
        response = await deleteNonEmergencyFee(fee.fee_id);
      } else {
        response = await deleteFee(fee.fee_id);
      }
      
      // Check if response is an error
      if (response?.response?.data?.msg || response?.message) {
        const errorMsg = response?.response?.data?.msg || response?.message || 'Failed to delete cost point';
        toast.error(errorMsg, { id: loadingToast });
      } else if (response?.status === 'ok' || response?.success) {
        toast.success(
          isNonEmergency ? 'Non-emergency cost point deleted successfully!' : 'Cost point deleted successfully!',
          { id: loadingToast }
        );
        
        // Trigger mutations to refresh data based on type
        if (isNonEmergency) {
          globalMutate('/admins/settings/non-emergency-fees');
        } else {
          globalMutate('/settings/fees');
        }
        
        // Call success callback
        onSuccess?.();
        
        // Close modal
        onClose();
      } else {
        // Assume success if we got here without error
        toast.success(
          isNonEmergency ? 'Non-emergency cost point deleted successfully!' : 'Cost point deleted successfully!',
          { id: loadingToast }
        );
        if (isNonEmergency) {
          globalMutate('/admins/settings/non-emergency-fees');
        } else {
          globalMutate('/settings/fees');
        }
        onSuccess?.();
        onClose();
      }
    } catch (error: any) {
      console.error('Error deleting fee:', error);
      toast.error(error?.message || 'Failed to delete cost point', { id: loadingToast });
    } finally {
      setIsDeleting(false);
    }
  };

  // Dynamic title and content based on type
  const modalTitle = isNonEmergency ? "Delete Non-Emergency Cost Point" : "Delete Cost Point";
  const confirmationText = isNonEmergency 
    ? "This action would remove this non-emergency cost point from the platform and is irreversible"
    : "This action would remove this cost point from the platform and is irreversible";

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={400}
      closeIcon={<FiX className="text-[#354959]" />}
    >
      <div className="text-left! p-6">
        <div className="flex justify-left! mb-4">
          <img src={Images.icon.question} alt=""/>
        </div>
        
        <h3 className="text-xl font-semibold text-[#001417] mb-2">
          {modalTitle}
        </h3>
        
        <p className="text-sm text-[#354959] mb-8">
          {confirmationText}
        </p>

        <div className="flex justify-center gap-4">
          <Button
            size="large"
            onClick={onClose}
            disabled={isDeleting}
            className="px-8 bg-gray-100! flex-1 text-gray-700! border-none!"
          >
            Cancel
          </Button>

          <Button
            size="large"
            danger
            loading={isDeleting}
            onClick={handleDelete}
            className="px-8 bg-[#DB4A47]! flex-1 text-white! border-none! hover:bg-[#c63d3a]!"
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteFeeModal;