import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock templates
const templates = [
  { id: 1, name: "Default", preview: "https://example.com/template1.png", lastEdited: "2025-06-01" },
  { id: 2, name: "Modern", preview: "https://example.com/template2.png", lastEdited: "2025-07-01" },
];

export default function CertificateTemplateList({ onEdit }: { onEdit: (template: any) => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Certificate Templates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map(template => (
            <div key={template.id} className="border rounded-lg p-4 flex flex-col items-center">
              <img src={template.preview} alt={template.name} className="w-full h-32 object-cover mb-2 rounded" />
              <div className="font-bold mb-1">{template.name}</div>
              <div className="text-xs text-muted-foreground mb-2">Last Edited: {template.lastEdited}</div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(template)}>Edit</Button>
                <Button variant="destructive" size="sm">Delete</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
