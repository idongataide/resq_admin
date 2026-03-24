import React, { useState } from "react";
import { Modal, Button } from "antd";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";
import Images from "@/components/images";
import { deleteBisProcess } from "@/api/settingsApi";

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  itemName: string;
  itemId: string;
  onSuccess?: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  open,
  onClose,
  itemName,
  itemId,
  onSuccess,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { mutate: globalMutate } = useSWRConfig();

  const handleDelete = async () => {
    if (!itemId) {
      toast.error("Document ID not found");
      return;
    }

    setIsDeleting(true);
    const loadingToast = toast.loading('Deleting document...');

    try {
      const response = await deleteBisProcess(itemId);
      
      if (response?.status === 'ok') {
        toast.success('Document deleted successfully', { id: loadingToast });
        globalMutate('/users/biz-process');
        onSuccess?.();
        onClose();
      } else {
        const errorMsg = response?.response?.data?.msg || response?.message || 'Failed to delete document';
        toast.error(errorMsg, { id: loadingToast });
      }
    } catch (error: any) {
      console.error('Error deleting document:', error);
      toast.error(error?.message || 'Failed to delete document', { id: loadingToast });
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
          <img src={Images.icon.question} alt="Delete confirmation" />
        </div>
        
        <h3 className="text-xl font-semibold text-[#001417] mb-2">
          Delete Business Process
        </h3>
        
        <p className="text-sm text-[#354959] mb-8">
          This action would remove "{itemName}" from the platform and is irreversible
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

export default DeleteConfirmationModal;