import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Trash2, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function QuizQuestionAdd() {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [questionData, setQuestionData] = useState({
    questionText: "",
    type: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    explanation: ""
  })

  const [existingQuestions, setExistingQuestions] = useState([
    {
      id: 1,
      questionText: "What is the capital of France?",
      type: "mcq",
      options: ["London", "Paris", "Berlin", "Madrid"],
      correctAnswer: "1"
    },
    {
      id: 2,
      questionText: "JavaScript is a compiled language.",
      type: "tf",
      correctAnswer: "false"
    }
  ])

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...questionData.options]
    newOptions[index] = value
    setQuestionData(prev => ({ ...prev, options: newOptions }))
  }

  const addOption = () => {
    setQuestionData(prev => ({
      ...prev,
      options: [...prev.options, ""]
    }))
  }

  const removeOption = (index: number) => {
    if (questionData.options.length > 2) {
      const newOptions = questionData.options.filter((_, i) => i !== index)
      setQuestionData(prev => ({ ...prev, options: newOptions }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement question creation logic
    const newQuestion = {
      id: existingQuestions.length + 1,
      questionText: questionData.questionText,
      type: questionData.type,
      options: questionData.type === "mcq" ? questionData.options.filter(opt => opt.trim()) : undefined,
      correctAnswer: questionData.correctAnswer
    }
    setExistingQuestions(prev => [...prev, newQuestion])
    
    // Reset form
    setQuestionData({
      questionText: "",
      type: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      explanation: ""
    })
    
    toast({
      title: "Question Added",
      description: "Your question has been added successfully.",
    })
  }

  const renderQuestionForm = () => {
    switch (questionData.type) {
      case "mcq":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Options *</Label>
              {questionData.options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeOption(index)}
                    disabled={questionData.options.length <= 2}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addOption}>
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="correctAnswer">Correct Option *</Label>
              <Select value={questionData.correctAnswer} onValueChange={(value) => setQuestionData(prev => ({ ...prev, correctAnswer: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select correct option" />
                </SelectTrigger>
                <SelectContent>
                  {questionData.options.map((option, index) => (
                    option.trim() && (
                      <SelectItem key={index} value={String(index)}>
                        Option {index + 1}: {option}
                      </SelectItem>
                    )
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case "tf":
        return (
          <div className="space-y-2">
            <Label htmlFor="correctAnswer">Correct Answer *</Label>
            <Select value={questionData.correctAnswer} onValueChange={(value) => setQuestionData(prev => ({ ...prev, correctAnswer: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select correct answer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">True</SelectItem>
                <SelectItem value="false">False</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )

      case "short":
        return (
          <div className="space-y-2">
            <Label htmlFor="correctAnswer">Sample Answer *</Label>
            <Textarea
              id="correctAnswer"
              value={questionData.correctAnswer}
              onChange={(e) => setQuestionData(prev => ({ ...prev, correctAnswer: e.target.value }))}
              placeholder="Enter sample answer or keywords..."
              className="min-h-[80px]"
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Manage Quiz Questions</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add Question Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Question</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="questionText">Question Text *</Label>
                <Textarea
                  id="questionText"
                  value={questionData.questionText}
                  onChange={(e) => setQuestionData(prev => ({ ...prev, questionText: e.target.value }))}
                  placeholder="Enter your question..."
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Question Type *</Label>
                <Select value={questionData.type} onValueChange={(value) => setQuestionData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select question type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mcq">Multiple Choice</SelectItem>
                    <SelectItem value="short">Short Answer</SelectItem>
                    <SelectItem value="tf">True/False</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {renderQuestionForm()}

              <div className="space-y-2">
                <Label htmlFor="explanation">Explanation (Optional)</Label>
                <Textarea
                  id="explanation"
                  value={questionData.explanation}
                  onChange={(e) => setQuestionData(prev => ({ ...prev, explanation: e.target.value }))}
                  placeholder="Explain why this is the correct answer..."
                  className="min-h-[80px]"
                />
              </div>

              <Button 
                type="submit" 
                disabled={!questionData.questionText || !questionData.type || !questionData.correctAnswer}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Questions */}
        <Card>
          <CardHeader>
            <CardTitle>Existing Questions ({existingQuestions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {existingQuestions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">
                          {question.type === "mcq" ? "Multiple Choice" : 
                           question.type === "tf" ? "True/False" : "Short Answer"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">Question {index + 1}</span>
                      </div>
                      <p className="font-medium mb-2">{question.questionText}</p>
                      
                      {question.type === "mcq" && question.options && (
                        <div className="space-y-1">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-2 text-sm">
                              {optIndex === parseInt(question.correctAnswer) && (
                                <Check className="h-3 w-3 text-green-600" />
                              )}
                              <span className={optIndex === parseInt(question.correctAnswer) ? "text-green-600 font-medium" : ""}>
                                {option}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {question.type === "tf" && (
                        <p className="text-sm">
                          Correct Answer: <span className="font-medium text-green-600">{question.correctAnswer}</span>
                        </p>
                      )}
                    </div>
                    
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {existingQuestions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No questions added yet. Create your first question using the form.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
