import ModerationList from "@/components/admin/ModerationList";
import ModerationLogs from "@/components/admin/ModerationLogs";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

export default function AdminModeration() {
  // Mock moderation handler
  const handleModerate = (item: any, action: string) => {
    // Could add to logs, show toast, etc.
  };

  return (
    <div className="flex">
      <AppSidebar />
      <div className="flex-1 p-6">
        <DashboardHeader userName="Super Admin" />
        <ModerationList onModerate={handleModerate} />
        <ModerationLogs />
      </div>
    </div>
  );
}
