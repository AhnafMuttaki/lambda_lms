import { useState } from "react";
import DiscussionList from "@/components/discussion/DiscussionList";
import DiscussionDetail from "@/components/discussion/DiscussionDetail";
import NewDiscussionForm from "@/components/discussion/NewDiscussionForm";
import FeedbackForm from "@/components/discussion/FeedbackForm";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

export default function CourseDiscussion() {
  const [selectedDiscussion, setSelectedDiscussion] = useState<number | null>(null);

  const handlePost = (question: string) => {
    // Add new discussion logic here
    setSelectedDiscussion(null);
  };

  return (
    <div className="flex">
      <AppSidebar />
      <div className="flex-1 p-6">
        <DashboardHeader userName="Student" />
        {!selectedDiscussion ? (
          <>
            <DiscussionList onSelect={setSelectedDiscussion} />
            <NewDiscussionForm onPost={handlePost} />
            <FeedbackForm onSubmit={() => {}} />
          </>
        ) : (
          <DiscussionDetail />
        )}
      </div>
    </div>
  );
}
