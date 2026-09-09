"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { DEFAULT_COLORS } from "@/features/categories/components/IconPicker";
import { formatCurrency } from "@/utils/formatting/currency";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CategorySpending } from "../types";

interface CategorySpendingChartProps {
  data: CategorySpending[];
  isLoading?: boolean;
}

export const CategorySpendingChart: React.FC<CategorySpendingChartProps> = ({
  data,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Card className="h-80">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="h-60">
          <Skeleton className="h-full w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full min-h-[340px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold">Category Breakdown</CardTitle>
        <p className="text-xs text-muted-foreground">Top spending by category</p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between pt-2">
        {data.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
            No category spending recorded
          </div>
        ) : (
          <>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="amount"
                    nameKey="categoryName"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--border)",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                    formatter={(value: unknown) => [formatCurrency(Number(value || 0)), "Amount"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Legend */}
            <div className="space-y-2 mt-2 pt-2 border-t border-border">
              {data.slice(0, 4).map((item, idx) => (
                <div key={item.categoryId || idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate max-w-[140px]">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{
                        backgroundColor: item.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
                      }}
                    />
                    <span className="font-medium text-foreground truncate">{item.categoryName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">
                      {formatCurrency(item.amount)}
                    </span>
                    <span className="text-muted-foreground text-[10px]">
                      ({item.percentage.toFixed(0)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
