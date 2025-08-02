import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ContentView({ content }: { content: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{content.metadata?.title || "Content"}</CardTitle>
      </CardHeader>
      <CardContent>
        {content.type === "video" && (
          <video src={content.url} controls className="w-full h-64 mb-4" />
        )}
        {content.type === "pdf" && (
          <iframe src={content.url} title="PDF" className="w-full h-64 mb-4" />
        )}
        {content.type === "interactive" && (
          <iframe src={content.url} title="Interactive" className="w-full h-64 mb-4" />
        )}
        <div className="text-xs text-muted-foreground">
          <pre>{JSON.stringify(content.metadata, null, 2)}</pre>
        </div>
      </CardContent>
    </Card>
  );
}
