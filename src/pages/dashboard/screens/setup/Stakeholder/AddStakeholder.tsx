import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Form, Select } from "antd";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";
import { verifyAccount } from "@/api/banks";
import { DefaultOptionType } from "antd/es/select";
import { useBanksList } from "@/hooks/useSettings";
import { addStakeholder } from "@/api/settingsApi";

const { Option } = Select;

interface AddStakeholderModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface Bank {
  name: string;
  code: string;
}

const AddStakeholderModal: React.FC<AddStakeholderModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [accountName, setAccountName] = useState<string>("");
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  
  const { data: bankList, isLoading: isLoadingBanks } = useBanksList();
  const { mutate: globalMutate } = useSWRConfig();

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      form.resetFields();
      setAccountName("");
      setSelectedBank(null);
    }
  }, [open, form]);

  const handleBankNameChange = (value: string, option: any) => {
    const bank = bankList?.find((b: Bank) => b.name === value);
    if (bank) {
      setSelectedBank(bank);
      form.setFieldsValue({ bank_code: bank.code });
    }
  };

  const handleAccountNumberChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const accountNumber = e.target.value;
    form.setFieldsValue({ account_number: accountNumber });
    
    // Reset account name when account number changes
    setAccountName("");
    
    // Only verify if we have both bank code and valid account number
    if (selectedBank?.code && accountNumber.length === 10) {
      setIsVerifying(true);
      
      try {
        const response = await verifyAccount({
          account_number: accountNumber,
          bank_code: selectedBank.code
        });
        
        if (response.status === 'ok' && response.data?.data?.account_name) {
          const name = response.data.data.account_name;
          setAccountName(name);
          form.setFieldsValue({ account_name: name });
          toast.success('Account verified successfully');
        } else {
          const errorMsg = response?.response?.data?.msg || 'Failed to verify account';
          toast.error(errorMsg);
          setAccountName("");
        }
      } catch (error: any) {
        console.error('Account verification error:', error);
        toast.error(error?.message || 'Failed to verify account');
        setAccountName("");
      } finally {
        setIsVerifying(false);
      }
    }
  };

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    const loadingToast = toast.loading("Adding stakeholder...");

    const payload = {
      name: values.name,
      bank_name: values.bank_name,
      bank_code: values.bank_code,
      account_number: values.account_number,
      account_name: values.account_name,
      amount: values.amount,
      amount_type: values.amount_type || 'percentage',
    };

    try {
      const response = await addStakeholder(payload);

      if (response.status === 'ok') {
        toast.success('Stakeholder added successfully', { id: loadingToast });
        globalMutate('/settings/stakeholders');
        
        form.resetFields();
        setAccountName("");
        setSelectedBank(null);
        
        onSuccess?.();
        onClose();
      } else {
        const errorMsg = response?.response?.data?.msg || response?.message || 'Failed to add stakeholder';
        toast.error(errorMsg, { id: loadingToast });
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast.error(error?.message || 'An error occurred while adding the stakeholder', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={500}
      closeIcon={<FiX className="text-[#354959]" />}
      destroyOnClose
    >
      {/* Header */}
      <div className="bg-[#F3F5F9] px-4 py-6">
        <h2 className="text-xl font-semibold text-[#000A0F]">
          Add New Stakeholder
        </h2>
      </div>

      {/* Body */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="px-6! py-6!"
        initialValues={{ amount_type: 'percentage' }}
      >
        {/* Name */}
        <Form.Item
          name="name"
          label={<span className="block text-sm text-[#354959]">Stakeholder Name</span>}
          rules={[{ required: true, message: 'Stakeholder name is required' }]}
        >
          <Input
            size="large"
            className="rounded-lg!"
            placeholder="Enter stakeholder name"
          />
        </Form.Item>

        {/* Hidden field for bank_code */}
        <Form.Item name="bank_code" hidden>
          <Input />
        </Form.Item>

        {/* Hidden field for account_name */}
        <Form.Item name="account_name" hidden>
          <Input />
        </Form.Item>

        {/* Bank name */}
        <Form.Item
          name="bank_name"
          label={<span className="block text-sm text-[#354959]">Bank name</span>}
          rules={[{ required: true, message: 'Please select a bank' }]}
        >
          <Select
            showSearch
            placeholder="Select bank"
            size="large"
            loading={isLoadingBanks}
            onChange={handleBankNameChange}
            filterOption={(input: string, option?: DefaultOptionType) => {
              const childrenText = option?.children as string | undefined;
              return childrenText ? childrenText.toLowerCase().includes(input.toLowerCase()) : false;
            }}
          >
            {bankList?.map((bank: Bank, index: number) => (
              <Option key={index} value={bank.name}>
                {bank.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Account number */}
        <Form.Item
          name="account_number"
          label={<span className="block text-sm text-[#354959]">Account number</span>}
          rules={[{ required: true, message: 'Please enter account number' }]}
        >
          <Input
            placeholder="Enter account number"
            size="large"
            onChange={handleAccountNumberChange}
            maxLength={10}
            type="number"
            className="rounded-lg!"
          />
        </Form.Item>

        {/* Account name display */}
        {isVerifying ? (
          <div className="bg-[#FFF0EA] rounded-md px-4 py-3 mb-4 text-[#FF6C2D] font-medium text-base">
            Fetching account name...
          </div>
        ) : accountName ? (
          <div className="bg-[#FFF0EA] rounded-md px-4 py-3 mb-4 text-[#FF6C2D] font-medium text-base">
            {accountName}
          </div>
        ) : null}

        {/* Amount Type */}
        <Form.Item
          name="amount_type"
          label={<span className="block text-sm text-[#354959]">Amount Type</span>}
          rules={[{ required: true, message: 'Please select amount type' }]}
        >
          <Select
            placeholder="Select amount type"
            size="large"
            className="rounded-lg!"
          >
            <Option value="percentage">Percentage (%)</Option>
            <Option value="amount">Fixed Amount (₦)</Option>
          </Select>
        </Form.Item>

        {/* Value (Percentage or Amount) */}
        <Form.Item
          name="amount"
          label={
            <span className="block text-sm text-[#354959]">
              {form.getFieldValue('amount_type') === 'percentage' ? 'Value (%)' : 'Amount (₦)'}
            </span>
          }
          rules={[{ required: true, message: 'Please enter value' }]}
        >
          <Input
            className="rounded-lg!"
            placeholder={form.getFieldValue('amount_type') === 'percentage' ? 'Enter percentage value' : 'Enter amount'}
            suffix={form.getFieldValue('amount_type') === 'percentage' ? '%' : '₦'}
            type="number"
            min="0"
            step="0.01"
          />
        </Form.Item>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
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
            Add Stakeholder
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddStakeholderModal;