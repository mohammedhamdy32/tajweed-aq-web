import { Link, useLocation } from "react-router-dom";
import { BookOpen, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-soft">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-medium group-hover:shadow-strong transition-all">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                تعلم التجويد
              </h1>
              <p className="text-xs text-muted-foreground">
                أساسيات أحكام التجويد
              </p>
            </div>
          </Link>
          
          {!isHome && (
            <Link to="/">
              <Button variant="outline" size="sm" className="gap-2">
                <Home className="w-4 h-4" />
                الصفحة الرئيسية
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
