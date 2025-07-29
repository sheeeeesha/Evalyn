"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const SignupContext = createContext();

const initialSignupData = {
  admin: {
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "CEO/Admin",
  },
  orgInfo: {
    orgName: "",
    logo: null,
    industry: "",
    companySize: "",
    website: "",
    emailDomain: "",
    country: "",
    hiringDomains: [],
  },
  setup: {
    workspaceName: "",
    teammates: [], // {name, email, role}
    evaluationForm: null, // template or custom
    branding: {
      senderName: "",
      emailSignature: "",
    },
  },
};

export function SignupProvider({ children }) {
  const [signupData, setSignupData] = useState(initialSignupData);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = typeof window !== "undefined" && localStorage.getItem("signupData");
    if (stored) setSignupData(JSON.parse(stored));
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("signupData", JSON.stringify(signupData));
    }
  }, [signupData]);

  const updateSignupData = (section, data) => {
    setSignupData((prev) => ({ ...prev, [section]: { ...prev[section], ...data } }));
  };

  const resetSignupData = () => {
    setSignupData(initialSignupData);
    if (typeof window !== "undefined") {
      localStorage.removeItem("signupData");
    }
  };

  return (
    <SignupContext.Provider value={{ signupData, updateSignupData, resetSignupData }}>
      {children}
    </SignupContext.Provider>
  );
}

export function useSignup() {
  return useContext(SignupContext);
} 