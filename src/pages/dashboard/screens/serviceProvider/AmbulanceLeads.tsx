import React, { useState } from "react";
import { Table, Button, Modal } from "antd";
import { useParams } from "react-router-dom";
import {
  SearchOutlined,
  FilterOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { FiClock } from "react-icons/fi";
import Images from "@/components/images";
import { useProviderAmbulanceLeads } from "@/hooks/useProvider";



interface AmbulanceLead {
  lead_id: string;
  provider_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  gender: string;
  user_type: string;
  address: string;
  emergency_contact: string;
  account_status: number;
  createdAt: string;
  updatedAt: string;
  lead_data?: {
    full_name: string;
    email: string;
    phone_number: string;
  };
}

const AmbulanceLeads = () => {
  const { provider_id } = useParams<{ provider_id: string }>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<AmbulanceLead | null>(null);

  const { data: leads, isLoading, mutate } = useProviderAmbulanceLeads(provider_id);

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

  const columns = [
    {
      title: "Added Date & Time",
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
      dataIndex: "full_name",
      key: "full_name",
      render: (text: string) => <span className="font-medium text-[#354959]">{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: AmbulanceLead) => (
        <Button
          className="bg-[#FDF6F6]! font-medium! text-[#DB4A47]! border-0! rounded-lg!"
          onClick={() => {
            setSelectedLead(record);
            setViewDetailsOpen(true);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-[#354959] font-bold uppercase text-sm">
            AMBULANCE LEADS ({leads?.length || 0})
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
          dataSource={leads}
          rowKey="lead_id"
          loading={isLoading}
          pagination={{
            pageSize: 8,
            showSizeChanger: false,
          }}
          rowClassName="hover:bg-gray-50 cursor-pointer"
          onRow={(record) => ({
            onClick: () => {
              setSelectedLead(record);
              setViewDetailsOpen(true);
            },
          })}
        />

        {/* Footer */}
        <div className="flex justify-between items-center text-sm text-[#808D97] mt-4">
          <span>Showing page 1 of {Math.ceil((leads?.length || 0) / 8)}</span>
          <div className="flex items-center gap-4">
            <span>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            <span>{new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      <Modal
        open={viewDetailsOpen}
        footer={null}
        onCancel={() => {
          setViewDetailsOpen(false);
          setSelectedLead(null);
        }}
        centered
        width={500}
      >
        {selectedLead && (
          <div>
            <div className="w-full">
              <img src={Images.ambulancebg} alt="bg" className="w-full" />
            </div>
            <div className="p-6 bg-white">
              <h3 className="text-[#000A0F] font-bold text-xl mb-3">
                {selectedLead.full_name}
              </h3>
              <div className="bg-[#F3F5F9] p-3 rounded-md space-y-3">
                <div className="flex justify-between">
                  <p className="text-[#354959] text-sm">Name</p>
                  <p className="text-[#000A0F] text-sm font-medium">
                    {selectedLead.full_name}
                  </p>
                </div>
                <hr className="border-b border-[#DADCDD] p-0" />
                
                {/* Email */}
                <div className="flex justify-between">
                  <p className="text-[#354959] text-sm">Email</p>
                  <p className="text-[#000A0F] text-sm font-medium">
                    {selectedLead.email || 'N/A'}
                  </p>
                </div>
                <hr className="border-b border-[#DADCDD] p-0" />
                
                {/* Phone */}
                <div className="flex justify-between">
                  <p className="text-[#354959] text-sm">Phone</p>
                  <p className="text-[#000A0F] text-sm font-medium">
                    {selectedLead.phone_number || 'N/A'}
                  </p>
                </div>
                <hr className="border-b border-[#DADCDD] p-0" />

                {/* Emergency Contact */}
                <div className="flex justify-between">
                  <p className="text-[#354959] text-sm">Emergency Contact</p>
                  <p className="text-[#000A0F] text-sm font-medium">
                    {selectedLead.emergency_contact || 'N/A'}
                  </p>
                </div>
                <hr className="border-b border-[#DADCDD] p-0" />

                {/* Address */}
                <div className="flex justify-between">
                  <p className="text-[#354959] text-sm">Address</p>
                  <p className="text-[#000A0F] text-sm font-medium">
                    {selectedLead.address || 'N/A'}
                  </p>
                </div>
                <hr className="border-b border-[#DADCDD] p-0" />


                {/* Status */}
                <div className="flex justify-between">
                  <p className="text-[#354959] text-sm">Status</p>
                  <p className="text-[#000A0F] text-sm font-medium">
                    {selectedLead.account_status === 1 ? (
                      <span className="text-green-600">Active</span>
                    ) : (
                      <span className="text-orange-500">Inactive</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <Button
                  size="large"
                  onClick={() => {
                    setViewDetailsOpen(false);
                    setSelectedLead(null);
                  }}
                  className="px-8 bg-[#F5EAEA]! text-[#DB4A47]! font-medium! border-none!"
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

export default AmbulanceLeads;