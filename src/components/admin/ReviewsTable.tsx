import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Star, Calendar, Loader2, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { apiClient } from "@/lib/api";

interface Review {
  id: string;
  storeName: string;
  rating: number | null;
  comment: string;
  date: string;
  isApproved: boolean;
}

const ReviewsTable = () => {
  const { t, language } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = async () => {
    const response = await apiClient.getReviews(language);
    setReviews(response.reviews);
  };

  // Load reviews from API
  useEffect(() => {
    const loadReviews = async () => {
      try {
        setIsLoading(true);
        await refresh();
      } catch (error) {
        console.error('Failed to load reviews:', error);
        // Fallback to empty array
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, [language]);

  const handleDelete = async (id: string) => {
    try {
      await apiClient.deleteReview(id);
      await refresh();
    } catch (error) {
      console.error('Failed to delete review', error);
    }
  };

  const renderStars = (rating: number | null) => {
    if (!rating) return <span className="text-muted-foreground text-sm">No rating</span>;
    
    return (
      <div className="flex space-x-1 rtl:space-x-reverse">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "fill-primary text-primary" : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading reviews...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">

      <Card className="bg-card border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">{t("storeName")}</TableHead>
              <TableHead className="text-muted-foreground">{t("rating")}</TableHead>
              <TableHead className="text-muted-foreground">{t("comment")}</TableHead>
              <TableHead className="text-muted-foreground">{t("date")}</TableHead>
              <TableHead className="text-muted-foreground" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No reviews found
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review) => (
                <TableRow
                  key={review.id}
                  className="border-border hover:bg-secondary/50 transition-colors"
                >
                  <TableCell className="font-medium">{review.storeName}</TableCell>
                  <TableCell>{renderStars(review.rating)}</TableCell>
                  <TableCell className="max-w-md">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {review.comment}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(review.date).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="inline-flex items-center text-destructive hover:text-destructive/80"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default ReviewsTable;
