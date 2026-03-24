import React, { useState } from "react";
import { Table, Button } from "antd";
import { Modal, Input } from "antd";

import {
  SearchOutlined,
  FilterOutlined,
  UploadOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { FiClock } from "react-icons/fi";
import Images from "@/components/images";


const ServiceCostTable = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");


  const data = Array.from({ length: 8 }, (_, index) => ({
    key: index,
    lastModified: "12th Jan. 2025 · 12:34pm",
    serviceName: "Ambulance dispatch",
    amount: "₦2,4503",
    status: index < 2 ? "Pending" : "Approved",
  }));



  const columns = [
    {
      title: "Last Modified",
      dataIndex: "lastModified",
      key: "lastModified",
      render: (text: string) => (
        <div className="flex items-center gap-2 text-[#354959]">
          <FiClock className="text-gray-400" />
          {text}
        </div>
      ),
    },
    {
      title: "Service Name",
      dataIndex: "serviceName",
      key: "serviceName",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const isPending = status === "Pending";

        return (
          <span
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              isPending
                ? "bg-[#FFF7E8] text-[#BB7F05]"
                : "bg-[#F8FEF5] text-[#4EA507]"
            }`}
          >
            ● {status}
          </span>
        );
      },
    },
    {
        title: "Action",
        key: "action",
        render: (_: any, record: any) =>
            record.status === "Pending" ? (
            <div className="flex gap-3">
                <Button
                icon={<CheckOutlined />}
                className="bg-[#E6F4EA]! text-[#2E7D32]! border-0! rounded-lg!"
                onClick={() => {
                    setSelectedRecord(record);
                    setApproveOpen(true);
                }}
                />
                <Button
                icon={<CloseOutlined />}
                className="bg-[#FBE9E7]! text-[#DB4A47]! border-0! rounded-lg!"
                onClick={() => {
                    setSelectedRecord(record);
                    setRejectOpen(true);
                }}
                />
            </div>
            ) : null,
        }

  ];

  return (
    <>
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[#354959] font-bold uppercase text-sm">
          SERVICE COST POINTS
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
        dataSource={data}
        pagination={{
          pageSize: 8,
          showSizeChanger: false,
        }}
        rowClassName="hover:bg-gray-50"
      />

      {/* Footer */}
      <div className="flex justify-between items-center text-sm text-[#808D97] mt-4">
        <span>Showing page 24 of 30</span>
      </div>
    </div>

         <Modal
            open={approveOpen}
            footer={null}
            onCancel={() => setApproveOpen(false)}
            centered
            >
            <div className="space-y-4 p-6">
                <div className="text-left">
                    <img src={Images.icon.caution} alt="img"/>
                </div>

                <h2 className="text-xl font-semibold">
                Approve Cost point?
                </h2>

                <p className="text-gray-500">
                This action would approve{" "}
                <strong>{selectedRecord?.serviceName}</strong> and is irreversible
                </p>

                <div className="flex justify-end gap-4 mt-6">
                    <Button
                        size="large"
                        onClick={() => setRejectOpen(false)}
                        className="px-8 bg-[#F5EAEA]! text-[#DB4A47]! font-medium! border-none!"
                    >
                        Cancel
                    </Button>

                    <Button
                        size="large"
                        type="primary"
                        className="px-8 bg-[#DB4A47]! hover:bg-[#c63d3a]! border-none!"
                    >
                        Appprove
                    </Button>
                </div>
            </div>
        </Modal>
        <Modal
            open={rejectOpen}
            footer={null}
            onCancel={() => setRejectOpen(false)}
            centered
            >
            <div className="space-y-4 p-6">
                <div className="">
                 <div className="text-left">
                    <img src={Images.icon.caution} alt="img"/>
                </div>

                <h2 className="text-xl font-semibold mt-2">
                    Reject Cost Point?
                </h2>

                <p className="text-gray-500">
                    This action would reject{" "}
                    <strong>{selectedRecord?.serviceName}</strong> and is irreversible
                </p>
                </div>

                <Input.TextArea
                rows={14}
                placeholder="Reason"
                value={rejectReason}
                className="min-h-[150px]!"
                onChange={(e) => setRejectReason(e.target.value)}
                />

               <div className="flex justify-end gap-4 mt-6">
                    <Button
                        size="large"
                        onClick={() => setRejectOpen(false)}
                        className="px-8 bg-[#F5EAEA]! text-[#DB4A47]! font-medium! border-none!"
                    >
                        Cancel
                    </Button>

                    <Button
                        size="large"
                        type="primary"
                        className="px-8 bg-[#DB4A47]! hover:bg-[#c63d3a]! border-none!"
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
