import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Edit, Trash2, Store, Loader2 } from "lucide-react";
import StoreModal from "./StoreModal";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { apiClient } from "@/lib/api";

interface StoreType {
  id: string;
  name: string;
  location: string;
  createdAt: string;
  en?: { name: string; location: string };
  he?: { name: string; location: string };
}

const StoresList = () => {
  const { t, language } = useLanguage();

  const [stores, setStores] = useState<StoreType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<StoreType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load stores
  useEffect(() => {
    const loadStores = async () => {
      try {
        setIsLoading(true);
        const storesData = await apiClient.getStores(language);
        setStores(storesData);
      } catch (error) {
        console.error("Failed to load stores:", error);
        toast.error("Failed to load stores");
      } finally {
        setIsLoading(false);
      }
    };
    loadStores();
  }, [language]);

  // Listen for open store modal event from Admin page
  useEffect(() => {
    const handleOpenStoreModal = () => {
      setIsModalOpen(true);
    };

    window.addEventListener('openStoreModal', handleOpenStoreModal);
    return () => {
      window.removeEventListener('openStoreModal', handleOpenStoreModal);
    };
  }, []);

  const handleAddStore = async (storeData: {
    en: { name: string; location: string };
    he: { name: string; location: string };
  }) => {
    try {
      const newStore = (await apiClient.createStore({
        name: storeData[language].name,
        location: storeData[language].location,
        language,
      })) as StoreType;

      await apiClient.updateStore(newStore.id, {
        name: storeData[language === "en" ? "he" : "en"].name,
        location: storeData[language === "en" ? "he" : "en"].location,
        language: language === "en" ? "he" : "en",
      });

      setStores([newStore, ...stores]);
      toast.success(t("storeAdded"));
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create store:", error);
      toast.error("Failed to create store");
    }
  };

  const handleEditStore = async (storeData: {
    en: { name: string; location: string };
    he: { name: string; location: string };
  }) => {
    if (!editingStore) return;
    try {
      await apiClient.updateStore(editingStore.id, {
        name: storeData.en.name,
        location: storeData.en.location,
        language: "en",
      });

      await apiClient.updateStore(editingStore.id, {
        name: storeData.he.name,
        location: storeData.he.location,
        language: "he",
      });

      const storesData = await apiClient.getStores(language);
      setStores(storesData);

      toast.success(t("storeUpdated"));
      setEditingStore(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to update store:", error);
      toast.error("Failed to update store");
    }
  };

  const handleDeleteStore = async (id: string) => {
    try {
      await apiClient.deleteStore(id);
      setStores(stores.filter((s) => s.id !== id));
      toast.success(t("storeDeleted"));
    } catch (error) {
      console.error("Failed to delete store:", error);
      toast.error("Failed to delete store");
    }
  };

  const openEditModal = async (store: StoreType) => {
    try {
      const [enData, heData] = await Promise.all([
        apiClient.getStores("en").then((stores) => stores.find((s) => s.id === store.id)),
        apiClient.getStores("he").then((stores) => stores.find((s) => s.id === store.id)),
      ]);

      setEditingStore({
        ...store,
        en: enData || { name: store.name, location: store.location },
        he: heData || { name: store.name, location: store.location },
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to load store translations:", error);
      setEditingStore({
        ...store,
        en: { name: store.name, location: store.location },
        he: { name: store.name, location: store.location },
      });
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStore(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading stores...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" dir={language === "he" ? "rtl" : "ltr"}>

      {/* Stores Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stores.map((store) => (
          <Card
            key={store.id}
            className="p-6 bg-card border border-border hover:border-primary transition-smooth group"
          >
            <div className="space-y-4">
               {/* Header: icon + title + location */}
               <div className={`flex items-start gap-3 ${language === "he" ? "flex-row-reverse" : "flex-row"}`}>
                 <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                   <Store className="h-5 w-5 text-primary" />
                 </div>

                 <div className="flex-1 min-w-0">
                   <h3 className="font-semibold">{store.name}</h3>
                   <p className="text-sm text-muted-foreground">
                     {store.location}
                   </p>
                 </div>
               </div>

              {/* Footer: added date + actions */}
              <div className={`flex items-center justify-between pt-4 border-t border-border ${language === "he" ? "flex-row-reverse" : "flex-row"}`}>
                <span className={`text-xs text-muted-foreground ${language === "he" ? "text-right" : "text-left"}`}>
                  {t("added")}{" "}
                  {new Date(store.createdAt).toLocaleDateString(
                    language === "he" ? "he-IL" : "en-US"
                  )}
                </span>

                <div className={`flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${language === "he" ? "flex-row-reverse" : "flex-row"}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(store)}
                    className="hover:bg-secondary"
                    aria-label={t("edit")}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteStore(store.id)}
                    className="hover:bg-destructive/10 hover:text-destructive"
                    aria-label={t("delete")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <StoreModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingStore ? handleEditStore : handleAddStore}
        initialData={
          editingStore
            ? {
                en: editingStore.en || {
                  name: editingStore.name,
                  location: editingStore.location,
                },
                he: editingStore.he || {
                  name: editingStore.name,
                  location: editingStore.location,
                },
              }
            : null
        }
      />
    </div>
  );
};

export default StoresList;