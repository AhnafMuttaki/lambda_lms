import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

// Mock data
const metrics = {
  totalUsers: 1200,
  totalCourses: 35,
  completionRate: 68,
  recentActivity: [
    { label: "Enrollments", value: 50 },
    { label: "Completions", value: 30 },
    { label: "Active Users", value: 200 },
  ],
};

export default function AnalyticsDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6 mb-6">
          <div>
            <div className="text-lg font-bold">Total Users</div>
            <div>{metrics.totalUsers}</div>
          </div>
          <div>
            <div className="text-lg font-bold">Total Courses</div>
            <div>{metrics.totalCourses}</div>
          </div>
          <div>
            <div className="text-lg font-bold">Completion Rate</div>
            <div>{metrics.completionRate}%</div>
          </div>
        </div>
        <ChartContainer config={{}}
          className="w-full h-64"
        >
          {/* Chart implementation goes here, e.g., BarChart, LineChart, etc. */}
          {/* For mock, you can add a placeholder div */}
          <div className="flex items-center justify-center h-full text-muted-foreground">[Chart Placeholder]</div>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
