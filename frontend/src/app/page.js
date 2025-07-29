import React from 'react';
import Navbar from '../components/ui/Navbar.jsx';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Star, Users, Zap, Shield, BarChart3, FileText, Award } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="h-16" /> {/* Spacer for fixed navbar */}
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 lg:py-32">
        <div className="container-responsive">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Star className="w-4 h-4" />
              AI-Powered Candidate Evaluation Platform
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Transform Your
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Hiring Process</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Create custom evaluation forms, collect candidate responses, and get intelligent insights using advanced AI models. 
              Make fair, scalable, and data-driven hiring decisions with our comprehensive platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/org/register/admin" className="btn-primary px-8 py-4 text-lg font-semibold group">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#features" className="btn-outline px-8 py-4 text-lg font-semibold">
                Learn More
              </Link>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Setup in minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need for modern hiring
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From form creation to AI-powered evaluation, our platform provides all the tools you need for successful candidate assessment.
            </p>
          </div>
          
          <div className="grid-responsive">
            <div className="card p-8 text-center group hover:shadow-medium transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Custom Form Builder</h3>
              <p className="text-muted-foreground">
                Create tailored evaluation forms with our intuitive drag-and-drop builder. Support for multiple question types and advanced logic.
              </p>
            </div>
            
            <div className="card p-8 text-center group hover:shadow-medium transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">AI-Powered Evaluation</h3>
              <p className="text-muted-foreground">
                Get instant, intelligent scoring using advanced AI models. Fair, consistent, and insightful candidate assessments.
              </p>
            </div>
            
            <div className="card p-8 text-center group hover:shadow-medium transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-success rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Analytics & Insights</h3>
              <p className="text-muted-foreground">
                Comprehensive analytics dashboard with detailed reports, performance metrics, and actionable insights.
              </p>
            </div>
            
            <div className="card p-8 text-center group hover:shadow-medium transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Team Collaboration</h3>
              <p className="text-muted-foreground">
                Invite team members, assign roles, and collaborate seamlessly on candidate evaluations and hiring decisions.
              </p>
            </div>
            
            <div className="card p-8 text-center group hover:shadow-medium transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Enterprise Security</h3>
              <p className="text-muted-foreground">
                Bank-level security with data encryption, compliance standards, and secure candidate data handling.
              </p>
            </div>
            
            <div className="card p-8 text-center group hover:shadow-medium transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Industry Expertise</h3>
              <p className="text-muted-foreground">
                Domain-specific evaluation models trained on industry best practices for accurate candidate assessment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container-responsive text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to revolutionize your hiring?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of companies already using our platform to make better hiring decisions with AI-powered insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/org/register" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors group">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/org/login" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trusted by leading companies
            </h2>
            <p className="text-lg text-muted-foreground">
              See what our customers say about their experience with TES Platform
            </p>
          </div>
          
          <div className="grid-responsive">
            <div className="card p-8">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 italic">
                &ldquo;The AI evaluation saved us hours and gave us deeper insights into our candidates. The platform is intuitive and the results are consistently accurate.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">SM</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">Sarah Mitchell</div>
                  <div className="text-sm text-muted-foreground">HR Lead, TechCorp</div>
                </div>
              </div>
            </div>
            
            <div className="card p-8">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 italic">
                &ldquo;We love how easy it is to create forms and get instant, fair scoring for every applicant. The analytics dashboard is incredibly insightful.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-secondary rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">DJ</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">David Johnson</div>
                  <div className="text-sm text-muted-foreground">Talent Manager, FinStart</div>
                </div>
              </div>
            </div>
            
            <div className="card p-8">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 italic">
                &ldquo;The analytics dashboard helped us improve our hiring process and make data-driven decisions. ROI was immediate and significant.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-success rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">LC</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">Lisa Chen</div>
                  <div className="text-sm text-muted-foreground">COO, HealthAI</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container-responsive max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about TES Platform
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Is the AI evaluation customizable for my industry?
              </h3>
              <p className="text-muted-foreground">
                Yes! You can tailor forms and rubrics to your domain, and our AI adapts to your specific requirements and industry standards.
              </p>
            </div>
            
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Can I try the platform for free?
              </h3>
              <p className="text-muted-foreground">
                Absolutely. You can get started for free with our comprehensive trial—no credit card required. Upgrade when you&rsquo;re ready.
              </p>
            </div>
            
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                How secure is my data?
              </h3>
              <p className="text-muted-foreground">
                We use industry-standard security practices including end-to-end encryption, SOC 2 compliance, and secure data centers to keep your data safe.
              </p>
            </div>
            
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                What kind of support do you provide?
              </h3>
              <p className="text-muted-foreground">
                We offer comprehensive support including live chat, email support, video tutorials, and dedicated account managers for enterprise customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container-responsive">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TES</span>
                </div>
                <span className="font-semibold text-lg">TES Platform</span>
              </div>
              <p className="text-gray-400 mb-4">
                Transform your hiring process with AI-powered candidate evaluation and insights.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">API</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Integrations</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Status</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} TES Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}