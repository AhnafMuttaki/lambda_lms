import CertificateIssueHistory from "@/components/certificate/CertificateIssueHistory";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

export default function CertificateIssueHistoryPage() {
  return (
    <div className="flex">
      <AppSidebar />
      <div className="flex-1 p-6">
        <DashboardHeader userName="Teacher" />
        <CertificateIssueHistory />
      </div>
    </div>
  );
}
