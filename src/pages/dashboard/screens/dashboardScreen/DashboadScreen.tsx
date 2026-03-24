import React from "react";
import DashboardMetrics from "./DashboardMetrics";
import PerformanceRateChart from "./PerformanceRateChart";
import RevenueGrowthChart from "./RevenueGrowthChart";
import LagosHotspotsMap from "./LagosHotspotsMap";
import { FaArrowRight } from "react-icons/fa";

// Circular Progress Component
const CircularProgress = ({ percentage = 65, size = 60, strokeWidth = 6 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#FEE4E2"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#DB4A47"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold text-[#101928]">{percentage}%</span>
      </div>
    </div>
  );
};


const DashboadScreen: React.FC = () => {
  return (
    <div className="w-full p-6">
      
      <div className="bg-[#FDF5F5] border border-[#DE3631] p-4 rounded-lg flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
            <CircularProgress percentage={82} />
          <div className="flex flex-col">
            <h4 className="text-sm font-medium text-[#000A0F]">This is a dummy title text</h4>
            <p className="text-xs text-[#354959]">This is a dummy alert subtext</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-sm font-medium text-[#DB4A47] flex items-center gap-1">
            Action
            <FaArrowRight className="text-[#DB4A47]"/>
          </button>
        </div>
      </div>
      
      <DashboardMetrics />

  
      {/* Charts Row */}
      <main className="grid grid-cols-1 lg:grid-cols-7 mt-5 gap-5">
        <div className="col-span-1 lg:col-span-2">
          <PerformanceRateChart />
        </div>
        <div className="col-span-1 lg:col-span-5">
          <RevenueGrowthChart />
        </div>
      </main>

      <div className="col-span-1 mt-5">
        <LagosHotspotsMap />
      </div>         
      
    </div>
  );
};

export default DashboadScreen;