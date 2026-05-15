import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useOnboardingStore } from "../../../global/store";
import { AiOutlineLogout } from "react-icons/ai";
import Images from "../../../components/images";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";

const SiderScreen: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { siderBarView, setSiderBarView } = useOnboardingStore();
  const data = useOnboardingStore();
  
  const navData = [
    {
      id: 1,
      title: "dashboard",
      URL: "home",
      icon: Images.icon?.dashboard,
    },
    {
      id: 2,
      title: "bookings",
      URL: "bookings",
      icon: Images.icon?.bookings,
    },
    {
      id: 3,
      title: "patients",
      URL: "patients",
      icon: Images.icon?.patients,
    },
    {
      id: 4,
      title: "service providers",
      URL: "service-providers",
      icon: Images.icon?.serviceProviders,
    },
    {
      id: 5,
      title: "hospitals",
      URL: "hospitals",
      icon: Images.icon?.hospitals,
    },
    {
      id: 6,
      title: "revenue",
      URL: "revenue",
      icon: Images.icon?.revenue,
      children: [
        {
          id: 61,
          title: "Emergency",
          URL: "revenue/emergency",
        },
        {
          id: 62,
          title: "Non-emergency",
          URL: "revenue/non-emergency",
        },
      ],
    },
    {
      id: 7,
      title: "setup",
      URL: "setup",
      icon: Images.icon?.setup,
      children: [
        {
          id: 71,
          title: "Emergency",
          URL: "setup/emergency",
        },
        {
          id: 72,
          title: "Non-emergency",
          URL: "setup/non-emergency",
        },
      ],
    },
    {
      id: 8,
      title: "my team",
      URL: "my-team",
      icon: Images.icon?.patients,
    },
    {
      id: 9,
      title: "activity log",
      URL: "activity-log",
      icon: Images.icon?.activityLog,
    },
  ];

  const [expandedMenus, setExpandedMenus] = useState<{ [key: number]: boolean }>({});

  const toggleExpanded = (id: number) => {
    setExpandedMenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderMenuItem = (item: any, _index: number, isChild = false) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus[item.id];
    const isActive = pathname === `/${item.URL}` || (item.URL !== 'setup' && pathname.startsWith(`/${item.URL}`));

    return (
      <div key={item.id}>
        <div
          className={`
            flex items-center font-[400] transition-all duration-300 py-3 my-2 overflow-hidden capitalize cursor-pointer
            ${siderBarView ? "px-2 mx-4 transition-all duration-500" : "rounded-full w-10 h-10 flex justify-center items-center pl-2"}
            ${isChild ? "ml-6" : ""}
            ${
              isActive
                ? "text-[#FF6C2D] bg-[#FFF0E8] border-l-[5px]! border-[#DB4A47]"
                : "hover:bg-[#FFF0E8] text-[#7D8489] hover:text-[#7D8489]"
            }
          `}
          onClick={() => hasChildren ? toggleExpanded(item.id) : navigate(`/${item.URL}`)}
        >
          {!isChild && (
            <div className="h-[20px] relative">
              <img
                src={item?.icon}
                className={`h-[20px] ${
                  isActive
                    ? "[filter:invert(47%)_sepia(86%)_saturate(1894%)_hue-rotate(1deg)_brightness(101%)_contrast(101%)]"
                    : "[filter:invert(50%)_sepia(9%)_saturate(383%)_hue-rotate(182deg)_brightness(94%)_contrast(86%)]"
                }`}
              />
            </div>
          )}
          <span className="ml-2 text-[#4A4A4A]">{siderBarView && item.title}</span>
          {hasChildren && siderBarView && (
            <span className="ml-auto mr-2">{isExpanded ? <FaAngleDown /> : <FaAngleRight />}</span>
          )}
        </div>
        {hasChildren && isExpanded && siderBarView && (
          <div>
            {item.children.map((child: any, childIndex: number) => renderMenuItem(child, childIndex, true))}
          </div>
        )}
      </div>
    );
  };

  const [timeChange, setTimeChange] = useState(siderBarView);
  // const [handleStart, setHandleStart] = useState(true);

  useEffect(() => {
    const speedHandling = siderBarView ? 300 : 160;
    const timeDelay = setTimeout(() => {
      setTimeChange(siderBarView);
    }, speedHandling);

    return () => {
      clearTimeout(timeDelay);
    };
  }, [siderBarView]);

  return (
    <div className="w-full relative h-full flex flex-col">
      {/* Sidebar toggle button */}
      <div
        className="absolute -right-3 top-[22px] cursor-pointer text-[#7D8489] hidden md:block"
        onClick={() => {
          setSiderBarView(!siderBarView);
        }}
      >
        <img
          src={Images?.icon?.siderIcon}
          className={`${
            siderBarView ? "rotate-180" : "rotate-0"
          } text-[25px] transition-all duration-500 cursor-pointer`}
        />
      </div>

      {/* Logo */}
      <Link to="/">
        <main className="mt-[16px] w-full flex justify-start transition-all duration-500 ml-5 overflow-hidden">
          <img src={Images?.smallLogo} className="h-[40px] md:hidden" />
          <div>
            {siderBarView ? (
              <img src={Images?.logo} className="h-[40px] hidden md:block" />
            ) : (
              <img
                src={Images?.smallLogo}
                className="h-[40px] hidden md:block"
              />
            )}
          </div>
        </main>
      </Link>

      {/* Navigation Links */}
      <div>
        <div
          className={`mt-10 ${!siderBarView && "flex flex-col items-center siderBarView"}`}
        >
          {navData.map((item, index) => renderMenuItem(item, index))}
        </div>
      </div>

      {/* Avatar and Logout */}
      <div className="flex-1" />
      <div
        className={`${
          timeChange ? "px-3 items-start" : "px-7"
        } py-4 cursor-pointer flex gap-3 w-full transition-all duration-500 border-t border-gray-300`}
      >
        {data?.avatar ? (
          <div
            className="w-10 h-10 flex justify-center items-center object-cover border border-gray-600 rounded-full relative bg-white"
            onClick={() => {
              if (window.innerWidth >= 768) setSiderBarView(true);
            }}
          >
            <div
              className="h-4 w-4 bg-green-500 absolute rounded-full left-0 bottom-0 border-white border-2"
            />
            <img
              alt="avatar"
              src={data?.avatar}
              loading="lazy"
              className="h-10 w-10 -mt-[2px] object-cover rounded-full"
            />
          </div>
        ) : (
          <div className="w-10 h-10 object-contain rounded-full text-white relative">
            <div
              className="h-4 w-4 bg-green-500 absolute rounded-full left-0 bottom-0 border-white border-2"
            />
            <div className="w-10 h-10 flex justify-center items-center rounded-full bg-[#FF6C2D] text-white font-medium text-[18px]">
              {data?.firstName?.charAt(0)}
            </div>
          </div>
        )}

        {timeChange && (
          <div className="hidden flex-1 md:flex justify-between items-center">
            <Link to="/account" className="h-10 items-center">
              <p className="text-[12px] text-[#7D8489] transition-all duration-500">
                Welcome back <span className="text-[14px]">👋🏾</span>
              </p>
              <p className="leading-0 mt-1 whitespace-nowrap font-semibold text-[14px] text-gray-600 transition-all duration-500 capitalize">
                {data?.userName?.slice(0, 18)}
                {data?.userName?.length > 18 && "..."}
              </p>
            </Link>

            <div className="transition-all duration-300 hover:bg-[#FFF0E8] p-1 rounded-full cursor-pointer">
              <AiOutlineLogout
                className="text-[25px] text-[#7D8489]"
                onClick={() => {
                  useOnboardingStore.persist.clearStorage();
                  localStorage.clear();
                  sessionStorage.clear();
                  useOnboardingStore.setState({
                    token: null,
                    isAuthorized: false,
                    firstName: "",
                    lastName: ""
                  });
                  navigate("/login");
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SiderScreen;