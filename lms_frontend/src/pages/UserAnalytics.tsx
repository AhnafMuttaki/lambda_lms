import UserAnalytics from "@/components/analytics/UserAnalytics";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

export default function UserAnalyticsPage() {
  return (
    <div className="flex">
      <AppSidebar />
      <div className="flex-1 p-6">
        <DashboardHeader userName="Admin" />
        <UserAnalytics />
      </div>
    </div>
  );
}
