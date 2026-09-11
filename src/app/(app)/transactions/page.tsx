"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { exportTransactions } from "@/features/transactions/api";
import { DeleteTransactionDialog } from "@/features/transactions/components/DeleteTransactionDialog";
import { Pagination } from "@/features/transactions/components/Pagination";
import { TransactionDetails } from "@/features/transactions/components/TransactionDetails";
import { TransactionFilters } from "@/features/transactions/components/TransactionFilters";
import { TransactionForm } from "@/features/transactions/components/TransactionForm";
import { TransactionList } from "@/features/transactions/components/TransactionList";
import { OfflineTransactionsList } from "@/components/offline/OfflineTransactionsList";
import {
  useCreateTransaction,
  useDeleteTransaction,
  useTransactions,
  useUpdateTransaction,
} from "@/features/transactions/hooks/useTransactions";
import { Transaction, TransactionFilters as FilterType } from "@/features/transactions/types";
import { useToast } from "@/providers/ToastProvider";
import { Download, PlusCircle } from "lucide-react";

export default function TransactionsPage() {
  const { toast } = useToast();

  // State
  const [filters, setFilters] = useState<FilterType>({ page: 1, limit: 10 });
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deletingTx, setDeletingTx] = useState<Transaction | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Queries & Mutations
  const { data: txResponse, isLoading: isTxLoading } = useTransactions(filters);
  const { data: categories = [] } = useCategories();
  const createTxMutation = useCreateTransaction();
  const updateTxMutation = useUpdateTransaction();
  const deleteTxMutation = useDeleteTransaction();

  // Handlers
  const handleFilterChange = (updated: Partial<FilterType>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({ page: 1, limit: 10 });
  };

  const handleCreateOrUpdate = async (payload: Parameters<typeof createTxMutation.mutateAsync>[0]) => {
    try {
      if (editingTx) {
        await updateTxMutation.mutateAsync({ id: editingTx.id, payload });
        toast({ type: "success", title: "Transaction updated" });
      } else {
        const result = await createTxMutation.mutateAsync(payload);
        if (result.isOffline) {
          toast({
            type: "info",
            title: "Saved Offline",
            description: "The transaction was saved on this device and will sync when you're back online.",
          });
        } else {
          toast({ type: "success", title: "Transaction created" });
        }
      }
      setIsFormModalOpen(false);
      setEditingTx(null);
    } catch (err: unknown) {
      const description = err instanceof Error ? err.message : "An error occurred";
      toast({ type: "error", title: "Error saving transaction", description });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTx) return;
    try {
      await deleteTxMutation.mutateAsync(deletingTx.id);
      toast({ type: "success", title: "Transaction deleted" });
      setDeletingTx(null);
    } catch (err: unknown) {
      const description = err instanceof Error ? err.message : "Failed to delete";
      toast({ type: "error", title: "Error", description });
    }
  };

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      const blob = await exportTransactions(filters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `transactions_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast({ type: "success", title: "Export downloaded successfully" });
    } catch (err: unknown) {
      const description = err instanceof Error ? err.message : "Export failed";
      toast({ type: "error", title: "Export Failed", description });
    } finally {
      setIsExporting(false);
    }
  };

  const handleViewTx = useCallback((tx: Transaction) => {
    setSelectedTx(tx);
    setIsDetailModalOpen(true);
  }, []);

  const handleEditTx = useCallback((tx: Transaction) => {
    setEditingTx(tx);
    setIsFormModalOpen(true);
  }, []);

  const handleDeleteTx = useCallback((tx: Transaction) => {
    setDeletingTx(tx);
  }, []);

  const handleCreateNewTx = useCallback(() => {
    setEditingTx(null);
    setIsFormModalOpen(true);
  }, []);

  const transactionsList = useMemo(() => txResponse?.data || [], [txResponse?.data]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Transactions
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            View, filter, search, and manage all your income and expense transactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            isLoading={isExporting}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export CSV
          </Button>
          <Button
            size="sm"
            onClick={handleCreateNewTx}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Filter toolbar */}
      <TransactionFilters
        filters={filters}
        categories={categories}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Transactions list & pagination */}
      <div className="space-y-4">
        {/* Offline local queue items section */}
        <OfflineTransactionsList categories={categories} />

        <TransactionList
          transactions={transactionsList}
          isLoading={isTxLoading}
          onView={handleViewTx}
          onEdit={handleEditTx}
          onDelete={handleDeleteTx}
          onCreateNew={handleCreateNewTx}
        />

        {txResponse?.meta && (
          <Pagination
            page={txResponse.meta.page}
            totalPages={txResponse.meta.totalPages}
            total={txResponse.meta.total}
            limit={txResponse.meta.limit}
            onPageChange={(p) => handleFilterChange({ page: p })}
          />
        )}
      </div>

      {/* Form Modal (Add / Edit) */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingTx(null);
        }}
        title={editingTx ? "Edit Transaction" : "Add Transaction"}
        size="md"
      >
        <TransactionForm
          initialData={editingTx || undefined}
          categories={categories}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => {
            setIsFormModalOpen(false);
            setEditingTx(null);
          }}
          isLoading={createTxMutation.isPending || updateTxMutation.isPending}
        />
      </Modal>

      {/* Detail Viewer Modal */}
      <TransactionDetails
        transaction={selectedTx}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedTx(null);
        }}
        onEdit={(tx) => {
          setEditingTx(tx);
          setIsFormModalOpen(true);
        }}
        onDelete={(tx) => setDeletingTx(tx)}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteTransactionDialog
        transaction={deletingTx}
        isOpen={Boolean(deletingTx)}
        onClose={() => setDeletingTx(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteTxMutation.isPending}
      />
    </div>
  );
}
