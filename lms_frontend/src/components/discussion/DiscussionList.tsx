import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock discussions
const discussions = [
  { id: 1, user: "Alice", question: "How do I submit assignments?", created_at: "2025-07-01" },
  { id: 2, user: "Bob", question: "Is there a final exam?", created_at: "2025-07-02" },
];

export default function DiscussionList({ onSelect }: { onSelect: (id: number) => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Discussions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {discussions.map(disc => (
            <div key={disc.id} className="border rounded-lg p-4">
              <div className="font-bold mb-1">{disc.user}</div>
              <div className="mb-2">{disc.question}</div>
              <div className="text-xs text-muted-foreground mb-2">{disc.created_at}</div>
              <Button variant="outline" size="sm" onClick={() => onSelect(disc.id)}>View</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
