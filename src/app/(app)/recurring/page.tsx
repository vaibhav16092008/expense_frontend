"use client";

import React, { useState } from "react";
import {
  CreateRecurringTransactionPayload,
  RecurringFilters,
  RecurringTransaction,
  UpdateRecurringTransactionPayload,
} from "@/features/recurring/types";
import {
  useCreateRecurringTransaction,
  useDeleteRecurringTransaction,
  usePauseRecurringTransaction,
  useRecurringTransactions,
  useResumeRecurringTransaction,
  useUpdateRecurringTransaction,
} from "@/features/recurring/hooks/useRecurringTransactions";
import { RecurringSummaryHeader } from "@/features/recurring/components/RecurringSummaryHeader";
import { RecurringList } from "@/features/recurring/components/RecurringList";
import { RecurringFormModal } from "@/features/recurring/components/RecurringFormModal";
import { RecurringDetailsModal } from "@/features/recurring/components/RecurringDetailsModal";
import { DeleteRecurringDialog } from "@/features/recurring/components/DeleteRecurringDialog";
import { useToast } from "@/providers/ToastProvider";
import { Button } from "@/components/ui/Button";
import { Plus, Repeat } from "lucide-react";

function getErrorMessage(err: unknown): string {
  if (typeof err === "object" && err !== null && "response" in err) {
    const res = (err as { response?: { data?: { message?: string } } }).response;
    if (res?.data?.message) {
      return res.data.message;
    }
  }
  if (err instanceof Error) {
    return err.message;
  }
  return "An unexpected error occurred";
}

export default function RecurringPage() {
  const toast = useToast();

  const [filters, setFilters] = useState<RecurringFilters>({
    page: 1,
    limit: 20,
    sortBy: "nextRunAt",
    sortOrder: "asc",
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecurring, setEditingRecurring] = useState<RecurringTransaction | null>(null);
  const [detailsRecurring, setDetailsRecurring] = useState<RecurringTransaction | null>(null);
  const [deletingRecurring, setDeletingRecurring] = useState<RecurringTransaction | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Queries & Mutations
  const { data: response, isLoading, isError, refetch } = useRecurringTransactions(filters);
  const createMutation = useCreateRecurringTransaction();
  const updateMutation = useUpdateRecurringTransaction();
  const deleteMutation = useDeleteRecurringTransaction();
  const pauseMutation = usePauseRecurringTransaction();
  const resumeMutation = useResumeRecurringTransaction();

  const transactions = response?.data || [];
  const pagination = response?.pagination || {
    page: 1,
    limit: 20,
    totalCount: 0,
    totalPages: 1,
    hasMore: false,
  };

  const handleOpenCreate = () => {
    setEditingRecurring(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (recurring: RecurringTransaction) => {
    setEditingRecurring(recurring);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingRecurring(null);
  };

  const handleCreate = async (payload: CreateRecurringTransactionPayload) => {
    try {
      await createMutation.mutateAsync(payload);
      toast.success("Recurring Schedule Created", "The new recurring transaction has been scheduled.");
      handleCloseForm();
    } catch (err) {
      toast.error("Failed to Create Schedule", getErrorMessage(err));
    }
  };

  const handleUpdate = async (id: string, payload: UpdateRecurringTransactionPayload) => {
    try {
      await updateMutation.mutateAsync({ id, payload });
      toast.success("Schedule Updated", "The recurring transaction parameters have been saved.");
      handleCloseForm();
    } catch (err) {
      toast.error("Failed to Update Schedule", getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    if (!deletingRecurring) return;
    try {
      await deleteMutation.mutateAsync(deletingRecurring.id);
      toast.success("Schedule Deleted", "The recurring schedule was removed.");
      setDeletingRecurring(null);
    } catch (err) {
      toast.error("Failed to Delete Schedule", getErrorMessage(err));
    }
  };

  const handlePause = async (recurring: RecurringTransaction) => {
    try {
      setActionLoadingId(recurring.id);
      await pauseMutation.mutateAsync(recurring.id);
      toast.success("Schedule Paused", "The recurring schedule will not run until resumed.");
    } catch (err) {
      toast.error("Failed to Pause Schedule", getErrorMessage(err));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleResume = async (recurring: RecurringTransaction) => {
    try {
      setActionLoadingId(recurring.id);
      await resumeMutation.mutateAsync(recurring.id);
      toast.success("Schedule Resumed", "The recurring schedule is now active.");
    } catch (err) {
      toast.error("Failed to Resume Schedule", getErrorMessage(err));
    } finally {
      setActionLoadingId(null);
    }
  };

  const isFiltered = Boolean(
    filters.active !== undefined ||
      filters.type ||
      filters.frequency ||
      filters.categoryId ||
      filters.startDate ||
      filters.endDate
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Repeat className="w-6 h-6 text-[var(--primary)] shrink-0" />
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Recurring Transactions
            </h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Manage automated schedules for your regular income, bills, and subscriptions.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenCreate}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New Schedule
        </Button>
      </div>

      {/* Aggregate Metrics Header */}
      <RecurringSummaryHeader
        transactions={transactions}
        totalCount={pagination.totalCount}
        isFiltered={isFiltered}
      />

      {/* Main Recurring List Area */}
      <RecurringList
        transactions={transactions}
        pagination={pagination}
        filters={filters}
        onFilterChange={setFilters}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        onOpenCreate={handleOpenCreate}
        onEdit={handleOpenEdit}
        onDelete={(rec) => setDeletingRecurring(rec)}
        onDetails={(rec) => setDetailsRecurring(rec)}
        onPause={handlePause}
        onResume={handleResume}
        actionLoadingId={actionLoadingId}
      />

      {/* Create / Edit Form Modal */}
      <RecurringFormModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmitCreate={handleCreate}
        onSubmitUpdate={handleUpdate}
        initialData={editingRecurring}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* View Details Modal */}
      <RecurringDetailsModal
        isOpen={Boolean(detailsRecurring)}
        onClose={() => setDetailsRecurring(null)}
        recurring={detailsRecurring}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteRecurringDialog
        isOpen={Boolean(deletingRecurring)}
        onClose={() => setDeletingRecurring(null)}
        onConfirm={handleDelete}
        recurring={deletingRecurring}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
