import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, Volume2, Maximize, FileText } from "lucide-react"

interface VideoContentProps {
  content: {
    videoUrl: string
    transcript: string
  }
}

export const VideoContent = ({ content }: VideoContentProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  return (
    <div className="space-y-4">
      {/* Video Player */}
      <Card className="bg-black">
        <CardContent className="p-0">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center">
                <Play className="h-16 w-16 mx-auto mb-4 opacity-70" />
                <p className="text-sm opacity-70">Video Player Placeholder</p>
                <p className="text-xs opacity-50 mt-2">URL: {content.videoUrl}</p>
              </div>
            </div>
            
            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Volume2 className="h-4 w-4" />
                  <span className="text-sm">15:30 / 25:45</span>
                </div>
                <Maximize className="h-4 w-4" />
              </div>
              <Progress value={progress} className="mt-2 h-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Info Tabs */}
      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
        </TabsList>
        
        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Video Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">Take notes while watching the video to enhance your learning experience.</p>
                </div>
                <textarea 
                  className="w-full h-32 p-3 border rounded-lg resize-none bg-background"
                  placeholder="Write your notes here..."
                />
                <Button size="sm">Save Notes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transcript" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Video Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="text-sm leading-relaxed">{content.transcript}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}