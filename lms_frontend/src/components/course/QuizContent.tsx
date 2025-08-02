import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { 
  HelpCircle, 
  CheckCircle, 
  XCircle, 
  ChevronLeft, 
  ChevronRight,
  Trophy
} from "lucide-react"

interface Question {
  type: "mcq" | "true_false" | "short"
  question: string
  options?: string[]
  correct: number | boolean | string
}

interface QuizContentProps {
  content: {
    questions: Question[]
  }
}

export const QuizContent = ({ content }: QuizContentProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(string | boolean | null)[]>(
    new Array(content.questions.length).fill(null)
  )
  const [showResults, setShowResults] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const question = content.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / content.questions.length) * 100

  const handleAnswer = (answer: string | boolean) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < content.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setQuizCompleted(true)
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    setCurrentQuestion(prev => Math.max(0, prev - 1))
  }

  const calculateScore = () => {
    let correct = 0
    content.questions.forEach((q, index) => {
      const userAnswer = answers[index]
      if (q.type === "mcq" && userAnswer === String(q.correct)) {
        correct++
      } else if (q.type === "true_false" && userAnswer === q.correct) {
        correct++
      } else if (q.type === "short" && userAnswer && 
                 String(userAnswer).toLowerCase().includes(String(q.correct).toLowerCase())) {
        correct++
      }
    })
    return Math.round((correct / content.questions.length) * 100)
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

      case "true_false":
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

  if (showResults) {
    const score = calculateScore()
    return (
      <div className="space-y-6">
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
                You scored {Math.round((score / 100) * content.questions.length)} out of {content.questions.length} questions correctly.
              </p>
              <Badge variant={score >= 70 ? "default" : "destructive"}>
                {score >= 70 ? "Passed" : "Failed"}
              </Badge>
              <div className="flex gap-2 justify-center mt-6">
                <Button onClick={() => {
                  setShowResults(false)
                  setCurrentQuestion(0)
                  setAnswers(new Array(content.questions.length).fill(null))
                  setQuizCompleted(false)
                }}>
                  Retake Quiz
                </Button>
                <Button variant="outline">
                  Review Answers
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Quiz Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="flex items-center gap-1">
            <HelpCircle className="h-3 w-3" />
            Question {currentQuestion + 1} of {content.questions.length}
          </Badge>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg leading-relaxed">
            {question.question}
          </CardTitle>
          <Badge variant="secondary" className="w-fit">
            {question.type === "mcq" ? "Multiple Choice" : 
             question.type === "true_false" ? "True/False" : "Short Answer"}
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
        
        <Button 
          onClick={handleNext}
          disabled={answers[currentQuestion] === null}
        >
          {currentQuestion === content.questions.length - 1 ? "Finish Quiz" : "Next"}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}