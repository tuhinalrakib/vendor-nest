"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  banglaQuestion: string;
  banglaAnswer: string;
}

export default function FAQAccordion() {
  const { lang } = useLanguage();
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const faqs: FAQItem[] = [
    {
      id: "faq-1",
      question: "Are there any hidden setup fees for launching my store?",
      answer: "No! Opening your store is 100% free with zero upfront setup fees. We only charge a minor 2-3% platform transaction fee on completed purchases.",
      banglaQuestion: "স্টোর সেটআপ করার জন্য কি কোনো চার্জ বা ফি দিতে হয়?",
      banglaAnswer: "না, স্টোর খোলার জন্য কোনো সেটআপ চার্জ নেই। এটি সম্পূর্ণ ফ্রি। শুধুমাত্র আপনার প্রোডাক্ট বিক্রি হলে সফল অর্ডারের ওপর ২-৩% কমিশন নেওয়া হয়."
    },
    {
      id: "faq-2",
      question: "How does the AI credits allocation & billing work?",
      answer: "Every verified vendor receives free monthly AI credits to generate product titles, descriptions, and tag optimizations. Upgraded tiers start at $15/mo.",
      banglaQuestion: "এআই টুলস (চ্যাট বোট, রিভিউ অ্যানালাইসিস) ব্যবহারের চার্জ কেমন?",
      banglaAnswer: "প্রতিটি ভেরিফাইড মার্চেন্ট ফ্রিতে প্রতি মাসে এআই ক্রেডিট বরাদ্দ পাবেন। বেশি ব্যবহারের জন্য প্রতি মাসে ১৫ ডলার থেকে শুরু করে সাবস্ক্রিপশন প্ল্যান রয়েছে।"
    },
    {
      id: "faq-3",
      question: "How quickly can I withdraw my store earnings?",
      answer: "Seller payouts are processed automatically every Friday directly to your connected bank account, bKash/Nagad MFS, or Stripe dashboard.",
      banglaQuestion: "পেমেন্ট উইথড্রয়াল বা পে-আউট প্রসেস কীভাবে কাজ করে?",
      banglaAnswer: "টাকা সরাসরি আপনার ব্যাংক অ্যাকাউন্ট, মোবাইল ফিনান্সিয়াল সার্ভিস (বিকাশ/নগদ) অথবা স্ট্রাইপ-এ সপ্তাহের প্রতি শুক্রবার পেমেন্ট উইথড্র দেওয়া যায়।"
    },
    {
      id: "faq-4",
      question: "Can I connect my own custom brand domain?",
      answer: "Yes! You can link your custom domain (e.g. yourstore.com) directly from your seller dashboard settings, complete with automated free SSL certificates.",
      banglaQuestion: "আমি কি আমার নিজস্ব ব্র্যান্ড ডোমেইন লিঙ্ক করতে পারব?",
      banglaAnswer: "হ্যাঁ, আপনার শপ ড্যাশবোর্ড সেটিংস থেকে কাস্টম ডোমেইন ম্যাপ করতে পারবেন এবং সাথে পাবেন ফ্রি সিকিউরড SSL সার্টিফিকেট!"
    },
    {
      id: "faq-5",
      question: "How secure is the buyer checkout process?",
      answer: "Our checkout infrastructure complies with global PCI-DSS standards, securing all transactions with end-to-end tokenized encryption.",
      banglaQuestion: "ক্রেতাদের পেমেন্ট চেকআউট নিরাপত্তা কেমন?",
      banglaAnswer: "আমাদের চেকআউট সম্পূর্ণ নিরাপদ। ক্রেতাদের সকল পেমেন্ট গেটওয়ে এবং কার্ড সিকিউরিটি আন্তর্জাতিক PCI-DSS স্ট্যান্ডার্ড মেনে প্রসেস করা হয়।"
    }
  ];

  return (
    <section className="relative py-24 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200/80 dark:border-zinc-800/60 overflow-hidden font-sans transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-xs font-bold text-indigo-700 dark:text-indigo-400 select-none">
            {lang === "bn" ? "❓ সাধারণ প্রশ্নাবলী" : "❓ Common Questions"}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
            {lang === "bn" ? (
              <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                সাধারণ জিজ্ঞাসা ও সমাধান
              </span>
            ) : (
              "Frequently Asked Questions"
            )}
          </h2>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto font-medium">
            {lang === "bn"
              ? "কাস্টম ডোমেইন সেটআপ, এআই ক্রেডিট এবং পে-আউট সম্পর্কিত গুরুত্বপূর্ণ উত্তরসমূহ।"
              : "Find immediate answers regarding custom setup, AI features pricing, and payouts."}
          </p>
        </div>

        {/* FAQs list */}
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200/85 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 cursor-pointer select-none"
                >
                  <div className="space-y-1">
                    <h3 className="text-sm sm:text-base font-extrabold text-zinc-950 dark:text-zinc-50">
                      {lang === "bn" ? faq.banglaQuestion : faq.question}
                    </h3>
                  </div>
                  <span className={`w-8 h-8 rounded-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400 transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180 text-indigo-650 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-100 dark:border-indigo-900/40" : ""}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden border-zinc-150 dark:border-zinc-800 ${
                    isOpen ? "max-h-[500px] border-t p-6 bg-zinc-50/50 dark:bg-zinc-950/50" : "max-h-0"
                  }`}
                >
                  <div className="space-y-3 text-xs sm:text-sm font-semibold text-zinc-650 dark:text-zinc-400 leading-relaxed">
                    <p>{lang === "bn" ? faq.banglaAnswer : faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
