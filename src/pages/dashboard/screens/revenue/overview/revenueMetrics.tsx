// Metrics.tsx
import Images from "@/components/images";
import React from "react";

const RevenueMetrics: React.FC = () => {

    const revenueMetrics = [
    {
        id: 'total',
        title: 'Total',
        value: '₦2,853'
    },
    {
        id: 'thisWeek',
        title: 'This Week',
        value: '₦2,853'
    },
    {
        id: 'thisMonth',
        title: 'This Month',
        value: '₦2,853'
    },
    {
        id: 'thisQuarter',
        title: 'This Quarter',
        value: '₦2,853'
    }
    ];

  return (
    <>
      <div className="w-full">
        {/* Revenue Metrics Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6 bg-[#FFFFFF] p-4 rounded-lg">
          {revenueMetrics.map((metric) => (
            <div key={metric.id} className="bg-[#F6F8F9] rounded-lg  p-4">
              <div className="rounded-full bg-[#fff] p-2 w-10 h-10 flex items-center justify-center mb-3">
                <img src={Images.icon.naira} alt="" />
              </div>  
              <div className="text-sm text-[#354959] mb-1">{metric.title}</div>
              <div className="text-2xl text-[#354959] font-semibold">{metric.value}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default RevenueMetrics;