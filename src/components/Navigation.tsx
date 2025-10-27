import { Link } from "react-router-dom";
import { MessageSquare, Languages, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "he" : "en");
  };

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <MessageSquare className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {t("feedbackHub")}
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link to="/admin">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 hover:bg-primary/10 transition-smooth"
              >
                <Shield className="h-4 w-4" />
                <span>{t("admin") || "Admin"}</span>
              </Button>
            </Link>
            
            <Button
              onClick={toggleLanguage}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 border-border hover:border-primary transition-smooth"
            >
              <Languages className="h-4 w-4" />
              <span>{language === "en" ? "עברית" : "English"}</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
