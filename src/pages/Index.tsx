import Navigation from "@/components/Navigation";
import ReviewForm from "@/components/feedback/ReviewForm";
import { MessageSquareText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
            <MessageSquareText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {t("leaveAnonymousFeedback")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("feedbackDescription")}
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-8 shadow-lg animate-scale-in">
          <ReviewForm />
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground animate-fade-in">
          <p>{t("feedbackAnonymous")}</p>
        </div>
      </main>
    </div>
  );
};

export default Index;
