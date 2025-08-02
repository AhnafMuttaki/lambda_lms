import { useState } from "react";
import ContentList from "@/components/content/ContentList";
import ContentCreateForm from "@/components/content/ContentCreateForm";
import ContentEditForm from "@/components/content/ContentEditForm";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

export default function CourseContent() {
  const [contents, setContents] = useState<any[]>([]);
  const [editingContent, setEditingContent] = useState<any | null>(null);

  // Add new content
  const handleCreate = (content: any) => {
    setContents(prev => [...prev, { ...content, id: Date.now() }]);
  };

  // Update content
  const handleUpdate = (updated: any) => {
    setContents(prev => prev.map(c => c.id === updated.id ? updated : c));
    setEditingContent(null);
  };

  return (
    <div className="flex">
      <AppSidebar />
      <div className="flex-1 p-6">
        <DashboardHeader userName="Teacher" />
        <ContentList onEdit={setEditingContent} />
        {editingContent ? (
          <ContentEditForm content={editingContent} onUpdate={handleUpdate} onCancel={() => setEditingContent(null)} />
        ) : (
          <ContentCreateForm onCreate={handleCreate} />
        )}
      </div>
    </div>
  );
}
