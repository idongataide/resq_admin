import React, { useState } from "react";
import { ResponsiveLine } from '@nivo/line';
import moment from 'moment';
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import { useRevenues } from '@/hooks/useProfile';

interface RevenueData {
  date: string;
  amount: number;
}

interface WeekAmount {
  week: string;
  amount: number;
  count: number;
}

interface MonthlyResponse {
  monthly: { date: string; amount: number }[];
  total: {
    total: number;
  };
}

interface WeeklyResponse {
  weekly: WeekAmount[];
  total: {
    total_earning: number;
    total_rides: number;
  };
}

type TimePeriod = 'weekly' | 'monthly' | 'yearly';

const RevenueGrowthChart: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('yearly');
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  const formatToKM = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '₦0';
    if (value >= 1000000) {
      return `₦${(value / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
    }
    if (value >= 1000) {
      return `₦${(value / 1000).toFixed(0)}k`;
    }
    return `₦${value.toLocaleString()}`;
  };

  // Function to normalize week format
  const normalizeWeek = (weekStr: string): string => {
    const [year, rawWeek] = weekStr.split(/-w|-W/); // handle both lowercase and uppercase "w"
    const weekNum = String(parseInt(rawWeek, 10)).padStart(2, '0');
    return `${year}-W${weekNum}`;
  };

  // Function to create complete weekly data with all 52 weeks
  const createCompleteWeeklyData = (weeklyData: WeekAmount[]): WeekAmount[] => {
    const dataMap: Record<string, number> = {};
    
    // Create a map of existing data
    weeklyData.forEach(item => {
      const normalizedWeek = normalizeWeek(item.week);
      dataMap[normalizedWeek] = item.amount;
    });

    // Use the selected year
    const year = selectedYear.toString();
    
    // Create complete 52 weeks data
    const completeData: WeekAmount[] = [];
    
    for (let i = 1; i <= 52; i++) {
      const weekLabel = `W${String(i).padStart(2, '0')}`; // e.g., W01
      const fullWeekKey = `${year}-${weekLabel}`;
      
      completeData.push({
        week: fullWeekKey,
        amount: dataMap[fullWeekKey] || 0,
        count: 0 // You can map count if needed
      });
    }
    
    return completeData;
  };

  // Function to create complete monthly data with all 12 months
  const createCompleteMonthlyData = (monthlyData: { date: string, amount: number }[]): { date: string, amount: number }[] => {
    const dataMap: Record<string, number> = {};
    
    // Create a map of existing data
    monthlyData.forEach(item => {
      // Assuming item.date is "YYYY-MM"
      dataMap[item.date] = item.amount;
    });

    // Use the selected year
    const year = selectedYear.toString();
    
    // Create complete 12 months data
    const completeData: { date: string, amount: number }[] = [];
    
    for (let i = 1; i <= 12; i++) {
      const month = String(i).padStart(2, '0'); // e.g., 01, 02
      const fullMonthKey = `${year}-${month}`;
      
      completeData.push({
        date: fullMonthKey,
        amount: dataMap[fullMonthKey] || 0,
      });
    }
    
    return completeData;
  };

  // Function to create complete yearly data for a 5-year range
  const createCompleteYearlyData = (yearlyData: { date: string, amount: number }[], startYear: number, endYear: number): { date: string, amount: number }[] => {
    const dataMap: Record<string, number> = {};
    
    // Create a map of existing data
    yearlyData.forEach(item => {
      // Assuming item.date is "YYYY" or "YYYY-MM-DD", we extract the year
      const year = moment(item.date).format('YYYY');
      dataMap[year] = item.amount;
    });

    const completeData: { date: string, amount: number }[] = [];
    
    for (let year = startYear; year <= endYear; year++) {
      const yearStr = year.toString();
      completeData.push({
        date: yearStr, // Nivo will parse this as a year
        amount: dataMap[yearStr] || 0,
      });
    }
    
    return completeData;
  };

  // Get the appropriate endpoint based on selected period and year
  const getEndpoint = (period: TimePeriod) => {
    if (period === 'yearly') {
      const startYear = 2024;
      const endYear = 2030;
      const yearlyStartDate = `${startYear}-01-01`;
      const yearlyEndDate = `${endYear}-12-31`;
      return `revenue-growth-yearly&start_date=${yearlyStartDate}&end_date=${yearlyEndDate}`;
    }
    
    const startDate = `${selectedYear}-01-01`;
    const endDate = `${selectedYear}-12-31`;

    if (period === 'weekly') {
      return `revenue-growth-weekly&start_date=${startDate}&end_date=${endDate}`;
    } else if (period === 'monthly') {
      return `revenue-growth-monthly&start_date=${startDate}&end_date=${endDate}`;
    }

    return 'revenue-growth';
  };

  const { data: graph } = useRevenues(getEndpoint(selectedPeriod));

  // Transform the API data into the format required by nivo
  const transformedData = React.useMemo(() => {
    if (!graph) return [];

    if (selectedPeriod === 'weekly') {
      // Handle weekly data with complete 52 weeks
      const response = graph as WeeklyResponse;
      if (response && response.weekly) {
        const completeWeeklyData = createCompleteWeeklyData(response.weekly);
        
        return [{
          id: 'Revenue',
          data: completeWeeklyData.map(item => ({
            x: item.week, // Use the week string directly (e.g., "2025-W24")
            y: item.amount,
          })),
        }];
      }
    } else if (selectedPeriod === 'monthly') {
      const response = graph as MonthlyResponse;
      if (response && response.monthly) {
          const completeMonthlyData = createCompleteMonthlyData(response.monthly);

          return [{
              id: 'Revenue',
              data: completeMonthlyData.map(item => ({
                  x: item.date,
                  y: item.amount,
              })),
          }];
      }
    } else if (selectedPeriod === 'yearly') {
      const startYear = 2024;
      const endYear = 2030;
      const yearlyData = graph as { date: string; amount: number }[];
      
      if (Array.isArray(yearlyData)) {
          const completeYearlyData = createCompleteYearlyData(yearlyData, startYear, endYear);
          return [{
              id: 'Revenue',
              data: completeYearlyData.map(item => ({
                  x: item.date,
                  y: item.amount,
              })),
          }];
      }
    }

    return [];
  }, [graph, selectedPeriod, selectedYear]);

  const maxValue = React.useMemo(() => {
    if (!graph) return 2000;

    let amounts: number[] = [];
    if (selectedPeriod === 'weekly') {
      const response = graph as WeeklyResponse;
      if (response && response.weekly) {
        amounts = response.weekly.map(item => item.amount);
      }
    } else if (selectedPeriod === 'monthly') {
      const response = graph as MonthlyResponse;
      if (response && response.monthly) {
          amounts = response.monthly.map(item => item.amount);
      }
    } else {
        if (Array.isArray(graph)) {
            amounts = (graph as RevenueData[]).map(item => item.amount);
        }
    }
    
    if (amounts.length === 0) {
      return 2000; // Default max value if no amounts
    }

    const maxAmount = Math.max(...amounts);
    return maxAmount > 0 ? maxAmount * 1.2 : 2000;
  }, [graph, selectedPeriod]);

  const tickValues = React.useMemo(() => {
    const tickCount = 4;
    if (maxValue <= 0) return [0];

    const step = Math.ceil(maxValue / tickCount);
    
    // Create an array of tick values from 0 up to maxValue
    const ticks = Array.from({ length: tickCount + 1 }, (_, i) => {
      const value = i * step;
      // Ensure the last tick is not greater than maxValue, though `ceil` should handle this
      return value > maxValue ? Math.ceil(maxValue) : value;
    });
    
    // Ensure the highest value is included if it's not already
    if (ticks[ticks.length - 1] < maxValue) {
        ticks[ticks.length - 1] = Math.ceil(maxValue)
    }

    return ticks;
  }, [maxValue]);

  // Get the current period's revenue
  const currentPeriodRevenue = React.useMemo(() => {
    if (!graph) return 0;
    
    if (selectedPeriod === 'weekly') {
      const response = graph as WeeklyResponse;
      if (response && response.total) {
        return response.total.total_earning;
      }
      // Fallback: sum all weekly amounts
      if (response && response.weekly) {
        return response.weekly.reduce((acc, item) => acc + item.amount, 0);
      }
    } else if (selectedPeriod === 'monthly') {
      const response = graph as MonthlyResponse;
      if (response && response.total) {
          return response.total.total;
      }
      if (response && response.monthly) {
          return response.monthly.reduce((acc, item) => acc + item.amount, 0);
      }
    } else {
      const revenueData = graph as any[];
      if (!Array.isArray(revenueData)) {
        return 0;
      }
      // Sum all amounts in the graph data as the backend should return the correct range
      return revenueData.reduce((acc, item) => acc + item.amount, 0);
    }
    
    return 0;
  }, [graph, selectedPeriod]);

  // Get the period label
  const periodLabel = React.useMemo(() => {
    switch (selectedPeriod) {
      case 'weekly':
        return `${selectedYear}`;
      case 'monthly':
        return `${selectedYear}`;
      case 'yearly':
        return `2024 - 2030`;
      default:
        return `${selectedYear}`;
    }
  }, [selectedPeriod, selectedYear]);

  const getDateFormat = (period: TimePeriod) => {
    switch (period) {
      case 'weekly':
        return 'W[W]'; // Format for week display
      case 'monthly':
        return 'MMM';
      case 'yearly':
        return 'YYYY';
      default:
        return 'MMM D';
    }
  };

  // Get the xScale format based on selected period
  const getXScaleFormat = (period: TimePeriod) => {
    switch (period) {
      case 'weekly':
        return '%Y-W%V'; // Format for week display
      case 'monthly':
        return '%Y-%m';
      case 'yearly':
        return '%Y';
      default:
        return '%Y-%m-%d';
    }
  };

  // Generate year options for dropdown (current year and 5 years back)
  const yearOptions = React.useMemo(() => {
    const years = [];
    for (let i = 2030; i >= 2024; i--) {
      years.push(i);
    }
    return years;
  }, []);

  const commonProps = {
    margin: { top: 0, right: 20, bottom: 20, left: 50 },
    xScale: {
      type: (selectedPeriod === 'weekly' || selectedPeriod === 'yearly') ? 'point' as const : 'time' as const,
      format: (selectedPeriod === 'weekly' || selectedPeriod === 'yearly') ? undefined : getXScaleFormat(selectedPeriod),
      precision: selectedPeriod === 'monthly' ? ('month' as const) : ('day' as const),
      useUTC: false,
    },
    yScale: {
      type: 'linear' as const,
      min: 0,
      max: maxValue,
      stacked: false,
      reverse: false,
    },
    axisTop: null,
    axisRight: null,
    axisBottom: {
      tickSize: 5,
      tickPadding: 5,
      tickRotation: selectedPeriod === 'weekly' ? 45 : 0,
      legend: '',
      legendOffset: 36,
      legendPosition: 'middle' as const,
      format: selectedPeriod === 'weekly' ? 
        (value: any) => {
          if (typeof value === 'string' && value.includes('-W')) {
            return value.split('-W')[1];
          }
          return value;
        } : // Show only week number
        (value: string) => moment(value).format(getDateFormat(selectedPeriod)),
      tickValues: selectedPeriod === 'monthly' ? 'every 1 month' : undefined,
    },
    axisLeft: {
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      tickValues: tickValues,
      legend: '',
      legendOffset: -40,
      legendPosition: 'middle' as const,
      format: formatToKM,
    },
    enableGridX: false,
    enableGridY: true,
    gridYValues: tickValues,
    colors: ['#FFBB9E'],
    pointSize: 2,
    pointColor: { theme: 'background' as const },
    pointBorderWidth: 1,
    pointBorderColor: { from: 'serieColor' as const },
    pointLabelYOffset: -12,
    theme: {
      grid: {
        line: {
          stroke: '#E5E9F0',
          strokeWidth: 1,
          strokeDasharray: '4 4',
        },
      },
      axis: {
        ticks: {
          line: {
            stroke: 'transparent',
          },
        },
      },
    },
    useMesh: true,
    areaBlendMode: 'normal' as const,
    enableArea: true,
    defs: [
      {
        id: 'area-gradient',
        type: 'linearGradient' as const,
        colors: [
          { offset: 0, color: '#FFBB9E', opacity: 0.8 },
          { offset: 100, color: '#FFBB9E', opacity: 0 },
        ],
        gradientTransform: 'rotate(10)',
      },
    ],
    fill: [
      {
        match: { id: 'Revenue' },
        id: 'area-gradient',
      },
    ],
    tooltip: ({ point }: any) => {
      if (!point) return null;
      return (
        <div style={{
          background: '#334155',
          color: '#fff',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '0.875rem'
        }}>
          <div style={{ color: point.serieColor }}>
            {selectedPeriod === 'weekly' ? 
              (() => {
                const xValue = point.data.x;
                if (typeof xValue === 'string' && xValue.includes('-W')) {
                  return `Week ${xValue.split('-W')[1]}`;
                }
                return `Week ${xValue}`;
              })() :
              moment(point.data.x as string).format(getDateFormat(selectedPeriod))
            }
          </div>
          <strong>{formatToKM(point?.data?.y)}</strong>
        </div>
      );
    },
    crosshairType: 'bottom-left' as const,
    enablePoints: false,
    enableSlices: 'x' as const,
    sliceTooltip: ({ slice }: any) => {
      if (slice.points.length === 0) return null;
      const point = slice.points[0];
      return (
        <div style={{
          background: '#334155',
          color: '#fff',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '0.875rem'
        }}>
          <div style={{ color: point.serieColor }}>
            {selectedPeriod === 'weekly' ? 
              (() => {
                const xValue = point.data.x;
                if (typeof xValue === 'string' && xValue.includes('-W')) {
                  return `Week ${xValue.split('-W')[1]}`;
                }
                return `Week ${xValue}`;
              })() :
              moment(point.data.x as string).format(getDateFormat(selectedPeriod))
            }
          </div>
          <strong>{formatToKM(point?.data?.y)}</strong>
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg px-4 py-6 mb-6  min-h-[300px]">

      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xs font-medium text-[#667085]">Revenue Growth</h3>
          <div className="flex items-center text-sm">
            <span className="text-xl font-medium text-[#344054]">₦{currentPeriodRevenue?.toLocaleString()}</span>
            <span className="ml-2 text-[#475467]">{periodLabel}</span>
            <HiMiniArrowTrendingUp className="text-[20px] ml-2 text-[#69B574]" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500 flex">
            <button 
              onClick={() => setSelectedPeriod('weekly')}
              className={`px-3 py-1 text-[#475467] text-xs cursor-pointer border ${selectedPeriod === 'weekly' ? 'bg-[#FFF3ED] border-[#FF6C2D] text-[#FF6C2D]' : 'border-[#F2F4F7]'}`}
            >
              Weekly
            </button>
            <button 
              onClick={() => setSelectedPeriod('monthly')}
              className={`px-3 py-1 text-[#475467] text-xs cursor-pointer border ${selectedPeriod === 'monthly' ? 'bg-[#FFF3ED] border-[#FF6C2D] text-[#FF6C2D]' : 'border-[#F2F4F7]'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setSelectedPeriod('yearly')}
              className={`px-3 py-1 text-[#475467] text-xs cursor-pointer rounded-br-md rounded-tr-md border ${selectedPeriod === 'yearly' ? 'bg-[#FFF3ED] border-[#FF6C2D] text-[#FF6C2D]' : 'border-[#F2F4F7]'}`}
            >
              Yearly
            </button>
          </div>
          {selectedPeriod !== 'yearly' && (
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-1 text-[#475467] text-xs border border-[#F2F4F7] rounded-md bg-white focus:outline-none focus:border-[#FF6C2D]"
            >
              {yearOptions.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveLine
          {...commonProps}
          data={transformedData}
        />
      </div>
    </div>
  );
};

export default RevenueGrowthChart;