import { useState } from "react";
import ContentView from "@/components/content/ContentView";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

// Mock content for student view
const mockContent = {
  id: 1,
  type: "video",
  url: "https://sample-videos.com/video123.mp4",
  metadata: { title: "Intro Video", description: "Welcome to the course!" },
  order: 1,
  created_at: "2025-07-01"
};

export default function StudentContentView() {
  return (
    <div className="flex">
      <AppSidebar />
      <div className="flex-1 p-6">
        <DashboardHeader userName="Student" />
        <ContentView content={mockContent} />
      </div>
    </div>
  );
}
