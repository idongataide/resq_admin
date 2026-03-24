// teamslayout.tsx
import React from "react";
import RevenueMetrics from "./revenueMetrics";
import OperatorRevenue from "./operatorRevenue";

const OverviewLayout: React.FC = () => {
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