import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Users, Play, Clock, Target, FileText } from "lucide-react"

export default function QuizView() {
  const { quizId } = useParams()
  const navigate = useNavigate()
  
  const [quizData, setQuizData] = useState({
    id: 1,
    title: "JavaScript Fundamentals Quiz",
    description: "Test your knowledge of JavaScript basics including variables, functions, and data types.",
    type: "mixed",
    timeLimit: 30,
    passingScore: 70,
    totalQuestions: 10,
    totalAttempts: 25,
    averageScore: 78.5,
    questions: [
      {
        id: 1,
        questionText: "What is the correct way to declare a variable in JavaScript?",
        type: "mcq",
        options: ["var name;", "variable name;", "v name;", "declare name;"],
        correctAnswer: 0
      },
      {
        id: 2,
        questionText: "JavaScript is a compiled language.",
        type: "tf",
        correctAnswer: false
      },
      {
        id: 3,
        questionText: "What does DOM stand for?",
        type: "short",
        correctAnswer: "Document Object Model"
      },
      {
        id: 4,
        questionText: "Which method is used to add an element to the end of an array?",
        type: "mcq",
        options: ["push()", "add()", "append()", "insert()"],
        correctAnswer: 0
      },
      {
        id: 5,
        questionText: "The '===' operator checks for both value and type.",
        type: "tf",
        correctAnswer: true
      }
    ]
  })

  useEffect(() => {
    // TODO: Fetch quiz data from API
  }, [quizId])

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case "mcq": return "Multiple Choice"
      case "tf": return "True/False"
      case "short": return "Short Answer"
      default: return type
    }
  }

  const renderQuestion = (question: any, index: number) => (
    <Card key={question.id} className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{getQuestionTypeLabel(question.type)}</Badge>
            <span className="text-sm text-muted-foreground">Question {index + 1}</span>
          </div>
        </div>
        
        <h4 className="font-medium mb-3">{question.questionText}</h4>
        
        {question.type === "mcq" && (
          <div className="space-y-2">
            {question.options.map((option: string, optIndex: number) => (
              <div key={optIndex} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${
                  optIndex === question.correctAnswer 
                    ? "border-green-500 bg-green-50 text-green-700" 
                    : "border-gray-300"
                }`}>
                  {String.fromCharCode(65 + optIndex)}
                </div>
                <span className={optIndex === question.correctAnswer ? "text-green-700 font-medium" : ""}>
                  {option}
                </span>
              </div>
            ))}
          </div>
        )}
        
        {question.type === "tf" && (
          <div className="flex items-center gap-4">
            <div className={`px-3 py-1 rounded ${
              question.correctAnswer ? "bg-green-100 text-green-700" : "bg-gray-100"
            }`}>
              True
            </div>
            <div className={`px-3 py-1 rounded ${
              !question.correctAnswer ? "bg-green-100 text-green-700" : "bg-gray-100"
            }`}>
              False
            </div>
          </div>
        )}
        
        {question.type === "short" && (
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <span className="text-green-700 font-medium">Sample Answer: </span>
            <span className="text-green-600">{question.correctAnswer}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Quiz Details</h1>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button onClick={() => navigate(`/quiz/${quizId}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Quiz
        </Button>
        <Button variant="outline" onClick={() => navigate(`/quiz/${quizId}/questions/add`)}>
          <FileText className="h-4 w-4 mr-2" />
          Manage Questions
        </Button>
        <Button variant="outline" onClick={() => navigate(`/quiz/${quizId}/attempts`)}>
          <Users className="h-4 w-4 mr-2" />
          View Attempts ({quizData.totalAttempts})
        </Button>
        <Button variant="outline" onClick={() => navigate(`/quiz/${quizId}/attempt`)}>
          <Play className="h-4 w-4 mr-2" />
          Take Quiz
        </Button>
      </div>

      {/* Quiz Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {quizData.title}
            <Badge variant="secondary">{getQuestionTypeLabel(quizData.type)}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{quizData.description}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">{quizData.totalQuestions}</p>
                <p className="text-sm text-muted-foreground">Questions</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">{quizData.timeLimit} min</p>
                <p className="text-sm text-muted-foreground">Time Limit</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">{quizData.passingScore}%</p>
                <p className="text-sm text-muted-foreground">Passing Score</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">{quizData.averageScore}%</p>
                <p className="text-sm text-muted-foreground">Avg Score</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Questions & Answers</CardTitle>
        </CardHeader>
        <CardContent>
          {quizData.questions.map((question, index) => renderQuestion(question, index))}
        </CardContent>
      </Card>
    </div>
  )
}