import React, { useState } from "react";
import ProviderDetails from "./Provider/ProviderDetails";
import ServiceCostTable from "./serviceCost";
import { Tabs } from "antd";
import Ambulances from "./Ambulance";
import AmbulanceLeads from "./AmbulanceLeads";
AmbulanceLeads
    
const ServiceLayouts: React.FC = () => {
    const [activeTab, setActiveTab] = useState("serviceCost");

    const tabItems = [
        {
        key: "serviceCost",
        label: "Service Cost",
        children: <ServiceCostTable />
        },
        {
        key: "ambulances",
        label: "Ambulances",
        children: <Ambulances />
        },
        {
        key: "ambulanceLeads",
        label: "Ambulance Leads",
        children: <AmbulanceLeads />,
        },
       
    ];

    return (
        <>
        <div className="w-full p-6 ">
            <ProviderDetails />
             <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={tabItems}
                className="custom-tab-bar mt-3!"
                tabBarStyle={{
                marginBottom: 14,
                }}
                tabBarGutter={12}
            />
         
        </div>
        </>
    );
};

export default ServiceLayouts;