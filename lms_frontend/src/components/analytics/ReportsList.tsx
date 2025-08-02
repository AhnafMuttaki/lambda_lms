import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Mock data
const reports = [
  { id: 1, type: "Course", params: "courseId=1", generated_at: "2025-07-01", url: "https://example.com/report1.pdf" },
  { id: 2, type: "User", params: "userId=2", generated_at: "2025-07-02", url: "https://example.com/report2.pdf" },
];

export default function ReportsList() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Parameters</TableHead>
              <TableHead>Generated At</TableHead>
              <TableHead>Download</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map(report => (
              <TableRow key={report.id}>
                <TableCell>{report.type}</TableCell>
                <TableCell>{report.params}</TableCell>
                <TableCell>{report.generated_at}</TableCell>
                <TableCell>
                  <Button asChild variant="outline" size="sm">
                    <a href={report.url} target="_blank" rel="noopener noreferrer">Download</a>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
