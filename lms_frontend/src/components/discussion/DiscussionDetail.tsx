import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Mock discussion detail
const discussion = {
  id: 1,
  user: "Alice",
  question: "How do I submit assignments?",
  created_at: "2025-07-01",
  replies: [
    { id: 1, user: "Teacher", reply: "You can submit via the portal.", created_at: "2025-07-01" },
    { id: 2, user: "Bob", reply: "Thanks!", created_at: "2025-07-02" },
  ],
};

export default function DiscussionDetail() {
  const [reply, setReply] = useState("");
  const [replies, setReplies] = useState(discussion.replies);

  const handleReply = () => {
    if (reply.trim()) {
      setReplies([...replies, { id: Date.now(), user: "You", reply, created_at: new Date().toISOString() }]);
      setReply("");
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Discussion Detail</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2 font-bold">{discussion.user}</div>
        <div className="mb-2">{discussion.question}</div>
        <div className="mb-4 text-xs text-muted-foreground">{discussion.created_at}</div>
        <div className="mb-4">
          <div className="font-bold mb-2">Replies</div>
          <div className="space-y-2">
            {replies.map(r => (
              <div key={r.id} className="border rounded p-2">
                <div className="font-bold text-sm">{r.user}</div>
                <div>{r.reply}</div>
                <div className="text-xs text-muted-foreground">{r.created_at}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Input value={reply} onChange={e => setReply(e.target.value)} placeholder="Write a reply..." />
          <Button onClick={handleReply}>Reply</Button>
        </div>
      </CardContent>
    </Card>
  );
}
