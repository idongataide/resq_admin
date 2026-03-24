import React from "react";
import { useOnboardingStore } from "../../global/store";
import EnterEmail from "./forgot-password/enterEmail";
import Success from "./success/success";
import EnterOtp from "./enter-otp/enterOtp";
import EnterPasspord from "./enter-password/enterPassword";

const AuthPath: React.FC = () => {
  const navPath = useOnboardingStore();


  return (
    <div>
      {navPath?.navPath === "forgot-password" && <EnterEmail/>}   
      {navPath?.navPath === "enter-otp" && <EnterOtp/>}   
      {navPath?.navPath === "enter-password" && <EnterPasspord/>}   
      {navPath?.navPath === "success" && <Success/>}   
    </div>
  );
};

export default AuthPath;
