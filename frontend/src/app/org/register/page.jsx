"use client";
import { useState } from "react";
import { useTheme } from "@/lib/ThemeContext";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Building2, 
  Globe, 
  Phone,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Shield,
  Users,
  Sparkles
} from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    phone: "",
    website: "",
    agreeToTerms: false,
    subscribeToNewsletter: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const { theme } = useTheme();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName) {
      setMessage({ type: "error", text: "Please enter your full name" });
      return false;
    }
    if (!formData.email) {
      setMessage({ type: "error", text: "Please enter your email address" });
      return false;
    }
    if (!formData.password) {
      setMessage({ type: "error", text: "Please enter a password" });
      return false;
    }
    if (formData.password.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters long" });
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return false;
    }
    if (!formData.companyName) {
      setMessage({ type: "error", text: "Please enter your company name" });
      return false;
    }
    if (!formData.agreeToTerms) {
      setMessage({ type: "error", text: "Please agree to the terms and conditions" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/register-org`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orgName: formData.companyName,
          email: formData.email,
          adminName: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          website: formData.website
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage({ type: "success", text: "Account created successfully! Please check your email for verification." });
        // Reset form after successful signup
        setTimeout(() => {
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            companyName: "",
            phone: "",
            website: "",
            agreeToTerms: false,
            subscribeToNewsletter: false
          });
        }, 2000);
      } else {
        setMessage({ type: "error", text: data.error || "Registration failed. Please try again." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please check your connection and try again." });
    } finally {
      setIsLoading(false);
    }
  };

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
                <Sparkles className="w-4 h-4" />
                Join thousands of companies
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Transform Your <br />
              <span className="text-blue-200">Hiring Process</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100 leading-relaxed">
              Streamline candidate evaluations with AI-powered assessments, 
              automated workflows, and comprehensive analytics.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>AI-powered candidate evaluation</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Automated email workflows</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Comprehensive analytics & insights</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                theme === "dark" ? "bg-blue-600" : "bg-blue-100"
              }`}>
                <Building2 className={`w-6 h-6 ${
                  theme === "dark" ? "text-white" : "text-blue-600"
                }`} />
              </div>
              <h2 className={`text-3xl font-bold mb-2 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>
                Create Your Account
              </h2>
              <p className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}>
                Start your free trial today. No credit card required.
              </p>
            </div>

            {/* Signup Form */}
            <div className={`rounded-xl shadow-xl p-8 ${
              theme === "dark" 
                ? "bg-gray-800 border border-gray-700" 
                : "bg-white border border-gray-200"
            }`}>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}>
                      First Name
                    </label>
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-400"
                      }`} />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          theme === "dark" 
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                            : "border-gray-300"
                        }`}
                        placeholder="John"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}>
                      Last Name
                    </label>
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-400"
                      }`} />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          theme === "dark" 
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                            : "border-gray-300"
                        }`}
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-400"
                    }`} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        theme === "dark" 
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                          : "border-gray-300"
                      }`}
                      placeholder="john@company.com"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-400"
                    }`} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        theme === "dark" 
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                          : "border-gray-300"
                      }`}
                      placeholder="Create a strong password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded ${
                        theme === "dark" ? "text-gray-400 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-400"
                    }`} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        theme === "dark" 
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                          : "border-gray-300"
                      }`}
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded ${
                        theme === "dark" ? "text-gray-400 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Company Information */}
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}>
                      Company Name
                    </label>
                    <div className="relative">
                      <Building2 className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-400"
                      }`} />
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          theme === "dark" 
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                            : "border-gray-300"
                        }`}
                        placeholder="Your Company Inc."
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}>
                        Phone
                      </label>
                      <div className="relative">
                        <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-400"
                        }`} />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            theme === "dark" 
                              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                              : "border-gray-300"
                          }`}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}>
                        Website
                      </label>
                      <div className="relative">
                        <Globe className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-400"
                        }`} />
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            theme === "dark" 
                              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                              : "border-gray-300"
                          }`}
                          placeholder="https://company.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      required
                    />
                    <span className={`text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}>
                      I agree to the{" "}
                      <Link href="/terms" className="text-blue-600 hover:text-blue-500 underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-blue-600 hover:text-blue-500 underline">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="subscribeToNewsletter"
                      checked={formData.subscribeToNewsletter}
                      onChange={handleInputChange}
                      className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className={`text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}>
                      Send me product updates and newsletters
                    </span>
                  </label>
                </div>

                {/* Message Display */}
                {message.text && (
                  <div className={`flex items-center gap-2 p-3 rounded-lg ${
                    message.type === "success"
                      ? theme === "dark" 
                        ? "bg-green-900/20 border border-green-700 text-green-300"
                        : "bg-green-50 border border-green-200 text-green-700"
                      : theme === "dark"
                        ? "bg-red-900/20 border border-red-700 text-red-300"
                        : "bg-red-50 border border-red-200 text-red-700"
                  }`}>
                    {message.type === "success" ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    <span className="text-sm">{message.text}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    isLoading
                      ? theme === "dark"
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Login Link */}
                <div className="text-center">
                  <p className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Already have an account?{" "}
                    <Link href="/org/login" className="text-blue-600 hover:text-blue-500 font-medium">
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
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
