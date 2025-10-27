import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface StoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    en: { name: string; location: string };
    he: { name: string; location: string };
  }) => void;
  initialData?: {
    en: { name: string; location: string };
    he: { name: string; location: string };
  } | null;
}

const StoreModal = ({ isOpen, onClose, onSubmit, initialData }: StoreModalProps) => {
  const { t, language } = useLanguage();
  const isRTL = language === "he";

  const [enData, setEnData] = useState({ name: "", location: "" });
  const [heData, setHeData] = useState({ name: "", location: "" });

  useEffect(() => {
    if (initialData) {
      setEnData(initialData.en);
      setHeData(initialData.he);
    } else {
      setEnData({ name: "", location: "" });
      setHeData({ name: "", location: "" });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const safeEn = {
      name: enData.name || heData.name,
      location: enData.location || heData.location,
    };
    const safeHe = {
      name: heData.name || enData.name,
      location: heData.location || enData.location,
    };

    onSubmit({ en: safeEn, he: safeHe });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        className="
          bg-card border border-border shadow-lg rounded-lg
          w-[94vw] max-w-2xl max-h-[85vh]
          overflow-y-auto relative p-8
        "
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* כפתור X */}
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} text-muted-foreground hover:text-foreground transition`}
          aria-label={t("close") ?? "Close"}
        >
          <X className="h-5 w-5" />
        </button>

        {/* כותרת */}
        <h2 className={`text-xl font-semibold mb-6 ${isRTL ? "text-right" : "text-left"}`}>
          {initialData ? t("editStore") : t("addNewStore")}
        </h2>

        {/* טופס */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRTL ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="he-name" className="text-right">
                  שם החנות (עברית)
                </Label>
                <Input
                  id="he-name"
                  value={heData.name}
                  onChange={(e) => setHeData({ ...heData, name: e.target.value })}
                  placeholder="לדוגמה: חנות מרכז העיר"
                  required
                  dir="rtl"
                  className="bg-input border-border text-right placeholder:text-right rtl:pr-4 rtl:pl-3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="he-location" className="text-right">
                  מיקום (עברית)
                </Label>
                <Input
                  id="he-location"
                  value={heData.location}
                  onChange={(e) => setHeData({ ...heData, location: e.target.value })}
                  placeholder="לדוגמה: רחוב ראשי 123, מרכז העיר"
                  required
                  dir="rtl"
                  className="bg-input border-border text-right placeholder:text-right rtl:pr-4 rtl:pl-3"
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="en-name">Store Name (English)</Label>
                <Input
                  id="en-name"
                  value={enData.name}
                  onChange={(e) => setEnData({ ...enData, name: e.target.value })}
                  placeholder="e.g., Downtown Store"
                  required
                  dir="ltr"
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="en-location">Location (English)</Label>
                <Input
                  id="en-location"
                  value={enData.location}
                  onChange={(e) => setEnData({ ...enData, location: e.target.value })}
                  placeholder="e.g., 123 Main St, City Center"
                  required
                  dir="ltr"
                  className="bg-input border-border"
                />
              </div>
            </>
          )}

{/* כפתורים בתחתית — מיקום שונה לפי שפה */}
<div
  className={`flex pt-6 gap-2 ${
    isRTL ? "justify-start flex-row-reverse" : "justify-end"
  }`}
>
  {isRTL ? (
    <>
      {/* RTL – קודם הוספה, אחר כך ביטול */}
      <Button type="submit" className="bg-gradient-primary hover:opacity-90">
        {initialData ? t("update") : t("add")} {t("store")}
      </Button>
      <Button type="button" variant="outline" onClick={onClose}>
        {t("cancel")}
      </Button>
    </>
  ) : (
    <>
      {/* LTR – קודם ביטול, אחר כך הוספה */}
      <Button type="button" variant="outline" onClick={onClose}>
        {t("cancel")}
      </Button>
      <Button type="submit" className="bg-gradient-primary hover:opacity-90">
        {initialData ? t("update") : t("add")} {t("store")}
      </Button>
    </>
  )}
</div>

        </form>
      </div>
    </div>
  );
};

export default StoreModal;
