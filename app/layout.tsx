import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Spend Audit | Optimize Your AI Tooling Expenses",
  description:
    "Analyze your AI tool spending, identify overpayments, and discover smarter alternatives to reduce your burn rate.",
  keywords: [
    "AI spend",
    "cost optimization",
    "AI tools",
    "SaaS audit",
    "startup finance",
  ],
  openGraph: {
    title: "AI Spend Audit",
    description:
      "Stop overpaying for AI tools. Get a personalized audit of your AI stack.",
    type: "website",
    url: "https://ai-spend-audit.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Spend Audit",
    description:
      "Stop overpaying for AI tools. Get a personalized audit of your AI stack.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.className} min-h-full bg-slate-50 text-slate-900 antialiased`}
      >
        <main className="flex-1">{children}</main>
        <Toaster position="top-center" richColors closeButton expand={false} />
      </body>
    </html>
  );
}
