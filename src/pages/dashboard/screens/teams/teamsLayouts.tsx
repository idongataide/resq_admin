// teamslayout.tsx
import React from "react";
import UserManagementTable from "./teamsList";

const TeamsLayout: React.FC = () => {
    return (
        <>
        <div className="w-full p-6">
            {/* Teams Table */}
            <div className="mt-4">
                <UserManagementTable />
            </div>
        </div>
        </>
    );
};

export default TeamsLayout;