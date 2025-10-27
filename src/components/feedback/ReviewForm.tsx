import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import StoreSelect from "./StoreSelect";
import RatingStars from "./RatingStars";
import { Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { apiClient } from "@/lib/api";

const ReviewForm = () => {
  const { t, language } = useLanguage();
  const [store, setStore] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [stores, setStores] = useState<Array<{ id: string; name: string }>>([]);
  const [isLoadingStores, setIsLoadingStores] = useState(true);

  // Load stores from API
  useEffect(() => {
    const loadStores = async () => {
      try {
        setIsLoadingStores(true);
        const storesData = await apiClient.getStores(language);
        setStores(storesData);
      } catch (error) {
        console.error('Failed to load stores:', error);
        toast.error('Failed to load stores');
        // Fallback to mock data
        setStores([
          { id: "1", name: t("downtownStore") },
          { id: "2", name: t("westsideLocation") },
          { id: "3", name: t("airportBranch") },
          { id: "4", name: t("northgateMall") },
        ]);
      } finally {
        setIsLoadingStores(false);
      }
    };

    loadStores();
  }, [language, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!store || !comment.trim()) {
      toast.error(t("selectStoreAndFeedback"));
      return;
    }

    setIsSubmitting(true);
    
    try {
      await apiClient.submitReview({
        storeId: store,
        rating: rating > 0 ? rating : undefined,
        comment: comment.trim(),
        language
      });
      
      setIsSuccess(true);
      toast.success(t("thankYouFeedback"), {
        description: t("feedbackSubmittedSuccessfully"),
      });

      // Reset form after success animation
      setTimeout(() => {
        setStore("");
        setRating(0);
        setComment("");
        setIsSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to submit review:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="animate-scale-in text-center py-12">
        <CheckCircle2 className="h-20 w-20 text-success mx-auto mb-4" />
        <h3 className="text-2xl font-semibold mb-2">{t("feedbackSubmitted")}</h3>
        <p className="text-muted-foreground">{t("thankYouImprove")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <StoreSelect 
        value={store} 
        onChange={setStore} 
        stores={stores} 
        isLoading={isLoadingStores}
      />
      
      <RatingStars value={rating} onChange={setRating} />

      <div className="space-y-2">
        <label htmlFor="comment" className="text-sm font-medium">
          {t("yourFeedback")}
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t("feedbackPlaceholder")}
          className="min-h-[150px] bg-input border-border focus:border-primary transition-smooth resize-none"
          required
        />
        <p className="text-xs text-muted-foreground">
          {comment.length} / 500 {t("characters")}
        </p>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-primary hover:opacity-90 transition-smooth shadow-glow h-12 text-base font-medium"
      >
        {isSubmitting ? (
          <span className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            <span>{t("submitting")}</span>
          </span>
        ) : (
          <span className="flex items-center space-x-2 rtl:space-x-reverse">
            <Send className="h-4 w-4" />
            <span>{t("submitFeedback")}</span>
          </span>
        )}
      </Button>
    </form>
  );
};

export default ReviewForm;
