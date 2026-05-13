import React, { useState } from "react";
import { Table, Button, Modal, Input } from "antd";
import { useParams } from "react-router-dom";
import {
  SearchOutlined,
  FilterOutlined,
  UploadOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { FiClock } from "react-icons/fi";
import Images from "@/components/images";
import toast from "react-hot-toast";
import { updateServiceStatus } from "@/api/providerApi";
import { useProviderServices } from "@/hooks/useProvider";

interface Service {
  service_id: string;
  auth_id: string;
  provider_id: string;
  name: string;
  amount: number;
  status: number; // 0 = Pending, 1 = Approved, 2 = Rejected
  service_type?: string;
  category?: string;
  rejected_note?: string;
  createdAt: string;
  updatedAt: string;
  provider_data?: Array<{
    _id: string;
    name: string;
    email: string;
    phone_number: string;
  }>;
}

const ServiceCostTable = () => {
  const { provider_id } = useParams<{ provider_id: string }>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [reason, setReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: services, isLoading, mutate } = useProviderServices(provider_id);

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not modified";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).replace(',', ' ·');
  };

  // Handle approve
  const handleApprove = async () => {
    const serviceId = selectedService?.service_id;
    if (!serviceId) return;

    setIsProcessing(true);
    const loadingToast = toast.loading('Approving service...');

    try {
      const response = await updateServiceStatus(serviceId, {
        status: "1", // "1" for approve
      });
      
      if (response.status === 'ok') {
        toast.success('Service approved successfully!', { id: loadingToast });
        mutate(); // Refresh the list
        setApproveOpen(false);
        setSelectedService(null);
      } else {
        const errorMsg = response?.response?.data?.msg || response?.message || 'Failed to approve service';
        toast.error(errorMsg, { id: loadingToast });
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to approve service', { id: loadingToast });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle reject
  const handleReject = async () => {
    const serviceId = selectedService?.service_id;
    if (!serviceId) return;
    
    if (!reason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setIsProcessing(true);
    const loadingToast = toast.loading('Rejecting service...');

    try {
      const response = await updateServiceStatus(serviceId, {
        status: "2", // "2" for reject
        reason: reason,
      });
      
      if (response.status === 'ok') {
        toast.success('Service rejected successfully!', { id: loadingToast });
        mutate(); // Refresh the list
        setRejectOpen(false);
        setReason("");
        setSelectedService(null);
      } else {
        const errorMsg = response?.response?.data?.msg || response?.message || 'Failed to reject service';
        toast.error(errorMsg, { id: loadingToast });
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to reject service', { id: loadingToast });
    } finally {
      setIsProcessing(false);
    }
  };

  // Get status badge
  const getStatusBadge = (status: number) => {
    const statusConfig = {
      0: { bg: '#FFF7E8', text: '#BB7F05', label: 'Pending' },      // Pending
      1: { bg: '#F8FEF5', text: '#4EA507', label: 'Approved' },      // Approved
      2: { bg: '#FEE9E7', text: '#DB4A47', label: 'Rejected' },      // Rejected
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig[0];
    
    return (
      <span
        className="px-3 py-1 rounded-md text-sm font-medium"
        style={{ backgroundColor: config.bg, color: config.text }}
      >
        ● {config.label}
      </span>
    );
  };

  const columns = [
    {
      title: "Last Modified",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (_text: string, record: Service) => (
        <div className="flex items-center gap-2 text-[#354959]">
          <FiClock className="text-gray-400" />
          {formatDate(record.updatedAt || record.createdAt)}
        </div>
      ),
    },
    {
      title: "Service Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => (
        <span>₦{amount?.toLocaleString()}</span>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: string) => category || "—",
    },
    {
      title: "Service Type",
      dataIndex: "service_type",
      key: "service_type",
      render: (type: string) => type || "—",
    },
    {
      title: "Status",
      key: "status",
      render: (_: any, record: Service) => getStatusBadge(record.status),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Service) => {
        // If status is 0 (Pending): Show both Approve and Reject
        if (record.status === 0) {
          return (
            <div className="flex gap-3">
              <Button
                icon={<CheckOutlined />}
                className="bg-[#E6F4EA]! text-[#2E7D32]! border-0! rounded-lg!"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedService(record);
                  setApproveOpen(true);
                }}
              />
              <Button
                icon={<CloseOutlined />}
                className="bg-[#FBE9E7]! text-[#DB4A47]! border-0! rounded-lg!"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedService(record);
                  setRejectOpen(true);
                }}
              />
            </div>
          );
        }
        
        // If status is 1 (Approved): Show Reject only
        if (record.status === 1) {
          return (
            <div className="flex gap-3">
              <Button
                icon={<CloseOutlined />}
                className="bg-[#FBE9E7]! text-[#DB4A47]! border-0! rounded-lg!"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedService(record);
                  setRejectOpen(true);
                }}
              />
            </div>
          );
        }
        
        // If status is 2 (Rejected): Show Approve only
        if (record.status === 2) {
          return (
            <div className="flex gap-3">
              <Button
                icon={<CheckOutlined />}
                className="bg-[#E6F4EA]! text-[#2E7D32]! border-0! rounded-lg!"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedService(record);
                  setApproveOpen(true);
                }}
              />
            </div>
          );
        }
        
        return null;
      },
    },
  ];

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-[#354959] font-bold uppercase text-sm">
            SERVICE COST POINTS ({services?.length || 0})
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
          </div>
        </div>

        {/* Table */}
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
          columns={columns}
          dataSource={services}
          rowKey={(record) => record.service_id}
          loading={isLoading}
          pagination={{
            pageSize: 8,
            showSizeChanger: false,
          }}
          rowClassName="hover:bg-gray-50"
        />

        {/* Footer */}
        <div className="flex justify-between items-center text-sm text-[#808D97] mt-4">
          <span>Showing page 1 of {Math.ceil((services?.length || 0) / 8)}</span>
          <span>Total: {services?.length || 0} services</span>
        </div>
      </div>

      {/* Approve Modal */}
      <Modal
        open={approveOpen}
        footer={null}
        onCancel={() => {
          setApproveOpen(false);
          setSelectedService(null);
        }}
        centered
      >
        <div className="space-y-4 p-6">
          <img src={Images.icon.caution} alt="img" />

          <h2 className="text-xl font-semibold">Approve Cost Point?</h2>

          <p className="text-gray-500">
            This action would approve{" "}
            <strong>{selectedService?.name}</strong>
          </p>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              size="large"
              onClick={() => {
                setApproveOpen(false);
                setSelectedService(null);
              }}
              disabled={isProcessing}
              className="px-8 bg-[#F5EAEA]! text-[#DB4A47]! border-none!"
            >
              Cancel
            </Button>

            <Button
              size="large"
              type="primary"
              loading={isProcessing}
              className="px-8 bg-[#DB4A47]! border-none!"
              onClick={handleApprove}
            >
              Approve
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        open={rejectOpen}
        footer={null}
        onCancel={() => {
          setRejectOpen(false);
          setReason("");
          setSelectedService(null);
        }}
        centered
      >
        <div className="space-y-4 p-6">
          <img src={Images.icon.caution} alt="img" />

          <h2 className="text-xl font-semibold">Reject Cost Point?</h2>

          <p className="text-gray-500">
            This action would reject{" "}
            <strong>{selectedService?.name}</strong>.
          </p>

          <Input.TextArea
            rows={6}
            placeholder="Reason for rejection"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[100px]!"
          />

          <div className="flex justify-end gap-4 mt-6">
            <Button
              size="large"
              onClick={() => {
                setRejectOpen(false);
                setReason("");
                setSelectedService(null);
              }}
              disabled={isProcessing}
              className="px-8 bg-[#F5EAEA]! text-[#DB4A47]! border-none!"
            >
              Cancel
            </Button>

            <Button
              size="large"
              type="primary"
              loading={isProcessing}
              className="px-8 bg-[#DB4A47]! border-none!"
              onClick={handleReject}
            >
              Reject
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ServiceCostTable;