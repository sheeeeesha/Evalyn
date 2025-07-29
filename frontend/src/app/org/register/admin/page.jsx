"use client";
import Link from "next/link";
import { useState } from "react";
import { useSignup } from "../SignupContext";
import { useTheme } from "@/lib/ThemeContext";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Phone, 
  Shield, 
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Crown
} from "lucide-react";

export default function AdminAccountStep() {
  const { signupData, updateSignupData } = useSignup();
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useTheme();

  const admin = signupData.admin;

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateSignupData("admin", { [name]: value });
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  // Simple validation
  const isValid =
    admin.name.trim() &&
    admin.email.trim() &&
    admin.password.trim();

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === "dark" ? "bg-gray-900" : "bg-gray-50"
    }`}>
      <div className="flex min-h-screen">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          <div className={`absolute inset-0 ${
            theme === "dark" 
              ? "bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900" 
              : "bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600"
          }`}>
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <div className="mb-8">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                theme === "dark" ? "bg-white/10" : "bg-white/20"
              }`}>
                <Crown className="w-4 h-4" />
                Step 1 of 4
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Create Your <br />
              <span className="text-blue-200">Admin Account</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100 leading-relaxed">
              Set up your administrator account to manage your organization's 
              evaluation platform and team members.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Full administrative control</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Team management capabilities</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Secure authentication</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Simple Button */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md text-center">
            {/* Header */}
            <div className="mb-8">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                theme === "dark" ? "bg-blue-600" : "bg-blue-100"
              }`}>
                <Crown className={`w-6 h-6 ${
                  theme === "dark" ? "text-white" : "text-blue-600"
                }`} />
              </div>
              <h2 className={`text-3xl font-bold mb-2 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>
                Ready to Get Started?
              </h2>
              <p className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}>
                Begin your organization setup process
              </p>
            </div>

            {/* Proceed Button */}
            <div className={`rounded-xl shadow-xl p-8 ${
              theme === "dark" 
                ? "bg-gray-800 border border-gray-700" 
                : "bg-white border border-gray-200"
            }`}>
              <div className="mb-6">
                <p className={`text-lg mb-4 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}>
                  Click the button below to proceed with your organization signup process.
                </p>
              </div>

              <Link href="/org/register/org-info">
                <button className={`inline-flex items-center gap-3 px-8 py-4 rounded-lg font-medium text-lg transition-all duration-200 ${
                  "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                }`}>
                  Proceed to Signup
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>

            {/* Security Notice */}
            <div className="mt-6 text-center">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs ${
                theme === "dark" 
                  ? "bg-gray-800 border border-gray-700 text-gray-400" 
                  : "bg-gray-100 text-gray-600"
              }`}>
                <Shield className="w-3 h-3" />
                Your data is protected with enterprise-grade security
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 