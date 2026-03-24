import React, { useState, useMemo } from "react";
import { Table, Button, Input, Modal } from "antd";
import {  
  FilterOutlined, 
  PlusOutlined,
  UploadOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import { FiX, FiClock } from "react-icons/fi";
import Images from "@/components/images";
import { useHospitals } from "@/hooks/useHospitals";
import AddHospitalModal from "./AddHospitalModal";
import { deleteHospital } from "@/api/hospitalsApi";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";
import UpdateHospitalModal from "./UpdateHospitalModal";



interface Hospital {
  name: string;
  phone_number: string;
  email: string;
  specialty: string[];
  location: string;
  location_cordinate?: {
    type: string;
    coordinates: [number, number];
  };
  contact_person: string;
  createdAt: string;
  updatedAt: string;
  hospital_id: string;
}

const HospitalsTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [searchText, setSearchText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { data: hospitals, isLoading, mutate } = useHospitals();
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

  // Format coordinates
  const formatCoordinates = (location_cordinate?: Hospital['location_cordinate']) => {
    if (!location_cordinate?.coordinates) return 'N/A';
    const [lng, lat] = location_cordinate.coordinates;
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedHospital?.hospital_id) {
      toast.error("Hospital ID not found");
      return;
    }
    
    setIsDeleting(true);
    const loadingToast = toast.loading('Deleting hospital...');

    try {
      const response = await deleteHospital(selectedHospital.hospital_id);
      
      // Check if response is an error
      if (response?.response?.data?.msg || response?.message) {
        const errorMsg = response?.response?.data?.msg || response?.message || 'Failed to delete hospital';
        toast.error(errorMsg, { id: loadingToast });
      } else if (response?.status === 'ok' || response?.success) {
        toast.success('Hospital deleted successfully!', { id: loadingToast });
        
        // Trigger mutations to refresh data
        globalMutate('/providers/hospitals/');
        mutate();
        
        // Close modal
        setDeleteModalOpen(false);
        setViewDetailsOpen(false);
        setSelectedHospital(null);
      } else {
        // Assume success if we got here without error
        toast.success('Hospital deleted successfully!', { id: loadingToast });
        globalMutate('/providers/hospitals/');
        mutate();
        setDeleteModalOpen(false);
        setViewDetailsOpen(false);
        setSelectedHospital(null);
      }
    } catch (error: any) {
      console.error('Error deleting hospital:', error);
      toast.error(error?.message || 'Failed to delete hospital', { id: loadingToast });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle edit
  const handleEdit = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setIsEditModalOpen(true);
    setViewDetailsOpen(false);
  };

  // Handle delete click
  const handleDeleteClick = (hospital: Hospital, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedHospital(hospital);
    setDeleteModalOpen(true);
  };

  // Handle row click
  const handleRowClick = (record: Hospital) => {
    setSelectedHospital(record);
    setViewDetailsOpen(true);
  };

  // Filter data based on search
  const filteredHospitals = useMemo(() => {
    return hospitals?.filter((hospital: Hospital) => 
      hospital.name.toLowerCase().includes(searchText.toLowerCase()) ||
      hospital.contact_person.toLowerCase().includes(searchText.toLowerCase()) ||
      hospital.specialty.some(s => s.toLowerCase().includes(searchText.toLowerCase()))
    );
  }, [hospitals, searchText]);

  // Table columns
  const columns = [
    {
      title: "Reg. Date & Time",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a: Hospital, b: Hospital) => 
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
      sorter: (a: Hospital, b: Hospital) => a.name.localeCompare(b.name),
    },
    {
      title: "Specialty",
      dataIndex: "specialty",
      key: "specialty",
      render: (specialties: string[]) => (
        <div className="flex flex-wrap gap-1">
          {specialties.map((specialty, index) => (
            <span 
              key={index}
              className="bg-gray-100 px-2 py-1 rounded-md text-xs"
            >
              {specialty}
            </span>
          ))}
        </div>
      ),
    },
    {
      title: "Contact Person",
      dataIndex: "contact_person",
      key: "contact_person",
      sorter: (a: Hospital, b: Hospital) => a.contact_person.localeCompare(b.contact_person),
    },
    {
      title: "Phone",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Hospital) => (
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
        </div>
      ),
    }
  ];

  return (
    <>
      <p className="mb-4">Manage hospital information and contact details</p>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header with Filter and Add New */}
        <div className="p-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-[#354959] uppercase text-md font-bold">
              Hospitals Directory ({hospitals?.length || 0})
            </h1>  
            <div className="gap-3 flex">
              <Input
                placeholder="Search hospitals..."
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
                onClick={() => setIsModalOpen(true)}
              >
                Add New
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredHospitals}
          rowKey="hospital_id"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} hospitals`,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          className="border-none"
          rowClassName="hover:bg-gray-50 transition-colors cursor-pointer"
          loading={isLoading}
          onRow={(record) => ({
            onClick: () => handleRowClick(record)
          })}
        />

        {/* View Hospital Details Modal */}
        <Modal
          open={viewDetailsOpen}
          footer={null}
          onCancel={() => setViewDetailsOpen(false)}
          centered
          width={500}
          closeIcon={<FiX className="text-[#354959]" />}
        >
          {selectedHospital && (
            <div>
              <img src={Images.ambulancebg} alt="Hospital" className="w-full h-32 object-cover" />

              <div className="p-6 bg-white">
                <h3 className="text-[#000A0F] font-bold text-xl mb-3">
                  {selectedHospital.name}
                </h3>

                {/* Address Section */}
                <div className="bg-[#F3F5F9] p-3 rounded-md space-y-3">
                  <div className="flex justify-between">
                    <p className="text-sm">Name</p>
                    <p className="font-medium text-right">
                      {selectedHospital.name}
                    </p>
                  </div>
                  <hr className="border-b border-[#DADCDD] p-0"/>

                  <div className="flex justify-between">
                    <p className="text-sm">Address</p>
                    <p className="font-medium text-right">
                      {selectedHospital.location}
                    </p>
                  </div>
                  <hr className="border-b border-[#DADCDD] p-0"/>

                  <div className="flex justify-between">
                    <p className="text-sm">Coordinates</p>
                    <p className="font-medium">
                      {formatCoordinates(selectedHospital.location_cordinate)}
                    </p>
                  </div>
                  <hr className="border-b border-[#DADCDD] p-0"/>
                  
                  <div className="flex justify-between">
                    <p className="text-sm">Specialties</p>
                    <div className="text-right">
                      {selectedHospital.specialty?.map((specialty: string, index: number) => (
                        <span 
                          key={index} 
                          className="inline-block bg-white px-2 py-1 rounded-md mb-1 ml-1 text-sm"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Available Beds Section - Placeholder as it's not in the API */}
                <div className="bg-[#F3F5F9] p-3 rounded-md space-y-3 mt-3">
                  <div className="flex justify-between">
                    <p className="text-sm">Available Beds</p>
                    <p className="font-medium">0</p>
                  </div>
                </div>

                {/* Contact Section */}
                <div className="bg-[#F3F5F9] p-3 rounded-md space-y-3 mt-3">
                  <div className="flex justify-between">
                    <p className="text-sm">Contact Person</p>
                    <p className="font-medium">
                      {selectedHospital.contact_person}
                    </p>
                  </div>
                  <hr className="border-b border-[#DADCDD] p-0"/>
                  <div className="flex justify-between">
                    <p className="text-sm">Email</p>
                    <p className="font-medium">{selectedHospital?.email || 'N/A'}</p>
                  </div>
                  <hr className="border-b border-[#DADCDD] p-0"/>

                  <div className="flex justify-between">
                    <p className="text-sm">Phone</p>
                    <p className="font-medium">
                      {selectedHospital.phone_number}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-6">
                  <Button
                    size="large"
                    onClick={() => setViewDetailsOpen(false)}
                    className="px-8 bg-[#F5EAEA]! text-[#DB4A47]! border-none!"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="large"
                    onClick={() => handleEdit(selectedHospital)}
                    className="px-8 bg-[#DB4A47]! text-white! border-none! hover:bg-[#c63d3a]!"
                  >
                    Edit
                  </Button>
                  <Button
                    size="large"
                    danger
                    onClick={() => {
                      setViewDetailsOpen(false);
                      setDeleteModalOpen(true);
                    }}
                    className="px-8 bg-[#DB4A47]! text-white! border-none! hover:bg-[#c63d3a]!"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Delete Hospital Modal */}
        <Modal
          open={deleteModalOpen}
          onCancel={() => setDeleteModalOpen(false)}
          footer={null}
          centered
          width={400}
          closeIcon={<FiX className="text-[#354959]" />}
        >
          <div className="text-left! p-6">
            <div className="flex justify-left! mb-4">
              <img src={Images.icon.question} alt=""/>
            </div>
            
            <h3 className="text-xl font-semibold text-[#001417] mb-2">
              Delete Hospital
            </h3>
            
            <p className="text-sm text-[#354959] mb-8">
              This action would remove {selectedHospital?.name} from the platform and is irreversible
            </p>

            <div className="flex justify-center gap-4">
              <Button
                size="large"
                onClick={() => setDeleteModalOpen(false)}
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

        <AddHospitalModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onHospitalAdded={() => {
            mutate();
            setIsModalOpen(false);
          }}
        />
        <UpdateHospitalModal
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedHospital(null);
          }}
          onHospitalUpdated={() => {
            mutate();
            setIsEditModalOpen(false);
            setSelectedHospital(null);
          }}
          hospital={selectedHospital}
        />
      </div>
    </>
  );
};

export default HospitalsTable;