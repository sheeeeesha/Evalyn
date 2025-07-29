"use client";
import Link from "next/link";
import { useState } from "react";
import { useSignup } from "../SignupContext";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/ThemeContext";
import { 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight,
  Shield,
  User,
  Building2,
  Settings,
  Mail,
  Phone,
  Globe,
  MapPin,
  Users,
  FileText,
  Crown,
  Loader2
} from "lucide-react";

export default function ReviewStep() {
  const { signupData, resetSignupData } = useSignup();
  const { admin, orgInfo, setup } = signupData;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [failedInvites, setFailedInvites] = useState([]);
  const { theme } = useTheme();
  const router = useRouter();

  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    setFailedInvites([]);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/register-org", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin, orgInfo, setup }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409 && data.joinOrgId) {
          setError("An organization with this email domain already exists. You can join the existing organization instead.");
        } else {
          setError(data.error || "Registration failed. Please try again.");
        }
        setLoading(false);
        return;
      }
      setSuccess("Organization and admin registered! Invites sent to teammates.");
      setFailedInvites(data.failedInvites || []);
      resetSignupData();
      setLoading(false);
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/org/dashboard");
      }, 2000);
    } catch (err) {
      setError("Registration failed. Please try again.");
      setLoading(false);
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
                <CheckCircle className="w-4 h-4" />
                Step 4 of 4
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Review & <br />
              <span className="text-blue-200">Confirm</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100 leading-relaxed">
              Review all your information before creating your organization. 
              You're almost ready to start using your evaluation platform!
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>All information verified</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Ready to create organization</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Team invites will be sent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Review Content */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                theme === "dark" ? "bg-blue-600" : "bg-blue-100"
              }`}>
                <CheckCircle className={`w-6 h-6 ${
                  theme === "dark" ? "text-white" : "text-blue-600"
                }`} />
              </div>
              <h2 className={`text-3xl font-bold mb-2 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>
                Review & Confirm
              </h2>
              <p className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}>
                Step 4 of 4 • Review your information before creating your organization
              </p>
            </div>

            {/* Review Content */}
            <div className={`rounded-xl shadow-xl p-8 ${
              theme === "dark" 
                ? "bg-gray-800 border border-gray-700" 
                : "bg-white border border-gray-200"
            }`}>
              <div className="space-y-8">
                {/* Admin Account Section */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${
                      theme === "dark" ? "bg-blue-600" : "bg-blue-100"
                    }`}>
                      <Crown className={`w-4 h-4 ${
                        theme === "dark" ? "text-white" : "text-blue-600"
                      }`} />
                    </div>
                    <h3 className={`text-lg font-semibold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}>
                      Admin Account
                    </h3>
                  </div>
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg ${
                    theme === "dark" 
                      ? "bg-gray-700 border border-gray-600" 
                      : "bg-gray-50 border border-gray-200"
                  }`}>
                    <div className="flex items-center gap-3">
                      <User className={`w-4 h-4 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`} />
                      <div>
                        <div className={`text-xs font-medium ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}>Name</div>
                        <div className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}>{admin.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className={`w-4 h-4 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`} />
                      <div>
                        <div className={`text-xs font-medium ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}>Email</div>
                        <div className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}>{admin.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className={`w-4 h-4 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`} />
                      <div>
                        <div className={`text-xs font-medium ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}>Phone</div>
                        <div className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}>{admin.phone || <span className={`${
                          theme === "dark" ? "text-gray-500" : "text-gray-400"
                        }`}>Not provided</span>}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Crown className={`w-4 h-4 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`} />
                      <div>
                        <div className={`text-xs font-medium ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}>Role</div>
                        <div className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}>{admin.role}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Organization Details Section */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${
                      theme === "dark" ? "bg-blue-600" : "bg-blue-100"
                    }`}>
                      <Building2 className={`w-4 h-4 ${
                        theme === "dark" ? "text-white" : "text-blue-600"
                      }`} />
                    </div>
                    <h3 className={`text-lg font-semibold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}>
                      Organization Details
                    </h3>
                  </div>
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg ${
                    theme === "dark" 
                      ? "bg-gray-700 border border-gray-600" 
                      : "bg-gray-50 border border-gray-200"
                  }`}>
                    <div className="flex items-center gap-3">
                      <Building2 className={`w-4 h-4 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`} />
                      <div>
                        <div className={`text-xs font-medium ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}>Name</div>
                        <div className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}>{orgInfo.orgName}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building2 className={`w-4 h-4 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`} />
                      <div>
                        <div className={`text-xs font-medium ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}>Industry</div>
                        <div className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}>{orgInfo.industry}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className={`w-4 h-4 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`} />
                      <div>
                        <div className={`text-xs font-medium ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}>Size</div>
                        <div className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}>{orgInfo.companySize} employees</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className={`w-4 h-4 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`} />
                      <div>
                        <div className={`text-xs font-medium ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}>Website</div>
                        <div className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}>{orgInfo.website}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className={`w-4 h-4 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`} />
                      <div>
                        <div className={`text-xs font-medium ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}>Email Domain</div>
                        <div className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}>@{orgInfo.emailDomain}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className={`w-4 h-4 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`} />
                      <div>
                        <div className={`text-xs font-medium ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}>Country</div>
                        <div className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}>{orgInfo.country}</div>
                      </div>
                    </div>
                    {orgInfo.hiringDomains && orgInfo.hiringDomains.length > 0 && (
                      <div className="md:col-span-2">
                        <div className={`text-xs font-medium mb-2 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}>Hiring Domains</div>
                        <div className="flex flex-wrap gap-2">
                          {orgInfo.hiringDomains.map((domain, idx) => (
                            <span key={idx} className={`px-2 py-1 rounded-full text-xs font-medium ${
                              theme === "dark" 
                                ? "bg-blue-600 text-white" 
                                : "bg-blue-100 text-blue-700"
                            }`}>
                              {domain}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Setup Preferences Section */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${
                      theme === "dark" ? "bg-blue-600" : "bg-blue-100"
                    }`}>
                      <Settings className={`w-4 h-4 ${
                        theme === "dark" ? "text-white" : "text-blue-600"
                      }`} />
                    </div>
                    <h3 className={`text-lg font-semibold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}>
                      Setup Preferences
                    </h3>
                  </div>
                  <div className={`space-y-4 p-4 rounded-lg ${
                    theme === "dark" 
                      ? "bg-gray-700 border border-gray-600" 
                      : "bg-gray-50 border border-gray-200"
                  }`}>
                    <div className="flex items-center gap-3">
                      <Building2 className={`w-4 h-4 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`} />
                      <div>
                        <div className={`text-xs font-medium ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}>Workspace Name</div>
                        <div className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}>{setup.workspaceName}</div>
                      </div>
                    </div>
                    
                    {setup.teammates && setup.teammates.length > 0 && (
                      <div>
                        <div className={`text-xs font-medium mb-2 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}>Teammates</div>
                        <div className="space-y-2">
                          {setup.teammates.map((tm, idx) => (
                            <div key={idx} className={`flex items-center justify-between p-2 rounded ${
                              theme === "dark" 
                                ? "bg-gray-600 border border-gray-500" 
                                : "bg-white border border-gray-200"
                            }`}>
                              <div className="flex items-center gap-2">
                                <Users className={`w-3 h-3 ${
                                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                                }`} />
                                <span className={`text-sm ${
                                  theme === "dark" ? "text-white" : "text-gray-900"
                                }`}>{tm.name}</span>
                              </div>
                              <div className={`text-xs ${
                                theme === "dark" ? "text-gray-400" : "text-gray-600"
                              }`}>
                                {tm.email} • {tm.role}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <FileText className={`w-4 h-4 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`} />
                      <div>
                        <div className={`text-xs font-medium ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}>Evaluation Form</div>
                        <div className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}>
                          {setup.evaluationForm ? (
                            setup.evaluationForm.type === "template" ? (
                              <>Template: {setup.evaluationForm.templateId}</>
                            ) : (
                              <>Custom: {setup.evaluationForm.questions.length} question(s)</>
                            )
                          ) : <span className={`${
                            theme === "dark" ? "text-gray-500" : "text-gray-400"
                          }`}>Not configured</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              {error && (
                <div className="mt-6 flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <div className="text-red-700 font-medium">{error}</div>
                </div>
              )}
              {success && (
                <div className="mt-6 flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div className="text-green-700 font-medium">{success}</div>
                </div>
              )}
              {failedInvites.length > 0 && (
                <div className="mt-6 flex items-center gap-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  <div className="text-yellow-700">
                    <div className="font-medium mb-1">Warning: The following invite emails could not be delivered:</div>
                    {failedInvites.map(email => (
                      <div key={email} className="text-sm">{email}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-between">
                <Link href="/org/register/setup">
                  <button className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    theme === "dark"
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}>
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                </Link>
                <div className="flex gap-3">
                  <button
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      theme === "dark"
                        ? "bg-gray-600 hover:bg-gray-500 text-gray-300"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                    onClick={() => alert('You can finish setup later! (Implement save & exit logic here)')}
                    disabled={loading}
                  >
                    Finish Setup Later
                  </button>
                  <button
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    }`}
                    onClick={handleConfirm}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      <>
                        Confirm & Enter Dashboard
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
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