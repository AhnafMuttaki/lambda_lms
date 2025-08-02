import CourseAnalytics from "@/components/analytics/CourseAnalytics";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

export default function CourseAnalyticsPage() {
  return (
    <div className="flex">
      <AppSidebar />
      <div className="flex-1 p-6">
        <DashboardHeader userName="Admin" />
        <CourseAnalytics />
      </div>
    </div>
  );
}
