import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, TrendingDown, Shield, Zap, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">
            AI Spend Audit
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/testimonials" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">
            Testimonials
          </Link>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="px-6 py-16 md:py-32 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Copy & Social Proof */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              Free Analysis Tool
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Stop overpaying <br />
              <span className="text-teal-600">for AI tools.</span>
            </h1>
            
            <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
              Teams waste thousands of dollars a year on redundant AI subscriptions. Tell us what you use, and we&apos;ll show you exactly how to consolidate and save.
            </p>

            {/* CTA Button instead of Form */}
            <div className="pt-2">
              <Link href="/scan" className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-teal-600/20 hover:shadow-teal-600/40 hover:-translate-y-0.5">
                Start Free Audit <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Social Proof with Avatars */}
            <div className="flex items-center gap-4 pt-8">
              <div className="flex -space-x-3">
                <Avatar className="border-2 border-slate-50 w-12 h-12">
                  <AvatarImage src="https://i.pravatar.cc/150?u=1" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Avatar className="border-2 border-slate-50 w-12 h-12">
                  <AvatarImage src="https://i.pravatar.cc/150?u=2" />
                  <AvatarFallback>SM</AvatarFallback>
                </Avatar>
                <Avatar className="border-2 border-slate-50 w-12 h-12">
                  <AvatarImage src="https://i.pravatar.cc/150?u=3" />
                  <AvatarFallback>RW</AvatarFallback>
                </Avatar>
                <Avatar className="border-2 border-slate-50 w-12 h-12">
                  <AvatarImage src="https://i.pravatar.cc/150?u=4" />
                  <AvatarFallback>AL</AvatarFallback>
                </Avatar>
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1 text-amber-400">
                  {"★".repeat(5)}
                </div>
                <p className="text-slate-600 font-medium">Trusted by 500+ teams</p>
              </div>
            </div>

          </div>

          {/* Right: Value Props Grid */}
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200">
             <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                     <CheckCircle2 className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Instant Analysis</h3>
                    <p className="text-sm text-slate-600">Get a detailed breakdown of your spend immediately.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                     <CheckCircle2 className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">No Credit Card Required</h3>
                    <p className="text-sm text-slate-600">100% free tool for teams of any size.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                     <CheckCircle2 className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Data Remains Private</h3>
                    <p className="text-sm text-slate-600">We don&apos;t share your stack with third parties.</p>
                  </div>
                </div>
             </div>
          </div>
          
        </section>

        {/* Feature Highlights */}
        <section className="bg-white border-t border-slate-200 py-16">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4">
                <TrendingDown className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Reduce Burn Rate</h3>
              <p className="text-slate-600 leading-relaxed">
                Identify overlapping capabilities across your AI stack to eliminate redundant subscriptions.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Optimize Plans</h3>
              <p className="text-slate-600 leading-relaxed">
                Discover when it&apos;s more cost-effective to switch from individual seats to team or enterprise plans.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Expert Guidance</h3>
              <p className="text-slate-600 leading-relaxed">
                Get AI-generated summaries and recommendations tailored specifically to your use cases.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <p>© {new Date().getFullYear()} AI Spend Audit. All rights reserved.</p>
      </footer>
    </div>
  );
}
