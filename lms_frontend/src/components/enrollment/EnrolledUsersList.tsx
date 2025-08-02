import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";

// Mock API
const mockEnrolledUsers = [
  { id: 1, name: "Alice Smith", email: "alice@example.com", status: "active", enrolled_at: "2025-07-01", completed_at: null },
  { id: 2, name: "Bob Jones", email: "bob@example.com", status: "completed", enrolled_at: "2025-06-15", completed_at: "2025-07-15" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", status: "cancelled", enrolled_at: "2025-05-10", completed_at: null },
];

export default function EnrolledUsersList({ courseId }: { courseId: number }) {
  const [users, setUsers] = useState(mockEnrolledUsers);
  const [removeId, setRemoveId] = useState<number | null>(null);

  const handleRemove = (id: number) => {
    setUsers(users.filter(u => u.id !== id));
    setRemoveId(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enrolled Students</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Enrolled At</TableHead>
              <TableHead>Completed At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>{user.enrolled_at}</TableCell>
                <TableCell>{user.completed_at || "-"}</TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm" onClick={() => setRemoveId(user.id)}>
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <AlertDialog open={!!removeId} onOpenChange={open => !open && setRemoveId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Student</AlertDialogTitle>
            </AlertDialogHeader>
            <p>Are you sure you want to remove this student?</p>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => removeId && handleRemove(removeId)}>Remove</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
