import CourseCompletionStatus from "@/components/enrollment/CourseCompletionStatus";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

export default function StudentCourseProgress() {
  // Mock enrollment status
  const enrollmentStatus = "active";
  const completedAt = undefined;

  return (
    <div className="flex">
      <AppSidebar />
      <div className="flex-1 p-6">
        <DashboardHeader userName="Student" />
        <CourseCompletionStatus enrollmentStatus={enrollmentStatus} completedAt={completedAt} />
      </div>
    </div>
  );
}
