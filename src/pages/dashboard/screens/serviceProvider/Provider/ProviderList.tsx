import React, { useState } from "react";
import { Table, Button, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { FiX } from "react-icons/fi";
import {
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { FiClock } from "react-icons/fi";

import toast from "react-hot-toast";
import { useSWRConfig } from "swr";
import Images from "@/components/images";
import AddProviderModal from "./AddModal";
import UpdateProviderModal from "./EditModal";
import { deleteProvider } from "@/api/providerApi";
import { useProviders } from "@/hooks/useProvider";


interface Provider {
  provider_id: string;
  name: string;
  reg_number: string;
  email: string;
  phone_number: string;
  location?: string;
  contact_person?: string;
  location_coordinate?: {
    latitude: number;
    longitude: number;
  };
  createdAt: string;
}

const ProvidersList = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const navigate = useNavigate();
  const { data: providers, isLoading, mutate } = useProviders();
  const { mutate: globalMutate } = useSWRConfig();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).replace(',', ' ·');
  };

  const handleDelete = async () => {
    if (!selectedProvider?.provider_id) {
      toast.error("Provider ID not found");
      return;
    }
    
    setIsDeleting(true);
    const loadingToast = toast.loading('Deleting provider...');

    try {
      const response = await deleteProvider(selectedProvider.provider_id);
      
      if (response?.response?.data?.msg || response?.message) {
        const errorMsg = response?.response?.data?.msg || response?.message || 'Failed to delete provider';
        toast.error(errorMsg, { id: loadingToast });
      } else {
        toast.success('Provider deleted successfully!', { id: loadingToast });
        globalMutate('/providers/all');
        mutate();
        setIsDeleteModalOpen(false);
        setSelectedProvider(null);
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete provider', { id: loadingToast });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (provider: Provider) => {
    setSelectedProvider(provider);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (provider: Provider, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProvider(provider);
    setIsDeleteModalOpen(true);
  };

  const columns = [
    {
      title: "Reg. Date & Time",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => (
        <div className="flex items-center gap-2 text-[#354959]">
          <FiClock className="text-gray-400" />
          {formatDate(text)}
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Reg. No.",
      dataIndex: "reg_number",
      key: "reg_number",
    },
    {
      title: "Phone",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: "Contact Person",
      dataIndex: "contact_person",
      key: "contact_person",
      render: (text: string) => text || 'N/A',
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Provider) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="flex items-center gap-1 bg-[#F3F5F9]! text-[#354959]! hover:text-[#DB4A47]! border-none shadow-none"
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => handleDeleteClick(record, e)}
            className="flex items-center gap-1 bg-[#F3F5F9]! text-[#DB4A47]! border-none shadow-none"
          />
          <Button
            type="text"
            className="bg-[#FDF6F6]! text-[#DB4A47]! px-4 rounded-lg!"
            onClick={() => navigate(`/service-providers/${record.provider_id}`)}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="p-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-[#354959] font-bold uppercase text-sm">
              ALL SERVICE PROVIDERS ({providers?.length || 0})
            </h1>

            <div className="flex gap-3">
              <Button
                icon={<SearchOutlined />}
                className="bg-[#FDF6F6]! text-[#DB4A47]! border-0!"
              />
              <Button
                icon={<UploadOutlined />}
                className="bg-[#FDF6F6]! text-[#DB4A47]! border-0!"
              />
              <Button
                icon={<FilterOutlined />}
                className="bg-[#FDF6F6]! text-[#DB4A47]! border-0!"
              >
                Filter
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className="bg-[#DB4A47]! rounded-lg!"
                onClick={() => setIsAddModalOpen(true)}
              >
                Add New
              </Button>
            </div>
          </div>

          {/* Table */}
          <Table
            rowSelection={{
              selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys),
            }}
            columns={columns}
            dataSource={providers}
            rowKey="provider_id"
            loading={isLoading}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
            }}
            rowClassName="hover:bg-gray-50 cursor-pointer"
            onRow={(record) => ({
              onClick: () => navigate(`/service-providers/${record.provider_id}`)
            })}
          />

          {/* Footer */}
          <div className="flex justify-between items-center text-sm text-[#808D97] mt-4">
            <span>Showing page 1 of {Math.ceil((providers?.length || 0) / 10)}</span>
          </div>
        </div>
      </div>

      {/* Add Provider Modal */}
      <AddProviderModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProviderAdded={() => {
          mutate();
          setIsAddModalOpen(false);
        }}
      />

      {/* Update Provider Modal */}
      <UpdateProviderModal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProvider(null);
        }}
        onProviderUpdated={() => {
          mutate();
          setIsEditModalOpen(false);
          setSelectedProvider(null);
        }}
        provider={selectedProvider}
      />

      {/* Delete Provider Modal */}
      <Modal
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
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
            Delete Provider
          </h3>
          
          <p className="text-sm text-[#354959] mb-8">
            This action would remove {selectedProvider?.name} from the platform and is irreversible
          </p>

          <div className="flex justify-center gap-4">
            <Button
              size="large"
              onClick={() => setIsDeleteModalOpen(false)}
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
    </>
  );
};

export default ProvidersList;