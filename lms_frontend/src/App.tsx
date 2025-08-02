import AnalyticsDashboardPage from "./pages/AnalyticsDashboard";
import CourseAnalyticsPage from "./pages/CourseAnalytics";
import UserAnalyticsPage from "./pages/UserAnalytics";
import AdminModeration from "./pages/AdminModeration";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CourseView from "./pages/CourseView";
import CourseCreate from "./pages/CourseCreate";
import QuizCreate from "./pages/QuizCreate";
import QuizEdit from "./pages/QuizEdit";
import QuizQuestionAdd from "./pages/QuizQuestionAdd";
import QuizView from "./pages/QuizView";
import QuizAttempts from "./pages/QuizAttempts";
import QuizAttempt from "./pages/QuizAttempt";
import NotFound from "./pages/NotFound";
import CourseEnrollments from "./pages/CourseEnrollments";
import StudentCourseProgress from "./pages/StudentCourseProgress";
import CourseContent from "./pages/CourseContent";
import StudentContentView from "./pages/StudentContentView";
import CertificateView from "./pages/CertificateView";
import CertificateTemplates from "./pages/CertificateTemplates";
import CertificateIssueHistoryPage from "./pages/CertificateIssueHistory";
import CourseDiscussion from "./pages/CourseDiscussion";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/course/:courseId" element={<CourseView />} />
          <Route path="/course/create" element={<CourseCreate />} />
          <Route path="/course/edit/:courseId" element={<CourseCreate />} />
          
          {/* Quiz routes */}
          <Route path="/quiz/create" element={<QuizCreate />} />
          <Route path="/quiz/:quizId/edit" element={<QuizEdit />} />
          <Route path="/quiz/:quizId/questions/add" element={<QuizQuestionAdd />} />
          <Route path="/quiz/:quizId" element={<QuizView />} />
          <Route path="/quiz/:quizId/attempts" element={<QuizAttempts />} />
          {/* Enrollment routes */}
          <Route path="/course/:courseId/enrollments" element={<CourseEnrollments />} />
          <Route path="/course/:courseId/progress" element={<StudentCourseProgress />} />
          {/* Content service routes */}
          <Route path="/course/:courseId/content" element={<CourseContent />} />
          <Route path="/course/:courseId/content/view" element={<StudentContentView />} />
          <Route path="/quiz/:quizId/attempt" element={<QuizAttempt />} />
          
          {/* Analytics routes */}
          <Route path="/analytics/dashboard" element={<AnalyticsDashboardPage />} />
          <Route path="/analytics/course/:courseId" element={<CourseAnalyticsPage />} />
          <Route path="/analytics/user/:userId" element={<UserAnalyticsPage />} />
          {/* Certificate service routes */}
          {/* Discussion/Q&A service route */}
          <Route path="/course/:courseId/discussion" element={<CourseDiscussion />} />
          <Route path="/course/:courseId/certificate" element={<CertificateView />} />
          <Route path="/course/:courseId/certificate/templates" element={<CertificateTemplates />} />
          <Route path="/course/:courseId/certificate/history" element={<CertificateIssueHistoryPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
