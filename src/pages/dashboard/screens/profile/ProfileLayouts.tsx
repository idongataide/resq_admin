// teamslayout.tsx
import React from "react";
import ProfilePage from "./ProfileDetails";
import AccountSettings from "./AccountSettings";

const ProfileLayout: React.FC = () => {
    return (
        <>
        <div className="w-full p-6">
            {/* Teams Table */}
            <div className="mt-4">
                <ProfilePage />
                <AccountSettings/>
            </div>
        </div>
        </>
    );
};

export default ProfileLayout;