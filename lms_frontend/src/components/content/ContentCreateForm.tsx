import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function ContentCreateForm({ onCreate }: { onCreate: (content: any) => void }) {
  const [type, setType] = useState("");
  const [url, setUrl] = useState("");
  const [metadata, setMetadata] = useState("");
  const [order, setOrder] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({ type, url, metadata: metadata ? JSON.parse(metadata) : {}, order, created_at: new Date().toISOString() });
    setType("");
    setUrl("");
    setMetadata("");
    setOrder(1);
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Create Content</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select value={type} onValueChange={setType} required>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="interactive">Interactive</SelectItem>
            </SelectContent>
          </Select>
          <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="Content URL" required />
          <Input value={metadata} onChange={e => setMetadata(e.target.value)} placeholder='Metadata (JSON)' />
          <Input type="number" value={order} onChange={e => setOrder(Number(e.target.value))} placeholder="Order" min={1} required />
          <Button type="submit">Create</Button>
        </form>
      </CardContent>
    </Card>
  );
}
