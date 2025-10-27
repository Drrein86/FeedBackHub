import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Store } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface StoreSelectProps {
  value: string;
  onChange: (value: string) => void;
  stores: { id: string; name: string; }[];
  isLoading?: boolean;
}

const StoreSelect = ({ value, onChange, stores, isLoading = false }: StoreSelectProps) => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center space-x-2 rtl:space-x-reverse">
        <Store className="h-4 w-4 text-primary" />
        <span>{t("selectStore")}</span>
      </label>
      <Select value={value} onValueChange={onChange} dir={isRTL ? "rtl" : "ltr"} disabled={isLoading}>
        <SelectTrigger className="w-full bg-input border-border hover:border-primary transition-smooth">
          <SelectValue placeholder={isLoading ? "Loading stores..." : t("chooseStore")} />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border">
          {stores.map((store) => (
            <SelectItem key={store.id} value={store.id}>
              {store.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StoreSelect;
