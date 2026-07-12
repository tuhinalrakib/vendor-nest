"use client";

import React, { useState } from "react";

interface FAQItem {
  id: string;
  question: string;
  banglaQuestion: string;
  answer: string;
  banglaAnswer: string;
}

export default function FAQAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);

  const faqs: FAQItem[] = [
    {
      id: "faq-1",
      question: "Are there any upfront shop registration or setup fees?",
      banglaQuestion: "স্টোর সেটআপ করার জন্য কি কোনো চার্জ বা ফি দিতে হয়?",
      answer: "No, opening a basic merchant storefront is completely free. We only charge a small transaction commission (typically 2-3%) on successful orders placed inside your store.",
      banglaAnswer: "না, স্টোর খোলার জন্য কোনো সেটআপ চার্জ নেই। এটি সম্পূর্ণ ফ্রি। শুধুমাত্র আপনার প্রোডাক্ট বিক্রি হলে সফল অর্ডারের ওপর ২-৩% কমিশন নেওয়া হয়।",
    },
    {
      id: "faq-2",
      question: "Are the AI features (chat support, reviews analysis) free to use?",
      banglaQuestion: "এআই টুলস (চ্যাট বোট, রিভিউ অ্যানালাইসিস) ব্যবহারের চার্জ কেমন?",
      answer: "All verified sellers receive a free monthly allocation of AI credits. High-volume merchants can upgrade to premium tier licenses starting at $15/month for unlimited queries.",
      banglaAnswer: "প্রতিটি ভেরিফাইড মার্চেন্ট ফ্রিতে প্রতি মাসে এআই ক্রেডিট বরাদ্দ পাবেন। বেশি ব্যবহারের জন্য প্রতি মাসে ১৫ ডলার থেকে শুরু করে সাবস্ক্রিপশন প্ল্যান রয়েছে।",
    },
    {
      id: "faq-3",
      question: "How do vendor payment withdrawals work?",
      banglaQuestion: "পেমেন্ট উইথড্রয়াল বা পে-আউট প্রসেস কীভাবে কাজ করে?",
      answer: "Payments are processed securely. You can link your local bank account, credit card, or Stripe profile. Payout cycles occur weekly on Friday or instantly upon balance clearance.",
      banglaAnswer: "টাকা সরাসরি আপনার ব্যাংক অ্যাকাউন্ট, মোবাইল ফিনান্সিয়াল সার্ভিস (বিকাশ/নগদ) অথবা স্ট্রাইপ-এ সপ্তাহের প্রতি শুক্রবার পেমেন্ট উইথড্র দেওয়া যায়।",
    },
    {
      id: "faq-4",
      question: "Can I connect my own custom internet domain name?",
      banglaQuestion: "আমি কি আমার নিজস্ব ব্র্যান্ড ডোমেইন লিঙ্ক করতে পারব?",
      answer: "Yes, fully! Inside the seller portal settings, you can map your custom domain (e.g., myshop.com) to your storefront instantly. We generate free SSL certificates for you.",
      banglaAnswer: "হ্যাঁ, আপনার শপ ড্যাশবোর্ড সেটিংস থেকে কাস্টম ডোমেইন ম্যাপ করতে পারবেন এবং সাথে পাবেন ফ্রি সিকিউরড SSL সার্টিফিকেট!",
    },
    {
      id: "faq-5",
      question: "Is checkout secure for global retail shoppers?",
      banglaQuestion: "ক্রেতাদের পেমেন্ট চেকআউট নিরাপত্তা কেমন?",
      answer: "We support end-to-end encryption. All card details, token credentials, and user data are securely handled in compliance with international PCI-DSS protection specifications.",
      banglaAnswer: "আমাদের চেকআউট সম্পূর্ণ নিরাপদ। ক্রেতাদের সকল পেমেন্ট গেটওয়ে এবং কার্ড সিকিউরিটি আন্তর্জাতিক PCI-DSS স্ট্যান্ডার্ড মেনে প্রসেস করা হয়।",
    },
  ];

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="relative py-24 bg-zinc-50 border-t border-zinc-200/80 overflow-hidden font-sans">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700 select-none">
            ❓ Common Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950">
            Frequently Asked Questions <br />
            <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              সাধারণ জিজ্ঞাসা ও সমাধান
            </span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-550 max-w-xl mx-auto font-medium">
            Find immediate answers regarding custom setup, AI features pricing, and payouts.
          </p>
        </div>

        {/* Accordions Container */}
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white border border-zinc-200/85 hover:border-zinc-300 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
              >
                {/* Header Toggle Clickable Area */}
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 cursor-pointer select-none"
                >
                  <div className="space-y-1">
                    <h3 className="text-sm sm:text-base font-extrabold text-zinc-950">
                      {faq.question}
                    </h3>
                    <p className="text-[11px] font-extrabold text-indigo-600">
                      {faq.banglaQuestion}
                    </p>
                  </div>
                  
                  {/* Chevron Icon */}
                  <span className={`w-8 h-8 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-500 transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180 text-indigo-600 bg-indigo-50 border-indigo-100" : ""}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>

                {/* Answer Expanded Area */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden border-zinc-150 ${
                    isOpen ? "max-h-[500px] border-t p-6 bg-zinc-50/50" : "max-h-0"
                  }`}
                >
                  <div className="space-y-3 text-xs sm:text-sm font-semibold text-zinc-650 leading-relaxed">
                    <p>{faq.answer}</p>
                    <p className="text-zinc-500 font-bold border-l-2 border-indigo-600 pl-3.5 italic">
                      {faq.banglaAnswer}
                    </p>
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
