import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Award, 
  Download, 
  Share, 
  CheckCircle, 
  XCircle,
  Calendar,
  User
} from "lucide-react"

interface CertificateContentProps {
  content: {
    certificateId: string
    requirements: string
    available: boolean
  }
}

export const CertificateContent = ({ content }: CertificateContentProps) => {
  const completionRate = 85 // Mock completion rate
  const requiredRate = 80

  const handleDownload = () => {
    // Simulate certificate download
    const link = document.createElement('a')
    link.download = `certificate-${content.certificateId}.pdf`
    link.click()
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Course Completion Certificate',
        text: 'I just completed the JavaScript Mastery course!',
        url: window.location.href
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Certificate Status */}
      <div className="text-center">
        <Badge variant={content.available ? "default" : "secondary"} className="mb-4">
          {content.available ? "Certificate Available" : "Certificate Locked"}
        </Badge>
      </div>

      {/* Certificate Preview */}
      <Card className="border-2 border-primary/20">
        <CardContent className="p-8">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8 text-center border-2 border-dashed border-primary/30">
            {content.available ? (
              <div className="space-y-6">
                <Award className="h-16 w-16 text-yellow-500 mx-auto" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Certificate of Completion
                  </h2>
                  <p className="text-gray-600">This certifies that</p>
                  <h3 className="text-xl font-semibold text-primary mt-2 mb-2">
                    John Doe
                  </h3>
                  <p className="text-gray-600">has successfully completed</p>
                  <h4 className="text-lg font-medium text-gray-800 mt-2">
                    Complete JavaScript Mastery
                  </h4>
                </div>
                <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Completed: Dec 15, 2024
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Instructor: John Doe
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Certificate ID: {content.certificateId}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Award className="h-16 w-16 text-gray-400 mx-auto" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Certificate Not Available
                  </h3>
                  <p className="text-gray-500">
                    Complete the course requirements to unlock your certificate
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Certificate Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">{content.requirements}</p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Course Completion</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{completionRate}%</span>
                {completionRate >= requiredRate ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
            <Progress value={completionRate} className="h-2" />
            
            <div className="flex items-center justify-between text-sm">
              <span>Minimum required: {requiredRate}%</span>
              <span className={completionRate >= requiredRate ? "text-green-600" : "text-red-600"}>
                {completionRate >= requiredRate ? "Requirement met" : `${requiredRate - completionRate}% needed`}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      {content.available ? (
        <div className="flex gap-4 justify-center">
          <Button onClick={handleDownload} size="lg">
            <Download className="h-4 w-4 mr-2" />
            Download Certificate
          </Button>
          <Button variant="outline" onClick={handleShare} size="lg">
            <Share className="h-4 w-4 mr-2" />
            Share Achievement
          </Button>
        </div>
      ) : (
        <div className="text-center">
          <Button disabled size="lg">
            <Award className="h-4 w-4 mr-2" />
            Complete Course to Unlock
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            {requiredRate - completionRate}% more progress needed
          </p>
        </div>
      )}
    </div>
  )
}