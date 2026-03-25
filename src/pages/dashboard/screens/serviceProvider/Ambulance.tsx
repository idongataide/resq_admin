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
import { updateAmbulanceStatus } from "@/api/providerApi";
import { useProviderAmbulances } from "@/hooks/useProvider";

interface Ambulance {
  ambulance_id: string;
  provider_id: string;
  lead_id: string;
  plate_number: string;
  color: string;
  model: string;
  ambulance_type: string;
  file: string;
  suspend_reason: string;
  status: number; // This comes from API as number
  createdAt: string;
  updatedAt: string;
  lead_data: {
    full_name: string;
    email: string;
    phone_number: string;
  };
}

// Status mapping
const statusMap = {
  0: 'pending',
  1: 'approved',
  2: 'rejected'
} as const;

type StatusType = 'pending' | 'approved' | 'rejected' | 'suspended';

const Ambulances = () => {
  const { provider_id } = useParams<{ provider_id: string }>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [activateOpen, setActivateOpen] = useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedAmbulance, setSelectedAmbulance] = useState<Ambulance | null>(null);
  const [reason, setReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: ambulances, isLoading, mutate } = useProviderAmbulances(provider_id);

  // Format date
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

  // Get status as string
  const getStatusString = (record: Ambulance): StatusType => {
    if (record.status === 2 && record.suspend_reason) {
      return 'suspended';
    }
    return statusMap[record.status as keyof typeof statusMap] || 'pending';
  };

  // Handle approve
  const handleApprove = async () => {
    if (!selectedAmbulance?.ambulance_id) return;

    setIsProcessing(true);
    const loadingToast = toast.loading('Approving ambulance...');

    try {
      const response = await updateAmbulanceStatus(selectedAmbulance.ambulance_id, {
        status: "1", // Send as string "1" for activate
      });
      
      if (response.status === 'ok') {
        toast.success('Ambulance approved successfully!', { id: loadingToast });
        mutate(); // Refresh the list
        setApproveOpen(false);
        setSelectedAmbulance(null);
      } else {
        const errorMsg = response?.response?.data?.msg || response?.message || 'Failed to approve ambulance';
        toast.error(errorMsg, { id: loadingToast });
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to approve ambulance', { id: loadingToast });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle reject
  const handleReject = async () => {
    if (!selectedAmbulance?.ambulance_id) return;
    if (!reason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setIsProcessing(true);
    const loadingToast = toast.loading('Rejecting ambulance...');

    try {
      const response = await updateAmbulanceStatus(selectedAmbulance.ambulance_id, {
        status: "2", // Send as string "2" for suspend
        reason: reason,
      });
      
      if (response.status === 'ok') {
        toast.success('Ambulance rejected successfully!', { id: loadingToast });
        mutate(); // Refresh the list
        setRejectOpen(false);
        setReason("");
        setSelectedAmbulance(null);
      } else {
        const errorMsg = response?.response?.data?.msg || response?.message || 'Failed to reject ambulance';
        toast.error(errorMsg, { id: loadingToast });
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to reject ambulance', { id: loadingToast });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle suspend
  const handleSuspend = async () => {
    if (!selectedAmbulance?.ambulance_id) return;
    if (!reason.trim()) {
      toast.error('Please provide a reason for suspension');
      return;
    }

    setIsProcessing(true);
    const loadingToast = toast.loading('Suspending ambulance...');

    try {
      const response = await updateAmbulanceStatus(selectedAmbulance.ambulance_id, {
        status: "2", // Send as string "2" for suspend
        reason: reason,
      });
      
      if (response.status === 'ok') {
        toast.success('Ambulance suspended successfully!', { id: loadingToast });
        mutate(); // Refresh the list
        setSuspendOpen(false);
        setReason("");
        setSelectedAmbulance(null);
      } else {
        const errorMsg = response?.response?.data?.msg || response?.message || 'Failed to suspend ambulance';
        toast.error(errorMsg, { id: loadingToast });
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to suspend ambulance', { id: loadingToast });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle activate
  const handleActivate = async () => {
    if (!selectedAmbulance?.ambulance_id) return;

    setIsProcessing(true);
    const loadingToast = toast.loading('Activating ambulance...');

    try {
      const response = await updateAmbulanceStatus(selectedAmbulance.ambulance_id, {
        status: "1", // Send as string "1" for activate
      });
      
      if (response.status === 'ok') {
        toast.success('Ambulance activated successfully!', { id: loadingToast });
        mutate(); // Refresh the list
        setActivateOpen(false);
        setSelectedAmbulance(null);
      } else {
        const errorMsg = response?.response?.data?.msg || response?.message || 'Failed to activate ambulance';
        toast.error(errorMsg, { id: loadingToast });
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to activate ambulance', { id: loadingToast });
    } finally {
      setIsProcessing(false);
    }
  };

  // Get status badge
  const getStatusBadge = (record: Ambulance) => {
    const statusString = getStatusString(record);

    const statusConfig: Record<StatusType, { bg: string; text: string; label: string }> = {
      pending: { bg: '#FFF7E8', text: '#BB7F05', label: 'Pending' },
      approved: { bg: '#F8FEF5', text: '#4EA507', label: 'Approved' },
      rejected: { bg: '#FEE9E7', text: '#DB4A47', label: 'Rejected' },
      suspended: { bg: '#FEE9E7', text: '#DB4A47', label: 'Suspended' },
    };

    const config = statusConfig[statusString] || statusConfig.pending;
    
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
      title: "Created Date & Time",
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
      title: "Vehicle Model",
      dataIndex: "model",
      key: "model",
    },
    {
      title: "Plate Number",
      dataIndex: "plate_number",
      key: "plate_number",
    },
    {
      title: "Type/Category",
      dataIndex: "ambulance_type",
      key: "ambulance_type",
      render: (text: string) => text?.toUpperCase(),
    },
    {
      title: "Status",
      key: "status",
      render: (_: any, record: Ambulance) => getStatusBadge(record),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Ambulance) => {
        const statusString = getStatusString(record);
        
        // For Pending: Show both Approve and Reject
        if (statusString === "pending") {
          return (
            <div className="flex gap-3">
              <Button
                icon={<CheckOutlined />}
                className="bg-[#E6F4EA]! text-[#2E7D32]! border-0! rounded-lg!"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAmbulance(record);
                  setApproveOpen(true);
                }}
              />
              <Button
                icon={<CloseOutlined />}
                className="bg-[#FBE9E7]! text-[#DB4A47]! border-0! rounded-lg!"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAmbulance(record);
                  setRejectOpen(true);
                }}
              />
            </div>
          );
        }
        
        // For Approved: Show Suspend only
        if (statusString === "approved") {
          return (
            <div className="flex gap-3">
              <Button
                icon={<CloseOutlined />}
                className="bg-[#FBE9E7]! text-[#DB4A47]! border-0! rounded-lg!"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAmbulance(record);
                  setSuspendOpen(true);
                }}
              />
            </div>
          );
        }
        
        // For Rejected: Show Approve only
        if (statusString === "rejected") {
          return (
            <div className="flex gap-3">
              <Button
                icon={<CheckOutlined />}
                className="bg-[#E6F4EA]! text-[#2E7D32]! border-0! rounded-lg!"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAmbulance(record);
                  setApproveOpen(true);
                }}
              />
            </div>
          );
        }
        
        // For Suspended: Show Activate only
        if (statusString === "suspended") {
          return (
            <div className="flex gap-3">
              <Button
                icon={<CheckOutlined />}
                className="bg-[#E6F4EA]! text-[#2E7D32]! border-0! rounded-lg!"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAmbulance(record);
                  setActivateOpen(true);
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
            AMBULANCES ({ambulances?.length || 0})
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
          dataSource={ambulances}
          rowKey="ambulance_id"
          loading={isLoading}
          pagination={{
            pageSize: 8,
            showSizeChanger: false,
          }}
          rowClassName="hover:bg-gray-50 cursor-pointer"
          onRow={(record) => ({
            onClick: () => {
              setSelectedAmbulance(record);
              setViewDetailsOpen(true);
            },
          })}
        />

        <div className="flex justify-between items-center text-sm text-[#808D97] mt-4">
          <span>Showing page 1 of {Math.ceil((ambulances?.length || 0) / 8)}</span>
        </div>
      </div>

      {/* Approve Modal */}
      <Modal
        open={approveOpen}
        footer={null}
        onCancel={() => {
          setApproveOpen(false);
          setSelectedAmbulance(null);
        }}
        centered
      >
        <div className="space-y-4 p-6">
          <img src={Images.icon.caution} alt="img" />

          <h2 className="text-xl font-semibold">Approve Ambulance?</h2>

          <p className="text-gray-500">
            This action would approve{" "}
            <strong>
              {selectedAmbulance?.model} - {selectedAmbulance?.plate_number}
            </strong>{" "}
            and is irreversible.
          </p>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              size="large"
              onClick={() => {
                setApproveOpen(false);
                setSelectedAmbulance(null);
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
          setSelectedAmbulance(null);
        }}
        centered
      >
        <div className="space-y-4 p-6">
          <img src={Images.icon.caution} alt="img" />

          <h2 className="text-xl font-semibold">Reject Ambulance?</h2>

          <p className="text-gray-500">
            This action would reject{" "}
            <strong>
              {selectedAmbulance?.model} - {selectedAmbulance?.plate_number}
            </strong>{" "}
            and is irreversible.
          </p>

          <Input.TextArea
            rows={6}
            placeholder="Reason for rejection"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          <div className="flex justify-end gap-4 mt-6">
            <Button
              size="large"
              onClick={() => {
                setRejectOpen(false);
                setReason("");
                setSelectedAmbulance(null);
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

      {/* Suspend Modal */}
      <Modal
        open={suspendOpen}
        footer={null}
        onCancel={() => {
          setSuspendOpen(false);
          setReason("");
          setSelectedAmbulance(null);
        }}
        centered
      >
        <div className="space-y-4 p-6">
          <img src={Images.icon.caution} alt="img" />

          <h2 className="text-xl font-semibold">Suspend Ambulance?</h2>

          <p className="text-gray-500">
            This action would suspend{" "}
            <strong>
              {selectedAmbulance?.model} - {selectedAmbulance?.plate_number}
            </strong>
          </p>

          <Input.TextArea
            rows={6}
            placeholder="Reason for suspension"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          <div className="flex justify-end gap-4 mt-6">
            <Button
              size="large"
              onClick={() => {
                setSuspendOpen(false);
                setReason("");
                setSelectedAmbulance(null);
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
              onClick={handleSuspend}
            >
              Suspend
            </Button>
          </div>
        </div>
      </Modal>

      {/* Activate Modal */}
      <Modal
        open={activateOpen}
        footer={null}
        onCancel={() => {
          setActivateOpen(false);
          setSelectedAmbulance(null);
        }}
        centered
      >
        <div className="space-y-4 p-6">
          <img src={Images.icon.caution} alt="img" />

          <h2 className="text-xl font-semibold">Activate Ambulance?</h2>

          <p className="text-gray-500">
            This action would activate{" "}
            <strong>
              {selectedAmbulance?.model} - {selectedAmbulance?.plate_number}
            </strong>
          </p>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              size="large"
              onClick={() => {
                setActivateOpen(false);
                setSelectedAmbulance(null);
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
              onClick={handleActivate}
            >
              Activate
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Details Modal */}
      <Modal
        open={viewDetailsOpen}
        footer={null}
        onCancel={() => {
          setViewDetailsOpen(false);
          setSelectedAmbulance(null);
        }}
        centered
        width={500}
      >
        {selectedAmbulance && (
          <div>
            <img src={Images.ambulancebg} alt="bg" />

            <div className="p-6 bg-white">
              <h3 className="text-[#000A0F] font-bold text-xl mb-3">
                {selectedAmbulance.model} {selectedAmbulance.plate_number}
              </h3>

              <div className="bg-[#F3F5F9] p-3 rounded-md space-y-3">
                <div className="flex justify-between">
                  <p className="text-sm">Model</p>
                  <p className="font-medium">{selectedAmbulance.model}</p>
                </div>

                <div className="flex justify-between">
                  <p className="text-sm">Plate Number</p>
                  <p className="font-medium">{selectedAmbulance.plate_number}</p>
                </div>

                <div className="flex justify-between">
                  <p className="text-sm">Color</p>
                  <p className="font-medium">{selectedAmbulance.color}</p>
                </div>

                <div className="flex justify-between">
                  <p className="text-sm">Type/Category</p>
                  <p className="font-medium">{selectedAmbulance.ambulance_type?.toUpperCase()}</p>
                </div>

                <div className="flex justify-between">
                  <p className="text-sm">Status</p>
                  <p className="font-medium capitalize">
                    {getStatusString(selectedAmbulance)}
                  </p>
                </div>

                {selectedAmbulance.suspend_reason && (
                  <div className="flex justify-between">
                    <p className="text-sm">Reason</p>
                    <p className="font-medium text-right">{selectedAmbulance.suspend_reason}</p>
                  </div>
                )}

                <div className="flex justify-between">
                  <p className="text-sm">Documents</p>
                  <div className="text-right">
                    {selectedAmbulance.file ? (
                      <Button
                        type="link"
                        className="text-[#DB4A47]! p-0"
                        onClick={() => window.open(selectedAmbulance.file, '_blank')}
                      >
                        View Document
                      </Button>
                    ) : (
                      <p className="font-medium">No document</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-[#F3F5F9] p-3 rounded-md space-y-3 mt-3">
                <div className="flex justify-between">
                  <p className="text-sm">Ambulance Lead</p>
                  <p className="font-medium">{selectedAmbulance.lead_data?.full_name || 'N/A'}</p>
                </div>

                <div className="flex justify-between">
                  <p className="text-sm">Email</p>
                  <p className="font-medium">{selectedAmbulance.lead_data?.email || 'N/A'}</p>
                </div>

                <div className="flex justify-between">
                  <p className="text-sm">Phone</p>
                  <p className="font-medium">{selectedAmbulance.lead_data?.phone_number || 'N/A'}</p>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  size="large"
                  onClick={() => {
                    setViewDetailsOpen(false);
                    setSelectedAmbulance(null);
                  }}
                  className="px-8 bg-[#F5EAEA]! text-[#DB4A47]! border-none!"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Ambulances;