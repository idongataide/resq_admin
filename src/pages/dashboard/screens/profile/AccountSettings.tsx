import React, { useState } from "react";
import { Modal, Input, Button, Switch, Form } from "antd";
import { FiX } from "react-icons/fi";
import Images from "@/components/images";
import { updatePassword } from "@/api/profileApi";
import { toast } from "react-hot-toast";

const AccountSettings = () => {
  const [twoFactor, setTwoFactor] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [form] = Form.useForm();
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePasswordUpdate = async (values: {
    old_password: string;
    new_password: string;
    confirm_password: string;
    }) => {
    if (values.new_password !== values.confirm_password) {
        form.setFields([
        {
            name: "confirm_password",
            errors: ["Passwords do not match"],
        },
        ]);
        return;
    }

    try {
        setIsUpdating(true);

        const res = await updatePassword({
        old_password: values.old_password,
        new_password: values.new_password,
        });

        if (res?.status === "ok") {
        toast.success("Password updated successfully!");
        form.resetFields();
        setResetOpen(false);
        }
            else {
            const errorMsg = res?.response?.data?.msg || "Failed to update password. Please try again.";
            toast.error(errorMsg);
        }
    } finally {
        setIsUpdating(false);
    }
    };

  return (
    <div className="mt-6">
      {/* ACCOUNT SETTINGS CARD */}
      <div className="bg-[#fff] rounded-2xl p-6 space-y-6">
        <h2 className="text-[#354959] font-semibold uppercase text-sm">
          ACCOUNT SETTINGS
        </h2>

        {/* Two Factor */}
        <div className="flex justify-between items-center border-b border-[#DADCDD] pb-5">
          <div>
            <p className="font-medium text-[#000A0F]">Two-Factor Authentication</p>
            <p className="text-sm text-[#808D97]">
              Protect your account with an extra layer of security.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#FCEAEA] px-4 py-2 rounded-lg">
            <span className="text-[#DB4A47] font-medium">
              {twoFactor ? "Enabled" : "Enable"}
            </span>
            <Switch
              checked={twoFactor}
              onChange={(checked) => setTwoFactor(checked)}
            />
          </div>
        </div>

        {/* Reset Password */}
        <div className="flex justify-between items-center border-b border-[#DADCDD] pb-5">
          <div>
            <p className="font-medium text-[#000A0F]">Reset Password</p>
            <p className="text-sm text-[#808D97]">
              Lorem ipsum dolor sit amet
            </p>
          </div>

          <Button
            onClick={() => setResetOpen(true)}
            className="text-[#DB4A47]! border-[#F3D1D1]! bg-white!"
          >
            Reset Password
          </Button>
        </div>

        {/* Delete Account */}
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium text-[#000A0F]">Delete Account</p>
            <p className="text-sm text-[#808D97]">
              This would remove your organisation details and irreversible.
            </p>
          </div>

          <Button
            danger
            onClick={() => setDeleteOpen(true)}
            className="bg-white!"
          >
            Delete Account
          </Button>
        </div>
      </div>

      {/* RESET PASSWORD MODAL */}
      <Modal
        open={resetOpen}
        onCancel={() => setResetOpen(false)}
        footer={null}
        centered
        width={500}
        closeIcon={<FiX className="text-[#354959]" />}
      >
        {/* Custom Header */}
        <div className="bg-[#F3F5F9] px-6 py-6  rounded-t-lg">
          <h2 className="text-xl font-semibold text-[#000A0F]">
            Reset Password
          </h2>
        </div>

        <Form
            form={form}
            layout="vertical"
            onFinish={handlePasswordUpdate}
            className="p-6! space-y-5"
            >
            <Form.Item
                label="Current Password"
                name="old_password"
                rules={[{ required: true, message: "Enter current password" }]}
            >
                <Input.Password size="large" />
            </Form.Item>

            <Form.Item
                label="New Password"
                name="new_password"
                rules={[{ required: true, message: "Enter new password" }]}
            >
                <Input.Password size="large" />
            </Form.Item>

            <Form.Item
                label="Confirm New Password"
                name="confirm_password"
                dependencies={["new_password"]}
                rules={[
                { required: true, message: "Confirm your password" },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                    if (!value || getFieldValue("new_password") === value) {
                        return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                    },
                }),
                ]}
            >
                <Input.Password size="large" />
            </Form.Item>

            <div className="flex justify-end gap-4 pt-6">
                <Button
                size="large"
                onClick={() => setResetOpen(false)}
                className="px-8 bg-[#F3EAEA]! text-[#DB4A47]! border-0!"
                >
                Cancel
                </Button>

                <Button
                htmlType="submit"
                size="large"
                loading={isUpdating}
                className="px-8 bg-[#DB4A47]! text-white! border-0!"
                >
                Update Password
                </Button>
            </div>
            </Form>
      </Modal>

      {/* DELETE ACCOUNT MODAL */}
      <Modal
        open={deleteOpen}
        onCancel={() => setDeleteOpen(false)}
        footer={null}
        centered
        width={420}
        closeIcon={null}
        >
        <div className="text-left space-y-4 p-6">
            <div className="flex justify-start">
            <img src={Images.icon.question} alt="delete"/>
            </div>

            <h3 className="text-lg font-semibold">
            Delete Account?
            </h3>

            <p className="text-[#808D97]">
            This action will delete your account and this is irreversible
            </p>

            <div className="flex justify-center gap-4 pt-4">
            <Button
                size="large"
                onClick={() => setDeleteOpen(false)}
                className="flex-1 px-8 bg-[#F3EAEA]! text-[#DB4A47]! border-0!"
            >
                Cancel
            </Button>

            <Button
                size="large"
                danger
                className="flex-1 px-8 bg-[#DB4A47]! text-white! border-0!"
            >
                Delete Account
            </Button>
            </div>
        </div>
        </Modal>
    </div>
  );
};

export default AccountSettings;
