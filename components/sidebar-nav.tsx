"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Truck,
  Settings,
  FileText,
} from "lucide-react";


const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: "Purchase Requests",
    href: "/dashboard/purchase-requests",
    icon: FileText,
    exact: false,
  },
  {
    name: "Manage Team",
    href: "/dashboard/team",
    icon: Users,
    exact: false,
  },
  {
    name: "Vendors",
    href: "/dashboard/vendors",
    icon: Truck,
    exact: false,
  },
  {
    name: "Settings",
    href: "#", // Placeholder
    icon: Settings,
    exact: false,
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
      <div className="px-3 mb-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Main Menu
        </p>
      </div>

      {navItems.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href) && item.href !== "#";

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium group transition-all duration-200 border ${
              isActive
                ? "bg-indigo-50/80 text-indigo-700 border-indigo-100 hover:shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent"
            }`}
          >
            <item.icon
              className={`w-5 h-5 transition-transform duration-200 ${
                isActive
                  ? "text-indigo-600 group-hover:scale-110"
                  : "text-gray-400 group-hover:text-gray-600"
              }`}
            />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
