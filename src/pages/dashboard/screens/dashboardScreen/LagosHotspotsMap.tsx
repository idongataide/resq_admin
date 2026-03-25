import Images from "@/components/images";
import React from "react";
import './LagosHotspotsMap.css';


const LagosHotspotsMap: React.FC = () => {
  
  return (
    <div className="bg-white border border-[#E5E9F0] rounded-lg p-6">      
          <img src={Images.response} alt="Filter" className="w-full rounded-lg" /> 
    </div>
  );
};

export default LagosHotspotsMap;