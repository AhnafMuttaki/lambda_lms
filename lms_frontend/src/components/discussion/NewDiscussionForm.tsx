import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NewDiscussionForm({ onPost }: { onPost: (question: string) => void }) {
  const [question, setQuestion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onPost(question);
      setQuestion("");
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>New Discussion</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask a question..." required />
          <Button type="submit">Post</Button>
        </form>
      </CardContent>
    </Card>
  );
}
