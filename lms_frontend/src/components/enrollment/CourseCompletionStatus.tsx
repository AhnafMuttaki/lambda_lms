import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Mock API
const mockProgress = [
  { module: "Intro", section: "Welcome", status: "completed" },
  { module: "Basics", section: "Variables", status: "in_progress" },
  { module: "Advanced", section: "Functions", status: "not_started" },
];

export default function CourseCompletionStatus({ enrollmentStatus, completedAt }: { enrollmentStatus: string, completedAt?: string }) {
  const completedCount = mockProgress.filter(p => p.status === "completed").length;
  const totalCount = mockProgress.length;
  const percent = Math.round((completedCount / totalCount) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Completion Status</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={percent} className="mb-4" />
        <ul className="mb-2">
          {mockProgress.map((p, i) => (
            <li key={i} className="flex justify-between text-sm mb-1">
              <span>{p.module} - {p.section}</span>
              <span>{p.status.replace("_", " ")}</span>
            </li>
          ))}
        </ul>
        <div className="text-xs text-muted-foreground">
          Status: {enrollmentStatus}
          {completedAt && <span> | Completed At: {completedAt}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
