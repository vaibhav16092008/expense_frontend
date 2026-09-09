"use client";

import React from "react";
import Link from "next/link";
import { Dropdown, DropdownItem, DropdownDivider } from "@/components/ui/Dropdown";
import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { User, Settings, LogOut, Sun, Moon } from "lucide-react";

export function UserMenu() {
  const { user, logout } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();

  const userDisplayName = user?.fullName || user?.email?.split("@")[0] || "Account";
  const userEmail = user?.email || "user@expenseiq.app";
  const avatarInitial = userDisplayName.charAt(0).toUpperCase();

  return (
    <Dropdown
      align="right"
      trigger={
        <button
          className="flex items-center gap-2.5 p-1.5 rounded-[var(--radius-md)] hover:bg-[var(--surface-secondary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          aria-label="User account menu"
        >
          <div className="w-8 h-8 rounded-full bg-[var(--primary-muted)] text-[var(--primary)] font-semibold text-xs flex items-center justify-center border border-[var(--primary)]/20">
            {avatarInitial}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-[var(--text-primary)] leading-tight">
              {userDisplayName}
            </span>
            <span className="text-[11px] text-[var(--text-muted)] leading-tight">{userEmail}</span>
          </div>
        </button>
      }
    >
      <div className="px-3 py-2 border-b border-[var(--border-subtle)]">
        <p className="text-xs font-semibold text-[var(--text-primary)]">{userDisplayName}</p>
        <p className="text-[11px] text-[var(--text-muted)] truncate">{userEmail}</p>
      </div>

      <Link href="/profile">
        <DropdownItem>
          <User className="w-4 h-4 text-[var(--text-muted)]" />
          Profile
        </DropdownItem>
      </Link>

      <Link href="/settings">
        <DropdownItem>
          <Settings className="w-4 h-4 text-[var(--text-muted)]" />
          Settings
        </DropdownItem>
      </Link>

      <DropdownItem onClick={toggleTheme}>
        {resolvedTheme === "dark" ? (
          <>
            <Sun className="w-4 h-4 text-[var(--warning)]" />
            Light Mode
          </>
        ) : (
          <>
            <Moon className="w-4 h-4 text-[var(--text-muted)]" />
            Dark Mode
          </>
        )}
      </DropdownItem>

      <DropdownDivider />

      <DropdownItem danger onClick={() => logout()}>
        <LogOut className="w-4 h-4" />
        Log out
      </DropdownItem>
    </Dropdown>
  );
}
