import { useState } from "react"
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  Video, 
  Award, 
  User, 
  LogOut, 
  LayoutDashboard,
  Menu,
  X,
  Plus,
  BarChart2,
  ClipboardList,
  MessageCircle
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navigationItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Login", url: "/login", icon: User },
  { title: "Register", url: "/register", icon: User },
];

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/"
    return currentPath.startsWith(path)
  }

  const getNavClassName = (path: string) => cn(
    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group",
    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
    isActive(path) 
      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md" 
      : "text-sidebar-foreground"
  )

  return (
    <div className={cn(
      "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-sidebar-foreground">Lambda LMS</h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={getNavClassName(item.url)}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && (
              <span className="font-medium truncate">{item.title}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer - Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 w-full",
            "text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground"
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  )
}