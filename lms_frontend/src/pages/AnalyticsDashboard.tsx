import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";
import ReportsList from "@/components/analytics/ReportsList";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

export default function AnalyticsDashboardPage() {
  return (
    <div className="flex">
      <AppSidebar />
      <div className="flex-1 p-6">
        <DashboardHeader userName="Admin" />
        <AnalyticsDashboard />
        <ReportsList />
      </div>
    </div>
  );
}
