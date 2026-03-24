import React, { useState, useEffect, useRef } from "react";
import { Modal, Input, Button, Form } from "antd";
import { FiX } from "react-icons/fi";
import { FaFile, FaTrash } from "react-icons/fa";
import { FiUploadCloud } from "react-icons/fi";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";
import { axiosAPIInstance } from "@/api/interceptor";
import { getBisProcess } from "@/api/settingsApi";


interface AddEditBusinessProcessModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  initialData?: {
    _id: string;
    name: string;
    file?: string;
    size?: string;
  } | null;
  onSuccess?: () => void;
}

const AddEditBusinessProcessModal: React.FC<AddEditBusinessProcessModalProps> = ({
  open,
  onClose,
  mode,
  initialData,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [file, setFile] = useState<File | null>(null);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: globalMutate } = useSWRConfig();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      if (mode === 'add') {
        form.resetFields();
        setFile(null);
        setFileInfo(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else if (mode === 'edit' && initialData) {
        form.setFieldsValue({
          name: initialData.name,
        });
        if (initialData.file) {
          setFileInfo({
            name: initialData.name,
            size: 'Existing file'
          });
        }
      }
    }
  }, [open, mode, initialData, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      // Check file size (2MB max)
      if (f.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        return;
      }
      
      const ext = f.name.split('.').pop()?.toUpperCase() || 'FILE';
      setFile(f);
      setFileInfo({ 
        name: f.name, 
        size: `${ext} • ${(f.size / 1024).toFixed(1)}Kb` 
      });
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileInfo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (values: any) => {
    if (!values.name?.trim()) {
      toast.error('Please enter a document name');
      return;
    }

    // Only require a file if adding, or if editing and no file exists
    if (mode === 'add' && !file) {
      toast.error('Please upload a file');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading(
      mode === 'add' ? 'Adding business process...' : 'Updating business process...'
    );

    try {
      let bizId = initialData?._id;

      // For edit mode, first update the document name using PUT
      if (mode === 'edit' && bizId) {
        const updateResponse = await getBisProcess(
          { doc_name: values.name },
          'edit',
          bizId
        );
        
        if (updateResponse?.status === 'ok') {
          bizId = updateResponse?.data?._id || bizId;
        } else {
          const errorMsg = updateResponse?.response?.data?.msg || updateResponse?.message || 'Failed to update document name';
          throw new Error(errorMsg);
        }
      }
      // For add mode, create the document first using POST
      else if (mode === 'add') {
        const createResponse = await getBisProcess(
          { doc_name: values.name },
          'add'
        );
        
        if (createResponse?.status === 'ok') {
          bizId = createResponse?.data?._id;
        } else {
          const errorMsg = createResponse?.response?.data?.msg || createResponse?.message || 'Failed to create document';
          throw new Error(errorMsg);
        }
      }

      // If there's a file to upload (for both add and edit modes)
      if (file && bizId) {
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await axiosAPIInstance.post(
          `/settings/biz-image/${bizId}`, 
          formData,
           {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Accept': 'application/form-data'
            },
          }
        );

        if (uploadResponse?.data?.status === 'ok') {
          toast.success(
            mode === 'add' ? 'Business process added successfully' : 'Business process updated successfully',
            { id: loadingToast }
          );
          globalMutate('/settings/biz-process');
          
          form.resetFields();
          setFile(null);
          setFileInfo(null);
          
          onSuccess?.();
          onClose();
        } else {
          const errorMsg = uploadResponse?.data?.msg || `Failed to ${mode === 'edit' ? 'update' : 'upload'} file`;
          throw new Error(errorMsg);
        }
      } else if (mode === 'edit') {
        // If in edit mode and no file was selected, just consider it successful
        toast.success('Business process updated successfully', { id: loadingToast });
        globalMutate('/settings/biz-process');
        form.resetFields();
        setFile(null);
        setFileInfo(null);
        onSuccess?.();
        onClose();
      }
    } catch (error: any) {
      console.error('Error saving business process:', error);
      toast.error(error.message || `Failed to ${mode === 'edit' ? 'update' : 'add'} business process`, {
        id: loadingToast,
      });
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
          {mode === 'add' ? 'Add New Business Process' : 'Edit Business Process'}
        </h2>
      </div>

      {/* Body */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="px-6! py-6!"
      >
        {/* File Name */}
        <Form.Item
          name="name"
          label={<span className="block text-sm text-[#354959] mb-2">File Name</span>}
          rules={[{ required: true, message: 'Please enter file name' }]}
        >
          <Input
            size="large"
            className="rounded-lg!"
            placeholder="Enter file name"
          />
        </Form.Item>

        {/* Upload File */}
        <div className="mb-8">
          <label className="block text-sm text-[#354959] mb-2">
            Upload File
          </label>

          <div className="border border-dashed border-[#FFBB9E] rounded-lg p-4 py-5 flex items-center gap-4 min-h-[60px]">
            {fileInfo ? (
              <>
                <FaFile className="text-red-500 text-2xl" />
                <div className="flex-1">
                  <div className="font-medium text-[#475467]">{fileInfo.name}</div>
                  <div className="text-xs text-[#667085]">{fileInfo.size}</div>
                </div>
                <button 
                  onClick={handleRemoveFile} 
                  className="text-[#C21E1E] ml-2 cursor-pointer"
                  type="button"
                >
                  <FaTrash />
                </button>
              </>
            ) : (
              <>
                <label className="flex-1 cursor-pointer" htmlFor="file-upload">
                  <div className="flex items-center">
                    <div className="bg-[#FFF0EA] h-10 w-10 items-center flex justify-center rounded-full p-2 me-2">
                      <FiUploadCloud className="text-[#DB4A47]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[#475467] font-medium">Click to upload</span>
                      <span className="text-xs text-[#667085]">Any file type | 2mb max.</span>
                    </div>
                  </div>
                  <input
                    id="file-upload"
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                <button
                  className="px-2 py-1 bg-[#DB4A47] text-white rounded-md cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                >
                  Upload
                </button>
              </>
            )}
          </div>
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
            {mode === 'add' ? 'Add File' : 'Update File'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddEditBusinessProcessModal;