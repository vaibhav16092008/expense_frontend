export type Theme = "light" | "dark" | "system";

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string | number;
  exact?: boolean;
}

export interface NavGroup {
  groupName: string;
  items: NavItem[];
}
