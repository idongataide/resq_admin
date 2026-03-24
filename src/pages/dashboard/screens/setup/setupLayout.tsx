// setupLayout.tsx
import React, { useState } from "react";
import { Tabs } from "antd";
import GeneralCostPointsTable from "./GeneralCost/GeneralCost";
import StakeholderDisbursementTable from "./Stakeholder/Stakeholder";
import BusinessProcessTable from "./BusinessProccess/BusinessProcess";

const SetupLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");

  // Tab items configuration
  const tabItems = [
    {
      key: "general",
      label: "General Cost Points",
      children: <GeneralCostPointsTable />,
    },
    {
      key: "stakeholder",
      label: "Stakeholder Disbursement",
      children: <StakeholderDisbursementTable />,
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
     
        {/* Tabs */}
        <div className="mt-4">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            className="custom-tab-bar "
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