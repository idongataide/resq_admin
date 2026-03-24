// OperatorRevenue.tsx
import { Table, Button} from "antd";
import { FiClock, FiDollarSign } from "react-icons/fi";


const OperatorRevenue = () => {

  const data = [
    {
      key: "1",
      dateJoined: "12th Jan. 2025",
      operatorName: "John Doe Transport",
      operatorEarning: "₦45,300",
      totalRequest: "156",
    },
    {
      key: "2",
      dateJoined: "15th Jan. 2025",
      operatorName: "Swift Logistics",
      operatorEarning: "₦38,200",
      totalRequest: "142",
    },
    {
      key: "3",
      dateJoined: "13th Jan. 2025",
      operatorName: "City Cabs Ltd",
      operatorEarning: "₦52,150",
      totalRequest: "189",
    },
    {
      key: "4",
      dateJoined: "10th Jan. 2025",
      operatorName: "Metro Movers",
      operatorEarning: "₦29,800",
      totalRequest: "98",
    },
    {
      key: "5",
      dateJoined: "14th Jan. 2025",
      operatorName: "Express Deliveries",
      operatorEarning: "₦41,500",
      totalRequest: "167",
    },
    {
      key: "6",
      dateJoined: "11th Jan. 2025",
      operatorName: "Royal Rides",
      operatorEarning: "₦33,750",
      totalRequest: "124",
    },
    {
      key: "7",
      dateJoined: "16th Jan. 2025",
      operatorName: "Prime Transport",
      operatorEarning: "₦47,200",
      totalRequest: "178",
    },
    {
      key: "8",
      dateJoined: "12th Jan. 2025",
      operatorName: "Elite Logistics",
      operatorEarning: "₦36,400",
      totalRequest: "135",
    },
  ];

  // Table columns
  const columns = [
    {
      title: "Date Joined",
      dataIndex: "dateJoined",
      key: "dateJoined",
      sorter: (a, b) => a.dateJoined.localeCompare(b.dateJoined),
      render: (text) => (
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
      sorter: (a, b) => a.operatorName.localeCompare(b.operatorName),
    },
    {
      title: "Operator Earning",
      dataIndex: "operatorEarning",
      key: "operatorEarning",
      sorter: (a, b) => {
        const numA = parseInt(a.operatorEarning.replace(/[₦,]/g, ''));
        const numB = parseInt(b.operatorEarning.replace(/[₦,]/g, ''));
        return numA - numB;
      },
      render: (text) => (
        <div className="flex items-center gap-2">
          <FiDollarSign className="text-gray-400" />
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: "Total Request",
      dataIndex: "totalRequest",
      key: "totalRequest",
      sorter: (a, b) => parseInt(a.totalRequest) - parseInt(b.totalRequest),
    },
  ];

  return (
    <>
      <p className="mb-4">Manage incoming requests for customer emergency booking</p>
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
        />
      </div>
    </>
  );
};

export default OperatorRevenue;