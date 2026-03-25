import { useState } from "react";
import { Table, Button, Input } from "antd";
import { 
  SearchOutlined, 
  FilterOutlined, 
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { FiClock } from "react-icons/fi";
import AddFeeModal from "./AddFeeModal";
import EditFeeModal from "./EditFeeModal";
import DeleteFeeModal from "./DeleteFee";
import { useFees } from "@/hooks/useSettings";



export interface Fee {
  fee_id: string;
  name: string;
  amount: number;
  updatedAt?: string;
  createdAt?: string;
}

const GeneralCostPointsTable = () => {
  const [searchText, setSearchText] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<Fee | null>(null);
  
  const { data: feesList, mutate, isLoading } = useFees();

  // Format amount for display
  const formatAmount = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num).replace('NGN', '&#8358; ');
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).replace(',', ' ·');
  };

  // Handle successful operations
  const handleSuccess = () => {
    mutate(); // Refresh the list
  };

  // Table columns
 const columns = [
  {
    title: "Last Modified",
    dataIndex: "updatedAt",
    key: "updatedAt",
    render: (_: string, record: Fee) => (
      <div className="flex items-center gap-2">
        <FiClock className="text-gray-400" />
        <span>
          {formatDate(record.updatedAt || record.createdAt)}
        </span>
      </div>
    ),
  },
  {
    title: "Cost Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    render: (text: string | number) => (
      <div className="flex items-center gap-2">
        {/* <span>&#8358;</span> */}
        <span className="font-medium">
          {formatAmount(text)}
        </span>
      </div>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_: any, record: Fee) => (
      <div className="flex items-center gap-3">
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => {
            setSelectedFee(record);
            setIsEditModalOpen(true);
          }}
          className="flex items-center gap-1 bg-[#F3F5F9]! text-[#354959]! hover:text-[#DB4A47]! border-none shadow-none"
        />

        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => {
            setSelectedFee(record);
            setIsDeleteModalOpen(true);
          }}
          className="flex items-center gap-1 bg-[#F3F5F9]! text-[#DB4A47]! border-none shadow-none"
        />
      </div>
    ),
  },
];

  // Filter data based on search
 const feesArray: Fee[] = Array.isArray(feesList)
  ? feesList
  : feesList?.data || feesList?.fees || [];

const filteredData = feesArray.filter((fee: Fee) =>
  fee.name?.toLowerCase().includes(searchText.toLowerCase())
);

  return (
    <>
      <p className="mb-4">Manage incoming requests for customer emergency booking</p>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header with Filter and Add New */}
        <div className="p-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-[#354959] uppercase text-md font-bold">
              General Cost Points  
            </h1>  
            <div className="gap-3 flex">
              <Input
                placeholder="Search cost points..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-64 rounded-lg"
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
          rowKey="fee_id"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} cost points`,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          className="border-none"
          rowClassName="hover:bg-gray-50 transition-colors"
          loading={isLoading}
        />
      </div>

      {/* Modals */}
      <AddFeeModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleSuccess}
      />

      <EditFeeModal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedFee(null);
        }}
        onSuccess={handleSuccess}
        fee={selectedFee}
      />

      <DeleteFeeModal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedFee(null);
        }}
        onSuccess={handleSuccess}
        fee={selectedFee}
      />
    </>
  );
};

export default GeneralCostPointsTable;