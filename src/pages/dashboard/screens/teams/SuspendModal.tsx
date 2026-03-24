import { Modal, Input, Button, DatePicker } from "antd";
import { FiX, FiAlertCircle } from "react-icons/fi";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";
import dayjs from "dayjs";
import { updateAdminUserStatus } from "@/api/teamsApi";
const { TextArea } = Input;

interface SuspendMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSuccess?: () => void;
}

const SuspendMemberModal = ({ isOpen, onClose, user, onSuccess }: SuspendMemberModalProps) => {
  const [reason, setReason] = useState("");
  const [unsuspendDate, setUnsuspendDate] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate } = useSWRConfig();

  const handleSuspend = async () => {
    if (!user?.auth_id) return;

    if (!reason.trim()) {
      toast.error("Please provide a reason for suspension");
      return;
    }

    if (!unsuspendDate) {
      toast.error("Please select an unsuspend date");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Suspending user...");

    try {
      const response = await updateAdminUserStatus(user.auth_id, {
        status: 2, // 2 = suspended
        reason: reason.trim(),
        unsuspend_date: dayjs(unsuspendDate).format("YYYY-MM-DD"),
      });

      if (response?.status === "ok") {
        toast.success("User suspended successfully!", { id: loadingToast });
        mutate("/admins/operations/user-admins"); // Refresh the users list
        onSuccess?.();
        handleClose();
      } else {
        toast.error(response?.message || "Failed to suspend user", { id: loadingToast });
      }
    } catch (error: any) {
      console.error("Suspend user error:", error);
      toast.error(error?.response?.data?.msg || error?.message || "Failed to suspend user", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActivate = async () => {
    if (!user?.auth_id) return;

    setIsSubmitting(true);
    const loadingToast = toast.loading("Activating user...");

    try {
      const response = await updateAdminUserStatus(user.auth_id, {
        status: 1, // 1 = active
      });

      if (response?.status === "ok") {
        toast.success("User activated successfully!", { id: loadingToast });
        mutate("/admins/operations/user-admins"); // Refresh the users list
        onSuccess?.();
        handleClose();
      } else {
        toast.error(response?.message || "Failed to activate user", { id: loadingToast });
      }
    } catch (error: any) {
      console.error("Activate user error:", error);
      toast.error(error?.response?.data?.msg || error?.message || "Failed to activate user", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason("");
    setUnsuspendDate(null);
    onClose();
  };

  const isUserSuspended = user?.account_status === 1;

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      centered
      width={500}
      closeIcon={<FiX className="text-[#354959]" />}
      destroyOnClose
    >
      {/* Header */}
      <div className="bg-[#F3F5F9] px-4 py-6">
        <h2 className="text-xl font-semibold text-[#000A0F]">
          {isUserSuspended ? "Activate Member" : "Suspend Member"}
        </h2>
        <p className="text-[#354959] mt-1">
          {isUserSuspended 
            ? `This action would activate ${user?.full_name}'s account.` 
            : `This action would suspend ${user?.full_name}'s account.`
          }
        </p>
      </div>

      {/* Body */}
      <div className="px-6 py-6">
        {!isUserSuspended ? (
          <>
            {/* Suspension Reason */}
            <div className="mb-5">
              <label className="block text-sm text-[#354959] mb-2">
                Reason for Suspension <span className="text-red-500">*</span>
              </label>
              <TextArea
                rows={4}
                size="large"
                placeholder="Enter reason for suspension..."
                className="rounded-lg!"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            {/* Unsuspend Date */}
            <div className="mb-8">
              <label className="block text-sm text-[#354959] mb-2">
                Unsuspend Date <span className="text-red-500">*</span>
              </label>
              <DatePicker
                size="large"
                className="w-full rounded-lg!"
                placeholder="Select date to unsuspend"
                value={unsuspendDate}
                onChange={(date) => setUnsuspendDate(date)}
                minDate={dayjs()}
                format="YYYY-MM-DD"
              />
              <p className="text-xs text-[#808D97] mt-1">
                Account will be automatically reactivated on this date
              </p>
            </div>

            {/* Warning Note */}
            <div className="mb-6 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-2">
                <FiAlertCircle className="text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-yellow-700">
                  Suspended users will not be able to access the system until the unsuspend date.
                </p>
              </div>
            </div>
          </>
        ) : (
          // Activation Warning
          <div className="mb-6 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start gap-2">
              <FiAlertCircle className="text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-green-700">
                Activating this user will restore their access to the system immediately.
              </p>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            size="large"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-8 bg-[#F5EAEA]! text-[#DB4A47]! font-medium! border-none!"
          >
            Cancel
          </Button>

          {!isUserSuspended ? (
            <Button
              size="large"
              type="primary"
              danger
              loading={isSubmitting}
              onClick={handleSuspend}
              disabled={!reason.trim() || !unsuspendDate}
              className="px-8 bg-[#DB4A47]! hover:bg-[#c63d3a]! border-none!"
            >
              Suspend
            </Button>
          ) : (
            <Button
              size="large"
              type="primary"
              loading={isSubmitting}
              onClick={handleActivate}
              className="px-8 bg-[#4EA507]! hover:bg-[#3d8205]! border-none!"
            >
              Activate
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SuspendMemberModal;