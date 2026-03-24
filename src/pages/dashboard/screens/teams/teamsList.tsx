import { useState } from "react";
import { Table, Button, Input, Space, Dropdown, Menu, Tag, Modal, Form, Select } from "antd";
import { 
  SearchOutlined, 
  FilterOutlined, 
  PlusOutlined,
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { FaUserTimes } from "react-icons/fa";
import AddNewMemberModal from "./AddNewMemberModal";
import SuspendMemberModal from "./SuspendModal";
import { useAdminUsers } from "@/hooks/useMember";
import toast from "react-hot-toast";
import { updateAdminUser } from "@/api/teamsApi";
import DeleteConfirmationModal from "./deleteMember";
import { FiX } from "react-icons/fi";

const { Option } = Select;


interface AdminUser {
  auth_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  position: string;
  access_level: string;
  account_status: number;
}

const UserManagementTable = () => {
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuspendOpen, setIsSuspendOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm] = Form.useForm();

  const { users, isLoading, mutate } = useAdminUsers();

  // Filter users based on search
  const filteredUsers = users?.filter((user: AdminUser) =>
    user.full_name?.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
    user.position?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Handle edit user
  const handleEdit = (user: AdminUser) => {
    setSelectedUser(user);
    editForm.setFieldsValue({
      full_name: user.full_name,
      email: user.email,
      phone_number: user.phone_number,
      position: user.position,
      access_level: user.access_level?.split(", "),
    });
    setIsEditModalOpen(true);
  };

  // Handle update user
  const handleUpdate = async (values: any) => {
    if (!selectedUser?.auth_id) return;

    setIsUpdating(true);
    const loadingToast = toast.loading("Updating user...");

    try {
      const payload = {
        full_name: values.full_name,
        email: values.email,
        phone_number: values.phone_number,
        position: values.position,
        access_level: values.access_level?.join(", "),
      };

      const response = await updateAdminUser(selectedUser.auth_id, payload);

      if (response?.status === "ok") {
        toast.success("User updated successfully!", { id: loadingToast });
        mutate(); // Refresh the users list
        setIsEditModalOpen(false);
        editForm.resetFields();
      } else {
        toast.error(response?.message || "Failed to update user", { id: loadingToast });
      }
    } catch (error: any) {
      console.error("Update user error:", error);
      toast.error(error?.response?.data?.msg || error?.message || "Failed to update user", { id: loadingToast });
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle suspend user
  const handleSuspend = (user: AdminUser) => {
    setSelectedUser(user);
    setIsSuspendOpen(true);
  };

  // Handle delete user
  const handleDelete = (user: AdminUser) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  // Action menu for each row
  const actionMenu = (record: AdminUser) => (
    <Menu>
      <Menu.Item 
        key="edit" 
        icon={<EditOutlined />} 
        onClick={() => handleEdit(record)}
      >
        Edit User
      </Menu.Item>
      <Menu.Divider />
      {record.account_status !== 1 && (
        <Menu.Item 
          key="suspend" 
          icon={<FaUserTimes />} 
          onClick={() => handleSuspend(record)}
          danger
        >
          Suspend User
        </Menu.Item>
      )}
      <Menu.Divider />
      <Menu.Item 
        key="delete" 
        icon={<DeleteOutlined />} 
        onClick={() => handleDelete(record)}
        danger
        className="text-red-600!"
      >
        Delete User
      </Menu.Item>
    </Menu>
  );

  // Table columns
  const columns = [
    {
      title: "S/N",
      key: "sn",
      width: 70,
      render: (_: any, __: any, index: number) => (
        <span className="text-sm text-[#808D97]">{index + 1}</span>
      ),
    },
    {
      title: "Name",
      dataIndex: "full_name",
      key: "full_name",
      sorter: (a: AdminUser, b: AdminUser) => a.full_name.localeCompare(b.full_name),
      render: (text: string, record: AdminUser) => (
        <div>
          <div className="font-medium text-[#000A0F]">{text}</div>
          {record.phone_number && (
            <div className="text-xs text-[#808D97]">{record.phone_number}</div>
          )}
        </div>
      ),
    },
    {
      title: "Email Address",
      dataIndex: "email",
      key: "email",
      sorter: (a: AdminUser, b: AdminUser) => a.email.localeCompare(b.email),
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
      filters: [
        { text: "CEO", value: "CEO" },
        { text: "Manager", value: "Manager" },
        { text: "Staff", value: "Staff" },
      ],
      onFilter: (value: string, record: AdminUser) => record.position === value,
    },
    {
      title: "Access Level",
      dataIndex: "access_level",
      key: "access_level",
      render: (text: string) => (
        <div className="flex flex-wrap gap-1">
          {text?.split(", ").map((level: string, index: number) => (
            <Tag key={index} className="bg-[#F5F6F7] text-[#354959] border-none">
              {level.replace(/_/g, ' ')}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "account_status",
      key: "account_status",
      render: (status: number) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
          status === 0 
            ? "bg-[#F8FEF5] text-[#4EA507]" 
            : "bg-[#FDF5F5] text-[#DE3631]"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full mr-1 ${
            status === 0 ? "bg-[#4EA507]" : "bg-[#DE3631]"
          }`}></span>
          {status === 0 ? "Active" : "Suspended"}
        </span>
      ),
      filters: [
        { text: "Active", value: 0 },
        { text: "Suspended", value: 1 },
      ],
      onFilter: (value: number, record: AdminUser) => record.account_status === value,
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      render: (_: any, record: AdminUser) => (
        <Dropdown overlay={actionMenu(record)} trigger={["click"]} placement="bottomRight">
          <Button 
            type="text" 
            icon={<EllipsisOutlined className="text-xl font-bold! text-[#DB4A47]!" />} 
            className="border-none shadow-none bg-[#FDF6F6]!"
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="p-2 bg-white min-h-screen">
      <div className="bg-white rounded-xl overflow-hidden">
        {/* Header with Search and Actions */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Search */}
            <Input
              placeholder="Search by name, email, or position"
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-50! sm:w-64 rounded-lg"
              allowClear
            />

            {/* Action Buttons */}
            <Space>
              <Button 
                icon={<FilterOutlined />} 
                className="rounded-lg flex items-center"
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
            </Space>
          </div>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="auth_id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} users`,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          className="border-none"
          rowClassName="hover:bg-gray-50 transition-colors"
        />
      </div>

      {/* Add New Member Modal */}
      <AddNewMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => mutate()}
      />

      {/* Suspend Member Modal */}
      <SuspendMemberModal
        isOpen={isSuspendOpen}
        onClose={() => setIsSuspendOpen(false)}
        user={selectedUser}
        onSuccess={() => mutate()}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        user={selectedUser}
        onSuccess={() => mutate()}
      />

      {/* Edit Member Modal */}
      <Modal
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
        centered
        width={500}
        closeIcon={<FiX className="text-[#354959]" />}
        destroyOnClose
      >
        <div className="bg-[#F3F5F9] px-4 py-6">
          <h2 className="text-xl font-semibold text-[#000A0F]">Edit User</h2>
        </div>

        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdate}
          className="px-6! py-6!"
        >
          <Form.Item
            name="full_name"
            label="Name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input size="large" placeholder="Enter full name" className="rounded-lg!" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Enter a valid email" }
            ]}
          >
            <Input size="large" placeholder="Enter email" className="rounded-lg!" />
          </Form.Item>

          <Form.Item name="phone_number" label="Phone Number (optional)">
            <Input size="large" placeholder="Enter phone number" className="rounded-lg!" />
          </Form.Item>

          <Form.Item
            name="position"
            label="Position"
            rules={[{ required: true, message: "Position is required" }]}
          >
            <Input size="large" placeholder="Enter position" className="rounded-lg!" />
          </Form.Item>

          <Form.Item
            name="access_level"
            label="Access Level"
            rules={[{ required: true, message: "Access level is required" }]}
          >
            <Select
              mode="multiple"
              size="large"
              placeholder="Select access level"
              className="w-full rounded-lg!"
            >
              <Option value="view_bookings">View Bookings</Option>
              <Option value="manage_bookings">Manage Bookings</Option>
              <Option value="view_users">View Users</Option>
              <Option value="manage_users">Manage Users</Option>
              <Option value="view_reports">View Reports</Option>
              <Option value="manage_settings">Manage Settings</Option>
            </Select>
          </Form.Item>

          <div className="flex justify-end gap-4">
            <Button
              size="large"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isUpdating}
              className="px-8 bg-[#F5EAEA]! text-[#DB4A47]! font-medium! border-none!"
            >
              Cancel
            </Button>

            <Button
              size="large"
              type="primary"
              htmlType="submit"
              loading={isUpdating}
              className="px-8 bg-[#DB4A47]! hover:bg-[#c63d3a]! border-none!"
            >
              Update User
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagementTable;