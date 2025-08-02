import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function FeedbackForm({ onSubmit }: { onSubmit: (rating: number, comment: string) => void }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rating, comment);
    setRating(5);
    setComment("");
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Course Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">Rating (1-5)</label>
            <Input type="number" min={1} max={5} value={rating} onChange={e => setRating(Number(e.target.value))} required />
          </div>
          <div>
            <label className="block mb-1 text-sm">Comment</label>
            <Input value={comment} onChange={e => setComment(e.target.value)} placeholder="Your feedback..." />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </CardContent>
    </Card>
  );
}
