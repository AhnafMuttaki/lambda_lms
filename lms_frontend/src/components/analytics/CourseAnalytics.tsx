import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

// Mock data
const courseMetrics = {
  enrollments: 120,
  completionRate: 75,
  modulePerformance: [
    { label: "Module 1", value: 80 },
    { label: "Module 2", value: 60 },
    { label: "Module 3", value: 90 },
  ],
};

export default function CourseAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6 mb-6">
          <div>
            <div className="text-lg font-bold">Enrollments</div>
            <div>{courseMetrics.enrollments}</div>
          </div>
          <div>
            <div className="text-lg font-bold">Completion Rate</div>
            <div>{courseMetrics.completionRate}%</div>
          </div>
        </div>
        <ChartContainer config={{}}
          className="w-full h-64"
        >
          <div className="flex items-center justify-center h-full text-muted-foreground">[Chart Placeholder]</div>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
