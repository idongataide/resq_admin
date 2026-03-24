import React, { useEffect } from "react";
import { useOnboardingStore } from "../global/store";
import DashboardLayout from "../layouts/dashboardLayout";
import Login from "@/pages/auth/login/login";
import OnboardingLayout from "@/layouts/OnboardingLayout";

const MainRouter: React.FC = () => {
  const { token } = useOnboardingStore();

  useEffect(() => {
    // Add any initialization logic 
  }, []);

  if (token) {
    return <DashboardLayout />;
  }

  return (
    <OnboardingLayout>
      <Login />
    </OnboardingLayout>
  );
};

export default MainRouter;