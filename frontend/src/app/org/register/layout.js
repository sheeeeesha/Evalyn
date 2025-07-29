"use client";
import { SignupProvider } from "./SignupContext";

export default function RegisterLayout({ children }) {
  return <SignupProvider>{children}</SignupProvider>;
} 