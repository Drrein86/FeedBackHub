import { useState } from "react";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import StoresList from "@/components/admin/StoresList";
import ReviewsTable from "@/components/admin/ReviewsTable";
import SettingsPanel from "@/components/admin/SettingsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, MessageSquare, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("stores");
  const { t, language } = useLanguage();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8" dir={language === "he" ? "rtl" : "ltr"}>
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-2">{t("adminDashboard")}</h1>
            <p className="text-muted-foreground">{t("manageStoresReviews")}</p>
          </div>

          {/* Tabs bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex bg-card border border-border rounded-lg p-1 gap-1">
                <button
                  onClick={() => setActiveTab("stores")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    activeTab === "stores"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary"
                  }`}
                >
                  <Store className="h-4 w-4 shrink-0" />
                  <span>{t("stores")}</span>
                </button>

                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    activeTab === "reviews"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary"
                  }`}
                >
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span>{t("reviews")}</span>
                </button>

                <button
                  onClick={() => setActiveTab("settings")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    activeTab === "settings"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary"
                  }`}
                >
                  <Settings className="h-4 w-4 shrink-0" />
                  <span>{t("settings")}</span>
                </button>
            </div>
            
            {/* Add Store button - only show when stores tab is active */}
            {activeTab === "stores" && (
              <Button
                onClick={() => {
                  // This will need to be handled by the StoresList component
                  const event = new CustomEvent('openStoreModal');
                  window.dispatchEvent(event);
                }}
                className={`bg-gradient-primary hover:opacity-90 shadow-glow flex items-center gap-2 ${language === "he" ? "flex-row-reverse" : "flex-row"}`}
              >
                <Plus className="h-4 w-4 shrink-0" />
                <span>{t("addStore")}</span>
              </Button>
            )}
          </div>

          {/* Content */}
          {activeTab === "stores" && <StoresList />}
          {activeTab === "reviews" && <ReviewsTable />}
          {activeTab === "settings" && <SettingsPanel />}

        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Admin;
