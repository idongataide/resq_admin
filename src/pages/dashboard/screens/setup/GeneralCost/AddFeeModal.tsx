// components/settings/AddFeeModal.tsx
import React, { useState } from "react";
import { Modal, Form, Input, Button, Select } from "antd";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { addFees, addNonEmergencyFee } from "@/api/settingsApi";
import { useSWRConfig } from "swr";
import { useSettingsType } from "@/hooks/useSettingsType";

interface AddFeeModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormValues {
  cost_name: string;
  amount: number;
  // type: "percentage" | "fixed";
}

const AddFeeModal: React.FC<AddFeeModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm<FormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate: globalMutate } = useSWRConfig();
  const {  isNonEmergency } = useSettingsType();

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    const loadingToast = toast.loading(
      isNonEmergency ? 'Adding non-emergency cost point...' : 'Adding cost point...'
    );

    try {
      let response;
      
      if (isNonEmergency) {
        // Use non-emergency API
        response = await addNonEmergencyFee({
          name: values.cost_name,
          amount: values.amount,
          // amount_type: values.type,
        });
      } else {
        // Use emergency API
        response = await addFees({
          name: values.cost_name,
          amount: values.amount,
          // type: values.type,
        });
      }
      
      // Check if response is an error
      if (response?.response?.data?.msg || response?.message) {
        const errorMsg = response?.response?.data?.msg || response?.message || 'Failed to add cost point';
        toast.error(errorMsg, { id: loadingToast });
      } else if (response?.status === 'ok' || response?.success || response?.id) {
        toast.success(
          isNonEmergency ? 'Non-emergency cost point added successfully!' : 'Cost point added successfully!',
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
        
        // Close modal and reset form
        form.resetFields();
        onClose();
      } else {
        // Assume success if we got here without error
        toast.success(
          isNonEmergency ? 'Non-emergency cost point added successfully!' : 'Cost point added successfully!',
          { id: loadingToast }
        );
        if (isNonEmergency) {
          globalMutate('/admins/settings/non-emergency-fees');
        } else {
          globalMutate('/settings/fees');
        }
        onSuccess?.();
        form.resetFields();
        onClose();
      }
    } catch (error: any) {
      console.error('Error adding fee:', error);
      toast.error(error?.message || 'Failed to add cost point', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  // Watch the type field to conditionally change the amount label and placeholder
  const selectedType = Form.useWatch('type', form);

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
          {isNonEmergency ? "Add New Non-Emergency Cost Point" : "Add New Cost Point"}
        </h2>
      </div>

      {/* Body */}
      <div className="px-6 py-6">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ cost_name: '', amount: undefined, type: 'fixed' }}
        >
          {/* Cost Name */}
          <Form.Item
            name="cost_name"
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
          {/* <Form.Item
            name="type"
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
          </Form.Item> */}

          {/* Amount */}
          <Form.Item
            name="amount"
            label={selectedType === 'percentage' ? 'Percentage' : 'Amount'}
            rules={[
              { required: true, message: `Please enter ${selectedType === 'percentage' ? 'percentage' : 'amount'}` },
              {
                validator: (_, value) => {
                  if (!value) return Promise.reject(new Error(`${selectedType === 'percentage' ? 'Percentage' : 'Amount'} is required`));
                  const num = parseFloat(value);
                  if (isNaN(num) || num <= 0) {
                    return Promise.reject(new Error(`Please enter a valid ${selectedType === 'percentage' ? 'percentage' : 'amount'} greater than 0`));
                  }
                  if (selectedType === 'percentage' && (num < 0 || num > 100)) {
                    return Promise.reject(new Error('Percentage must be between 0 and 100'));
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
                Add Cost
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default AddFeeModal;