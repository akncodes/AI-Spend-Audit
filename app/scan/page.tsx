import React from "react";
import SpendForm from "@/components/forms/SpendForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ScanPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">
            AI Spend Audit
          </span>
        </Link>
        <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl bg-white p-6 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200">
          <SpendForm />
        </div>
      </main>
    </div>
  );
}
