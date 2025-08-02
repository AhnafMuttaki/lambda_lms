import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

// Mock data
const userMetrics = {
  coursesEnrolled: 5,
  completionHistory: [
    { label: "Course 1", value: 100 },
    { label: "Course 2", value: 80 },
    { label: "Course 3", value: 60 },
  ],
  activityTimeline: [
    { label: "2025-07-01", value: 2 },
    { label: "2025-07-02", value: 3 },
    { label: "2025-07-03", value: 1 },
  ],
};

export default function UserAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="text-lg font-bold">Courses Enrolled</div>
          <div>{userMetrics.coursesEnrolled}</div>
        </div>
        <ChartContainer config={{}} className="w-full h-64 mb-6">
          <div className="flex items-center justify-center h-full text-muted-foreground">[Completion History Chart]</div>
        </ChartContainer>
        <ChartContainer config={{}} className="w-full h-64">
          <div className="flex items-center justify-center h-full text-muted-foreground">[Activity Timeline Chart]</div>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
