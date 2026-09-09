"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Edit2, FolderPlus, Trash2 } from "lucide-react";
import { Category } from "../types";
import { ICON_MAP } from "./IconPicker";

interface CategoryListProps {
  categories: Category[];
  isLoading?: boolean;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onCreateNew: () => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  isLoading = false,
  onEdit,
  onDelete,
  onCreateNew,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <EmptyState
        icon={<FolderPlus className="w-8 h-8 text-muted-foreground" />}
        title="No categories found"
        description="Create categories to categorize your income and expenses."
        action={
          <Button onClick={onCreateNew} leftIcon={<FolderPlus className="w-4 h-4" />}>
            Create Category
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden border border-border rounded-xl bg-surface shadow-xs">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground">
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.map((cat) => {
              const IconComp = cat.icon ? ICON_MAP[cat.icon] || FolderPlus : FolderPlus;
              return (
                <tr key={cat.id} className="hover:bg-accent/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-medium shadow-xs"
                        style={{ backgroundColor: cat.color || "var(--primary)" }}
                      >
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-semibold text-foreground">{cat.name}</span>
                        {cat.isDefault && (
                          <span className="ml-2 text-[10px] uppercase font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={cat.type === "INCOME" ? "success" : "danger"}>
                      {cat.type}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(cat)}
                        aria-label={`Edit ${cat.name}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(cat)}
                        className="text-danger hover:text-danger hover:bg-danger/10"
                        aria-label={`Delete ${cat.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {categories.map((cat) => {
          const IconComp = cat.icon ? ICON_MAP[cat.icon] || FolderPlus : FolderPlus;
          return (
            <div
              key={cat.id}
              className="p-4 border border-border rounded-xl bg-surface flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-medium shadow-xs"
                  style={{ backgroundColor: cat.color || "var(--primary)" }}
                >
                  <IconComp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">{cat.name}</h4>
                  <Badge
                    variant={cat.type === "INCOME" ? "success" : "danger"}
                    className="mt-1"
                  >
                    {cat.type}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => onEdit(cat)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(cat)}
                  className="text-danger"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
