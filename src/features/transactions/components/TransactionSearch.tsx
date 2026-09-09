"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Search, X } from "lucide-react";

interface TransactionSearchProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export const TransactionSearch: React.FC<TransactionSearchProps> = ({
  value,
  onChange,
  placeholder = "Search transactions...",
  debounceMs = 300,
}) => {
  const [searchTerm, setSearchTerm] = useState(value);

  // Debounce notification back to parent
  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(searchTerm);
    }, debounceMs);
    return () => clearTimeout(handler);
  }, [searchTerm, onChange, debounceMs]);

  return (
    <Input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder={placeholder}
      leftElement={<Search className="w-4 h-4" />}
      rightElement={
        searchTerm ? (
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              onChange("");
            }}
            className="hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null
      }
      className="max-w-xs"
    />
  );
};
