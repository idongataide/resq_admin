// StakeholderPayout.tsx
import { Table, Button } from "antd";
import { FiClock } from "react-icons/fi";

const StakeholderPayout = () => {

  const data = [
    {
      key: "1",
      dateJoined: "12th Jan. 2025",
      beneficiary: "John Doe Transport",
      amountDue: "₦45,300",
      bankName: "First Bank of Nigeria",
      accountNumber: "0123456789",
    },
    {
      key: "2",
      dateJoined: "15th Jan. 2025",
      beneficiary: "Swift Logistics Ltd",
      amountDue: "₦38,200",
      bankName: "GTBank Plc",
      accountNumber: "0234567891",
    },
    {
      key: "3",
      dateJoined: "13th Jan. 2025",
      beneficiary: "City Cabs Ltd",
      amountDue: "₦52,150",
      bankName: "Access Bank",
      accountNumber: "0345678912",
    },
    {
      key: "4",
      dateJoined: "10th Jan. 2025",
      beneficiary: "Metro Movers",
      amountDue: "₦29,800",
      bankName: "Zenith Bank",
      accountNumber: "0456789123",
    },
    {
      key: "5",
      dateJoined: "14th Jan. 2025",
      beneficiary: "Express Deliveries",
      amountDue: "₦41,500",
      bankName: "UBA",
      accountNumber: "0567891234",
    },
    {
      key: "6",
      dateJoined: "11th Jan. 2025",
      beneficiary: "Royal Rides",
      amountDue: "₦33,750",
      bankName: "Fidelity Bank",
      accountNumber: "0678912345",
    },
    {
      key: "7",
      dateJoined: "16th Jan. 2025",
      beneficiary: "Prime Transport",
      amountDue: "₦47,200",
      bankName: "Union Bank",
      accountNumber: "0789123456",
    },
    {
      key: "8",
      dateJoined: "12th Jan. 2025",
      beneficiary: "Elite Logistics",
      amountDue: "₦36,400",
      bankName: "Stanbic IBTC",
      accountNumber: "0891234567",
    },
    {
      key: "9",
      dateJoined: "17th Jan. 2025",
      beneficiary: "Highway Carriers",
      amountDue: "₦54,800",
      bankName: "First Bank of Nigeria",
      accountNumber: "0912345678",
    },
    {
      key: "10",
      dateJoined: "15th Jan. 2025",
      beneficiary: "Speed Transport",
      amountDue: "₦27,500",
      bankName: "GTBank Plc",
      accountNumber: "1023456789",
    },
    {
      key: "11",
      dateJoined: "14th Jan. 2025",
      beneficiary: "Reliable Rides",
      amountDue: "₦39,600",
      bankName: "Access Bank",
      accountNumber: "1123456789",
    },
    {
      key: "12",
      dateJoined: "13th Jan. 2025",
      beneficiary: "City Link",
      amountDue: "₦43,200",
      bankName: "Zenith Bank",
      accountNumber: "1223456789",
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
      title: "Beneficiary",
      dataIndex: "beneficiary",
      key: "beneficiary",      
    },
    {
      title: "Amount Due",
      dataIndex: "amountDue",
      key: "amountDue",
    },
    {
      title: "Bank Name",
      dataIndex: "bankName",
      key: "bankName",  
    },
    {
      title: "Account Number",
      dataIndex: "accountNumber",
      key: "accountNumber",
    },
  ];

  return (
    <>
      <p className="mb-4">Manage stakeholder payouts and beneficiary payments</p>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header with Filter */}
        <div className="p-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-[#354959] uppercase text-md font-bold">
              Stakeholder Payouts
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
            showTotal: (total) => `Total ${total} payouts`,
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

export default StakeholderPayout;