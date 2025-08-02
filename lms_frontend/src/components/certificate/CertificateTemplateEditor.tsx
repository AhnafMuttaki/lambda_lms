import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CertificateTemplateEditor({ template, onSave, onCancel }: { template?: any, onSave: (tpl: any) => void, onCancel: () => void }) {
  const [name, setName] = useState(template?.name || "");
  const [logo, setLogo] = useState(template?.logo || "");
  const [background, setBackground] = useState(template?.background || "");
  const [signature, setSignature] = useState(template?.signature || "");
  const [text, setText] = useState(template?.text || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, logo, background, signature, text });
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{template ? "Edit" : "Add"} Certificate Template</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Template Name" required />
          <Input value={logo} onChange={e => setLogo(e.target.value)} placeholder="Logo URL" />
          <Input value={background} onChange={e => setBackground(e.target.value)} placeholder="Background Image URL" />
          <Input value={signature} onChange={e => setSignature(e.target.value)} placeholder="Signature URL" />
          <Input value={text} onChange={e => setText(e.target.value)} placeholder="Certificate Text" />
          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          </div>
        </form>
        {/* Live preview mock */}
        <div className="mt-6 border rounded-lg p-4 bg-muted text-center">
          <div className="font-bold mb-2">{name || "Template Preview"}</div>
          {background && <img src={background} alt="Background" className="w-full h-24 object-cover mb-2 rounded" />}
          {logo && <img src={logo} alt="Logo" className="h-12 mx-auto mb-2" />}
          <div className="mb-2">{text}</div>
          {signature && <img src={signature} alt="Signature" className="h-8 mx-auto" />}
        </div>
      </CardContent>
    </Card>
  );
}
