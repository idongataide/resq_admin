// hooks/useSettingsType.ts
import { useLocation } from "react-router-dom";

export const useSettingsType = () => {
  const location = useLocation();
  const isNonEmergency = location.pathname.includes("/setup/non-emergency");
  
  return {
    type: isNonEmergency ? "non-emergency" : "emergency",
    isNonEmergency,
    isEmergency: !isNonEmergency,
    apiEndpoint: isNonEmergency ? "/settings" : "/accounts"
  };
};