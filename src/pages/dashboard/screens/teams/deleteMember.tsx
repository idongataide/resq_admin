// components/DeleteConfirmationModal.tsx
import { Modal, Button } from "antd";
import { FiX, FiAlertTriangle } from "react-icons/fi";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";
import { deleteAdminUser } from "@/api/teamsApi";
import Images from "@/components/images";



interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSuccess?: () => void;
}

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  user, 
  onSuccess 
}: DeleteConfirmationModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { mutate } = useSWRConfig();

  const handleDelete = async () => {
    if (!user?.auth_id) return;

    setIsDeleting(true);
    const loadingToast = toast.loading("Deleting user...");

    try {
      const response = await deleteAdminUser(user.auth_id);

      if (response?.status === "ok") {
        toast.success("User deleted successfully!", { id: loadingToast });
        mutate("/admins/operations/user-admins"); // Refresh the users list
        onSuccess?.();
        onClose();
      } else {
        toast.error(response?.message || "Failed to delete user", { id: loadingToast });
      }
    } catch (error: any) {
      console.error("Delete user error:", error);
      toast.error(error?.response?.data?.msg || error?.message || "Failed to delete user", { id: loadingToast });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={450}
      closeIcon={<FiX className="text-[#808D97]" />}
      destroyOnClose
    >
       <div className="text-left! p-6">
        <div className="flex justify-left! mb-4">
          <img src={Images.icon.question} alt="Delete confirmation" />
        </div>
        
        <h2 className="text-xl font-semibold text-[#000A0F] mb-2">
          Delete User
        </h2>
        
        <p className="text-[#808D97] mb-6">
          Are you sure you want to delete{" "}
          <strong className="text-[#000A0F]">{user?.full_name}</strong>? 
          This action cannot be undone.
        </p>

        <div className="flex gap-4">
          <Button
            size="large"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 bg-[#F5EAEA]! text-[#DB4A47]! font-medium! border-none!"
          >
            Cancel
          </Button>

          <Button
            size="large"
            danger
            onClick={handleDelete}
            loading={isDeleting}
            className="flex-1 bg-[#DB4A47]! text-white! border-none! hover:bg-[#c63d3a]!"
          >
            Delete User
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;