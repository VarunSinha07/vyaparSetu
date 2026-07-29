"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Truck,
  FileText,
  ShoppingBag,
  ClipboardList,
  BarChart3,
  Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  exact?: boolean;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    items: [
      {
        title: "Overview",
        href: "/dashboard",
        icon: LayoutDashboard,
        exact: true,
      },
    ],
  },
  {
    title: "Procurement Workflows",
    items: [
      {
        title: "Purchase Requests",
        href: "/dashboard/purchase-requests",
        icon: FileText,
      },
      {
        title: "Purchase Orders",
        href: "/dashboard/purchase-orders",
        icon: ShoppingBag,
      },
      {
        title: "3-Way Invoices",
        href: "/dashboard/invoices",
        icon: Receipt,
      },
    ],
  },
  {
    title: "Directory & Access",
    items: [
      {
        title: "Vendor Registry",
        href: "/dashboard/vendors",
        icon: Truck,
      },
      {
        title: "Team & Roles",
        href: "/dashboard/team",
        icon: Users,
      },
    ],
  },
  {
    title: "Analytics & Compliance",
    items: [
      {
        title: "Spend Reports",
        href: "/dashboard/reports",
        icon: BarChart3,
      },
      {
        title: "Audit Logs",
        href: "/dashboard/audit-logs",
        icon: ClipboardList,
      },
    ],
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto scrollbar-hide">
      {navSections.map((section, sectionIdx) => (
        <div key={sectionIdx} className="space-y-1">
          {section.title && (
            <h3 className="px-3 text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">
              {section.title}
            </h3>
          )}
          <div className="space-y-0.5">
            {section.items.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href) && item.href !== "#";

              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 outline-none",
                    isActive
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs font-extrabold"
                      : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 active:bg-emerald-100",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-colors",
                      isActive ? "text-white" : "text-slate-400 group-hover:text-emerald-700",
                    )}
                  />
                  <span>{item.title}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
