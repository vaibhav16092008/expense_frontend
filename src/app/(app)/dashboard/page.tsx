"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { BudgetOverviewCard } from "@/features/dashboard/components/BudgetOverviewCard";
import { CashFlowChart } from "@/features/dashboard/components/CashFlowChart";
import { CategorySpendingChart } from "@/features/dashboard/components/CategorySpendingChart";
import { GoalsSummaryCard } from "@/features/dashboard/components/GoalsSummaryCard";
import { RecentTransactions } from "@/features/dashboard/components/RecentTransactions";
import { SummaryCards } from "@/features/dashboard/components/SummaryCards";
import {
  useBudgetOverview,
  useCategorySpending,
  useDashboardSummary,
  useGoalSummary,
  useMonthlyData,
} from "@/features/dashboard/hooks/useDashboard";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { TransactionForm } from "@/features/transactions/components/TransactionForm";
import { useCreateTransaction, useTransactions } from "@/features/transactions/hooks/useTransactions";
import { useOfflineQueueStatus } from "@/hooks/useOfflineQueueStatus";
import { useToast } from "@/providers/ToastProvider";
import { PlusCircle, CloudOff } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { toast } = useToast();
  const { pendingCount } = useOfflineQueueStatus();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Queries
  const { data: summary, isLoading: isSummaryLoading } = useDashboardSummary();
  const { data: monthlyData = [], isLoading: isMonthlyLoading } = useMonthlyData(6);
  const { data: categorySpending = [], isLoading: isCategoriesLoading } = useCategorySpending();
  const { data: budget, isLoading: isBudgetLoading } = useBudgetOverview();
  const { data: goals, isLoading: isGoalsLoading } = useGoalSummary();
  const { data: txResponse, isLoading: isTxLoading } = useTransactions({ limit: 5 });
  const { data: categories = [] } = useCategories();

  // Mutations
  const createTxMutation = useCreateTransaction();

  const handleCreateTransaction = async (payload: Parameters<typeof createTxMutation.mutateAsync>[0]) => {
    try {
      const result = await createTxMutation.mutateAsync(payload);
      if (result.isOffline) {
        toast({
          type: "info",
          title: "Saved Offline",
          description: "The transaction was saved on this device and will sync when you're back online.",
        });
      } else {
        toast({ type: "success", title: "Transaction added successfully" });
      }
      setIsAddModalOpen(false);
    } catch (err: unknown) {
      const description = err instanceof Error ? err.message : "Failed to create transaction";
      toast({ type: "error", title: "Error", description });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Financial Dashboard
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Overview of your cash flow, top spending categories, and financial health.
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<PlusCircle className="w-4 h-4" />}
          size="sm"
        >
          Add Transaction
        </Button>
      </div>

      {/* Offline Pending Activity Indicator */}
      {pendingCount > 0 && (
        <div className="flex items-center justify-between p-3.5 rounded-[var(--radius-md)] bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-medium animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <CloudOff className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong className="font-semibold">Offline activity:</strong> {pendingCount} transaction{pendingCount > 1 ? "s" : ""} waiting to sync.
            </span>
          </div>
          <Link href="/transactions" className="font-semibold underline hover:text-amber-900 dark:hover:text-amber-100 transition-colors">
            View pending
          </Link>
        </div>
      )}

      {/* Metric Cards */}
      <SummaryCards summary={summary} isLoading={isSummaryLoading} />

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CashFlowChart data={monthlyData} isLoading={isMonthlyLoading} />
        </div>
        <div>
          <CategorySpendingChart data={categorySpending} isLoading={isCategoriesLoading} />
        </div>
      </div>

      {/* Secondary Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BudgetOverviewCard budget={budget} isLoading={isBudgetLoading} />
        <GoalsSummaryCard goals={goals} isLoading={isGoalsLoading} />
        <RecentTransactions transactions={txResponse?.data || []} isLoading={isTxLoading} />
      </div>

      {/* Add Transaction Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Transaction"
        size="md"
      >
        <TransactionForm
          categories={categories}
          onSubmit={handleCreateTransaction}
          onCancel={() => setIsAddModalOpen(false)}
          isLoading={createTxMutation.isPending}
        />
      </Modal>
    </div>
  );
}
