// revenueLayout.tsx
import React, { useState } from "react";
import { Tabs } from "antd";
import { useLocation } from "react-router-dom";
import OverviewLayout from "./overview/overviewLayout";
import RemmitedRevenue from "./remittedRevenue";
import StakeholderPayout from "./stakeHolder";
import OperatorPayout from "./operatorPayout";

const RevenueLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const location = useLocation();
  
  // Check if we're in non-emergency mode
  const isNonEmergency = location.pathname.includes("/revenue/non-emergency");
  
  // Dynamic title based on route
  const pageTitle = isNonEmergency ? "Non-Emergency Revenue" : "Emergency Revenue";

  // Tab items configuration with dynamic props
  const tabItems = [
    {
      key: "overview",
      label: "Overview",
      children: <OverviewLayout isNonEmergency={isNonEmergency} />
    },
    {
      key: "remitted",
      label: "Remitted Revenue",
      children: <RemmitedRevenue isNonEmergency={isNonEmergency} />
    },
    {
      key: "stakeholder",
      label: "Stakeholder Payouts",
      children: <StakeholderPayout isNonEmergency={isNonEmergency} />,
    },
    {
      key: "operator",
      label: "Operator Payouts",
      children: <OperatorPayout isNonEmergency={isNonEmergency} />
    },
  ];

  return (
    <>
      <div className="w-full p-6">
        {/* Page Title */}
        <div className="mb-4">
          <h1 className="text-md font-semibold text-[#000A0F]">{pageTitle}</h1>
        </div>
     
        {/* Tabs */}
        <div className="mt-4">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            className="custom-tab-bar"
            tabBarStyle={{
              marginBottom: 14,
            }}
            tabBarGutter={12}
          />
        </div>
      </div>
    </>
  );
};

export default RevenueLayout;