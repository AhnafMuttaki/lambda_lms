import { Course } from "@/components/courses/CourseCard"
import courseJavaScript from "@/assets/course-javascript.jpg"
import courseReact from "@/assets/course-react.jpg"
import coursePython from "@/assets/course-python.jpg"
import courseNodejs from "@/assets/course-nodejs.jpg"

export const mockCourses: Course[] = [
  {
    id: "js-fundamentals",
    title: "JavaScript Fundamentals",
    instructor: "Sarah Johnson",
    description: "Master the core concepts of JavaScript including variables, functions, objects, and modern ES6+ features. Perfect for beginners.",
    image: courseJavaScript,
    duration: "8 weeks",
    students: 1250,
    rating: 4.8,
    price: 89,
    level: "Beginner"
  },
  {
    id: "react-complete",
    title: "Complete React Developer",
    instructor: "Alex Chen",
    description: "Build modern web applications with React, hooks, context, and state management. Includes real-world projects.",
    image: courseReact,
    duration: "12 weeks",
    students: 987,
    rating: 4.9,
    price: 149,
    level: "Intermediate"
  },
  {
    id: "python-data-science",
    title: "Python for Data Science",
    instructor: "Dr. Maria Rodriguez",
    description: "Learn Python programming with focus on data analysis, visualization, and machine learning fundamentals.",
    image: coursePython,
    duration: "10 weeks",
    students: 756,
    rating: 4.7,
    price: 129,
    level: "Intermediate"
  },
  {
    id: "nodejs-backend",
    title: "Node.js Backend Development",
    instructor: "Michael Thompson",
    description: "Build scalable backend applications with Node.js, Express, databases, and API development best practices.",
    image: courseNodejs,
    duration: "14 weeks",
    students: 543,
    rating: 4.6,
    price: 179,
    level: "Advanced"
  }
]