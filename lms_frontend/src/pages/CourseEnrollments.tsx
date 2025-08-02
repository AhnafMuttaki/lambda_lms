import EnrolledUsersList from "@/components/enrollment/EnrolledUsersList";
import EnrollStudentForm from "@/components/enrollment/EnrollStudentForm";
import { useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

export default function CourseEnrollments() {
  const courseId = 1; // mock course id
  const [enrolledUsers, setEnrolledUsers] = useState<any[]>([]);

  // Add new student to enrolled users
  const handleEnroll = (student: any) => {
    setEnrolledUsers(prev => [...prev, student]);
  };

  return (
    <div className="flex">
      <AppSidebar />
      <div className="flex-1 p-6">
        <DashboardHeader userName="Teacher" />
        <EnrolledUsersList courseId={courseId} />
        <EnrollStudentForm courseId={courseId} onEnroll={handleEnroll} />
      </div>
    </div>
  );
}
