import { AppSidebar } from "@/components/layout/AppSidebar"
import { DashboardHeader } from "@/components/layout/DashboardHeader"
import { CourseCard } from "@/components/courses/CourseCard"
import { mockCourses } from "@/data/mockCourses"
import { useToast } from "@/hooks/use-toast"

const Index = () => {
  const { toast } = useToast()

  const handleEnroll = (courseId: string) => {
    const course = mockCourses.find(c => c.id === courseId)
    toast({
      title: "Enrollment Successful!",
      description: `You've successfully enrolled in ${course?.title}`,
    })
  }

  return (
    <div className="min-h-screen bg-background flex dark">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader userName="Alex" />
        
        <main className="flex-1 p-6">
          {/* Featured Courses Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Featured Courses
              </h2>
              <p className="text-muted-foreground">
                Discover our most popular courses and start learning today
              </p>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mockCourses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  onEnroll={handleEnroll}
                />
              ))}
            </div>
          </section>

          {/* Quick Stats */}
          <section className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-card p-6 rounded-xl border border-border">
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  Your Progress
                </h3>
                <div className="text-3xl font-bold text-primary">75%</div>
                <p className="text-sm text-muted-foreground">Completed courses</p>
              </div>
              
              <div className="bg-gradient-card p-6 rounded-xl border border-border">
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  Learning Hours
                </h3>
                <div className="text-3xl font-bold text-secondary">42h</div>
                <p className="text-sm text-muted-foreground">This month</p>
              </div>
              
              <div className="bg-gradient-card p-6 rounded-xl border border-border">
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  Certificates
                </h3>
                <div className="text-3xl font-bold text-primary">5</div>
                <p className="text-sm text-muted-foreground">Earned</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
};

export default Index;
