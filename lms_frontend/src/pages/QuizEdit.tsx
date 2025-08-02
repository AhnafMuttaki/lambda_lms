import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Edit, Eye, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function QuizEdit() {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    timeLimit: "",
    passingScore: ""
  })

  useEffect(() => {
    // TODO: Fetch quiz data and populate form
    // Mock data for now
    setFormData({
      title: "JavaScript Fundamentals Quiz",
      description: "Test your knowledge of JavaScript basics",
      type: "mcq",
      timeLimit: "30",
      passingScore: "70"
    })
  }, [quizId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement quiz update logic
    toast({
      title: "Quiz Updated",
      description: "Your quiz has been updated successfully.",
    })
    navigate(`/quiz/${quizId}`)
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Edit Quiz</h1>
      </div>

      <div className="flex gap-4 mb-6">
        <Button variant="outline" onClick={() => navigate(`/quiz/${quizId}`)}>
          <Eye className="h-4 w-4 mr-2" />
          View Quiz
        </Button>
        <Button variant="outline" onClick={() => navigate(`/quiz/${quizId}/questions/add`)}>
          <Edit className="h-4 w-4 mr-2" />
          Manage Questions
        </Button>
        <Button variant="outline" onClick={() => navigate(`/quiz/${quizId}/attempts`)}>
          <Users className="h-4 w-4 mr-2" />
          View Attempts
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quiz Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Quiz Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter quiz title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Quiz Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select quiz type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mcq">Multiple Choice</SelectItem>
                    <SelectItem value="short">Short Answer</SelectItem>
                    <SelectItem value="tf">True/False</SelectItem>
                    <SelectItem value="mixed">Mixed Types</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  value={formData.timeLimit}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeLimit: e.target.value }))}
                  placeholder="30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passingScore">Passing Score (%)</Label>
                <Input
                  id="passingScore"
                  type="number"
                  value={formData.passingScore}
                  onChange={(e) => setFormData(prev => ({ ...prev, passingScore: e.target.value }))}
                  placeholder="70"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter quiz description..."
                className="min-h-[100px]"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit">
                Update Quiz
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(`/quiz/${quizId}`)}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}