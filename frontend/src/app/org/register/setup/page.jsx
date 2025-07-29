"use client";
import Link from "next/link";
import { useState } from "react";
import { useSignup } from "../SignupContext";
import { useTheme } from "@/lib/ThemeContext";
import { 
  Settings, 
  Users, 
  Plus, 
  Trash2, 
  FileText, 
  Mail, 
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Shield,
  Sparkles
} from "lucide-react";

const FORM_TEMPLATES = [
  { id: "template1", name: "Standard Evaluation" },
  { id: "template2", name: "Technical Interview" },
  { id: "template3", name: "Custom" },
];

export default function SetupPreferencesStep() {
  const { signupData, updateSignupData } = useSignup();
  const [touched, setTouched] = useState({});
  const { theme } = useTheme();
  const setup = signupData.setup;

  // Teammate management
  const [teammate, setTeammate] = useState({ name: "", email: "", role: "Member" });
  const [inviteError, setInviteError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateSignupData("setup", { [name]: value });
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  // Teammate add
  const handleTeammateChange = (e) => {
    const { name, value } = e.target;
    setTeammate((prev) => ({ ...prev, [name]: value }));
  };

  const addTeammate = (e) => {
    e.preventDefault();
    if (!teammate.name.trim() || !teammate.email.trim()) {
      setInviteError("Name and email required");
      return;
    }
    updateSignupData("setup", { teammates: [...(setup.teammates || []), teammate] });
    setTeammate({ name: "", email: "", role: "Member" });
    setInviteError("");
  };

  const removeTeammate = (idx) => {
    const newList = setup.teammates.filter((_, i) => i !== idx);
    updateSignupData("setup", { teammates: newList });
  };

  // Evaluation form selection
  const handleFormSelect = (e) => {
    const value = e.target.value;
    if (value === "custom") {
      updateSignupData("setup", { evaluationForm: { type: "custom", questions: [""] } });
    } else {
      updateSignupData("setup", { evaluationForm: { type: "template", templateId: value } });
    }
  };

  // Custom form question management
  const handleCustomQuestionChange = (idx, value) => {
    const questions = [...(setup.evaluationForm?.questions || [])];
    questions[idx] = value;
    updateSignupData("setup", { evaluationForm: { ...setup.evaluationForm, questions } });
  };

  const addCustomQuestion = () => {
    const questions = [...(setup.evaluationForm?.questions || []), ""];
    updateSignupData("setup", { evaluationForm: { ...setup.evaluationForm, questions } });
  };

  const removeCustomQuestion = (idx) => {
    const questions = setup.evaluationForm.questions.filter((_, i) => i !== idx);
    updateSignupData("setup", { evaluationForm: { ...setup.evaluationForm, questions } });
  };

  // Branding
  const handleBrandingChange = (e) => {
    const { name, value } = e.target;
    updateSignupData("setup", { branding: { ...setup.branding, [name]: value } });
  };

  // Validation
  const isValid =
    setup.workspaceName.trim() &&
    setup.evaluationForm &&
    ((setup.evaluationForm.type === "template" && setup.evaluationForm.templateId) ||
      (setup.evaluationForm.type === "custom" && setup.evaluationForm.questions && setup.evaluationForm.questions.length > 0 && setup.evaluationForm.questions[0].trim()));

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
                <Settings className="w-4 h-4" />
                Step 3 of 4
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Configure Your <br />
              <span className="text-blue-200">Workspace</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100 leading-relaxed">
              Set up your workspace preferences, invite team members, 
              and configure evaluation forms for your hiring process.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Team collaboration setup</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Evaluation form templates</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Custom branding options</span>
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
                <Settings className={`w-6 h-6 ${
                  theme === "dark" ? "text-white" : "text-blue-600"
                }`} />
              </div>
              <h2 className={`text-3xl font-bold mb-2 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>
                Setup Preferences
              </h2>
              <p className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}>
                Step 3 of 4 • Configure your workspace
              </p>
            </div>

            {/* Form */}
            <div className={`rounded-xl shadow-xl p-8 ${
              theme === "dark" 
                ? "bg-gray-800 border border-gray-700" 
                : "bg-white border border-gray-200"
            }`}>
              <form className="space-y-6">
                {/* Workspace Name */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    name="workspaceName"
                    value={setup.workspaceName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      theme === "dark" 
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                        : "border-gray-300"
                    }`}
                    placeholder="My Workspace"
                    required
                  />
                  {touched.workspaceName && !setup.workspaceName.trim() && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      <span>Workspace name is required</span>
                    </div>
                  )}
                </div>

                {/* Teammates */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Invite Teammates
                  </label>
                  <div className={`p-4 rounded-lg border ${
                    theme === "dark" 
                      ? "bg-gray-700 border-gray-600" 
                      : "bg-gray-50 border-gray-200"
                  }`}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <input
                        type="text"
                        placeholder="Name"
                        value={teammate.name}
                        onChange={handleTeammateChange}
                        name="name"
                        className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          theme === "dark" 
                            ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" 
                            : "border-gray-300"
                        }`}
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={teammate.email}
                        onChange={handleTeammateChange}
                        name="email"
                        className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          theme === "dark" 
                            ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" 
                            : "border-gray-300"
                        }`}
                      />
                      <select
                        value={teammate.role}
                        onChange={handleTeammateChange}
                        name="role"
                        className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          theme === "dark" 
                            ? "bg-gray-600 border-gray-500 text-white" 
                            : "border-gray-300"
                        }`}
                      >
                        <option value="Member">Member</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={addTeammate}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        theme === "dark"
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      Add Teammate
                    </button>
                    {inviteError && (
                      <div className="flex items-center gap-1 mt-2 text-red-500 text-xs">
                        <AlertCircle className="w-3 h-3" />
                        <span>{inviteError}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Teammates List */}
                  {setup.teammates && setup.teammates.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {setup.teammates.map((t, idx) => (
                        <div key={idx} className={`flex items-center justify-between p-3 rounded-lg ${
                          theme === "dark" 
                            ? "bg-gray-700 border border-gray-600" 
                            : "bg-gray-100 border border-gray-200"
                        }`}>
                          <div>
                            <div className={`font-medium ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}>{t.name}</div>
                            <div className={`text-sm ${
                              theme === "dark" ? "text-gray-400" : "text-gray-600"
                            }`}>{t.email} • {t.role}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeTeammate(idx)}
                            className={`p-1 rounded ${
                              theme === "dark" 
                                ? "text-red-400 hover:text-red-300 hover:bg-red-900/20" 
                                : "text-red-500 hover:text-red-700 hover:bg-red-50"
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Evaluation Form */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Evaluation Form
                  </label>
                  <select
                    value={setup.evaluationForm?.type === "template" ? setup.evaluationForm.templateId : "custom"}
                    onChange={handleFormSelect}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      theme === "dark" 
                        ? "bg-gray-700 border-gray-600 text-white" 
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select a template</option>
                    {FORM_TEMPLATES.map((template) => (
                      <option key={template.id} value={template.id}>{template.name}</option>
                    ))}
                    <option value="custom">Custom Form</option>
                  </select>
                  
                  {/* Custom Questions */}
                  {setup.evaluationForm?.type === "custom" && (
                    <div className="mt-3 space-y-2">
                      {setup.evaluationForm.questions.map((q, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            value={q}
                            onChange={(e) => handleCustomQuestionChange(idx, e.target.value)}
                            placeholder={`Question ${idx + 1}`}
                            className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              theme === "dark" 
                                ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" 
                                : "border-gray-300"
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => removeCustomQuestion(idx)}
                            className={`p-2 rounded ${
                              theme === "dark" 
                                ? "text-red-400 hover:text-red-300 hover:bg-red-900/20" 
                                : "text-red-500 hover:text-red-700 hover:bg-red-50"
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addCustomQuestion}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          theme === "dark"
                            ? "bg-gray-600 hover:bg-gray-500 text-gray-300"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        }`}
                      >
                        <Plus className="w-3 h-3" />
                        Add Question
                      </button>
                    </div>
                  )}
                </div>

                {/* Branding */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Email Branding
                  </label>
                  <div className="space-y-3">
                    <div>
                      <label className={`block text-xs mb-1 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}>Sender Name</label>
                      <input
                        type="text"
                        name="senderName"
                        value={setup.branding?.senderName || ""}
                        onChange={handleBrandingChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          theme === "dark" 
                            ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" 
                            : "border-gray-300"
                        }`}
                        placeholder="Your Company Name"
                      />
                    </div>
                    <div>
                      <label className={`block text-xs mb-1 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}>Email Signature</label>
                      <textarea
                        name="emailSignature"
                        value={setup.branding?.emailSignature || ""}
                        onChange={handleBrandingChange}
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                          theme === "dark" 
                            ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" 
                            : "border-gray-300"
                        }`}
                        placeholder="Best regards,&#10;Your Company Team"
                      />
                    </div>
                  </div>
                </div>
              </form>

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-between">
                <Link href="/org/register/org-info">
                  <button className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    theme === "dark"
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}>
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </button>
                </Link>
                <Link href="/org/register/review">
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