import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "TES - AI-Powered Candidate Evaluation Platform",
  description: "Transform your hiring process with AI-driven evaluations. Create custom forms, collect responses, and get intelligent insights for fair, scalable hiring decisions.",
  keywords: ["hiring", "recruitment", "AI evaluation", "candidate assessment", "HR tech"],
  authors: [{ name: "TES Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "TES - AI-Powered Candidate Evaluation Platform",
    description: "Transform your hiring process with AI-driven evaluations.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "TES - AI-Powered Candidate Evaluation Platform",
    description: "Transform your hiring process with AI-driven evaluations.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased bg-background text-foreground min-h-screen">
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
