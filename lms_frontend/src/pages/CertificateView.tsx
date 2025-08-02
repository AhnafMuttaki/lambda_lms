import CertificateViewer from "@/components/certificate/CertificateViewer";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

export default function CertificateView() {
  return (
    <div className="flex">
      <AppSidebar />
      <div className="flex-1 p-6">
        <DashboardHeader userName="Student" />
        <CertificateViewer />
      </div>
    </div>
  );
}
