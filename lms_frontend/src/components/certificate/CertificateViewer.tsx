import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock certificate data
const certificate = {
  url: "https://example.com/certificate.pdf",
  issued_at: "2025-07-01",
};

export default function CertificateViewer() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Certificate</CardTitle>
      </CardHeader>
      <CardContent>
        <iframe src={certificate.url} title="Certificate PDF" className="w-full h-96 mb-4 border" />
        <div className="mb-2 text-sm text-muted-foreground">Issued At: {certificate.issued_at}</div>
        <Button asChild variant="outline">
          <a href={certificate.url} target="_blank" rel="noopener noreferrer">Download PDF</a>
        </Button>
      </CardContent>
    </Card>
  );
}
