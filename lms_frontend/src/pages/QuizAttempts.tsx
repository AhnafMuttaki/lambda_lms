import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Download, Eye, Calendar, Trophy, Clock } from "lucide-react"
import { format } from "date-fns"

export default function QuizAttempts() {
  const { quizId } = useParams()
  const navigate = useNavigate()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("latest")

  const [quizInfo, setQuizInfo] = useState({
    title: "JavaScript Fundamentals Quiz",
    totalQuestions: 10,
    passingScore: 70
  })

  const [attempts, setAttempts] = useState([
    {
      id: 1,
      userId: 101,
      userName: "John Doe",
      userEmail: "john@example.com",
      score: 85,
      totalQuestions: 10,
      correctAnswers: 8.5,
      status: "completed",
      startedAt: new Date("2024-01-15T10:30:00"),
      completedAt: new Date("2024-01-15T10:45:00"),
      timeSpent: 15
    },
    {
      id: 2,
      userId: 102,
      userName: "Jane Smith",
      userEmail: "jane@example.com",
      score: 92,
      totalQuestions: 10,
      correctAnswers: 9.2,
      status: "completed",
      startedAt: new Date("2024-01-15T14:20:00"),
      completedAt: new Date("2024-01-15T14:38:00"),
      timeSpent: 18
    },
    {
      id: 3,
      userId: 103,
      userName: "Bob Johnson",
      userEmail: "bob@example.com",
      score: 65,
      totalQuestions: 10,
      correctAnswers: 6.5,
      status: "completed",
      startedAt: new Date("2024-01-16T09:15:00"),
      completedAt: new Date("2024-01-16T09:40:00"),
      timeSpent: 25
    },
    {
      id: 4,
      userId: 104,
      userName: "Alice Brown",
      userEmail: "alice@example.com",
      score: 0,
      totalQuestions: 10,
      correctAnswers: 0,
      status: "in_progress",
      startedAt: new Date("2024-01-16T11:30:00"),
      completedAt: null,
      timeSpent: 0
    }
  ])

  const filteredAttempts = attempts.filter(attempt => {
    const matchesSearch = attempt.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attempt.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || attempt.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const sortedAttempts = [...filteredAttempts].sort((a, b) => {
    switch (sortBy) {
      case "score_high":
        return b.score - a.score
      case "score_low":
        return a.score - b.score
      case "name":
        return a.userName.localeCompare(b.userName)
      case "latest":
      default:
        return new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    }
  })

  const getStatusBadge = (status: string, score: number) => {
    if (status === "in_progress") {
      return <Badge variant="outline">In Progress</Badge>
    }
    if (score >= quizInfo.passingScore) {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Passed</Badge>
    }
    return <Badge variant="destructive">Failed</Badge>
  }

  const calculateStats = () => {
    const completedAttempts = attempts.filter(a => a.status === "completed")
    const totalAttempts = attempts.length
    const averageScore = completedAttempts.length > 0 
      ? completedAttempts.reduce((sum, a) => sum + a.score, 0) / completedAttempts.length 
      : 0
    const passRate = completedAttempts.length > 0
      ? (completedAttempts.filter(a => a.score >= quizInfo.passingScore).length / completedAttempts.length) * 100
      : 0

    return { totalAttempts, averageScore, passRate }
  }

  const stats = calculateStats()

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Quiz Attempts</h1>
          <p className="text-muted-foreground">{quizInfo.title}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{attempts.length}</p>
                <p className="text-sm text-muted-foreground">Total Attempts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{stats.averageScore.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Average Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{stats.passRate.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Pass Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{attempts.filter(a => a.status === "completed").length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest First</SelectItem>
                <SelectItem value="score_high">Highest Score</SelectItem>
                <SelectItem value="score_low">Lowest Score</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Attempts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Quiz Attempts ({sortedAttempts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAttempts.map((attempt) => (
                <TableRow key={attempt.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{attempt.userName}</p>
                      <p className="text-sm text-muted-foreground">{attempt.userEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{attempt.score}%</span>
                      <span className="text-sm text-muted-foreground">
                        ({attempt.correctAnswers}/{attempt.totalQuestions})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(attempt.status, attempt.score)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span className="text-sm">
                        {format(attempt.startedAt, "MMM dd, yyyy HH:mm")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {attempt.completedAt ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span className="text-sm">
                          {format(attempt.completedAt, "MMM dd, yyyy HH:mm")}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {attempt.status === "completed" ? (
                      <span className="text-sm">{attempt.timeSpent} min</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {sortedAttempts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No attempts found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}