import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";

// Mock API
const mockModerationItems = [
  { id: 1, entity_type: "course", entity_id: 101, name: "JavaScript Mastery", status: "pending" },
  { id: 2, entity_type: "content", entity_id: 201, name: "Intro Video", status: "pending" },
  { id: 3, entity_type: "course", entity_id: 102, name: "React Bootcamp", status: "pending" },
];

export default function ModerationList({ onModerate }: { onModerate: (item: any, action: string) => void }) {
  const [items, setItems] = useState(mockModerationItems);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<string>("");

  const handleModerate = (id: number, action: string) => {
    setItems(items.map(item => item.id === id ? { ...item, status: action } : item));
    setSelectedId(null);
    setActionType("");
    onModerate(items.find(item => item.id === id), action);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Moderation Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.entity_type}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => { setSelectedId(item.id); setActionType("approved"); }}>Approve</Button>
                  <Button variant="destructive" size="sm" onClick={() => { setSelectedId(item.id); setActionType("rejected"); }} className="ml-2">Reject</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <AlertDialog open={!!selectedId} onOpenChange={open => !open && setSelectedId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{actionType === "approved" ? "Approve" : "Reject"} Item</AlertDialogTitle>
            </AlertDialogHeader>
            <p>Are you sure you want to {actionType} this item?</p>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => selectedId && handleModerate(selectedId, actionType)}>{actionType === "approved" ? "Approve" : "Reject"}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
