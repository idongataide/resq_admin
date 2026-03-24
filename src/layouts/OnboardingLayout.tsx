import React, { ReactNode } from "react";
import { Outlet } from "react-router-dom";

interface Props {
    children?: ReactNode;
}

const OnboardingLayout: React.FC<Props> = ({ children }) => {
    return (
        <main className="bg-[#F3F5F9] min-h-screen w-[100%] flex items-center justify-center">
            <div className="flex lg:w-full w-full p-30 lg:p-0 items-center justify-center">
                {/* Right side for children (login form, etc.) */}
                <div className="lg:max-w-md mx-auto  w-full flex items-center justify-center bg-white">
                    <div className="w-full max-w-md p-8 flex flex-col items-center justify-center">
                        {children ? children : <Outlet />}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default OnboardingLayout;