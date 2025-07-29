import { useState, useEffect } from "react";
import { X, Plus, Trash2, ChevronUp, ChevronDown, FileText, Mail, Settings, Save, ArrowUp, ArrowDown } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

export default function FlowForm({ orgId, flow, onClose, onSaved }) {
  const [name, setName] = useState(flow?.name || "");
  const [description, setDescription] = useState(flow?.description || "");
  const [stages, setStages] = useState(flow?.stages || []);
  const [finalEmail, setFinalEmail] = useState(flow?.finalEmail || { subject: "", passBody: "", failBody: "" });
  const [forms, setForms] = useState([]);
  const [saving, setSaving] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    // Fetch all forms for this org for stage selection
    const fetchForms = async () => {
      if (!orgId) return;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/org/${orgId}/forms`);
      const data = await res.json();
      setForms(data.forms || []);
    };
    fetchForms();
  }, [orgId]);

  const handleStageChange = (idx, key, value) => {
    setStages(prev => prev.map((s, i) => i === idx ? { ...s, [key]: value } : s));
  };
  const handleAddStage = () => {
    setStages(prev => [...prev, { formId: "", name: "", cutoff: null, sendIf: "always", emailTemplate: { subject: "", body: "" } }]);
  };
  const handleRemoveStage = (idx) => {
    setStages(prev => prev.filter((_, i) => i !== idx));
  };
  const handleMoveStage = (idx, dir) => {
    setStages(prev => {
      const arr = [...prev];
      const [removed] = arr.splice(idx, 1);
      arr.splice(idx + dir, 0, removed);
      return arr;
    });
  };
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const method = flow ? "PATCH" : "POST";
    const url = flow
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/org/${orgId}/flows/${flow.flowId}`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/org/${orgId}/flows`;
    const body = {
      name,
      description,
      stages,
      finalEmail,
    };
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (res.ok) {
      onSaved && onSaved();
    } else {
      alert("Failed to save flow");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto ${
        theme === "dark" 
          ? "bg-gray-800 border border-gray-700" 
          : "bg-white border border-gray-200"
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          theme === "dark" ? "border-gray-700" : "border-gray-200"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              theme === "dark" ? "bg-blue-600" : "bg-blue-100"
            }`}>
              <FileText className={`w-5 h-5 ${
                theme === "dark" ? "text-white" : "text-blue-600"
              }`} />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>{flow ? "Edit Flow" : "Create Flow"}</h2>
              <p className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}>Configure multi-stage evaluation process</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === "dark" 
                ? "text-gray-400 hover:text-white hover:bg-gray-700" 
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block font-medium mb-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}>Flow Name</label>
                <input 
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    theme === "dark" 
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                      : "border-gray-300"
                  }`}
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="Enter flow name"
                  required 
                />
              </div>
              <div>
                <label className={`block font-medium mb-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}>Description</label>
                <textarea 
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                    theme === "dark" 
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                      : "border-gray-300"
                  }`}
                  value={description} 
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe this evaluation flow"
                  rows={3}
                />
              </div>
            </div>

            {/* Stages Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Settings className={`w-5 h-5 ${
                    theme === "dark" ? "text-blue-400" : "text-blue-600"
                  }`} />
                  <h3 className={`text-lg font-semibold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}>Stages</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    theme === "dark" 
                      ? "bg-gray-700 text-gray-300" 
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {stages.length} stage{stages.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <button 
                  type="button" 
                  onClick={handleAddStage}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    theme === "dark"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Add Stage
                </button>
              </div>

              <div className="space-y-4">
                {stages.map((stage, idx) => (
                  <div key={idx} className={`rounded-lg border p-4 ${
                    theme === "dark" 
                      ? "bg-gray-700 border-gray-600" 
                      : "bg-gray-50 border-gray-200"
                  }`}>
                    {/* Stage Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600"
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className={`font-medium ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}>Stage {idx + 1}</h4>
                          <p className={`text-sm ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}>{stage.name || "Unnamed stage"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          type="button" 
                          onClick={() => handleRemoveStage(idx)}
                          className={`p-2 rounded-lg transition-colors ${
                            theme === "dark" 
                              ? "text-red-400 hover:text-red-300 hover:bg-red-900/20" 
                              : "text-red-500 hover:text-red-700 hover:bg-red-50"
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {idx > 0 && (
                          <button 
                            type="button" 
                            onClick={() => handleMoveStage(idx, -1)}
                            className={`p-2 rounded-lg transition-colors ${
                              theme === "dark" 
                                ? "text-blue-400 hover:text-blue-300 hover:bg-blue-900/20" 
                                : "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            }`}
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                        )}
                        {idx < stages.length - 1 && (
                          <button 
                            type="button" 
                            onClick={() => handleMoveStage(idx, 1)}
                            className={`p-2 rounded-lg transition-colors ${
                              theme === "dark" 
                                ? "text-blue-400 hover:text-blue-300 hover:bg-blue-900/20" 
                                : "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            }`}
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Stage Configuration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}>Form</label>
                        <select 
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            theme === "dark" 
                              ? "bg-gray-600 border-gray-500 text-white" 
                              : "border-gray-300"
                          }`}
                          value={stage.formId} 
                          onChange={e => handleStageChange(idx, "formId", e.target.value)} 
                          required
                        >
                          <option value="">Select Form</option>
                          {forms.map(f => <option key={f.formId} value={f.formId}>{f.formName}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}>Stage Name</label>
                        <input 
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            theme === "dark" 
                              ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" 
                              : "border-gray-300"
                          }`}
                          placeholder="Stage Name" 
                          value={stage.name} 
                          onChange={e => handleStageChange(idx, "name", e.target.value)} 
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}>Cutoff (%)</label>
                        <input 
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            theme === "dark" 
                              ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" 
                              : "border-gray-300"
                          }`}
                          type="number" 
                          placeholder="70" 
                          value={stage.cutoff ?? ""} 
                          onChange={e => handleStageChange(idx, "cutoff", e.target.value ? Number(e.target.value) : null)} 
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}>Send If</label>
                        <select 
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            theme === "dark" 
                              ? "bg-gray-600 border-gray-500 text-white" 
                              : "border-gray-300"
                          }`}
                          value={stage.sendIf} 
                          onChange={e => handleStageChange(idx, "sendIf", e.target.value)}
                        >
                          <option value="always">Always</option>
                          <option value="pass">If Passed</option>
                        </select>
                      </div>
                    </div>

                    {/* Email Template */}
                    <div className={`p-4 rounded-lg ${
                      theme === "dark" ? "bg-gray-600" : "bg-gray-100"
                    }`}>
                      <div className="flex items-center gap-2 mb-3">
                        <Mail className={`w-4 h-4 ${
                          theme === "dark" ? "text-blue-400" : "text-blue-600"
                        }`} />
                        <h5 className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}>Invite Email Template</h5>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}>Subject</label>
                          <input 
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              theme === "dark" 
                                ? "bg-gray-500 border-gray-400 text-white placeholder-gray-400" 
                                : "border-gray-300"
                            }`}
                            placeholder="Invite Email Subject" 
                            value={stage.emailTemplate?.subject || ""} 
                            onChange={e => handleStageChange(idx, "emailTemplate", { ...stage.emailTemplate, subject: e.target.value })} 
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}>Body</label>
                          <textarea 
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                              theme === "dark" 
                                ? "bg-gray-500 border-gray-400 text-white placeholder-gray-400" 
                                : "border-gray-300"
                            }`}
                            placeholder="Use {{formLink}} for the form URL" 
                            value={stage.emailTemplate?.body || ""} 
                            onChange={e => handleStageChange(idx, "emailTemplate", { ...stage.emailTemplate, body: e.target.value })} 
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Email Template */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Mail className={`w-5 h-5 ${
                  theme === "dark" ? "text-blue-400" : "text-blue-600"
                }`} />
                <h3 className={`text-lg font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>Final Email Template</h3>
              </div>
              <div className={`p-4 rounded-lg ${
                theme === "dark" ? "bg-gray-700 border border-gray-600" : "bg-gray-50 border border-gray-200"
              }`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}>Subject</label>
                    <input 
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        theme === "dark" 
                          ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" 
                          : "border-gray-300"
                      }`}
                      placeholder="Final Result Subject" 
                      value={finalEmail.subject} 
                      onChange={e => setFinalEmail(f => ({ ...f, subject: e.target.value }))} 
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}>Pass Body</label>
                    <textarea 
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                        theme === "dark" 
                          ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" 
                          : "border-gray-300"
                      }`}
                      placeholder="Congratulations message" 
                      value={finalEmail.passBody} 
                      onChange={e => setFinalEmail(f => ({ ...f, passBody: e.target.value }))} 
                      rows={3}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}>Fail Body</label>
                    <textarea 
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                        theme === "dark" 
                          ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" 
                          : "border-gray-300"
                      }`}
                      placeholder="Thank you for participating message" 
                      value={finalEmail.failBody} 
                      onChange={e => setFinalEmail(f => ({ ...f, failBody: e.target.value }))} 
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button 
                type="button" 
                onClick={onClose}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={saving}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  theme === "dark"
                    ? "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-600"
                    : "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400"
                }`}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Flow
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 