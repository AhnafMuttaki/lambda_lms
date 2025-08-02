import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight,
  Maximize
} from "lucide-react"

interface PDFContentProps {
  content: {
    pdfUrl: string
    pages: number
  }
}

export const PDFContent = ({ content }: PDFContentProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(100)

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(content.pages, prev + 1))
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(200, prev + 25))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(50, prev - 25))
  }

  return (
    <div className="space-y-4">
      {/* PDF Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            PDF Document
          </Badge>
          <span className="text-sm text-muted-foreground">
            {content.pages} pages
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm w-12 text-center">{zoom}%</span>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Maximize className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      <Card>
        <CardContent className="p-0">
          <div className="bg-gray-100 border rounded-lg overflow-hidden">
            {/* PDF Placeholder */}
            <div 
              className="bg-white border mx-auto my-4 shadow-sm"
              style={{ 
                width: `${Math.min(800, 800 * (zoom / 100))}px`,
                height: `${Math.min(1000, 1000 * (zoom / 100))}px`
              }}
            >
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FileText className="h-24 w-24 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">PDF Viewer</p>
                  <p className="text-sm mt-2">Page {currentPage} of {content.pages}</p>
                  <p className="text-xs mt-2 px-4 break-all">{content.pdfUrl}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Page Navigation */}
      <div className="flex items-center justify-center gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <span className="text-sm">
          Page {currentPage} of {content.pages}
        </span>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleNextPage}
          disabled={currentPage === content.pages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}