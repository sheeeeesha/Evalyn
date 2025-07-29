"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Eye, Edit, Trash2, Link2, Plus, FileText, Calendar, Users, BarChart3 } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/lib/ThemeContext";

export default function MyFormsPage() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copyToast, setCopyToast] = useState(false);
  const [copiedFormId, setCopiedFormId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchForms = async () => {
      setLoading(true);
      const orgId = localStorage.getItem("orgId");
      if (!orgId) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/org/${orgId}/forms`
        );
        const data = await res.json();
        setForms(data.forms || []);
      } catch (err) {
        console.error("Failed to fetch forms", err);
      }
      setLoading(false);
    };
    fetchForms();
  }, []);

  const handleCopyLink = (formId) => {
    const theme = localStorage.getItem("formTheme") || "light";
    const orgId = localStorage.getItem("orgId");
    const url = typeof window !== 'undefined'
      ? `${window.location.origin}/form/${formId}?theme=${theme}&orgId=${orgId}`
      : `/form/${formId}?theme=${theme}&orgId=${orgId}`;
    navigator.clipboard.writeText(url);
    setCopiedFormId(formId);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2000);
  };

  const handleDeleteForm = async () => {
    if (!formToDelete) return;
    setDeleteLoading(true);
    const orgId = localStorage.getItem("orgId");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/org/${orgId}/forms/${formToDelete}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setForms(forms.filter(f => f.formId !== formToDelete));
        setDeleteDialogOpen(false);
        setFormToDelete(null);
      }
    } catch (err) {
      console.error("Failed to delete form", err);
    }
    setDeleteLoading(false);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50"
      }`}>
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4" />
          <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>Loading forms...</p>
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
        <div className="container-responsive py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>Forms</h1>
              <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                Create and manage your evaluation forms
              </p>
            </div>
            <Link href="/org/dashboard/form-builder" className="btn-primary px-6 py-3">
              <Plus className="w-5 h-5 mr-2" />
              Create New Form
            </Link>
          </div>
        </div>
      </header>

      
      <main className="container-responsive py-8">
        {forms.length === 0 ? (
          <div className="text-center py-16">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-100"
            }`}>
              <FileText className={`w-12 h-12 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`} />
            </div>
            <h2 className={`text-2xl font-bold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}>No forms yet</h2>
            <p className={`mb-8 max-w-md mx-auto ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}>
              Create your first evaluation form to start collecting candidate responses and get AI-powered insights.
            </p>
            <Link href="/org/dashboard/form-builder" className="btn-primary px-8 py-3">
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Form
            </Link>
          </div>
        ) : (
          <div className="grid-responsive">
            {forms.map((form) => (
              <div
                key={form.formId}
                className={`p-6 hover:shadow-medium transition-all duration-300 group rounded-lg border ${
                  theme === "dark" 
                    ? "bg-gray-800 border-gray-700 hover:bg-gray-750" 
                    : "bg-white border-gray-200 hover:shadow-lg"
                }`}
              >
                {/* Form Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className={`text-xl font-semibold mb-2 group-hover:text-primary transition-colors ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}>
                      {form.formName}
                    </h3>
                    <div className={`flex items-center gap-4 text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{form.createdAt ? new Date(form.createdAt).toLocaleDateString() : "Recently"}</span>
                      </div>
                      {form.cutoff && (
                        <div className="flex items-center gap-1">
                          <BarChart3 className="w-4 h-4" />
                          <span>Cutoff: {form.cutoff}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopyLink(form.formId)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy form link"
                  >
                    <Link2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Form Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className={`text-center p-3 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                  }`}>
                    <div className={`text-2xl font-bold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}>
                      {form.sections?.reduce((total, section) => total + (section.questions?.length || 0), 0) || 0}
                    </div>
                    <div className={`text-xs ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}>Questions</div>
                  </div>
                  <div className={`text-center p-3 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                  }`}>
                    <div className={`text-2xl font-bold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}>
                      {form.sections?.length || 0}
                    </div>
                    <div className={`text-xs ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}>Sections</div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 min-w-0"
                    onClick={() => router.push(`/org/dashboard/submissions?formId=${form.formId}`)}
                  >
                    <Eye className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">View Submissions</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 min-w-0"
                    onClick={() => router.push(`/org/dashboard/form-builder?formId=${form.formId}`)}
                  >
                    <Edit className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">Edit</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive flex-shrink-0"
                    onClick={() => {
                      setFormToDelete(form.formId);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Copy Toast */}
                {copyToast && copiedFormId === form.formId && (
                  <div className={`absolute top-4 right-4 px-3 py-2 rounded-lg text-sm ${
                    theme === "dark" 
                      ? "bg-green-800 text-green-100 border border-green-700" 
                      : "bg-green-100 border border-green-200 text-green-800"
                  }`}>
                    Link copied!
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className={theme === "dark" ? "bg-gray-800 border-gray-700" : ""}>
            <DialogHeader>
              <DialogTitle className={theme === "dark" ? "text-white" : ""}>Delete Form</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                Are you sure you want to delete this form? This action cannot be undone and will also delete all associated submissions.
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={deleteLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteForm}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </div>
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
} 