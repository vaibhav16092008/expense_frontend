"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { CategoryForm } from "@/features/categories/components/CategoryForm";
import { CategoryList } from "@/features/categories/components/CategoryList";
import { DeleteCategoryDialog } from "@/features/categories/components/DeleteCategoryDialog";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/features/categories/hooks/useCategories";
import { Category, CategoryType } from "@/features/categories/types";
import { useToast } from "@/providers/ToastProvider";
import { FolderPlus } from "lucide-react";

export default function CategoriesPage() {
  const { toast } = useToast();

  // State
  const [activeTab, setActiveTab] = useState<CategoryType | "ALL">("ALL");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // Queries & Mutations
  const { data: categories = [], isLoading } = useCategories(
    activeTab === "ALL" ? undefined : activeTab
  );
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  // Handlers
  const handleCreateOrUpdate = async (payload: Parameters<typeof createCategoryMutation.mutateAsync>[0]) => {
    try {
      if (editingCategory) {
        await updateCategoryMutation.mutateAsync({ id: editingCategory.id, payload });
        toast({ type: "success", title: "Category updated successfully" });
      } else {
        await createCategoryMutation.mutateAsync(payload);
        toast({ type: "success", title: "Category created successfully" });
      }
      setIsFormModalOpen(false);
      setEditingCategory(null);
    } catch (err: unknown) {
      const description = err instanceof Error ? err.message : "Failed to save category";
      toast({ type: "error", title: "Error", description });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;
    try {
      await deleteCategoryMutation.mutateAsync(deletingCategory.id);
      toast({ type: "success", title: "Category deleted" });
      setDeletingCategory(null);
    } catch (err: unknown) {
      const description = err instanceof Error ? err.message : "Failed to delete category";
      toast({ type: "error", title: "Error", description });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Category Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Organize your transactions with custom categories, icons, and colors.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingCategory(null);
            setIsFormModalOpen(true);
          }}
          leftIcon={<FolderPlus className="w-4 h-4" />}
          size="sm"
        >
          Add Category
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        {(["ALL", "EXPENSE", "INCOME"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === tab
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            {tab === "ALL" ? "All Categories" : tab === "EXPENSE" ? "Expense Categories" : "Income Categories"}
          </button>
        ))}
      </div>

      {/* Category List */}
      <CategoryList
        categories={categories}
        isLoading={isLoading}
        onEdit={(cat) => {
          setEditingCategory(cat);
          setIsFormModalOpen(true);
        }}
        onDelete={(cat) => setDeletingCategory(cat)}
        onCreateNew={() => {
          setEditingCategory(null);
          setIsFormModalOpen(true);
        }}
      />

      {/* Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingCategory(null);
        }}
        title={editingCategory ? "Edit Category" : "Create Category"}
        size="md"
      >
        <CategoryForm
          initialData={editingCategory || undefined}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => {
            setIsFormModalOpen(false);
            setEditingCategory(null);
          }}
          isLoading={createCategoryMutation.isPending || updateCategoryMutation.isPending}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <DeleteCategoryDialog
        category={deletingCategory}
        isOpen={Boolean(deletingCategory)}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteCategoryMutation.isPending}
      />
    </div>
  );
}
