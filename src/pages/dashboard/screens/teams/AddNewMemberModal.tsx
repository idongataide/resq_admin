import { Modal, Input, Button, Select, Form } from "antd";
import { FiX } from "react-icons/fi";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";
import { createAdminUser } from "@/api/teamsApi";


const { Option } = Select;

interface AddNewMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddNewMemberModal = ({ isOpen, onClose, onSuccess }: AddNewMemberModalProps) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate } = useSWRConfig();

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    const loadingToast = toast.loading("Adding new member...");

    try {
      const payload = {
        full_name: values.full_name,
        email: values.email,
        phone_number: values.phone_number,
        position: values.position,
        access_level: values.access_level?.join(", "), // Convert array to comma-separated string
      };

      const response = await createAdminUser(payload);

      if (response?.status === "ok") {
        toast.success("Member added successfully!", { id: loadingToast });
        form.resetFields();
        mutate("/admins/operations/user-admins"); // Refresh the users list
        onSuccess?.();
        onClose();
      } else {
        toast.error(response?.message || "Failed to add member", { id: loadingToast });
      }
    } catch (error: any) {
      console.error("Add member error:", error);
      toast.error(error?.response?.data?.msg || error?.message || "Failed to add member", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={500}
      closeIcon={<FiX className="text-[#354959]" />}
      destroyOnClose
    >
      <div className="bg-[#F3F5F9] px-4 py-6">
        <h2 className="text-xl font-semibold text-[#000A0F]">Add New Member</h2>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="px-6! py-6!"
      >
        {/* Row 1 */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <Form.Item
            name="full_name"
            label="Name"
            rules={[{ required: true, message: "Name is required" }]}
            className="mb-0"
          >
            <Input size="large" placeholder="Enter full name" className="rounded-lg!" />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Gender (optional)"
            className="mb-0"
          >
            <Select size="large" placeholder="Select gender" className="rounded-lg!" allowClear>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
        </div>
        
        {/* Row 2 */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <Form.Item
            name="position"
            label="Position"
            rules={[{ required: true, message: "Position is required" }]}
            className="mb-0"
          >
            <Input size="large" placeholder="Enter position" className="rounded-lg!" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Enter a valid email" }
            ]}
            className="mb-0"
          >
            <Input size="large" placeholder="Enter email" className="rounded-lg!" />
          </Form.Item>
        </div>

        {/* Phone Number */}
        <div className="mb-5">
          <Form.Item
            name="phone_number"
            label="Phone Number (optional)"
            className="mb-0"
          >
            <Input size="large" placeholder="Enter phone number" className="rounded-lg!" />
          </Form.Item>
        </div>

        {/* Access Level */}
        <div className="mb-8">
          <Form.Item
            name="access_level"
            label="Access Level"
            rules={[{ required: true, message: "Access level is required" }]}
            className="mb-0"
          >
            <Select
              mode="multiple"
              size="large"
              placeholder="Select access level"
              className="w-full rounded-lg!"
            >
              <Option value="view_bookings">View Bookings</Option>
              <Option value="manage_bookings">Manage Bookings</Option>
              <Option value="view_users">View Users</Option>
              <Option value="manage_users">Manage Users</Option>
              <Option value="view_reports">View Reports</Option>
              <Option value="manage_settings">Manage Settings</Option>
              <Option value="full_access">Full Access</Option>
            </Select>
          </Form.Item>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            size="large"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-8 bg-[#F5EAEA]! text-[#DB4A47]! font-medium! border-none!"
          >
            Cancel
          </Button>

          <Button
            size="large"
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            className="px-8 bg-[#DB4A47]! hover:bg-[#c63d3a]! border-none!"
          >
            Add Member
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddNewMemberModal;