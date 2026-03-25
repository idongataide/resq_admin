// OperatorRevenue.tsx
import { Table, Button } from "antd";
import { FiClock } from "react-icons/fi";

interface OperatorData {
  key: string;
  dateJoined: string;
  operatorName: string;
  operatorEarning: string;
  totalRequest: string;
  totalRevenue: string;
  tax: string;
  ministryOfHealth: string;
  govt: string;
}

const OperatorRevenue = () => {
  const data: OperatorData[] = [
    {
      key: "1",
      dateJoined: "12th Jan. 2025",
      operatorName: "John Doe Transport",
      operatorEarning: "₦45,300",
      totalRequest: "156",
      totalRevenue: "₦78,500",
      tax: "₦7,850",
      ministryOfHealth: "₦3,925",
      govt: "₦11,775",
    },
    {
      key: "2",
      dateJoined: "15th Jan. 2025",
      operatorName: "Swift Logistics",
      operatorEarning: "₦38,200",
      totalRequest: "142",
      totalRevenue: "₦65,800",
      tax: "₦6,580",
      ministryOfHealth: "₦3,290",
      govt: "₦9,870",
    },
    {
      key: "3",
      dateJoined: "13th Jan. 2025",
      operatorName: "City Cabs Ltd",
      operatorEarning: "₦52,150",
      totalRequest: "189",
      totalRevenue: "₦89,200",
      tax: "₦8,920",
      ministryOfHealth: "₦4,460",
      govt: "₦13,380",
    },
    {
      key: "4",
      dateJoined: "10th Jan. 2025",
      operatorName: "Metro Movers",
      operatorEarning: "₦29,800",
      totalRequest: "98",
      totalRevenue: "₦51,200",
      tax: "₦5,120",
      ministryOfHealth: "₦2,560",
      govt: "₦7,680",
    },
    {
      key: "5",
      dateJoined: "14th Jan. 2025",
      operatorName: "Express Deliveries",
      operatorEarning: "₦41,500",
      totalRequest: "167",
      totalRevenue: "₦71,200",
      tax: "₦7,120",
      ministryOfHealth: "₦3,560",
      govt: "₦10,680",
    },
    {
      key: "6",
      dateJoined: "11th Jan. 2025",
      operatorName: "Royal Rides",
      operatorEarning: "₦33,750",
      totalRequest: "124",
      totalRevenue: "₦58,300",
      tax: "₦5,830",
      ministryOfHealth: "₦2,915",
      govt: "₦8,745",
    },
    {
      key: "7",
      dateJoined: "16th Jan. 2025",
      operatorName: "Prime Transport",
      operatorEarning: "₦47,200",
      totalRequest: "178",
      totalRevenue: "₦81,500",
      tax: "₦8,150",
      ministryOfHealth: "₦4,075",
      govt: "₦12,225",
    },
    {
      key: "8",
      dateJoined: "12th Jan. 2025",
      operatorName: "Elite Logistics",
      operatorEarning: "₦36,400",
      totalRequest: "135",
      totalRevenue: "₦62,800",
      tax: "₦6,280",
      ministryOfHealth: "₦3,140",
      govt: "₦9,420",
    },
  ];

  // Table columns with proper types
  const columns = [
    {
      title: "Date Joined",
      dataIndex: "dateJoined",
      key: "dateJoined",
      sorter: (a: OperatorData, b: OperatorData) => a.dateJoined.localeCompare(b.dateJoined),
      render: (text: string) => (
        <div className="flex items-center gap-2">
          <FiClock className="text-gray-400" />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Operator Name",
      dataIndex: "operatorName",
      key: "operatorName",
      sorter: (a: OperatorData, b: OperatorData) => a.operatorName.localeCompare(b.operatorName),
    },
    {
      title: "Total Revenue",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      sorter: (a: OperatorData, b: OperatorData) => {
        const aValue = parseFloat(a.totalRevenue.replace(/[₦,]/g, ''));
        const bValue = parseFloat(b.totalRevenue.replace(/[₦,]/g, ''));
        return aValue - bValue;
      },
    },
    {
      title: "Operator Revenue",
      dataIndex: "operatorEarning",
      key: "operatorEarning",
      sorter: (a: OperatorData, b: OperatorData) => {
        const aValue = parseFloat(a.operatorEarning.replace(/[₦,]/g, ''));
        const bValue = parseFloat(b.operatorEarning.replace(/[₦,]/g, ''));
        return aValue - bValue;
      },
    },
    {
      title: "Tax",
      dataIndex: "tax",
      key: "tax",
      sorter: (a: OperatorData, b: OperatorData) => {
        const aValue = parseFloat(a.tax.replace(/[₦,]/g, ''));
        const bValue = parseFloat(b.tax.replace(/[₦,]/g, ''));
        return aValue - bValue;
      },
    },
    {
      title: "Ministry of Health",
      dataIndex: "ministryOfHealth",
      key: "ministryOfHealth",
      sorter: (a: OperatorData, b: OperatorData) => {
        const aValue = parseFloat(a.ministryOfHealth.replace(/[₦,]/g, ''));
        const bValue = parseFloat(b.ministryOfHealth.replace(/[₦,]/g, ''));
        return aValue - bValue;
      },
    },
    {
      title: "Govt",
      dataIndex: "govt",
      key: "govt",
      sorter: (a: OperatorData, b: OperatorData) => {
        const aValue = parseFloat(a.govt.replace(/[₦,]/g, ''));
        const bValue = parseFloat(b.govt.replace(/[₦,]/g, ''));
        return aValue - bValue;
      },
    },
  ];

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header with Filter and Add New */}
        <div className="p-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-[#354959] uppercase text-md font-bold">
              Revenue per Operator
            </h1>  
            <div className="gap-3 flex">
              <Button 
                className="bg-[#F6F8F9]! rounded-lg flex items-center"
                size="small"
              >
                Weekly
              </Button>
              <Button 
                className="bg-[#F6F8F9]! rounded-lg flex items-center"
                size="small"
              >
                Monthly
              </Button>
              <Button 
                className="bg-[#F6F8F9]! rounded-lg flex items-center"
                size="small"
              >
                Yearly
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} operators`,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          className="border-none p-4"
          rowClassName="hover:bg-gray-50 transition-colors"
          scroll={{ x: 'max-content' }}
        />
      </div>
    </>
  );
};

export default OperatorRevenue;