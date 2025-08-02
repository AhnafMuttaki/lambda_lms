import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  ExternalLink, 
  Copy,
  CheckCircle
} from "lucide-react"

interface ZoomContentProps {
  content: {
    meetingId: string
    meetingUrl: string
    scheduledTime: string
    hostName: string
  }
}

export const ZoomContent = ({ content }: ZoomContentProps) => {
  const [copied, setCopied] = useState(false)
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
      isUpcoming: date > new Date()
    }
  }

  const { date, time, isUpcoming } = formatDate(content.scheduledTime)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(content.meetingUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleJoinMeeting = () => {
    window.open(content.meetingUrl, '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Meeting Status */}
      <div className="text-center">
        <Badge variant={isUpcoming ? "default" : "secondary"} className="mb-4">
          {isUpcoming ? "Upcoming Session" : "Past Session"}
        </Badge>
      </div>

      {/* Meeting Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Live Session Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Date:</strong> {date}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Time:</strong> {time}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Host:</strong> {content.hostName}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Meeting ID</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                    {content.meetingId}
                  </code>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={handleCopyLink}
                    className="h-6 w-6"
                  >
                    {copied ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Meeting Link</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="px-2 py-1 bg-muted rounded text-sm font-mono flex-1 truncate">
                    {content.meetingUrl}
                  </code>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={handleCopyLink}
                    className="h-6 w-6"
                  >
                    {copied ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Join Meeting */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            {isUpcoming ? (
              <>
                <div className="text-sm text-muted-foreground">
                  Session starts in 2 hours 30 minutes
                </div>
                <Button size="lg" onClick={handleJoinMeeting} className="w-full">
                  <Video className="h-4 w-4 mr-2" />
                  Join Meeting
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </>
            ) : (
              <>
                <div className="text-sm text-muted-foreground">
                  This session has ended
                </div>
                <Button size="lg" variant="outline" disabled className="w-full">
                  <Video className="h-4 w-4 mr-2" />
                  Session Ended
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Meeting Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">How to Join</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold mt-0.5">
                1
              </div>
              <span>Click the "Join Meeting" button above</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold mt-0.5">
                2
              </div>
              <span>Allow browser permissions for camera and microphone</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold mt-0.5">
                3
              </div>
              <span>Wait for the host to start the meeting</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}