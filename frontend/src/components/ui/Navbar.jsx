"use client"

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, User, LogOut, Settings, BarChart3, FileText, Users } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileAcademyOpen, setMobileAcademyOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-white/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container-responsive h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TES</span>
            </div>
            <span className="font-semibold text-lg text-foreground hidden sm:block">
              TES Platform
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="nav-link">
              Home
            </Link>
            
            {/* Academy Dropdown */}
            <div className="relative group">
              <button className="nav-link flex items-center gap-1">
                Academy
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-border rounded-lg shadow-strong opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  <Link href="#" className="block px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors">
                    Kickstart ESG & BRSR Career
                  </Link>
                  <Link href="#" className="block px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors">
                    GHG Accounting Course
                  </Link>
                  <Link href="#" className="block px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors">
                    Materiality Assessment
                  </Link>
                  <Link href="#" className="block px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors">
                    Life Cycle Assessment (LCA)
                  </Link>
                  <Link href="#" className="block px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors">
                    Sustainable Finance
                  </Link>
                  <Link href="#" className="block px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors">
                    ESG Readiness
                  </Link>
                  <Link href="#" className="block px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors">
                    ESG Mastery Bundle
                  </Link>
                  <Link href="#" className="block px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors">
                    Emissions Bundle
                  </Link>
                  <Link href="#" className="block px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors">
                    All Courses
                  </Link>
                </div>
              </div>
            </div>
            
            <Link href="#" className="nav-link">
              Community
            </Link>
            
            <div className="flex items-center gap-3">
              <Link href="/org/login" className="btn-outline px-4 py-2">
                Sign In
              </Link>
              <Link href="/org/register" className="btn-primary px-4 py-2">
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`absolute top-16 left-0 w-full bg-white border-b border-border md:hidden transition-all duration-300 overflow-hidden ${
            menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="p-4 space-y-4">
            <Link href="/" className="block nav-link py-2">
              Home
            </Link>
            
            {/* Mobile Academy Dropdown */}
            <div className="space-y-2">
              <button
                className="flex items-center justify-between w-full nav-link py-2"
                onClick={() => setMobileAcademyOpen(!mobileAcademyOpen)}
              >
                <span>Academy</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileAcademyOpen ? 'rotate-180' : ''}`} />
              </button>
              <div className={`space-y-1 pl-4 transition-all duration-300 overflow-hidden ${
                mobileAcademyOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground py-1">
                  Kickstart ESG & BRSR Career
                </Link>
                <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground py-1">
                  GHG Accounting Course
                </Link>
                <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground py-1">
                  Materiality Assessment
                </Link>
                <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground py-1">
                  Life Cycle Assessment (LCA)
                </Link>
                <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground py-1">
                  Sustainable Finance
                </Link>
                <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground py-1">
                  ESG Readiness
                </Link>
                <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground py-1">
                  ESG Mastery Bundle
                </Link>
                <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground py-1">
                  Emissions Bundle
                </Link>
                <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground py-1">
                  All Courses
                </Link>
              </div>
            </div>
            
            <Link href="#" className="block nav-link py-2">
              Community
            </Link>
            
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <Link href="/org/login" className="btn-outline w-full justify-center">
                Sign In
              </Link>
              <Link href="/org/register" className="btn-primary w-full justify-center">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 