import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Mock issued certificates
const issuedCertificates = [
  { id: 1, user: "Alice Smith", issued_at: "2025-07-01", url: "https://example.com/certificate1.pdf" },
  { id: 2, user: "Bob Jones", issued_at: "2025-07-02", url: "https://example.com/certificate2.pdf" },
];

export default function CertificateIssueHistory() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Certificate Issue History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Issued At</TableHead>
              <TableHead>Download</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issuedCertificates.map(cert => (
              <TableRow key={cert.id}>
                <TableCell>{cert.user}</TableCell>
                <TableCell>{cert.issued_at}</TableCell>
                <TableCell>
                  <Button asChild variant="outline" size="sm">
                    <a href={cert.url} target="_blank" rel="noopener noreferrer">Download</a>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
