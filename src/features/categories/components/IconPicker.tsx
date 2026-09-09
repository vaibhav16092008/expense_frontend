"use client";

import React from "react";
import {
  Briefcase,
  Car,
  Coffee,
  CreditCard,
  DollarSign,
  Film,
  Fuel,
  Gift,
  GraduationCap,
  Heart,
  Home,
  Landmark,
  PiggyBank,
  Plane,
  Shield,
  ShoppingBag,
  Smartphone,
  Tag,
  Tv,
  Utensils,
  Wallet,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ShoppingBag,
  Utensils,
  Home,
  Car,
  Heart,
  Zap,
  Shield,
  Gift,
  Landmark,
  DollarSign,
  Wallet,
  CreditCard,
  Briefcase,
  GraduationCap,
  Plane,
  Tv,
  Coffee,
  Smartphone,
  Film,
  Fuel,
  Tag,
  PiggyBank,
};

export const AVAILABLE_ICONS = Object.keys(ICON_MAP);

export const DEFAULT_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#6366F1", // Indigo
  "#14B8A6", // Teal
  "#64748B", // Slate
];

interface IconPickerProps {
  value?: string;
  onChange: (iconName: string) => void;
}

export const IconPicker: React.FC<IconPickerProps> = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1 border rounded-md border-border bg-background">
      {AVAILABLE_ICONS.map((iconName) => {
        const IconComp = ICON_MAP[iconName];
        const isSelected = value === iconName;
        return (
          <button
            key={iconName}
            type="button"
            onClick={() => onChange(iconName)}
            className={cn(
              "flex flex-col items-center justify-center p-2.5 rounded-lg border transition-all hover:bg-accent",
              isSelected
                ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
            title={iconName}
          >
            <IconComp className="h-5 w-5" />
          </button>
        );
      })}
    </div>
  );
};
