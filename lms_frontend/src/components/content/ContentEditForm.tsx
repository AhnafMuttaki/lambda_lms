import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function ContentEditForm({ content, onUpdate, onCancel }: { content: any, onUpdate: (content: any) => void, onCancel: () => void }) {
  const [type, setType] = useState(content.type);
  const [url, setUrl] = useState(content.url);
  const [metadata, setMetadata] = useState(JSON.stringify(content.metadata));
  const [order, setOrder] = useState(content.order);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ ...content, type, url, metadata: metadata ? JSON.parse(metadata) : {}, order });
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Edit Content</CardTitle>
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
          <div className="flex gap-2">
            <Button type="submit">Update</Button>
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
