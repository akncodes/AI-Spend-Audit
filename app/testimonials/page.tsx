import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Vishwadeep Singh",
    role: "Associate AI Developer",
    company: "InteligenAI",
    quote: "Most startups lack centralized systems that allow them to manage expenses. Although they pay for APIs they don't pay attention to the AI costing. They just pay the bill.",
    initials: "VS",
  },
  {
    name: "Pritish Tomar",
    role: "Algo Engineer",
    company: "SIHO Research",
    quote: "With spendings, I see it overvalued and lack of skills in team for its proper usage. We keep a track of usage and billings, but nothing for cost optimization.",
    initials: "PT",
  },
  {
    name: "Deepak Kumar",
    role: "Project Lead",
    company: "Techpix",
    quote: "We mostly overspend because of team members not knowing how to use the tools efficiently and no proper tracking system. AI tools have improved our development speed a lot, but companies don't compare the pricing of the team subscriptions and other plans.",
    initials: "DK",
  }
];

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">
            AI Spend Audit
          </span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-6 py-16 md:py-24 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            What Teams Are Saying
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            We spoke with engineering leaders and AI developers to understand how they manage their tool spend. Here&apos;s what they had to say about the need for cost optimization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <Card key={idx} className="h-full flex flex-col shadow-lg shadow-slate-200/50 border-slate-200 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-100 transition-all">
              <CardHeader className="pb-4">
                <Quote className="w-8 h-8 text-teal-200 mb-2" />
                <p className="text-slate-700 italic leading-relaxed flex-1">
                  &quot;{testimonial.quote}&quot;
                </p>
              </CardHeader>
              <CardContent className="pt-0 mt-auto">
                <div className="flex items-center gap-4 mt-6">
                  <Avatar className="w-12 h-12 border-2 border-teal-50">
                    <AvatarFallback className="bg-teal-100 text-teal-800 font-semibold">{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-slate-900">{testimonial.name}</h4>
                    <p className="text-sm text-slate-500">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-20 text-center bg-teal-50 rounded-3xl p-12 border border-teal-100">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to optimize your AI stack?</h2>
          <p className="text-slate-600 mb-8 max-w-xl mx-auto">
            Stop guessing about your API and subscription costs. Get a free, personalized analysis of your team&apos;s spend.
          </p>
          <Link href="/scan" className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-teal-600/20 hover:-translate-y-0.5">
            Start Free Audit <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <p>© {new Date().getFullYear()} AI Spend Audit. All rights reserved.</p>
      </footer>
    </div>
  );
}
