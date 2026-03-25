import React, { useState, useRef, useEffect, useMemo } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { IoIosNotificationsOutline} from "react-icons/io";
import { FaChevronDown, FaLock, FaQuestionCircle, FaSignOutAlt } from "react-icons/fa";
import { useOnboardingStore } from "../global/store";
import SiderScreen from "../pages/dashboard/common/sideBar";
import Images from "@/components/images";
import { IoMailOutline } from "react-icons/io5";

const DashboardLayout: React.FC = () => {
  const { siderBarView } = useOnboardingStore();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const datas = useOnboardingStore();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    if (isUserDropdownOpen || isNotificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserDropdownOpen, isNotificationsOpen]);

  const handleLogout = () => {
    useOnboardingStore.persist.clearStorage();
    localStorage.clear();
    sessionStorage.clear();
    useOnboardingStore.setState({
      token: null,
      isAuthorized: false,
      firstName: "",
      lastName: "",
    });
    navigate("/login");
  };

  // Function to get page title based on current route
  const getPageTitle = (pathname: string): string => {
    // Handle dynamic routes with parameters
    if (pathname.includes("/bookings/")) {
      return "Booking Details";
    }
    if (pathname.includes("/service-providers/")) {
      return "Service Provider Details";
    }

    // Static route mappings
    const routeTitles: Record<string, string> = {
      "/": "Dashboard",
      "/home": "Dashboard",
      "/ambulances": "Ambulances",
      "/ambulance-leads": "Ambulance Leads",
      "/bookings": "Bookings",
      "/service-providers": "Service Providers",
      "/hospitals": "Hospitals",
      "/setup": "Setup",
      "/revenue": "Revenue",
      "/my-team": "My Team",
      "/activity-log": "Activity Log",
      "/profile": "Profile",
      "/account/change-password": "Change Password",
    };

    return routeTitles[pathname] || "Dashboard";
  };

  const pageTitle = getPageTitle(location.pathname);

  const dropdownMenuItems = useMemo(() => [
    {
      id: 1,
      label: "Change Password",
      icon: <FaLock className="text-[#667085]" />,
      onClick: () => {
        navigate("/account/change-password");
        setIsUserDropdownOpen(false);
      }
    },
    {
      id: 2,
      label: "Profile",
      icon: <FaQuestionCircle className="text-[#667085]" />,
      onClick: () => {
        navigate("/profile");
        setIsUserDropdownOpen(false);
      }
    },
    {
      id: 3,
      label: "Log out",
      icon: <FaSignOutAlt className="text-[#667085]" />,
      onClick: handleLogout
    }
  ], []);

  return (
    <main className="overflow-hidden bg-black">
      <div className="flex w-full bg-[#F3F5F9]">
        <div
          className={`w-[100px] ${siderBarView ? "md:w-[240px]" : "md:w-[100px]"} z-[999] transition-all duration-500 border-r-gray-300 border-r-1 h-screen fixed rounded-r-3xl bg-[#FFFFFF]`}
        >
          <SiderScreen />
        </div>

        <div className="w-full min-h-screen flex justify-end">
          <div
            className={`w-[100%] ${siderBarView ? "md:pl-[240px]" : "md:pl-[100px]"} pl-[100px]
              transition-all duration-500 flex flex-col min-h-screen`}
          >
            <div className={`fixed ${siderBarView ? "w-[calc(100vw-240px)]" : "w-[calc(100vw-100px)]"} z-[800] py-4 mb-6 lg:flex-row- items-center flex-row flex justify-start md:justify-between bg-[#F9FAFB] px-8`}>
              <div className="flex items-center">
                <p className="text-xl pb-0 mb-0 md:mr-3 text-[#000A0F] font-medium capitalize">
                  {pageTitle}
                </p>
              </div>
              <div className="hidden md:flex items-center justify-between mt-3 lg:mt-0 gap-4">
                {/* Message Icon */}
                <div className="relative">
                  <div
                    className="flex items-center justify-center bg-[#003449] rounded-lg p-2 cursor-pointer hover:bg-[#004d6b] transition-colors"
                    onClick={() => {
                      // Handle message click
                      console.log("Messages clicked");
                    }}
                  >
                    <IoMailOutline className="text-[20px] text-white" />
                  </div>
                </div>

                {/* Notification Icon */}
                <div className="relative" ref={notificationRef}>
                  <div
                    className="flex items-center justify-center bg-[#003449] rounded-lg p-2 cursor-pointer hover:bg-[#004d6b] transition-colors relative"
                    onClick={toggleNotifications}
                  >
                    <IoIosNotificationsOutline className="text-[20px] text-white" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      3
                    </span>
                  </div>
                  
                  {/* Notifications Sidebar */}
                  {/* <NotificationsSidebar 
                    isOpen={isNotificationsOpen} 
                    onClose={() => setIsNotificationsOpen(false)} 
                  /> */}
                </div>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <div
                    className="flex items-center justify-center bg-[#003449] rounded-lg p-2 cursor-pointer hover:bg-[#004d6b] transition-colors"
                    onClick={toggleUserDropdown}
                  >
                    <span className="text-[12px] text-white font-medium me-3">{datas?.email}</span>
                    <FaChevronDown className={`text-[12px] text-white font-medium transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-[1000] overflow-hidden">
                      {/* User Info Section */}
                      <div className="px-4 py-4 border-b border-gray-200 flex items-center gap-3">
                        <img
                          src={datas?.avatar || Images.avatar}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-[#344054]">
                            {datas?.firstName} {datas?.lastName}
                          </p>
                          <p className="text-xs text-[#667085] mt-1">
                            {datas?.email}
                          </p>
                        </div>
                      </div>

                      <div className="py-2">
                        {dropdownMenuItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={item.onClick}
                            className="w-full px-4 py-3 cursor-pointer flex items-center gap-3 text-sm text-[#344054] hover:bg-gray-50 transition-colors"
                          >
                            {item.icon}
                            <span>{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <section className="mt-13">
              <Outlet />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardLayout;