import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";

// Mock API
const mockContents = [
  { id: 1, type: "video", url: "https://sample-videos.com/video123.mp4", metadata: { title: "Intro Video" }, order: 1, created_at: "2025-07-01" },
  { id: 2, type: "pdf", url: "https://example.com/guide.pdf", metadata: { title: "Guide PDF" }, order: 2, created_at: "2025-07-02" },
  { id: 3, type: "interactive", url: "https://example.com/sim", metadata: { title: "Simulation" }, order: 3, created_at: "2025-07-03" },
];

export default function ContentList({ onEdit }: { onEdit: (content: any) => void }) {
  const [contents, setContents] = useState(mockContents);
  const [removeId, setRemoveId] = useState<number | null>(null);

  const handleRemove = (id: number) => {
    setContents(contents.filter(c => c.id !== id));
    setRemoveId(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Contents</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Metadata</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contents.map(content => (
              <TableRow key={content.id}>
                <TableCell>{content.type}</TableCell>
                <TableCell><a href={content.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{content.url}</a></TableCell>
                <TableCell>{JSON.stringify(content.metadata)}</TableCell>
                <TableCell>{content.order}</TableCell>
                <TableCell>{content.created_at}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => onEdit(content)}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => setRemoveId(content.id)} className="ml-2">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <AlertDialog open={!!removeId} onOpenChange={open => !open && setRemoveId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Content</AlertDialogTitle>
            </AlertDialogHeader>
            <p>Are you sure you want to delete this content?</p>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => removeId && handleRemove(removeId)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
