"use client";

import { useState } from "react";
import { Sun, Moon, Eye, X } from "lucide-react";

export default function FormPreview({ form, onClose }) {
  const [previewTheme, setPreviewTheme] = useState("light");

  if (!form) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Preview Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Form Preview</h2>
            <span className="text-sm text-muted-foreground">
              How candidates will see your form
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setPreviewTheme("light")}
                className={`p-2 rounded-md transition-colors ${
                  previewTheme === "light" 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
                title="Light Mode"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewTheme("dark")}
                className={`p-2 rounded-md transition-colors ${
                  previewTheme === "dark" 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
                title="Dark Mode"
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className={`${previewTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
            {/* Form Header */}
            <header className={`${previewTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
              <div className="max-w-4xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${previewTheme === 'dark' ? 'bg-blue-600' : 'bg-gradient-primary'} rounded-xl flex items-center justify-center`}>
                      <span className="text-white font-bold text-sm">TES</span>
                    </div>
                    <div>
                      <h1 className={`text-lg font-semibold ${previewTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {form.formName || "Evaluation Form"}
                      </h1>
                      <p className={`text-sm ${previewTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Evaluation Form
                      </p>
                    </div>
                  </div>
                  {/* Removed cutoff display for candidates */}
                </div>
              </div>
            </header>

            {/* Form Content */}
            <main className="max-w-4xl mx-auto px-6 py-8">
              <div className="space-y-8">
                {/* Candidate Information Section */}
                <div className={`${previewTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border shadow-sm p-6`}>
                  <h2 className={`text-xl font-semibold mb-2 ${previewTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Candidate Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${previewTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Name
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        disabled
                        className={`w-full px-4 py-3 rounded-lg border text-sm bg-gray-100 cursor-not-allowed ${
                          previewTheme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-gray-400' 
                            : 'bg-gray-100 border-gray-300 text-gray-500'
                        }`}
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${previewTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Email
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="email"
                        disabled
                        className={`w-full px-4 py-3 rounded-lg border text-sm bg-gray-100 cursor-not-allowed ${
                          previewTheme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-gray-400' 
                            : 'bg-gray-100 border-gray-300 text-gray-500'
                        }`}
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${previewTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Phone Number
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="tel"
                        disabled
                        className={`w-full px-4 py-3 rounded-lg border text-sm bg-gray-100 cursor-not-allowed ${
                          previewTheme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-gray-400' 
                            : 'bg-gray-100 border-gray-300 text-gray-500'
                        }`}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                </div>

                {form.sections?.map((section, sectionIndex) => (
                  <div
                    key={sectionIndex}
                    className={`${previewTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border shadow-sm p-6`}
                  >
                    {/* Section Header */}
                    {section.title && (
                      <div className="mb-6">
                        <h2 className={`text-xl font-semibold mb-2 ${previewTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {section.title}
                        </h2>
                        {section.description && (
                          <p className={`text-sm ${previewTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {section.description}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Questions */}
                    <div className="space-y-6">
                      {section.questions?.map((question, questionIndex) => (
                        <div key={question.id || questionIndex} className="space-y-3">
                          <label className={`block text-sm font-medium ${previewTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {question.label}
                            {question.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </label>

                          {/* Question Description */}
                          {question.description && (
                            <p className={`text-sm ${previewTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              {question.description}
                            </p>
                          )}

                          {/* Input Field Preview */}
                          <div className="space-y-2">
                            {question.type === 'text' && (
                              <textarea
                                disabled
                                className={`w-full px-4 py-3 rounded-lg border text-sm ${
                                  previewTheme === 'dark' 
                                    ? 'bg-gray-700 border-gray-600 text-gray-400' 
                                    : 'bg-gray-100 border-gray-300 text-gray-500'
                                }`}
                                placeholder="Enter your answer..."
                                rows={4}
                              />
                            )}

                            {question.type === 'rating' && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-4">
                                  <span className={`text-sm ${previewTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>1</span>
                                  <input
                                    type="range"
                                    disabled
                                    min="1"
                                    max="10"
                                    value="5"
                                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-not-allowed slider opacity-50"
                                  />
                                  <span className={`text-sm ${previewTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>10</span>
                                </div>
                                <div className="text-center">
                                  <span className={`text-lg font-semibold ${previewTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                    5
                                  </span>
                                </div>
                              </div>
                            )}

                            {question.type === 'mcq' && (
                              <div className="space-y-2">
                                {question.options?.slice(0, 3).map((option, optionIndex) => (
                                  <label
                                    key={optionIndex}
                                    className={`flex items-center space-x-3 p-3 rounded-lg border ${
                                      previewTheme === 'dark'
                                        ? 'bg-gray-700 border-gray-600'
                                        : 'bg-gray-100 border-gray-200'
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      disabled
                                      className="w-4 h-4 text-blue-600 border-gray-300"
                                    />
                                    <span className={`text-sm ${previewTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                      {option}
                                    </span>
                                  </label>
                                ))}
                                {question.options?.length > 3 && (
                                  <p className={`text-xs ${previewTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                    +{question.options.length - 3} more options
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Submit Button Preview */}
                <div className="flex justify-end">
                  <button
                    disabled
                    className={`px-8 py-3 rounded-lg font-semibold text-white transition-colors ${
                      previewTheme === 'dark'
                        ? 'bg-blue-600'
                        : 'bg-gradient-primary'
                    } opacity-50 cursor-not-allowed`}
                  >
                    Submit Evaluation
                  </button>
                </div>
              </div>
            </main>

            {/* Footer */}
            <footer className={`${previewTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t mt-16`}>
              <div className="max-w-4xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 ${previewTheme === 'dark' ? 'bg-blue-600' : 'bg-gradient-primary'} rounded-lg flex items-center justify-center`}>
                      <span className="text-white font-bold text-xs">TES</span>
                    </div>
                    <span className={`text-sm ${previewTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Powered by TES Platform
                    </span>
                  </div>
                  <div className={`text-xs ${previewTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Secure • Professional • AI-Powered
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
} 