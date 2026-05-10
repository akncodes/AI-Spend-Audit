import React from "react";
import SpendForm from "@/components/forms/SpendForm";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Minimal Header */}
      <header className="px-6 py-3 border-b border-gray-200 flex items-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-teal-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="text-sm font-semibold text-gray-900">
            AI Spend Audit
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <SpendForm />
        </div>
      </main>
    </div>
  );
}
