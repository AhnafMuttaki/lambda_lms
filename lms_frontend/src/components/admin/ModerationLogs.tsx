import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock API
const mockLogs = [
  { id: 1, entity_type: "course", entity_id: 101, action: "approved", admin_id: 1, timestamp: "2025-07-01T10:00:00Z", notes: "Looks good." },
  { id: 2, entity_type: "content", entity_id: 201, action: "rejected", admin_id: 1, timestamp: "2025-07-02T12:00:00Z", notes: "Missing video URL." },
];

export default function ModerationLogs() {
  const [logs] = useState(mockLogs);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Moderation Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Entity ID</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Admin ID</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map(log => (
              <TableRow key={log.id}>
                <TableCell>{log.entity_type}</TableCell>
                <TableCell>{log.entity_id}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.admin_id}</TableCell>
                <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                <TableCell>{log.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
