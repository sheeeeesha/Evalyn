"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import FormRenderer from "@/components/FormRenderer";

export default function FormPage() {
  const { formId } = useParams();
  const searchParams = useSearchParams();
  const urlTheme = searchParams.get("theme") || "light";
  
  // State for theme management
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  // Initialize theme from URL or localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("formTheme");
    const initialTheme = savedTheme || urlTheme;
    setTheme(initialTheme);
    setMounted(true);
  }, [urlTheme]);

  // Save theme preference to localStorage
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("formTheme", newTheme);
    
    // Show brief feedback
    const toast = document.createElement("div");
    toast.className = `fixed top-16 right-4 px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300 ${
      newTheme === "dark" 
        ? "bg-gray-800 text-white border border-gray-600" 
        : "bg-white text-gray-700 border border-gray-200"
    }`;
    toast.textContent = `Switched to ${newTheme} mode`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 1500);
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === "dark" ? "bg-gray-900" : "bg-gray-50"
    }`}>
      {/* Theme Toggle Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            theme === "dark" 
              ? "bg-gray-700 text-yellow-400 hover:bg-gray-600 focus:ring-offset-gray-900" 
              : "bg-white text-gray-700 hover:bg-gray-100 focus:ring-offset-white"
          } border ${
            theme === "dark" ? "border-gray-600" : "border-gray-200"
          }`}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </button>
      </div>

      <FormRenderer formId={formId} theme={theme} />
    </div>
  );
} 