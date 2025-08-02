import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Mock API
const mockStudents = [
  { id: 4, name: "Diana Prince", email: "diana@example.com" },
  { id: 5, name: "Evan Lee", email: "evan@example.com" },
];

export default function EnrollStudentForm({ courseId, onEnroll }: { courseId: number, onEnroll: (student: any) => void }) {
  const [studentId, setStudentId] = useState<string>("");
  const [status, setStatus] = useState("active");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = mockStudents.find(s => s.id.toString() === studentId);
    if (student) {
      onEnroll({ ...student, status });
      toast({ title: "Student enrolled!", description: `${student.name} has been enrolled.` });
      setStudentId("");
      setStatus("active");
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Enroll New Student</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select value={studentId} onValueChange={setStudentId} required>
            <SelectTrigger>
              <SelectValue placeholder="Select student" />
            </SelectTrigger>
            <SelectContent>
              {mockStudents.map(student => (
                <SelectItem key={student.id} value={student.id.toString()}>
                  {student.name} ({student.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus} required>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit">Enroll</Button>
        </form>
      </CardContent>
    </Card>
  );
}
