// Stakeholder/Stakeholder.tsx
import React, { useState, useMemo } from "react";
import { Table, Button, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import { 
  SearchOutlined, 
  FilterOutlined, 
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import AddStakeholderModal from "./AddStakeholder";
import UpdateStakeholderModal from "./EditStakeholder";
import DeleteStakeholderModal from "./DeleteStakeHolder";
import { useStakeholders } from "@/hooks/useSettings";
import { useNonEmergencyStakeholders } from "@/hooks/useSettings";

// Updated interface to match API response
interface Stakeholder {
  stakeholder_id: string;
  name: string;
  bank_data: {
    bank_name: string;
    bank_code: string;
    account_number: string;
    account_name: string;
  };
  amount: number;
  amount_sufix: string;
  amount_type: 'percentage' | 'amount';
  createdAt: string;
  updatedAt: string;
}

// Interface for table display (flattened)
interface StakeholderDisplay {
  stakeholder_id: string;
  name: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  bank_code: string;
  amount: number;
  amount_type: 'percentage' | 'amount';
  createdAt: string;
}

interface StakeholderDisbursementTableProps {
  isNonEmergency?: boolean;
}

const StakeholderDisbursementTable = ({ isNonEmergency = false }: StakeholderDisbursementTableProps) => {
  const [searchText, setSearchText] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(null);
  
  // Use appropriate hook based on type
  const { data: emergencyStakeholders, isLoading: emergencyLoading, mutate: emergencyMutate } = useStakeholders();
  const { data: nonEmergencyStakeholders, isLoading: nonEmergencyLoading, mutate: nonEmergencyMutate } = useNonEmergencyStakeholders();
  
  const stakeholders = isNonEmergency ? nonEmergencyStakeholders : emergencyStakeholders;
  const isLoading = isNonEmergency ? nonEmergencyLoading : emergencyLoading;
  
  const mutate = () => {
    if (isNonEmergency) {
      nonEmergencyMutate();
    } else {
      emergencyMutate();
    }
  };

  // Transform API data to flattened structure for table display
  const transformedData: StakeholderDisplay[] = useMemo(() => {
    if (!stakeholders) return [];
    
    return stakeholders.map((item: Stakeholder) => ({
      stakeholder_id: item.stakeholder_id,
      name: item.name,
      account_name: item.bank_data?.account_name || 'N/A',
      account_number: item.bank_data?.account_number || 'N/A',
      bank_name: item.bank_data?.bank_name || 'N/A',
      bank_code: item.bank_data?.bank_code || 'N/A',
      amount: item.amount,
      amount_type: item.amount_type,
      createdAt: item.createdAt,
    }));
  }, [stakeholders]);

  // Format amount display based on type
  const formatAmount = (amount: number, type: 'percentage' | 'amount') => {
    if (type === 'percentage') {
      return `${amount}%`;
    } else {
      return `₦${amount.toLocaleString()}`;
    }
  };

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!transformedData) return [];
    
    return transformedData.filter((item: StakeholderDisplay) => 
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.account_name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.bank_name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.account_number.includes(searchText)
    );
  }, [transformedData, searchText]);

  // Handle edit click - need to find original stakeholder with full data
  const handleEdit = (record: StakeholderDisplay, e: React.MouseEvent) => {
    e.stopPropagation();
    // Find the original stakeholder with full data including bank_data
    const originalStakeholder = stakeholders?.find(
      (s: Stakeholder) => s.stakeholder_id === record.stakeholder_id
    );
    if (originalStakeholder) {
      setSelectedStakeholder(originalStakeholder);
      setIsEditModalOpen(true);
    }
  };

  // Handle delete click
  const handleDelete = (record: StakeholderDisplay, e: React.MouseEvent) => {
    e.stopPropagation();
    // Find the original stakeholder with full data
    const originalStakeholder = stakeholders?.find(
      (s: Stakeholder) => s.stakeholder_id === record.stakeholder_id
    );
    if (originalStakeholder) {
      setSelectedStakeholder(originalStakeholder);
      setIsDeleteModalOpen(true);
    }
  };

  // Generate unique bank filters
  const bankFilters = useMemo(() => {
    if (!transformedData) return [];
    const uniqueBanks = Array.from(
      new Set(transformedData.map((item: StakeholderDisplay) => item.bank_name))
    );
    return uniqueBanks.map(bank => ({
      text: bank,
      value: bank,
    }));
  }, [transformedData]);

  // Dynamic title and description
  const pageDescription = isNonEmergency 
    ? "Manage stakeholder disbursement for non-emergency bookings"
    : "Manage incoming requests for customer emergency booking";
  
  const pageTitle = isNonEmergency 
    ? "NON-EMERGENCY STAKEHOLDERS DISBURSEMENT"
    : "STAKEHOLDERS DISBURSEMENT";

  // Table columns
  const columns: ColumnsType<StakeholderDisplay> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: StakeholderDisplay, b: StakeholderDisplay) => a.name.localeCompare(b.name),
      render: (text: string) => <span className="font-medium text-[#354959]">{text}</span>,
    },
    {
      title: "Account Name",
      dataIndex: "account_name",
      key: "account_name",
      sorter: (a: StakeholderDisplay, b: StakeholderDisplay) => a.account_name.localeCompare(b.account_name),
    },
    {
      title: "Account Number",
      dataIndex: "account_number",
      key: "account_number",
    },
    {
      title: "Bank Name",
      dataIndex: "bank_name",
      key: "bank_name",
      filters: bankFilters,
      onFilter: (value: boolean | React.Key, record: StakeholderDisplay) => record.bank_name === value,
    },
    {
      title: "Value",
      dataIndex: "amount",
      key: "amount",
      sorter: (a: StakeholderDisplay, b: StakeholderDisplay) => a.amount - b.amount,
      render: (_: any, record: StakeholderDisplay) => (
        <span className="font-medium text-[#DB4A47]">
          {formatAmount(record.amount, record.amount_type)}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: StakeholderDisplay) => (
        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={(e) => handleEdit(record, e)}
            className="flex items-center gap-1 bg-[#F3F5F9]! text-[#354959]! hover:text-[#DB4A47]! border-none shadow-none"
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => handleDelete(record, e)}
            className="flex items-center gap-1 bg-[#F3F5F9]! text-[#DB4A47]! border-none shadow-none"
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <p className="mb-4">{pageDescription}</p>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header with Filter and Add New */}
        <div className="p-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-[#354959] uppercase text-md font-bold">
              {pageTitle} ({stakeholders?.length || 0})
            </h1>
            <div className="gap-3 flex">
              <Input
                placeholder="Type here to search"
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-64 rounded-lg"
                size="large"
                allowClear
              />
              <Button 
                icon={<UploadOutlined />} 
                className="rounded-lg flex bg-[#FDF6F6]! text-[#DB4A47]! border-0! items-center"
                size="large"
              />
              <Button 
                icon={<FilterOutlined />} 
                className="rounded-lg flex bg-[#FDF6F6]! text-[#DB4A47]! border-0! items-center"
                size="large"
              >
                Filter
              </Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                className="bg-[#DB4A47]! rounded-lg flex items-center"
                size="large"
                onClick={() => setIsAddModalOpen(true)}
              >
                Add New
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="stakeholder_id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} stakeholders`,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          className="border-none p-3"
          rowClassName="hover:bg-gray-50 transition-colors"
        />

      </div>

      {/* Modals - These will auto-detect the route */}
      <AddStakeholderModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          mutate();
          setIsAddModalOpen(false);
        }}
      />

      <UpdateStakeholderModal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedStakeholder(null);
        }}
        onSuccess={() => {
          mutate();
          setIsEditModalOpen(false);
          setSelectedStakeholder(null);
        }}
        stakeholder={selectedStakeholder}
      />

      <DeleteStakeholderModal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedStakeholder(null);
        }}
        onSuccess={() => {
          mutate();
          setIsDeleteModalOpen(false);
          setSelectedStakeholder(null);
        }}
        stakeholder={selectedStakeholder}
      />
    </>
  );
};

export default StakeholderDisbursementTable;