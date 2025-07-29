"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Inbox,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "../../../lib/utils";
import { useTheme } from "@/lib/ThemeContext";

const navItems = [
  { label: "Dashboard", href: "/org/dashboard", icon: LayoutDashboard },
  { label: "My Forms", href: "/org/dashboard/forms", icon: FileText },
  { label: "Create New Form", href: "/org/dashboard/form-builder", icon: PlusCircle },
  { label: "Submissions", href: "/org/dashboard/submissions", icon: Inbox },
  { label: "Flows", href: "/org/dashboard/flows", icon: BarChart2 },
  { label: "Analytics", href: "/org/dashboard/analytics", icon: BarChart2 },
  { label: "Settings", href: "/org/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  // Dynamic org admin info
  const [orgAdmin, setOrgAdmin] = useState({ name: "", email: "" });
  const [orgName, setOrgName] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("orgEmail") || "admin@org.com";
    const name = localStorage.getItem("orgName") || "Org Admin";
    const orgNameFromStorage = localStorage.getItem("orgName") || "Organization";
    setOrgAdmin({ name, email });
    setOrgName(orgNameFromStorage);
  }, []);

  return (
    <div className={`flex min-h-screen transition-colors duration-200 ${
      theme === "dark" ? "bg-gray-900" : "bg-gray-50"
    }`}>
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed z-40 inset-y-0 left-0 w-64 flex flex-col transition-transform duration-200",
          theme === "dark" 
            ? "bg-gray-800 border-gray-700" 
            : "bg-white border-gray-200",
          "border-r shadow-lg",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "md:static md:translate-x-0"
        )}
      >
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          theme === "dark" ? "border-gray-700" : "border-gray-200"
        }`}>
          <span className={`font-bold text-lg ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}>Org Panel</span>
          <Button
            variant="ghost"
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-md transition",
                theme === "dark" 
                  ? "text-gray-300 hover:bg-gray-700" 
                  : "text-gray-700 hover:bg-blue-100",
                pathname === href && "bg-blue-600 text-white hover:bg-blue-600"
              )}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className={`px-4 py-4 border-t flex items-center gap-3 ${
          theme === "dark" ? "border-gray-700" : "border-gray-200"
        }`}>
          <User className={`w-5 h-5 ${
            theme === "dark" ? "text-gray-400" : "text-gray-400"
          }`} />
          <div className="flex-1">
            <div className={`font-medium text-sm ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}>{orgAdmin.name}</div>
            <div className={`text-xs ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}>{orgAdmin.email}</div>
          </div>
          <Button variant="ghost" size="icon" aria-label="Logout">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className={`sticky top-0 z-20 border-b flex items-center h-16 px-6 shadow-sm ${
          theme === "dark" 
            ? "bg-gray-800 border-gray-700" 
            : "bg-white border-gray-200"
        }`}>
          <Button
            variant="ghost"
            className="md:hidden mr-2"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6" />
          </Button>
          <span className={`font-semibold text-lg ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}>{orgName}</span>
          <div className="ml-auto flex items-center gap-4">
            <span className={`hidden md:block text-sm ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}>
              {orgAdmin.email}
            </span>
            
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={`rounded-full p-2 ${
                theme === "dark" 
                  ? "hover:bg-gray-700 text-gray-300" 
                  : "hover:bg-gray-100 text-gray-600"
              }`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
            
            <Button variant="outline" size="sm">
              Profile
            </Button>
            <Button variant="destructive" size="sm">
              Logout
            </Button>
          </div>
        </header>
        <main className={`flex-1 p-6 transition-colors duration-200 ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}>
          {children}
        </main>
      </div>
    </div>
  );
} 