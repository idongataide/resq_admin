interface iData {
  data?: {
    token?: string;
    email?: string;
    full_name?: string;
    user_type?: string;
    avatar?: string;
    account_status?: number;
    auth_id?: string;
  };
}
  
interface iNavPath {
  setNavPath: (path: string) => void;
  setEmail: (email: string) => void;
  setToken: (token: string) => void;
  setRole: (role: string) => void;
  setAvatar: (avatar: string) => void;
  setUserName: (userName: string) => void;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setIsVerified: (isVerified: boolean) => void;
  setIsCompleted: (isCompleted: boolean) => void;
  setAuthId: (authId: string) => void;   // ✅ added
  setUserType?: (userType: string) => void;
}
  export const setNavData = (
    navPath: iNavPath,
    email: string,
    res: iData,
    screenPath: string = "",
  ) => {
    if (!res?.data) return;

    const fullName = res.data.full_name || "";
    const nameParts = fullName.split(" ");

    navPath.setNavPath(screenPath);
    navPath.setEmail(res.data.email || email || "");
    navPath.setAvatar(res.data.avatar || "");
    navPath.setToken(res.data.token || "");
    navPath.setRole(res.data.user_type || "");
    navPath.setUserName(fullName);
    navPath.setFirstName(nameParts[0] || "");
    navPath.setLastName(nameParts.slice(1).join(" ") || "");
    navPath.setAuthId(res.data.auth_id || "");

    // account_status: 1 = verified, 0 = not verified
    navPath.setIsVerified(res.data.account_status === 1);

    // Backend doesn't provide this yet
    navPath.setIsCompleted(true);

    // Optional userType setter
    if (navPath.setUserType) {
      navPath.setUserType(res.data.user_type || "");
    }
  };