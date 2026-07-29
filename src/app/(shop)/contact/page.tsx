"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "general",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans transition-colors duration-300 py-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight">
            Contact Support
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-medium">
            Have questions about your account, store payouts, or platform integration? Reach out to our team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          {/* Contact Details Column */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 space-y-6 shadow-xs">
              <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">Direct Contact</h3>
              
              <div className="space-y-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-base shrink-0">
                    📧
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900 dark:text-zinc-100">Email Support</p>
                    <p className="text-zinc-500">support@vendornest.com</p>
                    <p className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-0.5">Response SLA: Under 4 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-base shrink-0">
                    💬
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900 dark:text-zinc-100">Merchant Live Chat</p>
                    <p className="text-zinc-500">Available Mon - Fri, 9am - 6pm EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-base shrink-0">
                    🌐
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900 dark:text-zinc-100">Headquarters</p>
                    <p className="text-zinc-500">VendorNest Inc., Silicon Tower</p>
                    <p className="text-zinc-500">Dhaka & San Francisco</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-3xl p-6 space-y-3">
              <h4 className="text-sm font-extrabold text-indigo-900 dark:text-indigo-300">Quick Links</h4>
              <ul className="space-y-2 text-xs font-bold text-indigo-700 dark:text-indigo-400">
                <li><Link href="/faq" className="hover:underline">→ Frequently Asked Questions</Link></li>
                <li><Link href="/seller/faq" className="hover:underline">→ Seller Setup & Payout Guides</Link></li>
                <li><Link href="/terms" className="hover:underline">→ Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Form Column */}
          <div className="md:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto">
                  ✓
                </div>
                <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">Message Received!</h3>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                  Thank you for contacting VendorNest Support. Our team has received your ticket and will follow up via email shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-xs font-bold text-zinc-800 dark:text-zinc-200 cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">Send us a message</h3>
                
                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sarah Connor"
                    className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-indigo-600"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sarah@example.com"
                    className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-indigo-600"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Inquiry Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-indigo-600"
                  >
                    <option value="general">General Support</option>
                    <option value="seller">Seller Account & Payouts</option>
                    <option value="technical">Technical / API Inquiry</option>
                    <option value="enterprise">Enterprise Merchant Licensing</option>
                  </select>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Your Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe how we can help you..."
                    className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-indigo-600 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                >
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
