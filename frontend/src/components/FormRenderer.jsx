"use client";

import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Clock, User, Mail, Phone } from "lucide-react";

export default function FormRenderer({ formId, theme = "light" }) {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [candidateInfo, setCandidateInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/get-form/${formId}`);
        const data = await res.json();
        if (data.form) {
          // Ensure all questions have unique IDs
          const processedForm = {
            ...data.form,
            sections: data.form.sections?.map((section, sectionIndex) => ({
              ...section,
              questions: section.questions?.map((question, questionIndex) => ({
                ...question,
                id: question.id || `q_${sectionIndex}_${questionIndex}_${Date.now()}`
              }))
            }))
          };
          setForm(processedForm);
          
          // Initialize form data with proper IDs
          const initialData = {};
          processedForm.sections?.forEach(section => {
            section.questions?.forEach(question => {
              initialData[question.id] = "";
            });
          });
          setFormData(initialData);
        }
      } catch (error) {
        console.error("Failed to fetch form:", error);
      } finally {
        setLoading(false);
      }
    };

    if (formId) {
      fetchForm();
    }
  }, [formId]);

  const handleInputChange = (questionId, value) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors(prev => ({
        ...prev,
        [questionId]: ""
      }));
    }
  };

  const handleCandidateInfoChange = (field, value) => {
    setCandidateInfo(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate candidate info
    if (!candidateInfo.name || candidateInfo.name.trim() === "") {
      newErrors.name = "Name is required";
    }
    if (!candidateInfo.email || candidateInfo.email.trim() === "") {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidateInfo.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!candidateInfo.phone || candidateInfo.phone.trim() === "") {
      newErrors.phone = "Phone number is required";
    }
    
    // Validate form questions
    form.sections?.forEach(section => {
      section.questions?.forEach(question => {
        if (question.required && (!formData[question.id] || formData[question.id].trim() === "")) {
          newErrors[question.id] = "This field is required";
        }
      });
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      // Get orgId from the form data (which was fetched with the form)
      const orgId = form.orgId;
      
      if (!orgId) {
        throw new Error("Organization ID not found. Please ensure you're accessing the form from a valid link.");
      }
      
      // For candidate forms, we'll use default values since this is a demo
      const submissionData = {
        orgId: orgId,
        formId,
        candidateName: candidateInfo.name,
        candidateEmail: candidateInfo.email,
        phone: candidateInfo.phone,
        responses: Object.entries(formData).map(([questionId, answer]) => ({
          questionId,
          answer
        })),
        submittedAt: new Date().toISOString()
      };

      console.log("Submitting form with data:", { orgId, formId, candidateName: submissionData.candidateName });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/submit-form`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData)
      });

      if (res.ok) {
        // Show success message or redirect
        alert("Form submitted successfully!");
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to submit form");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading form...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} flex items-center justify-center`}>
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Form Not Found</h2>
          <p className="text-muted-foreground">The requested form could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-blue-600' : 'bg-gradient-primary'} rounded-xl flex items-center justify-center`}>
                <span className="text-white font-bold text-sm">TES</span>
              </div>
              <div>
                <h1 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {form.formName}
                </h1>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Evaluation Form
                </p>
              </div>
            </div>
            {/* Removed cutoff display for candidates */}
          </div>
        </div>
      </header>

      {/* Form Content */}
      <main className="max-w-4xl mx-auto px-6 py-8 pb-24">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Candidate Information Section */}
          <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border shadow-sm p-6`}>
            <h2 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Candidate Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="name" className={`block text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Name
                  {errors.name && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type="text"
                  id="name"
                  value={candidateInfo.name}
                  onChange={(e) => handleCandidateInfoChange('name', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label htmlFor="email" className={`block text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Email
                  {errors.email && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type="email"
                  id="email"
                  value={candidateInfo.email}
                  onChange={(e) => handleCandidateInfoChange('email', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="phone" className={`block text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Phone Number
                  {errors.phone && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={candidateInfo.phone}
                  onChange={(e) => handleCandidateInfoChange('phone', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>

          {form.sections?.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border shadow-sm p-6`}
            >
              {/* Section Header */}
              {section.title && (
                <div className="mb-6">
                  <h2 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {section.title}
                  </h2>
                  {section.description && (
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {section.description}
                    </p>
                  )}
                </div>
              )}

              {/* Questions */}
              <div className="space-y-6">
                {section.questions?.map((question, questionIndex) => (
                  <div key={question.id} className="space-y-3">
                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {question.label}
                      {question.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>

                    {/* Question Description */}
                    {question.description && (
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {question.description}
                      </p>
                    )}

                    {/* Input Field */}
                    <div className="space-y-2">
                      {question.type === 'text' && (
                        <textarea
                          value={formData[question.id] || ""}
                          onChange={(e) => handleInputChange(question.id, e.target.value)}
                          className={`w-full px-4 py-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            theme === 'dark' 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          } ${errors[question.id] ? 'border-red-500' : ''}`}
                          placeholder="Enter your answer..."
                          rows={4}
                        />
                      )}

                      {question.type === 'rating' && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-4">
                            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>1</span>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={formData[question.id] || "5"}
                              onChange={(e) => handleInputChange(question.id, e.target.value)}
                              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>10</span>
                          </div>
                          <div className="text-center">
                            <span className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {formData[question.id] || "5"}
                            </span>
                          </div>
                        </div>
                      )}

                      {question.type === 'mcq' && (
                        <div className="space-y-2">
                          {question.options?.map((option, optionIndex) => (
                            <label
                              key={optionIndex}
                              className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                theme === 'dark'
                                  ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                                  : 'bg-white border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              <input
                                type="radio"
                                name={question.id}
                                value={option}
                                checked={formData[question.id] === option}
                                onChange={(e) => handleInputChange(question.id, e.target.value)}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              />
                              <span className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}

                      {/* Error Message */}
                      {errors[question.id] && (
                        <div className="flex items-center gap-2 text-red-500 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          {errors[question.id]}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </form>
      </main>

      {/* Sticky Submit Button */}
      <div className={`fixed bottom-0 left-0 right-0 ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-t shadow-lg z-10`}>
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              onClick={handleSubmit}
              className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                submitting
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : theme === 'dark'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="loading-spinner w-4 h-4" />
                  Submitting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Submit Evaluation
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t mt-8`}>
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 ${theme === 'dark' ? 'bg-blue-600' : 'bg-gradient-primary'} rounded-lg flex items-center justify-center`}>
                <span className="text-white font-bold text-xs">TES</span>
              </div>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Powered by TES Platform
              </span>
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Secure • Professional • AI-Powered
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 