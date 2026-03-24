import { Table } from "antd";
import { useActivity } from "@/hooks/useActivity";
import { FiClock, FiUser, FiServer } from "react-icons/fi";

interface Activity {
  auth_id: string;
  service: string;
  operation: string;
  body: string;
  data: {
    data: any;
  };
  createdAt: string;
  updatedAt: string;
  admin_data: {
    _id: string;
    full_name: string;
    email: string;
    phone_number: string;
  };
}

const ActivityLog = () => {
  const { data, isLoading } = useActivity();

  // Format date function
  const formatTime = (timestamp: string) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get operation color
  const getOperationColor = (operation: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      create: { bg: '#E8F5E9', text: '#1B5E20' },
      update: { bg: '#FFF7E8', text: '#BB7F05' },
      delete: { bg: '#FDF5F5', text: '#DE3631' },
    };
    return colors[operation] || { bg: '#F5F6F7', text: '#354959' };
  };

  // Map API data to table format
  const activityData = data?.map((item: Activity, index: number) => {
    const operationColor = getOperationColor(item.operation);
    
    return {
      key: item.auth_id + index,
      sn: index + 1,
      activity: (
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span 
              className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: operationColor.bg, color: operationColor.text }}
            >
              {item.operation.toUpperCase()}
            </span>
            <span className="text-xs text-[#808D97] flex items-center gap-1">
              <FiServer className="w-3 h-3" />
              {item.service}
            </span>
          </div>
          <span className="font-medium text-[#000A0F]">{item.body}</span>
          {item.data?.data && Object.keys(item.data.data).length > 0 && (
            <span className="text-xs text-[#808D97] mt-1">
              {Object.entries(item.data.data)
                .map(([key, value]) => `${key}: ${value}`)
                .join(' • ')}
            </span>
          )}
        </div>
      ),
      user: (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <FiUser className="text-[#808D97] w-4 h-4" />
            <span className="text-sm font-medium text-[#000A0F]">
              {item.admin_data?.full_name || 'Unknown'}
            </span>
          </div>
          <span className="text-xs text-[#808D97] ml-6">
            {item.admin_data?.email}
          </span>
        </div>
      ),
      time: (
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-[#354959]">
            <FiClock className="text-gray-400 w-4 h-4" />
            <span className="text-sm">{formatTime(item.createdAt)}</span>
          </div>
          <span className="text-xs text-[#808D97] ml-6">
            {new Date(item.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      ),
    };
  }) || [];

  // Table columns
  const columns = [
    {
      title: "S/N",
      dataIndex: "sn",
      key: "sn",
      width: 70,
      render: (text: number) => (
        <span className="text-sm text-[#808D97]">{text}</span>
      ),
    },
    {
      title: "Activity",
      dataIndex: "activity",
      key: "activity",
      width: '40%',
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      width: '25%',
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      width: '25%',
    },
  ];

  return (
    <div className="w-full p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-[#000A0F]">Activity Log</h1>
          <p className="text-sm text-[#808D97] mt-0.5">
            Monitor all system activities and user actions
          </p>
        </div>
        
        {/* Table */}
        <div className="p-4">
          <Table
            columns={columns}
            dataSource={activityData}
            loading={isLoading}
            pagination={{
              pageSize: 10,
              showTotal: (total) => (
                <span className="text-[#808D97]">Total {total} activities</span>
              ),
              showSizeChanger: true,
              showQuickJumper: true,
            }}
            className="border-none"
            rowClassName="hover:bg-gray-50 transition-colors"
            scroll={{ x: 'max-content' }}
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;