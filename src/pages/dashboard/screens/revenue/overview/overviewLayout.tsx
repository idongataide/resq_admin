// teamslayout.tsx
import React from "react";
import RevenueMetrics from "./revenueMetrics";
import OperatorRevenue from "./operatorRevenue";

interface OverviewLayoutProps {
  isNonEmergency?: boolean;
}

const OverviewLayout: React.FC<OverviewLayoutProps> = ({ isNonEmergency = false }) => {
    console.log("OverviewLayout - isNonEmergency:", isNonEmergency);
    return (
        <>
        <div className="w-full">
            {/* Teams Table */}
            <div className="">
                <RevenueMetrics />
                <OperatorRevenue/>
            </div>
        </div>
        </>
    );
};

export default OverviewLayout;