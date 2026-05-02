// setupLayout.tsx
import React, { useState } from "react";
import { Tabs } from "antd";
import { useLocation } from "react-router-dom";
import GeneralCostPointsTable from "./GeneralCost/GeneralCost";
import StakeholderDisbursementTable from "./Stakeholder/Stakeholder";
import BusinessProcessTable from "./BusinessProccess/BusinessProcess";

const SetupLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");
  const location = useLocation();
  
  // Check if we're in non-emergency mode
  const isNonEmergency = location.pathname.includes("/setup/non-emergency");
  
  // Dynamic title based on route
  const pageTitle = isNonEmergency ? "Non-Emergency Settings" : "Emergency Settings";

  // Tab items configuration with dynamic props
  const tabItems = [
    {
      key: "general",
      label: "General Cost Points",
      children: <GeneralCostPointsTable isNonEmergency={isNonEmergency} />,
    },
    {
      key: "stakeholder",
      label: "Stakeholder Disbursement",
      children: <StakeholderDisbursementTable isNonEmergency={isNonEmergency} />,
    },
    {
      key: "business",
      label: "Business Process Documentation",
      children: <BusinessProcessTable />,
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

export default SetupLayout;