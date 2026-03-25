import Images from "@/components/images";
import { useBookingCounts } from "@/hooks/useBookings";
import React, { useState, useEffect } from "react";
import { Spin } from "antd";

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all';



const DashboardMetrics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('yearly');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ start_date: string; end_date: string }>({
    start_date: '',
    end_date: ''
  });
  console.log(dateRange);

  // Function to calculate date range based on selected period
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
      case 'all':
        startDate = new Date(0); // Beginning of time
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

  // Use the booking counts hook
  const { data: counts, isLoading } = useBookingCounts();

  const metrics = [
    {
      id: 'total',
      title: 'Total Bookings',
      value: counts?.total_req?.toLocaleString() || 'N/A',
      bgColor: '#F6F8F9'
    },
    {
      id: 'pending',
      title: 'Pending Bookings',
      value: counts?.total_pending?.toLocaleString() || 'N/A',
      bgColor: '#FFF7E8'
    },
    {
      id: 'ongoing',
      title: 'Ongoing Bookings',
      value: counts?.total_ongoing?.toLocaleString() || 'N/A',
      bgColor: '#F2F9FE'
    },
    {
      id: 'completed',
      title: 'Completed Bookings',
      value: counts?.total_completed?.toLocaleString() || 'N/A',
      bgColor: '#F8FEF5'
    },
    {
      id: 'cancelled',
      title: 'Canceled Bookings',
      value: counts?.total_cancelled?.toLocaleString() || 'N/A',
      bgColor: '#FDF5F5'
    },
    {
      id: 'not_found',
      title: 'Ambulance not found',
      value: counts?.not_found?.toLocaleString() || 'N/A',
      bgColor: '#F3F5F9'
    }
  ];

  const filterOptions = [
    { id: 1, label: "Today", period: 'daily' as Period },
    { id: 2, label: "All Time", period: 'all' as Period },
    { id: 3, label: "This Month", period: 'monthly' as Period },
    { id: 4, label: "Custom range", isCustom: true }
  ];

  const handleFilterSelect = (option: typeof filterOptions[0]) => {
    if (!option.isCustom) {
      setSelectedPeriod(option.period!);
    }
    setIsFilterOpen(false);
  };

  return (
    <div className="bg-[#FFFFFF] p-6 rounded-2xl">
      <div className="mb-3 flex justify-between items-center">
        <h3 className="text-[#000A0F] font-bold uppercase">OverView</h3>
        
        {/* Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#D0D5DD] rounded-lg shadow-sm hover:bg-gray-50"
          >
            <span className="text-sm text-[#344054] font-medium">Filter</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.6667 6L8 10.6667L3.33333 6" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {isFilterOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setIsFilterOpen(false)}
              />
              
              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-[#EAECF0] z-50 overflow-hidden">
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-[#101828] mb-4">Filter</h3>
                  
                  {/* Filter Options */}
                  <div className="space-y-2 mb-6">
                    {filterOptions.map((option) => (
                      <button
                        key={option.id}
                        className="w-full text-left px-3 py-2.5 text-sm text-[#344054] hover:bg-[#F9FAFB] rounded-lg transition-colors"
                        onClick={() => handleFilterSelect(option)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>

                  {/* Custom Range Section */}
                  <div className="border-t border-[#EAECF0] pt-4 mb-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-[#344054] mb-1.5">
                          Start Time
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Select Start Time"
                            className="w-full px-3 py-2.5 text-sm border border-[#D0D5DD] rounded-lg placeholder:text-[#667085] focus:outline-none focus:ring-1 focus:ring-[#E86229] focus:border-[#E86229]"
                            readOnly
                          />
                          <svg className="absolute right-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.6667 6L8 10.6667L3.33333 6" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#344054] mb-1.5">
                          End Time
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Select End Time"
                            className="w-full px-3 py-2.5 text-sm border border-[#D0D5DD] rounded-lg placeholder:text-[#667085] focus:outline-none focus:ring-1 focus:ring-[#E86229] focus:border-[#E86229]"
                            readOnly
                          />
                          <svg className="absolute right-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.6667 6L8 10.6667L3.33333 6" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-[#344054] bg-white border border-[#D0D5DD] rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-[#E86229] rounded-lg hover:bg-[#d54d1f] transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {metrics.map((metric) => (
          <div 
            key={metric.id} 
            className="rounded-xl p-3 border border-[#F2F4F7] flex flex-col"
            style={{ backgroundColor: metric.bgColor }}
          >
            <div className="flex items-center p-3 bg-white rounded-full w-max mb-4">
              <img 
                src={Images.icon?.siren} 
                alt={`${metric.title} icon`} 
                className="h-5 w-5"
              />
            </div>
            <p className="text-sm text-[#354959] mb-2">{metric.title}</p>
            <h2 className="text-xl font-semibold text-[#354959]">
              {isLoading ? (
                <Spin size="small" />
              ) : (
                metric.value
              )}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardMetrics;