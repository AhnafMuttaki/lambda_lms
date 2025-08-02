import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Trophy, 
  CheckCircle,
  AlertTriangle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function QuizAttempt() {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(string | boolean | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(30 * 60) // 30 minutes in seconds
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)

  const [quizData] = useState({
    id: 1,
    title: "JavaScript Fundamentals Quiz",
    description: "Test your knowledge of JavaScript basics including variables, functions, and data types.",
    timeLimit: 30,
    passingScore: 70,
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

  // Initialize answers array
  useEffect(() => {
    setAnswers(new Array(quizData.questions.length).fill(null))
  }, [quizData.questions.length])

  // Timer countdown
  useEffect(() => {
    if (!quizStarted || quizCompleted) return

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmitQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quizStarted, quizCompleted])

  const startQuiz = () => {
    setQuizStarted(true)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleAnswer = (answer: string | boolean) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentQuestion(prev => Math.max(0, prev - 1))
  }

  const calculateScore = () => {
    let correct = 0
    quizData.questions.forEach((q, index) => {
      const userAnswer = answers[index]
      if (q.type === "mcq" && userAnswer === String(q.correctAnswer)) {
        correct++
      } else if (q.type === "tf" && userAnswer === q.correctAnswer) {
        correct++
      } else if (q.type === "short" && userAnswer && 
                 String(userAnswer).toLowerCase().includes(String(q.correctAnswer).toLowerCase())) {
        correct++
      }
    })
    return Math.round((correct / quizData.questions.length) * 100)
  }

  const handleSubmitQuiz = () => {
    const finalScore = calculateScore()
    setScore(finalScore)
    setQuizCompleted(true)
    setShowSubmitDialog(false)
    
    // TODO: Submit quiz results to backend
    toast({
      title: "Quiz Submitted",
      description: `Your score: ${finalScore}%`,
    })
  }

  const getAnsweredCount = () => {
    return answers.filter(answer => answer !== null).length
  }

  const question = quizData.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100

  if (!quizStarted) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Take Quiz</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {quizData.title}
              <Badge variant="secondary">Quiz</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">{quizData.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                  <Trophy className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{quizData.questions.length} Questions</p>
                    <p className="text-sm text-muted-foreground">Total questions</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{quizData.timeLimit} Minutes</p>
                    <p className="text-sm text-muted-foreground">Time limit</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{quizData.passingScore}%</p>
                    <p className="text-sm text-muted-foreground">Passing score</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Instructions</h4>
                    <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                      <li>• You have {quizData.timeLimit} minutes to complete the quiz</li>
                      <li>• You can navigate between questions using the Previous/Next buttons</li>
                      <li>• Make sure to answer all questions before submitting</li>
                      <li>• The quiz will be automatically submitted when time runs out</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button onClick={startQuiz} className="w-full" size="lg">
                Start Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (quizCompleted) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4">
              <Trophy className="h-16 w-16 text-yellow-500" />
            </div>
            <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-4xl font-bold text-primary">{score}%</div>
              <p className="text-muted-foreground">
                You scored {Math.round((score / 100) * quizData.questions.length)} out of {quizData.questions.length} questions correctly.
              </p>
              <Badge variant={score >= quizData.passingScore ? "default" : "destructive"} className="text-lg px-4 py-2">
                {score >= quizData.passingScore ? "Passed" : "Failed"}
              </Badge>
              <div className="flex gap-2 justify-center mt-6">
                <Button onClick={() => navigate(`/quiz/${quizId}`)}>
                  View Quiz Details
                </Button>
                <Button variant="outline" onClick={() => navigate(-1)}>
                  Back to Course
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderQuestion = () => {
    switch (question.type) {
      case "mcq":
        return (
          <div className="space-y-4">
            <RadioGroup 
              value={String(answers[currentQuestion] || "")}
              onValueChange={(value) => handleAnswer(value)}
            >
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={String(index)} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )

      case "tf":
        return (
          <div className="space-y-4">
            <RadioGroup 
              value={String(answers[currentQuestion] || "")}
              onValueChange={(value) => handleAnswer(value === "true")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="true" />
                <Label htmlFor="true" className="cursor-pointer">True</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="false" />
                <Label htmlFor="false" className="cursor-pointer">False</Label>
              </div>
            </RadioGroup>
          </div>
        )

      case "short":
        return (
          <div className="space-y-4">
            <Textarea
              placeholder="Type your answer here..."
              value={String(answers[currentQuestion] || "")}
              onChange={(e) => handleAnswer(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">{quizData.title}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTime(timeRemaining)}
          </Badge>
          <Badge variant="secondary">
            {getAnsweredCount()}/{quizData.questions.length} Answered
          </Badge>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {quizData.questions.length}
          </span>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg leading-relaxed">
            {question.questionText}
          </CardTitle>
          <Badge variant="secondary" className="w-fit">
            {question.type === "mcq" ? "Multiple Choice" : 
             question.type === "tf" ? "True/False" : "Short Answer"}
          </Badge>
        </CardHeader>
        <CardContent>
          {renderQuestion()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <div className="flex gap-2">
          {currentQuestion === quizData.questions.length - 1 ? (
            <Button 
              onClick={() => setShowSubmitDialog(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              Submit Quiz
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered {getAnsweredCount()} out of {quizData.questions.length} questions.
              {getAnsweredCount() < quizData.questions.length && (
                <span className="text-yellow-600 block mt-2">
                  You still have {quizData.questions.length - getAnsweredCount()} unanswered questions.
                </span>
              )}
              Once submitted, you cannot change your answers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitQuiz}>
              Submit Quiz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}