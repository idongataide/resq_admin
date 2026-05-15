// operatorPayout.tsx
import { Table } from "antd";
import { FiClock } from "react-icons/fi";
import DateRangeFilter, { type Period } from "@/components/ui/DateRangeFilter";
import { useState, useEffect } from "react";
import { useOperatorRevenue } from "@/hooks/useRevenue";
import LoadingScreen from "../../common/LoadingScreen";


interface OperatorDataType {
  key: string;
  dateJoined: string;
  beneficiary: string;
  amountDue: number;
  bankName: string;
  accountNumber: string;
}

interface OperatorPayoutProps {
  isNonEmergency?: boolean;
}

const OperatorPayout: React.FC<OperatorPayoutProps> = ({ isNonEmergency = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('yearly');
  const [dateRange, setDateRange] = useState<{ start_date: string; end_date: string }>({
    start_date: '',
    end_date: ''
  });

  // Calculate date range based on selected period
  useEffect(() => {
    const calculateDateRange = (period: Period) => {
      const today = new Date();
      let startDate = new Date();
      let endDate = new Date();

      switch (period) {
        case 'daily':
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'weekly':
          startDate.setDate(today.getDate() - 7);
          break;
        case 'monthly':
          startDate.setMonth(today.getMonth() - 1);
          break;
        case 'yearly':
          startDate.setFullYear(today.getFullYear() - 1);
          break;
      }

      setDateRange({
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      });
    };

    calculateDateRange(selectedPeriod);
  }, [selectedPeriod]);

  // Use different endpoint based on emergency/non-emergency
  const { data, isLoading } = useOperatorRevenue({
    isNonEmergency,
    period: selectedPeriod,
    start_date: dateRange.start_date,
    end_date: dateRange.end_date,
    page: currentPage,
  });

  // Transform API data to table format
  const tableData: OperatorDataType[] = data?.map((item: any, index: number) => ({
    key: item._id || index.toString(),
    dateJoined: item.createdAt,
    beneficiary: item.name || 'N/A',
    amountDue: item.amount || 0,
    bankName: item.account?.bank_name || 'N/A',
    accountNumber: item.account?.account_number || 'N/A',
  })) || [];

  // Table columns
  const columns = [
    {
      title: "Date Joined",
      dataIndex: "dateJoined",
      key: "dateJoined",
      sorter: (a: OperatorDataType, b: OperatorDataType) => a.dateJoined.localeCompare(b.dateJoined),
      render: (text: string) => (
        <div className="flex items-center gap-2">
          <FiClock className="text-gray-400" />
          <span>{new Date(text).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        </div>
      ),
    },
    {
      title: "Beneficiary",
      dataIndex: "beneficiary",
      key: "beneficiary",
      sorter: (a: OperatorDataType, b: OperatorDataType) => a.beneficiary.localeCompare(b.beneficiary),
    },
    {
      title: "Amount Due",
      dataIndex: "amountDue",
      key: "amountDue",
      sorter: (a: OperatorDataType, b: OperatorDataType) => a.amountDue - b.amountDue,
      render: (value: number) => <span className="font-medium">₦{value?.toLocaleString() || '0'}</span>,
    },
    {
      title: "Bank Name",
      dataIndex: "bankName",
      key: "bankName",
      sorter: (a: OperatorDataType, b: OperatorDataType) => a.bankName.localeCompare(b.bankName),
    },
    {
      title: "Account Number",
      dataIndex: "accountNumber",
      key: "accountNumber",
      sorter: (a: OperatorDataType, b: OperatorDataType) => a.accountNumber.localeCompare(b.accountNumber),
    },
  ];

    if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <p className="mb-4">Manage operator payouts and beneficiary payments</p>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header with Filter */}
        <div className="p-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-[#354959] uppercase text-md font-bold">
              Operator Payouts
            </h1>  
            <DateRangeFilter
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
              periods={['weekly', 'monthly', 'yearly']}
              variant="outline"
            />
          </div>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={tableData}
          loading={isLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: tableData.length,
            showTotal: (total) => `Total ${total} payouts`,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size || 10);
            },
          }}
          className="border-none p-4"
          rowClassName="hover:bg-gray-50 transition-colors"
          scroll={{ x: 'max-content' }}
        />
      </div>
    </>
  );
};

export default OperatorPayout;