import { useState } from "react";
import CertificateTemplateList from "@/components/certificate/CertificateTemplateList";
import CertificateTemplateEditor from "@/components/certificate/CertificateTemplateEditor";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

export default function CertificateTemplates() {
  const [editingTemplate, setEditingTemplate] = useState<any | null>(null);

  const handleEdit = (template: any) => {
    setEditingTemplate(template);
  };

  const handleSave = (tpl: any) => {
    setEditingTemplate(null);
    // Save logic here
  };

  return (
    <div className="flex">
      <AppSidebar />
      <div className="flex-1 p-6">
        <DashboardHeader userName="Teacher" />
        <CertificateTemplateList onEdit={handleEdit} />
        {editingTemplate && (
          <CertificateTemplateEditor template={editingTemplate} onSave={handleSave} onCancel={() => setEditingTemplate(null)} />
        )}
      </div>
    </div>
  );
}
