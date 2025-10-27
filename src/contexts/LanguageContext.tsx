import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "he";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations = {
  en: {
    // Navigation
    feedbackHub: "FeedbackHub",
    feedback: "Feedback",
    admin: "Admin",
    
    // Feedback Page
    leaveAnonymousFeedback: "Leave Anonymous Feedback",
    feedbackDescription: "Your honest feedback helps us improve. Share your experience with us completely anonymously.",
    selectStore: "Select Store",
    chooseStore: "Choose a store...",
    rating: "Rating (Optional)",
    poor: "Poor",
    fair: "Fair",
    good: "Good",
    veryGood: "Very Good",
    excellent: "Excellent",
    yourFeedback: "Your Feedback",
    feedbackPlaceholder: "Tell us about your experience...",
    characters: "characters",
    submitFeedback: "Submit Feedback",
    submitting: "Submitting...",
    feedbackSubmitted: "Feedback Submitted!",
    thankYouImprove: "Thank you for helping us improve.",
    feedbackAnonymous: "🔒 Your feedback is completely anonymous and secure.",
    
    // Toast messages
    selectStoreAndFeedback: "Please select a store and write your feedback",
    thankYouFeedback: "Thank you for your feedback!",
    feedbackSubmittedSuccessfully: "Your anonymous review has been submitted successfully.",
    
    // Admin - Stores
    stores: "Stores",
    addStore: "Add Store",
    storeName: "Store Name",
    location: "Location",
    added: "Added",
    edit: "Edit",
    delete: "Delete",
    storeAdded: "Store added successfully",
    storeUpdated: "Store updated successfully",
    storeDeleted: "Store deleted successfully",
    
    // Admin - Store Modal
    editStore: "Edit Store",
    addNewStore: "Add New Store",
    storeNamePlaceholder: "e.g., Downtown Store",
    locationPlaceholder: "e.g., 123 Main St, City",
    cancel: "Cancel",
    update: "Update",
    add: "Add",
    store: "Store",
    
    // Admin - Reviews
    reviews: "Reviews",
    comment: "Comment",
    date: "Date",
    
    // Admin - Settings
    settings: "Settings",
    integrationSettings: "Integration Settings",
    webhookUrl: "Webhook URL",
    webhookDescription: "Endpoint to receive feedback notifications",
    notificationEmail: "Notification Email",
    emailDescription: "Email address for review notifications",
    reviewSettings: "Review Settings",
    autoApproveReviews: "Auto-Approve Reviews",
    autoApproveDescription: "Automatically publish submitted reviews",
    minRatingThreshold: "Minimum Rating Threshold",
    minRatingDescription: "Minimum rating to display publicly",
    saveSettings: "Save Settings",
    settingsSaved: "Settings saved successfully",
    
    // Admin Dashboard
    adminDashboard: "Admin Dashboard",
    manageStoresReviews: "Manage stores, reviews, and settings",
    
    // Mock stores
    downtownStore: "Downtown Store",
    westsideLocation: "Westside Location",
    airportBranch: "Airport Branch",
    northgateMall: "Northgate Mall",
  },
  he: {
    // Navigation
    feedbackHub: "מרכז משובים",
    feedback: "משוב",
    admin: "ניהול",
    
    // Feedback Page
    leaveAnonymousFeedback: "השאירו משוב אנונימי",
    feedbackDescription: "המשוב הכן שלכם עוזר לנו להשתפר. שתפו את החוויה שלכם באופן אנונימי לחלוטין.",
    selectStore: "בחירת חנות",
    chooseStore: "בחרו חנות...",
    rating: "דירוג (אופציונלי)",
    poor: "גרוע",
    fair: "בסדר",
    good: "טוב",
    veryGood: "טוב מאוד",
    excellent: "מצוין",
    yourFeedback: "המשוב שלכם",
    feedbackPlaceholder: "ספרו לנו על החוויה שלכם...",
    characters: "תווים",
    submitFeedback: "שלח משוב",
    submitting: "שולח...",
    feedbackSubmitted: "המשוב נשלח!",
    thankYouImprove: "תודה שעזרתם לנו להשתפר.",
    feedbackAnonymous: "🔒 המשוב שלכם אנונימי ומאובטח לחלוטין.",
    
    // Toast messages
    selectStoreAndFeedback: "אנא בחרו חנות וכתבו את המשוב שלכם",
    thankYouFeedback: "תודה על המשוב!",
    feedbackSubmittedSuccessfully: "הביקורת האנונימית שלכם נשלחה בהצלחה.",
    
    // Admin - Stores
    stores: "חנויות",
    addStore: "הוסף חנות",
    storeName: "שם החנות",
    location: "מיקום",
    added: "נוסף",
    edit: "ערוך",
    delete: "מחק",
    storeAdded: "החנות נוספה בהצלחה",
    storeUpdated: "החנות עודכנה בהצלחה",
    storeDeleted: "החנות נמחקה בהצלחה",
    
    // Admin - Store Modal
    editStore: "ערוך חנות",
    addNewStore: "הוסף חנות חדשה",
    storeNamePlaceholder: "לדוגמה: חנות מרכז העיר",
    locationPlaceholder: "לדוגמה: רחוב ראשי 123, עיר",
    cancel: "ביטול",
    update: "עדכן",
    add: "הוסף",
    store: "חנות",
    
    // Admin - Reviews
    reviews: "ביקורות",
    comment: "תגובה",
    date: "תאריך",
    
    // Admin - Settings
    settings: "הגדרות",
    integrationSettings: "הגדרות אינטגרציה",
    webhookUrl: "כתובת Webhook",
    webhookDescription: "נקודת קצה לקבלת התראות משוב",
    notificationEmail: "אימייל להתראות",
    emailDescription: "כתובת אימייל להתראות ביקורות",
    reviewSettings: "הגדרות ביקורות",
    autoApproveReviews: "אישור אוטומטי לביקורות",
    autoApproveDescription: "פרסם ביקורות שהוגשו באופן אוטומטי",
    minRatingThreshold: "סף דירוג מינימלי",
    minRatingDescription: "דירוג מינימלי להצגה ציבורית",
    saveSettings: "שמור הגדרות",
    settingsSaved: "ההגדרות נשמרו בהצלחה",
    
    // Admin Dashboard
    adminDashboard: "לוח בקרה ניהולי",
    manageStoresReviews: "ניהול חנויות, ביקורות והגדרות",
    
    // Mock stores
    downtownStore: "חנות מרכז העיר",
    westsideLocation: "סניף מערב העיר",
    airportBranch: "סניף שדה התעופה",
    northgateMall: "קניון צפון השער",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    // Apply RTL/LTR to document
    document.documentElement.dir = language === "he" ? "rtl" : "ltr";
    document.documentElement.lang = language;
    
    // Also set on body for better compatibility
    document.body.dir = language === "he" ? "rtl" : "ltr";
    document.body.lang = language;
    
    // Force a re-render of the page to ensure RTL/LTR changes take effect
    document.documentElement.setAttribute('data-lang', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
    isRTL: language === "he",
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
