"use client";
import Link from "next/link";
import { useState } from "react";
import { useSignup } from "../SignupContext";
import { useTheme } from "@/lib/ThemeContext";
import { 
  Building2, 
  Upload, 
  Globe, 
  Mail, 
  MapPin, 
  Users, 
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Shield
} from "lucide-react";

const INDUSTRIES = ["Technology", "Finance", "Healthcare", "Education", "Manufacturing", "Other"];
const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];
const COUNTRIES = ["India", "USA", "UK", "Germany", "Canada", "Other"];
const HIRING_DOMAINS = ["Engineering", "Sales", "Marketing", "HR", "Finance", "Operations", "Other"];

export default function OrgInfoStep() {
  const { signupData, updateSignupData } = useSignup();
  const [touched, setTouched] = useState({});
  const { theme } = useTheme();
  const orgInfo = signupData.orgInfo;

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateSignupData("orgInfo", { [name]: value });
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    updateSignupData("orgInfo", { logo: file });
  };

  const handleHiringDomainChange = (e) => {
    const { value, checked } = e.target;
    let newDomains = orgInfo.hiringDomains ? [...orgInfo.hiringDomains] : [];
    if (checked) {
      newDomains.push(value);
    } else {
      newDomains = newDomains.filter((d) => d !== value);
    }
    updateSignupData("orgInfo", { hiringDomains: newDomains });
  };

  // Simple validation
  const isValid =
    orgInfo.orgName.trim() &&
    orgInfo.industry &&
    orgInfo.companySize &&
    orgInfo.website.trim() &&
    orgInfo.emailDomain.trim() &&
    orgInfo.country;

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
                <Building2 className="w-4 h-4" />
                Step 2 of 4
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Tell Us About <br />
              <span className="text-blue-200">Your Organization</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100 leading-relaxed">
              Help us customize your evaluation platform with organization 
              details and hiring preferences.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Customized evaluation forms</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Industry-specific templates</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Tailored hiring workflows</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
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
                Organization Details
              </h2>
              <p className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}>
                Step 2 of 4 • Tell us about your company
              </p>
            </div>

            {/* Form */}
            <div className={`rounded-xl shadow-xl p-8 ${
              theme === "dark" 
                ? "bg-gray-800 border border-gray-700" 
                : "bg-white border border-gray-200"
            }`}>
              <form className="space-y-6">
                {/* Organization Name */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Organization Name
                  </label>
                  <div className="relative">
                    <Building2 className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-400"
                    }`} />
                    <input
                      type="text"
                      name="orgName"
                      value={orgInfo.orgName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        theme === "dark" 
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                          : "border-gray-300"
                      }`}
                      placeholder="Your Company Inc."
                      required
                    />
                  </div>
                  {touched.orgName && !orgInfo.orgName.trim() && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      <span>Organization name is required</span>
                    </div>
                  )}
                </div>

                {/* Company Logo */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Company Logo
                  </label>
                  <div className="relative">
                    <Upload className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-400"
                    }`} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        theme === "dark" 
                          ? "bg-gray-700 border-gray-600 text-white" 
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  {orgInfo.logo && (
                    <div className="flex items-center gap-1 mt-1 text-green-500 text-xs">
                      <CheckCircle className="w-3 h-3" />
                      <span>Logo selected: {orgInfo.logo.name}</span>
                    </div>
                  )}
                </div>

                {/* Industry */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Industry
                  </label>
                  <div className="relative">
                    <Building2 className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-400"
                    }`} />
                    <select
                      name="industry"
                      value={orgInfo.industry}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        theme === "dark" 
                          ? "bg-gray-700 border-gray-600 text-white" 
                          : "border-gray-300"
                      }`}
                      required
                    >
                      <option value="">Select industry</option>
                      {INDUSTRIES.map((ind) => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>
                  {touched.industry && !orgInfo.industry && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      <span>Industry is required</span>
                    </div>
                  )}
                </div>

                {/* Company Size */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Company Size
                  </label>
                  <div className="relative">
                    <Users className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-400"
                    }`} />
                    <select
                      name="companySize"
                      value={orgInfo.companySize}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        theme === "dark" 
                          ? "bg-gray-700 border-gray-600 text-white" 
                          : "border-gray-300"
                      }`}
                      required
                    >
                      <option value="">Select company size</option>
                      {COMPANY_SIZES.map((size) => (
                        <option key={size} value={size}>{size} employees</option>
                      ))}
                    </select>
                  </div>
                  {touched.companySize && !orgInfo.companySize && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      <span>Company size is required</span>
                    </div>
                  )}
                </div>

                {/* Website */}
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
                      value={orgInfo.website}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        theme === "dark" 
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                          : "border-gray-300"
                      }`}
                      placeholder="https://company.com"
                      required
                    />
                  </div>
                  {touched.website && !orgInfo.website.trim() && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      <span>Website is required</span>
                    </div>
                  )}
                </div>

                {/* Email Domain */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Email Domain
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-400"
                    }`} />
                    <input
                      type="text"
                      name="emailDomain"
                      value={orgInfo.emailDomain}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        theme === "dark" 
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                          : "border-gray-300"
                      }`}
                      placeholder="company.com"
                      required
                    />
                  </div>
                  {touched.emailDomain && !orgInfo.emailDomain.trim() && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      <span>Email domain is required</span>
                    </div>
                  )}
                </div>

                {/* Country */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Country
                  </label>
                  <div className="relative">
                    <MapPin className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-400"
                    }`} />
                    <select
                      name="country"
                      value={orgInfo.country}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        theme === "dark" 
                          ? "bg-gray-700 border-gray-600 text-white" 
                          : "border-gray-300"
                      }`}
                      required
                    >
                      <option value="">Select country</option>
                      {COUNTRIES.map((country) => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                  {touched.country && !orgInfo.country && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      <span>Country is required</span>
                    </div>
                  )}
                </div>

                {/* Hiring Domains */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Hiring Domains
                  </label>
                  <div className={`grid grid-cols-2 gap-3 p-4 rounded-lg border ${
                    theme === "dark" 
                      ? "bg-gray-700 border-gray-600" 
                      : "bg-gray-50 border-gray-200"
                  }`}>
                    {HIRING_DOMAINS.map((domain) => (
                      <label key={domain} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          value={domain}
                          checked={orgInfo.hiringDomains?.includes(domain) || false}
                          onChange={handleHiringDomainChange}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className={`text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}>
                          {domain}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </form>

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-between">
                <Link href="/org/register/admin">
                  <button className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    theme === "dark"
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}>
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </button>
                </Link>
                <Link href="/org/register/setup">
                  <button
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isValid
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        : theme === "dark"
                          ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={!isValid}
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
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