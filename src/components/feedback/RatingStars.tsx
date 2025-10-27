import { Star } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface RatingStarsProps {
  value: number;
  onChange: (rating: number) => void;
}

const RatingStars = ({ value, onChange }: RatingStarsProps) => {
  const [hoverRating, setHoverRating] = useState(0);
  const { t } = useLanguage();

  const getRatingLabel = (rating: number) => {
    const labels: { [key: number]: string } = {
      1: t("poor"),
      2: t("fair"),
      3: t("good"),
      4: t("veryGood"),
      5: t("excellent"),
    };
    return labels[rating] || "";
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{t("rating")}</label>
      <div className="flex space-x-2 rtl:space-x-reverse">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            onMouseEnter={() => setHoverRating(rating)}
            onMouseLeave={() => setHoverRating(0)}
            className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded"
          >
            <Star
              className={`h-8 w-8 transition-colors ${
                rating <= (hoverRating || value)
                  ? "fill-primary text-primary"
                  : "text-muted-foreground"
              }`}
            />
          </button>
        ))}
      </div>
      {value > 0 && (
        <p className="text-sm text-muted-foreground">
          {getRatingLabel(value)}
        </p>
      )}
    </div>
  );
};

export default RatingStars;
