import { Clock, Users, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface Course {
  id: string
  title: string
  instructor: string
  description: string
  image: string
  duration: string
  students: number
  rating: number
  price: number
  level: "Beginner" | "Intermediate" | "Advanced"
}

interface CourseCardProps {
  course: Course
  onEnroll?: (courseId: string) => void
}

export function CourseCard({ course, onEnroll }: CourseCardProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Intermediate": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Advanced": return "bg-red-500/20 text-red-400 border-red-500/30"
      default: return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card className="group bg-gradient-card border-border hover:shadow-elevated hover:border-primary/50 transition-all duration-300 overflow-hidden">
      {/* Course Image */}
      <div className="relative overflow-hidden">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4">
          <Badge className={getLevelColor(course.level)}>
            {course.level}
          </Badge>
        </div>
      </div>

      <CardHeader className="space-y-2">
        <h3 className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          by <span className="font-medium text-primary">{course.instructor}</span>
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.description}
        </p>

        {/* Course Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{course.students} students</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{course.rating}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-primary">
            ${course.price}
          </span>
        </div>
        <Button 
          variant="enroll" 
          size="course"
          onClick={() => onEnroll?.(course.id)}
          className="flex-shrink-0"
        >
          Enroll Now
        </Button>
      </CardFooter>
    </Card>
  )
}