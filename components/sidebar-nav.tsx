"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Truck,
  Settings,
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
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        exact: true,
      },
    ],
  },
  {
    title: "Procurement",
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
        title: "Invoices",
        href: "/dashboard/invoices",
        icon: Receipt,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Manage Team",
        href: "/dashboard/team",
        icon: Users,
      },
      {
        title: "Vendors",
        href: "/dashboard/vendors",
        icon: Truck,
      },
    ],
  },
  {
    title: "Analytics",
    items: [
      {
        title: "Reports",
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
  {
    title: "System",
    items: [
      {
        title: "Settings",
        href: "#", // Placeholder as per original
        icon: Settings,
      },
    ],
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto scrollbar-hide">
      {navSections.map((section, sectionIdx) => (
        <div key={sectionIdx} className="space-y-2">
          {section.title && (
            <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {section.title}
            </h3>
          )}
          <div className="space-y-1">
            {section.items.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href) && item.href !== "#";

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
                    isActive
                      ? "bg-emerald-50 text-emerald-900 shadow-sm ring-1 ring-emerald-100"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100",
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 shrink-0 transition-colors duration-200",
                      isActive
                        ? "text-emerald-600"
                        : "text-gray-400 group-hover:text-gray-600",
                    )}
                  />
                  <span>{item.title}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
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
