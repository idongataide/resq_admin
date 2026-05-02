// components/settings/EditFeeModal.tsx
import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Select } from "antd";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { updateFee, updateNonEmergencyFee } from "@/api/settingsApi";
import { useSWRConfig } from "swr";
import { useSettingsType } from "@/hooks/useSettingsType";

interface Fee {
  fee_id: string;
  name: string;
  amount: number;
  tag?: string;
  slug?: string;
  amount_type?: string;
  amount_sufix?: string;
  system_generated?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface EditFeeModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  fee: Fee | null;
}

interface FormValues {
  name: string;
  amount: number;
  amount_type: "percentage" | "fixed";
}

const EditFeeModal: React.FC<EditFeeModalProps> = ({
  open,
  onClose,
  onSuccess,
  fee,
}) => {
  const [form] = Form.useForm<FormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate: globalMutate } = useSWRConfig();
  const { isNonEmergency } = useSettingsType();

  useEffect(() => {
    if (fee && open) {
      form.setFieldsValue({
        name: fee.name || '',
        amount: fee.amount || 0,
        amount_type: (fee.amount_type?.toLowerCase() === 'percentage' ? 'percentage' : 'fixed') as "percentage" | "fixed",
      });
    }
  }, [fee, open, form]);

  const handleSubmit = async (values: FormValues) => {
    if (!fee?.fee_id) {
      toast.error("Fee ID not found");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading(
      isNonEmergency ? 'Updating non-emergency cost point...' : 'Updating cost point...'
    );

    try {
      let response;
      
      if (isNonEmergency) {
        response = await updateNonEmergencyFee(fee.fee_id, {
          name: values.name,
          amount: values.amount.toString(),
          amount_type: values.amount_type,
        });
      } else {
        response = await updateFee(fee.fee_id, {
          name: values.name,
          amount: values.amount.toString(),
          amount_type: values.amount_type,
        });
      }
      
      // Check if response is an error
      if (response?.response?.data?.msg || response?.message) {
        const errorMsg = response?.response?.data?.msg || response?.message || 'Failed to update cost point';
        toast.error(errorMsg, { id: loadingToast });
      } else if (response?.status === 'ok') {
        toast.success(
          isNonEmergency ? 'Non-emergency cost point updated successfully!' : 'Cost point updated successfully!',
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
        handleClose();
      } else {
        toast.success(
          isNonEmergency ? 'Non-emergency cost point updated successfully!' : 'Cost point updated successfully!',
          { id: loadingToast }
        );
        if (isNonEmergency) {
          globalMutate('/admins/settings/non-emergency-fees');
        } else {
          globalMutate('/settings/fees');
        }
        onSuccess?.();
        handleClose();
      }
    } catch (error: any) {
      console.error('Error updating fee:', error);
      toast.error(error?.message || 'Failed to update cost point', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  // Watch the type field to conditionally change the amount label and placeholder
  const selectedType = Form.useWatch('amount_type', form);

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      centered
      width={500}
      closeIcon={<FiX className="text-[#354959]" />}
    >
      {/* Header */}
      <div className="bg-[#F3F5F9] px-4 py-6">
        <h2 className="text-xl font-semibold text-[#000A0F]">
          {isNonEmergency ? "Edit Non-Emergency Cost Point" : "Edit Cost Point"}
        </h2>
      </div>

      {/* Body */}
      <div className="px-6 py-6">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          {/* Cost Name */}
          <Form.Item
            name="name"
            label="Cost Name"
            rules={[
              { required: true, message: 'Please enter cost name' },
              { min: 2, message: 'Cost name must be at least 2 characters' },
              { max: 100, message: 'Cost name cannot exceed 100 characters' }
            ]}
          >
            <Input
              size="large"
              className="rounded-lg!"
              placeholder="Enter cost name"
            />
          </Form.Item>

          {/* Type Selection */}
          <Form.Item
            name="amount_type"
            label="Cost Type"
            rules={[{ required: true, message: 'Please select cost type' }]}
          >
            <Select
              size="large"
              className="rounded-lg!"
              placeholder="Select type"
              options={[
                { label: 'Percentage (%)', value: 'percentage' },
                { label: 'Fixed Amount', value: 'fixed' }
              ]}
            />
          </Form.Item>

          {/* Amount */}
          <Form.Item
            name="amount"
            label={selectedType === 'percentage' ? 'Percentage' : 'Amount'}
            rules={[
              { required: true, message: `Please enter ${selectedType === 'percentage' ? 'percentage' : 'amount'}` },
              {
                validator: (_, value) => {
                  if (!value && value !== 0) return Promise.reject(new Error(`${selectedType === 'percentage' ? 'Percentage' : 'Amount'} is required`));
                  const num = parseFloat(value);
                  if (isNaN(num) || num < 0) {
                    return Promise.reject(new Error(`Please enter a valid ${selectedType === 'percentage' ? 'percentage' : 'amount'}`));
                  }
                  if (selectedType === 'percentage' && num > 100) {
                    return Promise.reject(new Error('Percentage cannot exceed 100'));
                  }
                  if (selectedType === 'fixed' && num <= 0) {
                    return Promise.reject(new Error('Amount must be greater than 0'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
            extra={selectedType === 'percentage' ? 'Value between 0 and 100' : 'Enter the fixed amount'}
          >
            <Input
              size="large"
              className="rounded-lg!"
              placeholder={selectedType === 'percentage' ? "Enter percentage" : "Enter amount"}
              prefix={selectedType === 'percentage' ? "%" : "#"}
              type="number"
              min="0"
              step={selectedType === 'percentage' ? "1" : "0.01"}
            />
          </Form.Item>

          {/* Buttons */}
          <Form.Item className="mb-0">
            <div className="flex justify-end gap-4">
              <Button
                size="large"
                onClick={handleClose}
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
                Update Cost
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default EditFeeModal;