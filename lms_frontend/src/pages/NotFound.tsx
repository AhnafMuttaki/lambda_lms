import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GraduationCap, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 mb-4">
          <GraduationCap className="h-12 w-12 text-primary" />
          <span className="text-3xl font-bold text-foreground">Lambda LMS</span>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">Page Not Found</h2>
          <p className="text-lg text-muted-foreground max-w-md">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <Button asChild variant="enroll" size="lg" className="gap-2">
          <Link to="/">
            <Home className="h-4 w-4" />
            Return to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
