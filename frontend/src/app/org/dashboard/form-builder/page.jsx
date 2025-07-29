"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { 
  FileText, 
  Settings, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  Save, 
  Copy, 
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  GripVertical,
  MessageSquare,
  BarChart3,
  Brain,
  Palette
} from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

export default function FormBuilder() {
  const [formName, setFormName] = useState("");
  const [cutoff, setCutoff] = useState("");
  const [sections, setSections] = useState([{ title: "", questions: [] }]);
  const [formId, setFormId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [domains, setDomains] = useState([]);
  const [llmPrompt, setLlmPrompt] = useState("");
  const [activeTab, setActiveTab] = useState("form");
  const [collapsedSections, setCollapsedSections] = useState(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const { theme } = useTheme();

  const PROVIDER_MODELS = {
    openrouter: [
      { value: "gpt-4o", label: "GPT-4o (OpenAI via OpenRouter)" },
      { value: "moonshot/kimi-k2", label: "Kimi K2 (Moonshot)" },
      { value: "claude-3-opus", label: "Claude 3 Opus (Anthropic)" },
    ],
    openai: [
      { value: "gpt-4o", label: "GPT-4o" },
      { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
    ],
    anthropic: [
      { value: "claude-3-opus-20240229", label: "Claude 3 Opus" },
      { value: "claude-3-sonnet-20240229", label: "Claude 3 Sonnet" },
    ],
    google: [
      { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
    ],
  };
  const PROVIDERS = [
    { value: "openrouter", label: "OpenRouter" },
    { value: "openai", label: "OpenAI" },
    { value: "anthropic", label: "Anthropic" },
    { value: "google", label: "Google" },
  ];
  const [llmConfig, setLlmConfig] = useState({
    provider: "openrouter",
    model: "moonshot/kimi-k2",
    temperature: 0.2,
    top_p: 0.95,
    max_tokens: 300,
    presence_penalty: 0,
    frequency_penalty: 0,
  });
  const [llmConfigErrors, setLlmConfigErrors] = useState({});
  const searchParams = useSearchParams();

  const availableDomains = [
    "Frontend",
    "Backend", 
    "Data Science",
    "DevOps",
    "UI/UX",
    "Mobile",
    "AI/ML",
    "Other",
  ];

  // Load form for editing
  useEffect(() => {
    const formIdParam = searchParams.get("formId");
    if (formIdParam) {
      const fetchForm = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/get-form/${formIdParam}`);
          const data = await res.json();
          if (data.form) {
            setFormName(data.form.formName || "");
            setCutoff(data.form.cutoff || "");
            setSections(data.form.sections || [{ title: "", questions: [] }]);
            setFormId(formIdParam);
            setDomains(data.form.domains ? data.form.domains.join(", ") : "");
            setLlmPrompt(data.form.llmPrompt || "");
            setLlmConfig(data.form.llmConfig || {
              provider: "openrouter",
              model: "moonshot/kimi-k2",
              temperature: 0.2,
              top_p: 0.95,
              max_tokens: 300,
              presence_penalty: 0,
              frequency_penalty: 0,
            });
          }
                  } catch (err) {
            console.error("Failed to load form for editing", err);
            displayToast("Failed to load form", "error");
          }
      };
      fetchForm();
    }
  }, [searchParams]);

  const displayToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const toggleSection = (sectionIndex) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(sectionIndex)) {
      newCollapsed.delete(sectionIndex);
    } else {
      newCollapsed.add(sectionIndex);
    }
    setCollapsedSections(newCollapsed);
  };

  const handleAddSection = () => {
    setSections([...sections, { title: "", questions: [] }]);
  };

  const handleSectionTitleChange = (index, title) => {
    const newSections = [...sections];
    newSections[index].title = title;
    setSections(newSections);
  };

  const handleAddQuestion = (sectionIndex) => {
    const newSections = [...sections];
    const questionId = `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    newSections[sectionIndex].questions.push({
      id: questionId,
      type: "text",
      label: "",
      required: false,
      options: [],
    });
    setSections(newSections);
  };

  const handleQuestionChange = (sectionIndex, questionIndex, key, value) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions[questionIndex][key] = value;
    setSections(newSections);
  };

  const handleAddRubric = (sectionIndex, questionIndex) => {
    const newSections = [...sections];
    if (!Array.isArray(newSections[sectionIndex].questions[questionIndex].rubrics)) {
      newSections[sectionIndex].questions[questionIndex].rubrics = [];
    }
    newSections[sectionIndex].questions[questionIndex].rubrics.push({ label: "", weight: 1, description: "" });
    setSections(newSections);
  };

  const handleRubricChange = (sectionIndex, questionIndex, rubricIndex, key, value) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions[questionIndex].rubrics[rubricIndex][key] = value;
    setSections(newSections);
  };

  const handleRemoveRubric = (sectionIndex, questionIndex, rubricIndex) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions[questionIndex].rubrics.splice(rubricIndex, 1);
    setSections(newSections);
  };

  const validateLlmConfig = (config) => {
    const errors = {};
    if (!config.model || typeof config.model !== "string") errors.model = "Model is required.";
    if (config.temperature < 0 || config.temperature > 1) errors.temperature = "Temperature must be between 0 and 1.";
    if (config.top_p < 0 || config.top_p > 1) errors.top_p = "Top_p must be between 0 and 1.";
    if (config.max_tokens < 50 || config.max_tokens > 2000) errors.max_tokens = "Max tokens must be between 50 and 2000.";
    if (config.presence_penalty < -2 || config.presence_penalty > 2) errors.presence_penalty = "Presence penalty must be between -2 and 2.";
    if (config.frequency_penalty < -2 || config.frequency_penalty > 2) errors.frequency_penalty = "Frequency penalty must be between -2 and 2.";
    return errors;
  };

  const handleLlmConfigChange = (key, value) => {
    setLlmConfig(prev => {
      let updated = { ...prev, [key]: value };
      if (key === "provider") {
        const models = PROVIDER_MODELS[value] || [];
        updated.model = models.length > 0 ? models[0].value : "";
      }
      setLlmConfigErrors(validateLlmConfig(updated));
      return updated;
    });
  };

  const handleSaveForm = async () => {
    const orgId = localStorage.getItem("orgId");
    const errors = validateLlmConfig(llmConfig);
    setLlmConfigErrors(errors);
    if (Object.keys(errors).length > 0) {
      displayToast("Please fix LLM settings errors before saving.", "error");
      return;
    }
    if (!formName || !cutoff || sections.length === 0) {
      displayToast("Please complete the form setup", "error");
      return;
    }

    setIsSaving(true);
    try {
      let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/save-form`;
      let method = "POST";
      let body = {
        orgId,
        formName,
        cutoff,
        sections,
        domains: typeof domains === "string" ? domains.split(",").map(d => d.trim()).filter(Boolean) : domains,
        llmPrompt,
        llmConfig,
      };
      if (formId) {
        url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/org/${orgId}/forms/${formId}`;
        method = "PATCH";
      }
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
              if (response.ok) {
          setFormId(data.formId || formId);
          setLastSaved(new Date());
          displayToast("Form saved successfully!", "success");
        } else {
          displayToast(data.error || "Failed to save form.", "error");
        }
      } catch (error) {
        console.error("Save error:", error);
        displayToast("Error saving form.", "error");
      }
    setIsSaving(false);
  };

  const handleCopyLink = () => {
    const url = typeof window !== 'undefined'
      ? `${window.location.origin}/form/${formId}`
      : `/form/${formId}`;
    navigator.clipboard.writeText(url);
    displayToast("Link copied to clipboard!", "success");
  };

  const getQuestionTypeIcon = (type) => {
    switch (type) {
      case "text": return "📝";
      case "number": return "🔢";
      case "mcq": return "☑️";
      case "rating": return "⭐";
      default: return "❓";
    }
  };

  const getTotalQuestions = () => {
    return sections.reduce((total, section) => total + (section.questions?.length || 0), 0);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === "dark" ? "bg-gray-900" : "bg-gray-50"
    }`}>
      {/* Header */}
      <div className={`border-b shadow-sm ${
        theme === "dark" 
          ? "bg-gray-800 border-gray-700" 
          : "bg-white border-gray-200"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className={`text-xl font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>
                  {formId ? "Edit Form" : "Create New Form"}
                </h1>
                <p className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}>
                  {getTotalQuestions()} questions • {sections.length} sections
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {lastSaved && (
                <span className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}>
                  Last saved: {lastSaved.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={handleSaveForm}
                disabled={isSaving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Form
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className={`rounded-lg shadow-sm border p-6 ${
              theme === "dark" 
                ? "bg-gray-800 border-gray-700" 
                : "bg-white border-gray-200"
            }`}>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("form")}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === "form"
                      ? "bg-blue-100 text-blue-700"
                      : theme === "dark"
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <FileText className="h-4 w-4 mr-3" />
                  Form Builder
                </button>
                <button
                  onClick={() => setActiveTab("ai")}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === "ai"
                      ? "bg-blue-100 text-blue-700"
                      : theme === "dark"
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Brain className="h-4 w-4 mr-3" />
                  AI Settings
                </button>
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === "preview"
                      ? "bg-blue-100 text-blue-700"
                      : theme === "dark"
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Eye className="h-4 w-4 mr-3" />
                  Preview
                </button>
              </nav>

              {formId && (
                <div className={`mt-6 pt-6 border-t ${
                  theme === "dark" ? "border-gray-700" : "border-gray-200"
                }`}>
                  <h3 className={`text-sm font-medium mb-3 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}>Form Link</h3>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={`/form/${formId}`}
                      readOnly
                      className={`flex-1 text-sm border rounded px-3 py-2 ${
                        theme === "dark" 
                          ? "bg-gray-700 border-gray-600 text-white" 
                          : "bg-gray-50 border-gray-300"
                      }`}
                    />
                    <button
                      onClick={handleCopyLink}
                      className={`p-2 hover:text-gray-600 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-400"
                      }`}
                      title="Copy link"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "form" && (
              <div className="space-y-6">
                                {/* Basic Form Info */}
                <div className={`rounded-lg shadow-sm border p-6 ${
                  theme === "dark" 
                    ? "bg-gray-800 border-gray-700" 
                    : "bg-white border-gray-200"
                }`}>
                  <h2 className={`text-lg font-semibold mb-4 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}>Basic Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}>
                        Form Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter form name"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          theme === "dark" 
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                            : "border-gray-300"
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}>
                        Cutoff Score (%)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., 70"
                        value={cutoff}
                        onChange={(e) => setCutoff(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          theme === "dark" 
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                            : "border-gray-300"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Domains */}
                <div className={`rounded-lg shadow-sm border p-6 ${
                  theme === "dark" 
                    ? "bg-gray-800 border-gray-700" 
                    : "bg-white border-gray-200"
                }`}>
                  <h2 className={`text-lg font-semibold mb-4 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}>Domains</h2>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}>
                      Evaluation Domains (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Frontend, Backend, Data Science"
                      value={domains.join(", ")}
                      onChange={(e) => setDomains(e.target.value.split(", ").filter(d => d.trim()))}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        theme === "dark" 
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                          : "border-gray-300"
                      }`}
                    />
                    <p className={`text-sm mt-2 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}>
                      Specify the domains this evaluation covers
                    </p>
                  </div>
                </div>

                {/* Sections */}
                <div className="space-y-4">
                  {sections.map((section, secIndex) => (
                    <div key={secIndex} className={`rounded-lg shadow-sm border ${
                      theme === "dark" 
                        ? "bg-gray-800 border-gray-700" 
                        : "bg-white border-gray-200"
                    }`}>
                      <div className={`p-4 border-b ${
                        theme === "dark" ? "border-gray-700" : "border-gray-200"
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => toggleSection(secIndex)}
                              className={`${
                                theme === "dark" ? "text-gray-400 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
                              }`}
                            >
                              {collapsedSections.has(secIndex) ? (
                                <ChevronDown className="h-5 w-5" />
                              ) : (
                                <ChevronUp className="h-5 w-5" />
                              )}
                            </button>
                            <input
                              type="text"
                              placeholder="Section Title"
                              value={section.title}
                              onChange={(e) => handleSectionTitleChange(secIndex, e.target.value)}
                              className={`text-lg font-medium border-none focus:outline-none focus:ring-0 bg-transparent ${
                                theme === "dark" ? "text-white placeholder-gray-400" : "text-gray-900"
                              }`}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm ${
                              theme === "dark" ? "text-gray-400" : "text-gray-500"
                            }`}>
                              {section.questions?.length || 0} questions
                            </span>
                          </div>
                        </div>
                      </div>

                      {!collapsedSections.has(secIndex) && (
                        <div className="p-4 space-y-4">
                          {section.questions.map((q, qIndex) => (
                            <div key={q.id} className={`rounded-lg p-4 border ${
                              theme === "dark" 
                                ? "bg-gray-700 border-gray-600" 
                                : "bg-gray-50 border-gray-200"
                            }`}>
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 mt-1">
                                  <span className="text-lg">{getQuestionTypeIcon(q.type)}</span>
                                </div>
                                <div className="flex-1 space-y-3">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className={`block text-sm font-medium mb-1 ${
                                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                                      }`}>
                                        Question Type
                                      </label>
                                      <select
                                        value={q.type}
                                        onChange={(e) => handleQuestionChange(secIndex, qIndex, "type", e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                          theme === "dark" 
                                            ? "bg-gray-600 border-gray-500 text-white" 
                                            : "border-gray-300"
                                        }`}
                                      >
                                        <option value="text">Text</option>
                                        <option value="number">Number</option>
                                        <option value="mcq">Multiple Choice (MCQ)</option>
                                        <option value="rating">Rating</option>
                                      </select>
                                    </div>
                                    <div>
                                      <label className={`block text-sm font-medium mb-1 ${
                                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                                      }`}>
                                        Question Weight
                                      </label>
                                      <input
                                        type="number"
                                        min={1}
                                        value={q.weight || 1}
                                        onChange={e => handleQuestionChange(secIndex, qIndex, "weight", Number(e.target.value))}
                                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                          theme === "dark" 
                                            ? "bg-gray-600 border-gray-500 text-white" 
                                            : "border-gray-300"
                                        }`}
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className={`block text-sm font-medium mb-1 ${
                                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                                    }`}>
                                      Question Label
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="Enter your question"
                                      value={q.label}
                                      onChange={(e) => handleQuestionChange(secIndex, qIndex, "label", e.target.value)}
                                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        theme === "dark" 
                                          ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" 
                                          : "border-gray-300"
                                      }`}
                                    />
                                  </div>

                                  {/* Rubrics */}
                                  <div>
                                    <label className={`block text-sm font-medium mb-2 ${
                                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                                    }`}>
                                      Evaluation Rubrics
                                    </label>
                                    <div className="space-y-2">
                                      {(Array.isArray(q.rubrics) ? q.rubrics : []).map((rubric, rIdx) => (
                                        <div key={rIdx} className={`flex items-center space-x-2 p-3 rounded border ${
                                          theme === "dark" 
                                            ? "bg-gray-600 border-gray-500" 
                                            : "bg-white border-gray-200"
                                        }`}>
                                          <input
                                            type="text"
                                            placeholder="Rubric Label"
                                            value={rubric.label}
                                            onChange={e => handleRubricChange(secIndex, qIndex, rIdx, "label", e.target.value)}
                                            className={`flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                              theme === "dark" 
                                                ? "bg-gray-500 border-gray-400 text-white placeholder-gray-400" 
                                                : "border-gray-300"
                                            }`}
                                          />
                                          <input
                                            type="number"
                                            min={1}
                                            placeholder="Weight"
                                            value={rubric.weight}
                                            onChange={e => handleRubricChange(secIndex, qIndex, rIdx, "weight", Number(e.target.value))}
                                            className={`w-20 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                              theme === "dark" 
                                                ? "bg-gray-500 border-gray-400 text-white placeholder-gray-400" 
                                                : "border-gray-300"
                                            }`}
                                          />
                                          <input
                                            type="text"
                                            placeholder="Description (optional)"
                                            value={rubric.description || ""}
                                            onChange={e => handleRubricChange(secIndex, qIndex, rIdx, "description", e.target.value)}
                                            className={`flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                              theme === "dark" 
                                                ? "bg-gray-500 border-gray-400 text-white placeholder-gray-400" 
                                                : "border-gray-300"
                                            }`}
                                          />
                                          <button
                                            type="button"
                                            onClick={() => handleRemoveRubric(secIndex, qIndex, rIdx)}
                                            className={`p-2 rounded ${
                                              theme === "dark" 
                                                ? "text-red-400 hover:text-red-300 hover:bg-red-900/20" 
                                                : "text-red-500 hover:text-red-700 hover:bg-red-50"
                                            }`}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </button>
                                        </div>
                                      ))}
                                      <button
                                        type="button"
                                        onClick={() => handleAddRubric(secIndex, qIndex)}
                                        className={`inline-flex items-center px-3 py-2 border shadow-sm text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                          theme === "dark" 
                                            ? "border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600" 
                                            : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                                        }`}
                                      >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Rubric
                                      </button>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <label className="flex items-center">
                                      <input
                                        type="checkbox"
                                        checked={q.required}
                                        onChange={(e) => handleQuestionChange(secIndex, qIndex, "required", e.target.checked)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                      />
                                      <span className={`ml-2 text-sm ${
                                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                                      }`}>Required</span>
                                    </label>
                                  </div>

                                  {q.type === "mcq" && (
                                    <div>
                                      <label className={`block text-sm font-medium mb-1 ${
                                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                                      }`}>
                                        Options (comma separated)
                                      </label>
                                      <textarea
                                        placeholder="A, B, C, D"
                                        value={q.options?.join(", ") || ""}
                                        onChange={(e) => handleQuestionChange(secIndex, qIndex, "options", e.target.value.split(",").map((opt) => opt.trim()))}
                                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                          theme === "dark" 
                                            ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" 
                                            : "border-gray-300"
                                        }`}
                                        rows={2}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}

                          <button
                            onClick={() => handleAddQuestion(secIndex)}
                            className={`w-full inline-flex items-center justify-center px-4 py-3 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                              theme === "dark" 
                                ? "border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600" 
                                : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                            }`}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Question
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={handleAddSection}
                    className={`w-full inline-flex items-center justify-center px-4 py-3 border-2 border-dashed rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      theme === "dark" 
                        ? "border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700" 
                        : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Section
                  </button>
                </div>
              </div>
            )}

            {activeTab === "ai" && (
              <div className="space-y-6">
                {/* AI Prompt */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Evaluation Prompt</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Detailed instructions for AI evaluation
                    </label>
                    <textarea
                      value={llmPrompt}
                      onChange={e => setLlmPrompt(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={6}
                      placeholder="Describe what the AI should consider when evaluating this form..."
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Provide clear instructions for how the AI should evaluate candidate responses
                    </p>
                  </div>
                </div>

                {/* LLM Settings */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Model Settings</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Provider
                      </label>
                      <select
                        value={llmConfig.provider}
                        onChange={e => handleLlmConfigChange("provider", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {PROVIDERS.map(p => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Model
                      </label>
                      <select
                        value={llmConfig.model}
                        onChange={e => handleLlmConfigChange("model", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {(PROVIDER_MODELS[llmConfig.provider] || []).map(m => (
                          <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                      </select>
                      {llmConfigErrors.model && (
                        <p className="text-sm text-red-600 mt-1">{llmConfigErrors.model}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Temperature
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={1}
                        step={0.01}
                        value={llmConfig.temperature}
                        onChange={e => handleLlmConfigChange("temperature", parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {llmConfigErrors.temperature && (
                        <p className="text-sm text-red-600 mt-1">{llmConfigErrors.temperature}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Tokens
                      </label>
                      <input
                        type="number"
                        min={50}
                        max={2000}
                        value={llmConfig.max_tokens}
                        onChange={e => handleLlmConfigChange("max_tokens", parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {llmConfigErrors.max_tokens && (
                        <p className="text-sm text-red-600 mt-1">{llmConfigErrors.max_tokens}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    💡 Tip: Lower temperature (0.2) provides more consistent evaluations, while higher values (0.8+) allow for more creative responses.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "preview" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Form Preview</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">{formName || "Untitled Form"}</h3>
                  {sections.map((section, secIndex) => (
                    <div key={secIndex} className="mb-6">
                      {section.title && (
                        <h4 className="text-lg font-medium mb-3">{section.title}</h4>
                      )}
                      <div className="space-y-4">
                        {section.questions.map((q, qIndex) => (
                          <div key={qIndex} className="bg-white p-4 rounded border">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm text-gray-500">{getQuestionTypeIcon(q.type)}</span>
                              <span className="text-sm font-medium">{q.label || "Untitled Question"}</span>
                              {q.required && <span className="text-red-500 text-sm">*</span>}
                            </div>
                            <div className="text-sm text-gray-600">
                              {q.type === "text" && <div className="h-10 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center px-3">Text input</div>}
                              {q.type === "number" && <div className="h-10 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center px-3">Number input</div>}
                              {q.type === "mcq" && (
                                <div className="space-y-2">
                                  {(q.options || []).map((opt, optIndex) => (
                                    <div key={optIndex} className="flex items-center">
                                      <input type="radio" disabled className="mr-2" />
                                      <span>{opt}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {q.type === "rating" && <div className="h-10 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center px-3">Rating scale</div>}
                            </div>
                            {q.rubrics && q.rubrics.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-xs text-gray-500 mb-2">Evaluation rubrics:</p>
                                <div className="space-y-1">
                                  {q.rubrics.map((rubric, rIdx) => (
                                    <div key={rIdx} className="text-xs text-gray-600">
                                      • {rubric.label} (weight: {rubric.weight})
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-6 right-6 px-4 py-3 rounded-lg shadow-lg z-50 transition-all ${
          toastType === "success" 
            ? theme === "dark" ? "bg-green-800 text-green-100 border border-green-700" : "bg-green-600 text-white"
            : theme === "dark" ? "bg-red-800 text-red-100 border border-red-700" : "bg-red-600 text-white"
        }`}>
          <div className="flex items-center space-x-2">
            {toastType === "success" ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
