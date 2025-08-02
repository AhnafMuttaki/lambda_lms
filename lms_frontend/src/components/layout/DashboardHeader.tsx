import { Search, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DashboardHeaderProps {
  userName?: string
}

export function DashboardHeader({ userName = "Student" }: DashboardHeaderProps) {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-10">
      <div className="flex items-center justify-between p-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {userName}!
          </h1>
          <p className="text-muted-foreground">
            Continue your learning journey
          </p>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              className="pl-10 bg-muted/50 border-border focus:border-primary"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full"></span>
          </Button>

          {/* Profile */}
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}