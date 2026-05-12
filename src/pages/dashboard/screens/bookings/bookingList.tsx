import React, { useState } from "react";
import { Table, Button, Input, Dropdown, Menu, Modal, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { 
  SearchOutlined, 
  FilterOutlined, 
  EllipsisOutlined,
  EyeOutlined
} from "@ant-design/icons";
import { FiClock } from "react-icons/fi";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Images from "@/components/images";
import { useBookings } from "@/hooks/useBookings";
import { useHospitals } from "@/hooks/useHospitals";
import toast from "react-hot-toast";
import { acceptBooking, cancelBooking } from "@/api/bookingsApi";

const { Option } = Select;

interface Booking {
  booking_id: string;
  schedule_id?: string;
  booking_ref: string;
  customer_data: {
    customer_name: string;
    customer_phone: string;
    user_id: string;
  };
  phone_number: string;
  payment_method: string;
  booking_status: string;
  created_at: string;
  emergency_category: string;
  emergency_description: string;
  start_address: string;
  end_address: string;
  passenger_count: number;
  special_requirements: string;
  hospital_id?: string;
  booking_reason?: string;
  estimated_cost?: number;
  final_cost?: number;
}

interface BookingListProps {
  bookingType?: string;
}

const BookingList: React.FC<BookingListProps> = ({ bookingType }) => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [acceptOpen, setAcceptOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [selectedHospital, setSelectedHospital] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: bookings, isLoading, mutate } = useBookings(bookingType);
  const { data: hospitals } = useHospitals();

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

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
        PENDING: { bg: '#FFF7E8', text: '#BB7F05', label: 'Pending' },
        REQUEST_ACCEPTED: { bg: '#F8FEF5', text: '#4EA507', label: 'Accepted' },
        ENROUTE_PICKUP: { bg: '#F2F9FE', text: '#007BFF', label: 'En-route Pickup' },
        ARRIVED_AT_PICKUP: { bg: '#E8F0FE', text: '#1A5F7A', label: 'Arrived at Pickup' },
        PICKED_PATIENT: { bg: '#E8F5E9', text: '#1B5E20', label: 'Picked Patient' },
        ENROUTE_TO_DROPOFF: { bg: '#F2F9FE', text: '#007BFF', label: 'En-route to Dropoff' },
        COMPLETED: { bg: '#E8F5E9', text: '#1B5E20', label: 'Completed' },
        CANCELED: { bg: '#FDF5F5', text: '#DE3631', label: 'Cancelled' },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    
    return (
       <span
        className="px-3 py-1 rounded-md text-sm font-medium inline-flex items-center gap-2"
        style={{ backgroundColor: config.bg, color: config.text }}
        >
        <span className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: config.text }}></span> 
        {config.label}
        </span>
    );
  };

  // Handle accept booking
  const handleAccept = async () => {
    if (!selectedBooking?.booking_id) return;

    setIsProcessing(true);
    const loadingToast = toast.loading('Accepting booking...');

    try {
      const response = await acceptBooking({
        booking_id: selectedBooking.booking_id,
        hospital_id: selectedHospital || undefined,
        booking_reason: reason || undefined,
      });
      
      if (response?.status === 'ok') {
        toast.success('Booking accepted successfully!', { id: loadingToast });
        mutate();
        setAcceptOpen(false);
        setReason("");
        setSelectedHospital("");
        setSelectedBooking(null);
      } else {
        const errorMsg = response?.response?.data?.msg || response?.message || 'Failed to accept booking';
        toast.error(errorMsg, { id: loadingToast });
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to accept booking', { id: loadingToast });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle cancel booking
  const handleCancel = async () => {
    if (!selectedBooking?.booking_id) return;

    setIsProcessing(true);
    const loadingToast = toast.loading('Cancelling booking...');

    try {
      const response = await cancelBooking({
        booking_id: selectedBooking.booking_id,
        reason: reason || undefined,
      });
      
      if (response?.status === 'ok') {
        toast.success('Booking cancelled successfully!', { id: loadingToast });
        mutate();
        setCancelOpen(false);
        setReason("");
        setSelectedBooking(null);
      } else {
        const errorMsg = response?.response?.data?.msg || response?.message || 'Failed to cancel booking';
        toast.error(errorMsg, { id: loadingToast });
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to cancel booking', { id: loadingToast });
    } finally {
      setIsProcessing(false);
    }
  };


  // Handle row click - navigate to booking details page
  const handleRowClick = (record: Booking) => {
    const id = record.schedule_id || record.booking_id;
    const route = bookingType === "non-emergency" 
      ? `/bookings/schedule/${id}` 
      : `/bookings/${id}`;
    navigate(route);
  };

  // Handle view details button click
  const handleViewDetails = (record: Booking, e: React.MouseEvent) => {
    e.stopPropagation();
    const id = record.schedule_id || record.booking_id;
    const route = bookingType === "non-emergency" 
      ? `/bookings/schedule/${id}` 
      : `/bookings/${id}`;
    navigate(route);
  };

  // Filter bookings based on search
  const filteredBookings = bookings?.filter((booking: Booking) => 
    booking.customer_data?.customer_name?.toLowerCase().includes(searchText.toLowerCase()) ||
    booking.customer_data?.customer_phone?.includes(searchText) ||
    booking.phone_number?.includes(searchText) ||
    booking.booking_ref?.includes(searchText) ||
    booking.booking_id?.includes(searchText)
  );

  // Action menu for each row
  const actionMenu = (record: Booking) => (
    <Menu>
      {record.booking_status === 'PENDING' && (
        <>
          <Menu.Item 
            key="accept" 
            icon={<FaCheckCircle />} 
            onClick={(e) => {
              e.domEvent.stopPropagation();
              setSelectedBooking(record);
              setAcceptOpen(true);
            }}
          >
            Accept Booking
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item 
            key="cancel" 
            icon={<FaTimesCircle />} 
            onClick={(e) => {
              e.domEvent.stopPropagation();
              setSelectedBooking(record);
              setCancelOpen(true);
            }}
            danger
          >
            Cancel Booking
          </Menu.Item>
        </>
      )}
      {(record.booking_status === 'REQUEST_ACCEPTED' || record.booking_status === 'ENROUTE_PICKUP' || 
        record.booking_status === 'ARRIVED_AT_PICKUP' || record.booking_status === 'PICKED_PATIENT' || 
        record.booking_status === 'ENROUTE_TO_DROPOFF') && (
        <Menu.Item 
          key="cancel" 
          icon={<FaTimesCircle />} 
          onClick={(e) => {
            e.domEvent.stopPropagation();
            setSelectedBooking(record);
            setCancelOpen(true);
          }}
          danger
        >
          Cancel Booking
        </Menu.Item>
      )}
    </Menu>
  );

  // Table columns
  const columns = [
    {
      title: "Date & Time",
      dataIndex: "created_at",
      key: "created_at",
      sorter: (a: Booking, b: Booking) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      render: (text: string) => (
        <div className="flex items-center gap-2 text-[#354959]">
          <FiClock className="text-gray-400" />
          {formatDate(text)}
        </div>
      ),
    },
    {
      title: "Booking ID",
      key: "booking_ref",
      render: (_: any, record: Booking) => (
        <span className="font-mono text-sm">{record.booking_ref || record.booking_id?.slice(-8).toUpperCase()}</span>
      ),
    },
    {
      title: "Name",
      key: "customer_name",
      render: (_: any, record: Booking) => (
        <span>{record.customer_data?.customer_name || 'N/A'}</span>
      ),
      sorter: (a: Booking, b: Booking) => 
        (a.customer_data?.customer_name || '').localeCompare(b.customer_data?.customer_name || ''),
    },
    {
      title: "Phone",
      key: "phone",
      render: (_: any, record: Booking) => (
        <span>{record.customer_data?.customer_phone || record.phone_number || 'N/A'}</span>
      ),
    },
    {
      title: "Payment Method",
      dataIndex: "payment_method",
      key: "payment_method",
      render: (text: string) => {
        if (!text) return 'N/A';
        return text.charAt(0).toUpperCase() + text.slice(1);
      },
    },
    {
        title: "Status",
        dataIndex: "booking_status",
        key: "booking_status",
        render: (status: string) => getStatusBadge(status),
        filters: [
        { text: 'Pending', value: 'PENDING' },
        { text: 'Accepted', value: 'REQUEST_ACCEPTED' },
        { text: 'En-route Pickup', value: 'ENROUTE_PICKUP' },
        { text: 'Arrived at Pickup', value: 'ARRIVED_AT_PICKUP' },
        { text: 'Picked Patient', value: 'PICKED_PATIENT' },
        { text: 'En-route to Dropoff', value: 'ENROUTE_TO_DROPOFF' },
        { text: 'Completed', value: 'COMPLETED' },
        { text: 'Cancelled', value: 'CANCELED' },
        ],
        onFilter: (value: boolean | React.Key, record: Booking) => record.booking_status === String(value),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Booking) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {/* View Details Icon */}
          <Button
            type="text"
            icon={<EyeOutlined className="text-lg text-[#DB4A47]" />}
            className="border-none shadow-none bg-[#FDF6F6]! rounded-lg w-8 h-8 flex items-center justify-center"
            onClick={(e) => handleViewDetails(record, e)}
          />
          
          {/* More Actions Dropdown */}
          <Dropdown 
            overlay={actionMenu(record)} 
            trigger={["click"]} 
            placement="bottomRight"
          >
            <Button 
              type="text" 
              icon={<EllipsisOutlined className="text-xl font-bold text-[#DB4A47]" />} 
              className="border-none shadow-none bg-[#FDF6F6]! rounded-lg w-8 h-8 flex items-center justify-center"
            />
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <div className="p-2 bg-white min-h-screen rounded-2xl">
      <div className="bg-white rounded-xl overflow-hidden">
        {/* Header with Search and Filter */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-[#354959] font-bold uppercase text-sm">
              BOOKINGS ({filteredBookings?.length || 0})
            </h1>
            
            <div className="flex gap-3">
              <Input
                placeholder="Search by name, phone, or ID"
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-64 rounded-lg"
                allowClear
              />
              <Button 
                icon={<FilterOutlined />} 
                className="rounded-lg flex items-center bg-[#FDF6F6]! text-[#DB4A47]! border-0!"
                size="large"
              >
                Filter
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredBookings}
          rowKey="booking_id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} bookings`,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          className="border-none"
          rowClassName="hover:bg-gray-50 transition-colors cursor-pointer"
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
        />
      </div>

      {/* Accept Booking Modal */}
      <Modal
        open={acceptOpen}
        footer={null}
        onCancel={() => {
          setAcceptOpen(false);
          setReason("");
          setSelectedHospital("");
          setSelectedBooking(null);
        }}
        centered
        width={500}
      >
        <div className="space-y-4 p-6">
          <img src={Images.icon.caution} alt="img" />

          <h2 className="text-xl font-semibold">Accept Booking?</h2>

          <p className="text-gray-500">
            This action would accept booking for{" "}
            <strong>
              {selectedBooking?.customer_data?.customer_name || 'this customer'}
            </strong>
          </p>

          <div className="space-y-2">
            <label className="text-sm text-[#354959]">Destination Hospital</label>
            <Select
              placeholder="Select hospital"
              className="w-full"
              size="large"
              value={selectedHospital}
              onChange={(value) => setSelectedHospital(value)}
              allowClear
            >
              {hospitals?.map((hospital: any) => (
                <Option key={hospital.hospital_id} value={hospital.hospital_id}>
                  {hospital.name}
                </Option>
              ))}
            </Select>
          </div>

          <Input.TextArea
            rows={4}
            placeholder="Reason for service"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          <div className="flex justify-end gap-4 mt-6">
            <Button
              size="large"
              onClick={() => {
                setAcceptOpen(false);
                setReason("");
                setSelectedHospital("");
                setSelectedBooking(null);
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
              onClick={handleAccept}
            >
              Approve & Broadcast
            </Button>
          </div>
        </div>
      </Modal>

      {/* Cancel Booking Modal */}
      <Modal
        open={cancelOpen}
        footer={null}
        onCancel={() => {
          setCancelOpen(false);
          setReason("");
          setSelectedBooking(null);
        }}
        centered
        width={500}
      >
        <div className="space-y-4 p-6">
          <img src={Images.icon.caution} alt="img" />

          <h2 className="text-xl font-semibold">Cancel Booking?</h2>

          <p className="text-gray-500">
            This action would cancel booking for{" "}
            <strong>
              {selectedBooking?.customer_data?.customer_name || 'this customer'}
            </strong>
          </p>

          <Input.TextArea
            rows={4}
            placeholder="Reason for cancellation (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          <div className="flex justify-end gap-4 mt-6">
            <Button
              size="large"
              onClick={() => {
                setCancelOpen(false);
                setReason("");
                setSelectedBooking(null);
              }}
              disabled={isProcessing}
              className="px-8 bg-[#F5EAEA]! text-[#DB4A47]! border-none!"
            >
              Cancel
            </Button>

            <Button
              size="large"
              danger
              loading={isProcessing}
              className="px-8 bg-[#DB4A47]! text-white! border-none!"
              onClick={handleCancel}
            >
              Cancel Booking
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookingList;