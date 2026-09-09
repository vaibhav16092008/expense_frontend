"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Category, CategoryType, CreateCategoryPayload } from "../types";
import { DEFAULT_COLORS, IconPicker } from "./IconPicker";

interface CategoryFormProps {
  initialData?: Partial<Category>;
  onSubmit: (data: CreateCategoryPayload) => Promise<void> | void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [type, setType] = useState<CategoryType>(initialData?.type || "EXPENSE");
  const [color, setColor] = useState(initialData?.color || DEFAULT_COLORS[0]);
  const [icon, setIcon] = useState(initialData?.icon || "Tag");
  const [errors, setErrors] = useState<{ name?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrors({ name: "Category name is required" });
      return;
    }
    setErrors({});
    await onSubmit({
      name: name.trim(),
      type,
      color,
      icon,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Category Name"
        placeholder="e.g. Groceries, Salary, Subscriptions"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        required
      />

      <Select
        label="Category Type"
        value={type}
        onChange={(e) => setType(e.target.value as CategoryType)}
        options={[
          { label: "Expense", value: "EXPENSE" },
          { label: "Income", value: "INCOME" },
        ]}
        required
      />

      <div className="space-y-2">
        <label className="text-xs font-semibold text-[var(--text-secondary)]">Color Accent</label>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-7 h-7 rounded-full border-2 transition-transform ${
                color === c ? "scale-110 border-foreground ring-2 ring-primary/40" : "border-transparent hover:scale-105"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-[var(--text-secondary)]">Select Icon</label>
        <IconPicker value={icon} onChange={(iconName) => setIcon(iconName)} />
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData?.id ? "Update Category" : "Create Category"}
        </Button>
      </div>
    </form>
  );
};
