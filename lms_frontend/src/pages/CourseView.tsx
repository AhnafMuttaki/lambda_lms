import { useState } from "react"
import { useParams } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { DashboardHeader } from "@/components/layout/DashboardHeader"
import { VideoContent } from "@/components/course/VideoContent"
import { PDFContent } from "@/components/course/PDFContent"
import { QuizContent } from "@/components/course/QuizContent"
import { InteractiveContent } from "@/components/course/InteractiveContent"
import { ZoomContent } from "@/components/course/ZoomContent"
import { CertificateContent } from "@/components/course/CertificateContent"
import { 
  Play, 
  FileText, 
  HelpCircle, 
  MousePointer, 
  Video, 
  Award,
  Clock,
  Users,
  Star
} from "lucide-react"

const mockCourseData = {
  id: "1",
  title: "Complete JavaScript Mastery",
  instructor: "John Doe",
  description: "Master JavaScript from basics to advanced concepts with hands-on projects and real-world applications.",
  duration: "40 hours",
  students: 2340,
  rating: 4.8,
  progress: 35,
  modules: [
    {
      id: "1",
      title: "Introduction to JavaScript",
      type: "video" as const,
      duration: "15 min",
      completed: true,
      content: {
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        transcript: "This is the introduction to JavaScript..."
      }
    },
    {
      id: "2", 
      title: "JavaScript Fundamentals Guide",
      type: "pdf" as const,
      duration: "30 min",
      completed: true,
      content: {
        pdfUrl: "https://example.com/javascript-guide.pdf",
        pages: 45
      }
    },
    {
      id: "3",
      title: "Variables and Data Types Quiz",
      type: "quiz" as const,
      duration: "10 min", 
      completed: false,
      content: {
        questions: [
          {
            type: "mcq" as const,
            question: "Which of the following is a primitive data type in JavaScript?",
            options: ["Object", "Array", "String", "Function"],
            correct: 2
          },
          {
            type: "true_false" as const,
            question: "JavaScript is a statically typed language.",
            correct: false
          },
          {
            type: "short" as const,
            question: "What does 'var' keyword do in JavaScript?",
            correct: "Declares a variable"
          }
        ]
      }
    },
    {
      id: "4",
      title: "Interactive Code Playground",
      type: "interactive" as const,
      duration: "45 min",
      completed: false,
      content: {
        type: "code_editor" as const,
        initialCode: "console.log('Hello World');",
        instructions: "Complete the function to reverse a string"
      }
    },
    {
      id: "5",
      title: "Live Q&A Session",
      type: "zoom" as const,
      duration: "60 min",
      completed: false,
      content: {
        meetingId: "123-456-789",
        meetingUrl: "https://zoom.us/j/123456789",
        scheduledTime: "2024-02-15T10:00:00Z",
        hostName: "John Doe"
      }
    },
    {
      id: "6",
      title: "Course Completion Certificate",
      type: "certificate" as const,
      duration: "-",
      completed: false,
      content: {
        certificateId: "JS-CERT-001",
        requirements: "Complete all modules with 80% score",
        available: false
      }
    }
  ]
}

const getContentIcon = (type: string) => {
  switch (type) {
    case "video": return Play
    case "pdf": return FileText
    case "quiz": return HelpCircle
    case "interactive": return MousePointer
    case "zoom": return Video
    case "certificate": return Award
    default: return FileText
  }
}

const CourseView = () => {
  const { courseId } = useParams()
  const [activeModule, setActiveModule] = useState(mockCourseData.modules[0])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const renderContent = () => {
    switch (activeModule.type) {
      case "video":
        return <VideoContent content={activeModule.content} />
      case "pdf":
        return <PDFContent content={activeModule.content} />
      case "quiz":
        return <QuizContent content={activeModule.content} />
      case "interactive":
        return <InteractiveContent content={activeModule.content} />
      case "zoom":
        return <ZoomContent content={activeModule.content} />
      case "certificate":
        return <CertificateContent content={activeModule.content} />
      default:
        return <div>Content type not supported</div>
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        
        <div className="flex-1 p-6">
          {/* Course Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {mockCourseData.title}
                </h1>
                <p className="text-muted-foreground mb-4">
                  {mockCourseData.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {mockCourseData.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {mockCourseData.students.toLocaleString()} students
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {mockCourseData.rating}
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="px-3 py-1">
                By {mockCourseData.instructor}
              </Badge>
            </div>
            
            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Course Progress</span>
                <span className="text-sm text-muted-foreground">{mockCourseData.progress}%</span>
              </div>
              <Progress value={mockCourseData.progress} className="h-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Course Content */}
            <div className="lg:col-span-3">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {(() => {
                      const Icon = getContentIcon(activeModule.type)
                      return <Icon className="h-5 w-5" />
                    })()}
                    {activeModule.title}
                  </CardTitle>
                  <CardDescription>
                    Duration: {activeModule.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderContent()}
                </CardContent>
              </Card>
            </div>

            {/* Course Modules Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Course Modules</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {mockCourseData.modules.map((module) => {
                    const Icon = getContentIcon(module.type)
                    return (
                      <Button
                        key={module.id}
                        variant={activeModule.id === module.id ? "default" : "ghost"}
                        className="w-full justify-start h-auto p-3"
                        onClick={() => setActiveModule(module)}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 text-left">
                            <div className="font-medium text-sm leading-tight">
                              {module.title}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {module.duration}
                            </div>
                          </div>
                          {module.completed && (
                            <div className="h-2 w-2 bg-green-500 rounded-full flex-shrink-0 mt-2" />
                          )}
                        </div>
                      </Button>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseView