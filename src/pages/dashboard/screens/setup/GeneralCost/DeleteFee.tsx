import React, { useState } from "react";
import { Modal, Button } from "antd";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { deleteFee } from "@/api/settingsApi";
import { useSWRConfig } from "swr";
import Images from "@/components/images";

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

  const handleDelete = async () => {
    if (!fee?.fee_id) {
      toast.error("Fee ID not found");
      return;
    }
    
    setIsDeleting(true);
    const loadingToast = toast.loading('Deleting cost point...');

    try {
      const response = await deleteFee(fee.fee_id);
      
      // Check if response is an error
      if (response?.response?.data?.msg || response?.message) {
        const errorMsg = response?.response?.data?.msg || response?.message || 'Failed to delete cost point';
        toast.error(errorMsg, { id: loadingToast });
      } else if (response?.status === 'ok' || response?.success) {
        toast.success('Cost point deleted successfully!', { id: loadingToast });
        
        // Trigger mutations to refresh data
        globalMutate('/settings/fees');
        
        // Call success callback
        onSuccess?.();
        
        // Close modal
        onClose();
      } else {
        // Assume success if we got here without error
        toast.success('Cost point deleted successfully!', { id: loadingToast });
        globalMutate('/settings/fees');
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
          Delete Cost Point
        </h3>
       
        
        <p className="text-sm text-[#354959] mb-8">
          This action would remove this cost point from the platform and is irrversible
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