"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  BarChart3, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  Plus, 
  Eye, 
  TrendingUp,
  Calendar,
  Award,
  Clock,
  CheckCircle,
  Palette,
  Sun,
  Moon
} from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

export default function OrgDashboard() {
  const [orgId, setOrgId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalForms: 0,
    totalSubmissions: 0,
    totalFlows: 0,
    recentActivity: []
  });
  const [formTheme, setFormTheme] = useState("light");
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    const id = localStorage.getItem("orgId");
    if (!id) {
      router.push("/org/login");
    } else {
      setOrgId(id);
      // Load saved theme preference
      const savedTheme = localStorage.getItem("formTheme") || "light";
      setFormTheme(savedTheme);
      // Fetch dashboard stats
      fetchDashboardStats(id);
    }
  }, [router]);

  const fetchDashboardStats = async (orgId) => {
    try {
      // Fetch forms count
      const formsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/org/${orgId}/forms`);
      const formsData = await formsRes.json();
      
      // Fetch submissions count
      const submissionsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/org/${orgId}/submissions`);
      const submissionsData = await submissionsRes.json();
      
      // Fetch flows count
      const flowsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/org/${orgId}/flows`);
      const flowsData = await flowsRes.json();

      setStats({
        totalForms: formsData.forms?.length || 0,
        totalSubmissions: submissionsData.submissions?.length || 0,
        totalFlows: flowsData.flows?.length || 0,
        recentActivity: submissionsData.submissions?.slice(0, 5) || []
      });
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = (newTheme) => {
    setFormTheme(newTheme);
    localStorage.setItem("formTheme", newTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem("orgId");
    localStorage.removeItem("orgEmail");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    router.push("/org/login");
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}>
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4" />
          <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!orgId) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}>
        <div className="text-center">
          <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === "dark" ? "bg-gray-900" : "bg-gray-50"
    }`}>
      {/* Header */}
      <header className={`border-b shadow-sm ${
        theme === "dark" 
          ? "bg-gray-800 border-gray-700" 
          : "bg-white border-gray-200"
      }`}>
        <div className="container-responsive py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">TES</span>
              </div>
              <div>
                <h1 className={`text-xl font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>Dashboard</h1>
                <p className={`text-sm ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}>Welcome back to TES Platform</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Theme Selector */}
              <div className={`flex items-center gap-2 rounded-lg p-1 ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-100"
              }`}>
                <button
                  onClick={() => handleThemeChange("light")}
                  className={`p-2 rounded-md transition-colors ${
                    formTheme === "light" 
                      ? "bg-white text-blue-600 shadow-sm" 
                      : theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
                  }`}
                  title="Light Mode"
                >
                  <Sun className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleThemeChange("dark")}
                  className={`p-2 rounded-md transition-colors ${
                    formTheme === "dark" 
                      ? "bg-white text-blue-600 shadow-sm" 
                      : theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
                  }`}
                  title="Dark Mode"
                >
                  <Moon className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={handleLogout}
                className="btn-outline px-4 py-2 text-sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-responsive py-8">
        {/* Stats Cards */}
        <div className="grid-responsive mb-8">
          <div className={`p-6 rounded-lg border shadow-sm ${
            theme === "dark" 
              ? "bg-gray-800 border-gray-700" 
              : "bg-white border-gray-200"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>Total Forms</p>
                <p className={`text-3xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>{stats.totalForms}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-lg border shadow-sm ${
            theme === "dark" 
              ? "bg-gray-800 border-gray-700" 
              : "bg-white border-gray-200"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>Total Submissions</p>
                <p className={`text-3xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>{stats.totalSubmissions}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-secondary rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-lg border shadow-sm ${
            theme === "dark" 
              ? "bg-gray-800 border-gray-700" 
              : "bg-white border-gray-200"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>Active Flows</p>
                <p className={`text-3xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>{stats.totalFlows}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-success rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold mb-6 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}>Quick Actions</h2>
          <div className="grid-responsive">
            <Link href="/org/dashboard/form-builder" className={`p-6 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 group ${
              theme === "dark" 
                ? "bg-gray-800 border-gray-700 hover:bg-gray-750" 
                : "bg-white border-gray-200 hover:shadow-lg"
            }`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`font-semibold mb-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}>Create New Form</h3>
                  <p className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>Build custom evaluation forms</p>
                </div>
              </div>
            </Link>

            <Link href="/org/dashboard/forms" className={`p-6 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 group ${
              theme === "dark" 
                ? "bg-gray-800 border-gray-700 hover:bg-gray-750" 
                : "bg-white border-gray-200 hover:shadow-lg"
            }`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-secondary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`font-semibold mb-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}>Manage Forms</h3>
                  <p className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>View and edit your forms</p>
                </div>
              </div>
            </Link>

            <Link href="/org/dashboard/submissions" className={`p-6 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 group ${
              theme === "dark" 
                ? "bg-gray-800 border-gray-700 hover:bg-gray-750" 
                : "bg-white border-gray-200 hover:shadow-lg"
            }`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-success rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`font-semibold mb-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}>View Submissions</h3>
                  <p className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>Review candidate responses</p>
                </div>
              </div>
            </Link>
            
            <Link href="/org/dashboard/flows" className={`p-6 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 group ${
              theme === "dark" 
                ? "bg-gray-800 border-gray-700 hover:bg-gray-750" 
                : "bg-white border-gray-200 hover:shadow-lg"
            }`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`font-semibold mb-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}>Manage Flows</h3>
                  <p className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>Create multi-stage evaluations</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold mb-6 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}>Recent Activity</h2>
          <div className={`rounded-lg border shadow-sm ${
            theme === "dark" 
              ? "bg-gray-800 border-gray-700" 
              : "bg-white border-gray-200"
          }`}>
            <div className="p-6">
              {stats.recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentActivity.map((submission, index) => (
                    <div key={index} className={`flex items-center gap-4 p-4 rounded-lg ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                    }`}>
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}>
                          New submission from {submission.candidateName || "Anonymous"}
                        </p>
                        <p className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}>
                          {submission.formName || "Form"} • {new Date(submission.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}>
                          {submission.aiScore ? `${submission.aiScore}/100` : "Pending"}
                        </p>
                        <p className={`text-xs ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}>
                          {submission.aiScore ? "AI Scored" : "Not scored"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                  }`}>
                    <Clock className={`w-8 h-8 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`} />
                  </div>
                  <h3 className={`font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}>No recent activity</h3>
                  <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                    Start by creating your first form or check back later for submissions.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="grid-responsive">
          <Link href="/org/dashboard/forms" className={`p-6 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 ${
            theme === "dark" 
              ? "bg-gray-800 border-gray-700 hover:bg-gray-750" 
              : "bg-white border-gray-200 hover:shadow-lg"
          }`}>
            <div className="text-center">
              <FileText className={`w-8 h-8 mx-auto mb-3 ${
                theme === "dark" ? "text-blue-400" : "text-blue-600"
              }`} />
              <h3 className={`font-semibold mb-2 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>Forms</h3>
              <p className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}>Create and manage evaluation forms</p>
            </div>
          </Link>
          
          <Link href="/org/dashboard/submissions" className={`p-6 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 ${
            theme === "dark" 
              ? "bg-gray-800 border-gray-700 hover:bg-gray-750" 
              : "bg-white border-gray-200 hover:shadow-lg"
          }`}>
            <div className="text-center">
              <Users className={`w-8 h-8 mx-auto mb-3 ${
                theme === "dark" ? "text-blue-400" : "text-blue-600"
              }`} />
              <h3 className={`font-semibold mb-2 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>Submissions</h3>
              <p className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}>Review candidate responses and scores</p>
            </div>
          </Link>
          
          <Link href="/org/dashboard/flows" className={`p-6 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 ${
            theme === "dark" 
              ? "bg-gray-800 border-gray-700 hover:bg-gray-750" 
              : "bg-white border-gray-200 hover:shadow-lg"
          }`}>
            <div className="text-center">
              <TrendingUp className={`w-8 h-8 mx-auto mb-3 ${
                theme === "dark" ? "text-blue-400" : "text-blue-600"
              }`} />
              <h3 className={`font-semibold mb-2 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>Flows</h3>
              <p className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}>Manage multi-stage evaluation processes</p>
            </div>
          </Link>
          
          <Link href="/org/dashboard/form-builder" className={`p-6 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 ${
            theme === "dark" 
              ? "bg-gray-800 border-gray-700 hover:bg-gray-750" 
              : "bg-white border-gray-200 hover:shadow-lg"
          }`}>
            <div className="text-center">
              <Plus className={`w-8 h-8 mx-auto mb-3 ${
                theme === "dark" ? "text-blue-400" : "text-blue-600"
              }`} />
              <h3 className={`font-semibold mb-2 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>Form Builder</h3>
              <p className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}>Create new evaluation forms</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
