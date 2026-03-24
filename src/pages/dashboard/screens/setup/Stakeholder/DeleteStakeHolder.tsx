import React, { useState } from "react";
import { Modal, Button } from "antd";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";
import Images from "@/components/images";
import { deleteStakeholder } from "@/api/settingsApi";


interface DeleteStakeholderModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  stakeholder: any | null;
}

const DeleteStakeholderModal: React.FC<DeleteStakeholderModalProps> = ({
  open,
  onClose,
  onSuccess,
  stakeholder,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { mutate: globalMutate } = useSWRConfig();

  const handleDelete = async () => {
    if (!stakeholder?.stakeholder_id) {
      toast.error("Stakeholder ID not found");
      return;
    }

    setIsDeleting(true);
    const loadingToast = toast.loading('Deleting stakeholder...');

    try {
      const response = await deleteStakeholder(stakeholder.stakeholder_id);

      if (response.status === 'ok') {
        toast.success('Stakeholder deleted successfully!', { id: loadingToast });
        globalMutate('/settings/stakeholders');
        onSuccess?.();
        onClose();
      } else {
        const errorMsg = response?.response?.data?.msg || response?.message || 'Failed to delete stakeholder';
        toast.error(errorMsg, { id: loadingToast });
      }
    } catch (error: any) {
      console.error('Error deleting stakeholder:', error);
      toast.error(error?.message || 'Failed to delete stakeholder', { id: loadingToast });
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
          <img src={Images.icon.question} alt="" />
        </div>
        
        <h3 className="text-xl font-semibold text-[#001417] mb-2">
          Delete Stakeholder
        </h3>
        
        <p className="text-sm text-[#354959] mb-8">
          This action would remove {stakeholder?.name} from the platform and is irreversible
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

export default DeleteStakeholderModal;