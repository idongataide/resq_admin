import Images from "@/components/images";
import React from "react";
import { usePatientsCount } from "@/hooks/usePatients";
import { Spin } from "antd";


const PatientMetrics: React.FC = () => {
  const { data: counts, isLoading } = usePatientsCount();

  const patientMetrics = [
    {
      id: 'total',
      title: 'Total Registered',
      value: counts?.total?.toLocaleString() || '0',
      bgColor: '#F6F8F9'
    },
    {
      id: 'atLeastOne',
      title: 'Made at least a Booking',
      value: counts?.madeAtLeastOneBooking?.toLocaleString() || '0',
      bgColor: '#FFF7E8'
    },
    {
      id: 'moreThanOne',
      title: 'Made >1 Bookings',
      value: counts?.madeMoreThanOneBooking?.toLocaleString() || '0',
      bgColor: '#FDF6F6'
    },
    {
      id: 'noBooking',
      title: 'Made no Booking',
      value: counts?.madeNoBooking?.toLocaleString() || '0',
      bgColor: '#F8FEF5'
    }
  ];

  return (
    <>
      <div className="w-full">
        {/* Patient Metrics Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6 bg-[#FFFFFF] p-4 rounded-lg">
          {patientMetrics.map((metric) => (
            <div 
              key={metric.id} 
              className="rounded-lg p-4"
              style={{ backgroundColor: metric.bgColor }}
            >
              <div className="rounded-full bg-[#fff] p-2 w-10 h-10 flex items-center justify-center mb-3">
                <img src={Images.icon.patients} alt="patients" />
              </div>  
              <div className="text-sm text-[#354959] mb-1 font-medium">{metric.title}</div>
              <div className="text-2xl text-[#354959] font-semibold">
                {isLoading ? (
                    <Spin/>
                ) : (
                  metric.value
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PatientMetrics;