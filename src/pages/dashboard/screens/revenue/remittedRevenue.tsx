// RemittedRevenue.tsx (fixed spelling)
import React, { useState, useMemo, useEffect } from 'react';
import { Table } from "antd";
import { FiClock } from "react-icons/fi";
import { useRemittedRevenue } from "@/hooks/useRevenue";
import LoadingScreen from '@/pages/dashboard/common/LoadingScreen';
import DateRangeFilter, { type Period } from '@/components/ui/DateRangeFilter';

interface RemittedRevenueProps {
  isNonEmergency?: boolean;
}

const RemittedRevenue: React.FC<RemittedRevenueProps> = ({ isNonEmergency = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('yearly');
  const [dateRange, setDateRange] = useState<{ start_date: string; end_date: string }>({
    start_date: '',
    end_date: ''
  });

  // Function to calculate date range based on selected period
  const calculateDateRange = (period: Period) => {
    const today = new Date();
    let startDate = new Date();
    let endDate = new Date();

    switch (period) {
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

  // Update date range when period changes
  useEffect(() => {
    calculateDateRange(selectedPeriod);
  }, [selectedPeriod]);

  const { data, isLoading } = useRemittedRevenue({
    isNonEmergency,
    start_date: dateRange.start_date,
    end_date: dateRange.end_date,
    page: currentPage,
    item_per_page: pageSize
  });

  const processedData = useMemo(() => {
    if (!data) return { data: [], columns: [] };

    const uniqueStakeholders = new Set<string>();
    const transformedData = data.map((revenue: any, index: number) => {
      const rowData: any = {
        id: revenue?.id || index,
        date: revenue?.date,
        totalRevenue: revenue?.totalAmount,
        operatorEarning: revenue?.serviceFee,
        originalItems: revenue?.items || []
      };
      
      revenue?.items?.forEach((item: any) => {
        const normalizedName = item.name.toLowerCase().replace(/\s+/g, '_');
        uniqueStakeholders.add(normalizedName);
        rowData[normalizedName] = item.amount;
      });
      
      return rowData;
    });

    // Create dynamic columns for each stakeholder
    const dynamicColumns = Array.from(uniqueStakeholders).map(stakeholderName => ({
      title: stakeholderName.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      dataIndex: stakeholderName,
      key: stakeholderName,
      render: (value: number) => `₦${value?.toLocaleString() || '0'}`,
      sorter: (a: any, b: any) => (a[stakeholderName] || 0) - (b[stakeholderName] || 0),
    }));

    // Static columns
    const staticColumns = [
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        render: (value: string) => (
          <div className="flex items-center gap-2">
            <FiClock className="text-gray-400" />
            <span>{new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
          </div>
        ),
        sorter: (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      },
      {
        title: "Total Revenue",
        dataIndex: "totalRevenue",
        key: "totalRevenue",
        render: (value: number) => <span className="font-medium">₦{value?.toLocaleString() || '0'}</span>,
        sorter: (a: any, b: any) => (a.totalRevenue || 0) - (b.totalRevenue || 0),
      },
      {
        title: "Operator Revenue",
        dataIndex: "operatorEarning",
        key: "operatorEarning",
        render: (value: number) => `₦${value?.toLocaleString() || '0'}`,
        sorter: (a: any, b: any) => (a.operatorEarning || 0) - (b.operatorEarning || 0),
      },
    ];

    const allColumns = [...staticColumns, ...dynamicColumns];

    return {
      data: transformedData,
      columns: allColumns,
    };

  }, [data]);

  const { data: tableData, columns } = processedData;

  const paginatedData = useMemo(() => {
    if (!tableData) return [];
    const startIndex = (currentPage - 1) * pageSize;
    return tableData.slice(startIndex, startIndex + pageSize);
  }, [currentPage, pageSize, tableData]);

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header with Filter */}
      <div className="p-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-[#354959] uppercase text-md font-bold">
            Remitted Revenue
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
        dataSource={paginatedData}
        pagination={tableData?.length > pageSize ? {
          current: currentPage,
          pageSize: pageSize,
          total: tableData?.length,
          showTotal: (total) => `Total ${total} records`,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: handlePageChange,
        } : undefined}
        className="border-none p-4"
        rowClassName="hover:bg-gray-50 transition-colors"
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default RemittedRevenue;