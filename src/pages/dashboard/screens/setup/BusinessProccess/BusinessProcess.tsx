import React, { useState, useMemo } from "react";
import { Table, Button, Input } from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { FiClock } from "react-icons/fi";
import { useBusinessProcess } from "@/hooks/useSettings";
import AddEditBusinessProcessModal from "./AddEditBusinessProcess";
import DeleteConfirmationModal from "./DeleteBusiness";

interface BusinessProcess {
  _id: string;
  name: string;
  file?: string;
  size?: string;
  createdAt: string;
  updatedAt: string;
}

const BusinessProcessTable = () => {
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedDoc, setSelectedDoc] = useState<BusinessProcess | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<BusinessProcess | null>(null);

  const { data: documents, isLoading, mutate } = useBusinessProcess();

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
  const filteredData = useMemo(() => {
    if (!documents) return [];
    
    return documents.filter((item: BusinessProcess) => 
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [documents, searchText]);

  // Handle edit click
  const handleEdit = (record: BusinessProcess, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedDoc(record);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (record: BusinessProcess, e: React.MouseEvent) => {
    e.stopPropagation();
    setDocToDelete(record);
    setIsDeleteModalOpen(true);
  };

  // Handle add new
  const handleAddNew = () => {
    setSelectedDoc(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDoc(null);
  };

  // Handle success
  const handleSuccess = () => {
    mutate();
  };

  // Handle delete success
  const handleDeleteSuccess = () => {
    mutate();
  };

  // Table columns
  const columns = [
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a: BusinessProcess, b: BusinessProcess) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (text: string) => (
        <div className="flex items-center gap-2">
          <FiClock className="text-gray-400" />
          <span>{formatDate(text)}</span>
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: BusinessProcess, b: BusinessProcess) => a.name.localeCompare(b.name),
      render: (text: string) => (
        <span className="font-medium text-[#354959]">{text}</span>
      ),
    },
    {
      title: "File",
      dataIndex: "file",
      key: "file",
      render: (text: string, record: BusinessProcess) => (
        record.file ? (
          <a 
            href={record.file} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#DB4A47] hover:underline"
          >
            View File
          </a>
        ) : (
          <span className="text-gray-400">No file</span>
        )
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: BusinessProcess) => (
        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={(e) => handleEdit(record, e)}
            className="bg-[#F3F5F9]! text-[#354959]! hover:text-[#DB4A47]! border-none shadow-none"
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => handleDeleteClick(record, e)}
            className="bg-[#F3F5F9]! text-[#DB4A47]! border-none shadow-none"
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <p className="mb-4">
        Manage and upload internal business process documentation
      </p>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-[#354959] uppercase text-md font-bold">
              BUSINESS PROCESS ({documents?.length || 0})
            </h1>

            <div className="gap-3 flex">
              <Input
                placeholder="Search file"
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-40 rounded-lg"
                allowClear
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
                onClick={handleAddNew}
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
          rowKey="_id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} documents`,
          }}
          className="border-none p-3"
          rowClassName="hover:bg-gray-50 transition-colors"
        />
      </div>

      {/* Add/Edit Modal */}
      <AddEditBusinessProcessModal
        open={isModalOpen}
        onClose={handleModalClose}
        mode={modalMode}
        initialData={selectedDoc ? {
          _id: selectedDoc._id,
          name: selectedDoc.name,
          file: selectedDoc.file,
        } : null}
        onSuccess={handleSuccess}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDocToDelete(null);
        }}
        itemName={docToDelete?.name || ''}
        itemId={docToDelete?._id || ''}
        onSuccess={handleDeleteSuccess}
      />
    </>
  );
};

export default BusinessProcessTable;