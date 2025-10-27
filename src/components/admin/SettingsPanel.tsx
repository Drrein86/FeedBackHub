import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Save } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const SettingsPanel = () => {
  const { t, language } = useLanguage();
  const isRTL = language === "he";

  const [settings, setSettings] = useState({
    webhookUrl: "https://api.example.com/webhook",
    notificationEmail: "admin@feedbackhub.com",
    autoApprove: true,
    minRating: 1,
  });

  const handleSave = () => {
    toast.success(t("settingsSaved"));
  };

  return (
    // קובעים כיווניות לפי שפה
    <div className="space-y-6 animate-fade-in" dir={isRTL ? "rtl" : "ltr"}>

      <div className="grid gap-6 md:grid-cols-2">
        {/* הגדרות ביקורות */}
        <Card className="p-6 bg-card border border-border rounded-xl space-y-4">
          <h3 className={`font-semibold text-lg ${isRTL ? "text-right" : "text-left"}`}>
            {t("reviewSettings")}
          </h3>

          {/* שורת סוויץ' – טקסט מימין ב-RTL והסוויץ' לשמאל */}
          <div
            className={`flex items-center justify-between gap-4 ${
              isRTL ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div className={`${isRTL ? "text-right" : "text-left"}`}>
              <Label className={`${isRTL ? "text-right" : ""}`}>{t("autoApproveReviews")}</Label>
              <p className="text-xs text-muted-foreground">{t("autoApproveDescription")}</p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings.autoApprove}
              onClick={() =>
                setSettings((s) => ({ ...s, autoApprove: !s.autoApprove }))
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors border border-border ${
                settings.autoApprove ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white transition-transform
                ${settings.autoApprove
                  ? (isRTL ? "-translate-x-6" : "translate-x-6")
                  : (isRTL ? "-translate-x-1" : "translate-x-1")}`}
              />
            </button>
          </div>

          {/* סף דירוג מינימלי */}
          <div className="space-y-2">
            <Label htmlFor="minRating" className={`${isRTL ? "text-right" : ""}`}>
              {t("minRatingThreshold")}
            </Label>
            <Input
              id="minRating"
              type="number"
              dir="ltr"            // מספרים תמיד LTR
              min={1}
              max={5}
              value={settings.minRating}
              onChange={(e) =>
                setSettings({ ...settings, minRating: Number.parseInt(e.target.value || "1", 10) })
              }
              className="bg-input border border-border focus-visible:ring-2 focus-visible:ring-primary/40"
            />
            <p className={`text-xs text-muted-foreground ${isRTL ? "text-right" : ""}`}>
              {t("minRatingDescription")}
            </p>
          </div>
        </Card>

        {/* הגדרות אינטגרציה */}
        <Card className="p-6 bg-card border border-border rounded-xl space-y-4">
          <h3 className={`font-semibold text-lg ${isRTL ? "text-right" : "text-left"}`}>
            {t("integrationSettings")}
          </h3>

          {/* Webhook */}
          <div className="space-y-2">
            <Label htmlFor="webhook" className={`${isRTL ? "text-right" : ""}`}>
              {t("webhookUrl")}
            </Label>
            <Input
              id="webhook"
              dir="ltr"            // URL תמיד LTR
              value={settings.webhookUrl}
              onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
              className="bg-input border border-border focus-visible:ring-2 focus-visible:ring-primary/40"
            />
            <p className={`text-xs text-muted-foreground ${isRTL ? "text-right" : ""}`}>
              {t("webhookDescription")}
            </p>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className={`${isRTL ? "text-right" : ""}`}>
              {t("notificationEmail")}
            </Label>
            <Input
              id="email"
              type="email"
              dir="ltr"            // אימייל תמיד LTR
              value={settings.notificationEmail}
              onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })}
              className="bg-input border border-border focus-visible:ring-2 focus-visible:ring-primary/40"
            />
            <p className={`text-xs text-muted-foreground ${isRTL ? "text-right" : ""}`}>
              {t("emailDescription")}
            </p>
          </div>
        </Card>
      </div>

      {/* כפתור שמירה – נשאר בקצה לפי כיוון העמוד */}
      <div className={`flex ${isRTL ? "justify-start" : "justify-end"}`}>
        <Button onClick={handleSave} className="bg-gradient-primary hover:opacity-90 shadow-glow">
          <Save className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
          {t("saveSettings")}
        </Button>
      </div>
    </div>
  );
};

export default SettingsPanel;
