// setupLayout.tsx
import React, { useState } from "react";
import { Tabs } from "antd";
import GeneralCostPointsTable from "../setup/GeneralCost/GeneralCost";
import OverviewLayout from "./overview/overviewLayout";
import OperatorRevenue from "./remittedRevenue";
import StakeholderPayout from "./stakeHolder";

const RevenueLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabItems = [
    {
      key: "overview",
      label: "Overview",
      children: <OverviewLayout />
    },
    {
      key: "remitted",
      label: "Operator Revenue",
      children: <OperatorRevenue />
    },
    {
      key: "stakeholder",
      label: "Stakeholder Payouts",
      children: <StakeholderPayout />,
    },
    {
      key: "operator",
      label: "Operator Payouts",
      children: <GeneralCostPointsTable />
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