import React, { useState, useMemo } from "react";
import { Table, Button, Input, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import {
  SearchOutlined,
  FilterOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { FiX, FiClock } from "react-icons/fi";
import Images from "@/components/images";

import toast from "react-hot-toast";
import { useSWRConfig } from "swr";
import { deletePatient } from "@/api/patientsApi";
import { usePatients } from "@/hooks/usePatients";

interface Patient {
  customer_id: string;
  provider_id?: string;
  full_name: string;
  email: string;
  phone_number: string;
  customer_id_display: string;
  gender?: string;
  address?: string;
  emergency_contact?: string;
  date_of_birth?: string;
  blood_group?: string;
  allergies?: string;
  medical_conditions?: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

const Patients = () => {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: patients, isLoading, mutate } = usePatients();
  const { mutate: globalMutate } = useSWRConfig();

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



  // Filter data based on search
  const filteredPatients = useMemo(() => {
    if (!patients) return [];
    
    return patients.filter((patient: Patient) => 
      patient.full_name.toLowerCase().includes(searchText.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchText.toLowerCase()) ||
      patient.phone_number.includes(searchText) ||
      (patient.customer_id_display && patient.customer_id_display.includes(searchText))
    );
  }, [patients, searchText]);

  // Handle delete click
  const handleDeleteClick = (patient: Patient, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    setSelectedPatient(patient);
    setDeleteModalOpen(true);
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!selectedPatient?.customer_id) {
      toast.error("Patient ID not found");
      return;
    }

    setIsDeleting(true);
    const loadingToast = toast.loading('Deleting patient...');

    try {
      const response = await deletePatient(selectedPatient.customer_id);
      
      if (response?.status === 'ok') {
        toast.success('Patient deleted successfully!', { id: loadingToast });
        globalMutate('/admins/providers/patients/');
        mutate();
        setDeleteModalOpen(false);
        setSelectedPatient(null);
      } else {
        const errorMsg = response?.response?.data?.msg || response?.message || 'Failed to delete patient';
        toast.error(errorMsg, { id: loadingToast });
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete patient', { id: loadingToast });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle row click - navigate to patient details page
  const handleRowClick = (record: Patient) => {
    navigate(`/patients/${record.customer_id}`);
  };

  // Handle view details button click
  const handleViewDetails = (record: Patient, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    navigate(`/patients/${record.customer_id}`);
  };

  const columns = [
    {
      title: "Reg. Date & Time",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a: Patient, b: Patient) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (text: string) => (
        <div className="flex items-center gap-2 text-[#354959]">
          <FiClock className="text-gray-400" />
          {formatDate(text)}
        </div>
      ),
    },
    {
      title: "Patient ID",
      dataIndex: "customer_id",
      key: "customer_id",
    },
    {
      title: "Name",
      dataIndex: "full_name",
      key: "full_name",
      sorter: (a: Patient, b: Patient) => a.full_name.localeCompare(b.full_name),
      render: (text: string) => <span className="font-medium text-[#354959]">{text}</span>,
    },
    {
      title: "Phone",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Patient) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={(e) => handleViewDetails(record, e)}
            className="flex items-center gap-1 bg-[#F3F5F9]! text-[#354959]! hover:text-[#DB4A47]! border-none shadow-none"
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => handleDeleteClick(record, e)}
            className="flex items-center gap-1 bg-[#F3F5F9]! text-[#DB4A47]! border-none shadow-none"
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-[#354959] font-bold uppercase text-sm">
            PATIENT ({filteredPatients?.length || 0})
          </h1>

          <div className="flex gap-3">
            <Input
              placeholder="Search patients..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-64 rounded-lg"
              allowClear
            />
            <Button
              icon={<FilterOutlined />}
              className="bg-[#FDF6F6]! text-[#DB4A47]! border-0! rounded-lg!"
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
          dataSource={filteredPatients}
          rowKey="customer_id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} patients`,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          rowClassName="hover:bg-gray-50 cursor-pointer"
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
        />

        {/* Footer */}
        <div className="flex justify-between items-center text-sm text-[#808D97] mt-4">
          <span>Showing page {Math.ceil((filteredPatients?.length || 0) / 10)} of {Math.ceil((filteredPatients?.length || 0) / 10) || 1}</span>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSelectedPatient(null);
        }}
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
            Delete Patient
          </h3>
          
          <p className="text-sm text-[#354959] mb-8">
            This action would remove {selectedPatient?.full_name} from the platform and is irreversible
          </p>

          <div className="flex justify-center gap-4">
            <Button
              size="large"
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedPatient(null);
              }}
              disabled={isDeleting}
              className="px-8 bg-gray-100! h-[45px]! flex-1 text-gray-700! border-none!"
            >
              Cancel
            </Button>

            <Button
              size="large"
              danger
              loading={isDeleting}
              onClick={handleDeleteConfirm}
              className="px-8 bg-[#DB4A47]! h-[45px]! flex-1 text-white! border-none! hover:bg-[#c63d3a]!"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Patients;