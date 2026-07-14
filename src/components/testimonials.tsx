"use client";

import React from "react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  storeName: string;
  quote: string;
  banglaQuote: string;
  rating: number;
  avatarGradient: string;
  avatarChar: string;
}

export default function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      id: "test-1",
      name: "Sarah Connor",
      role: "Lead Electronics Engineer",
      storeName: "AuraLink Official",
      quote: "Migrating our electronics shop to VendorNest was the best decision. The automated AI review summaries helped us identify critical feature requests instantly, increasing our sales conversion by 35% in three months.",
      banglaQuote: "এআই রিভিউ সামারি ব্যবহার করে আমরা ক্রেতাদের ভালোলাগা ও সমস্যাগুলো সহজেই বুঝতে পারছি, যা আমাদের সেলস বাড়াতে দারুণ সাহায্য করেছে!",
      rating: 5,
      avatarGradient: "from-indigo-500 to-purple-600",
      avatarChar: "S",
    },
    {
      id: "test-2",
      name: "Mark Jenkins",
      role: "Founder & Creative Designer",
      storeName: "Apex Apparel",
      quote: "The seamless AI catalog listing generator lets me publish new seasonal fashion designs to our storefront in seconds. Payment payouts are incredibly fast, transparent, and completely worry-free.",
      banglaQuote: "এআই দিয়ে খুব সহজেই ডেসক্রিপশনসহ প্রোডাক্ট লিস্টিং তৈরি করা যায়। এছাড়া পেমেন্ট উইথড্রয়াল প্রসেস অনেক ফাস্ট এবং নিরাপদ!",
      rating: 5,
      avatarGradient: "from-pink-500 to-rose-600",
      avatarChar: "M",
    },
    {
      id: "test-3",
      name: "Arthur Morgan",
      role: "Master Leather Artisan",
      storeName: "SaddleCraft Leather Co.",
      quote: "Our customized branding has stayed 100% pure under our storefront domain. Shoppers love the personalized smart AI product recommendations. It feels like our own premium standalone app.",
      banglaQuote: "এআই রিকমেন্ডেশনের কারণে আমাদের স্টোরের রিটার্নিং কাস্টমার অনেক বেড়েছে। মনে হয় আমাদের নিজস্ব প্রিমিয়াম অ্যাপ চালাচ্ছি!",
      rating: 5,
      avatarGradient: "from-amber-600 to-amber-800",
      avatarChar: "A",
    },
  ];

  return (
    <section className="relative py-24 bg-white dark:bg-zinc-950 border-t border-zinc-200/80 dark:border-zinc-800/60 overflow-hidden font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-xs font-bold text-indigo-700 dark:text-indigo-400 select-none">
            💬 Success Stories
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
            Loved by Merchants Worldwide <br />
            <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              বিক্রেতা ও ক্রেতাদের রিভিউ
            </span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto font-medium">
            Hear from certified business owners using our AI-driven ecommerce hosting platforms.
          </p>
        </div>

        {/* Testimonials Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-3xl p-6 text-left flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative group hover-neon-glow"
            >
              {/* Quote Mark Decotator SVG */}
              <div className="absolute top-6 right-6 text-zinc-200 dark:text-zinc-800 group-hover:text-indigo-100/50 dark:group-hover:text-indigo-950/20 transition-colors pointer-events-none">
                <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.154c-2.433.914-3.996 3.635-3.996 5.846h3.999v10h-10z" />
                </svg>
              </div>

              <div className="space-y-4 relative z-10">
                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(test.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-500 fill-amber-500" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote Content */}
                <div className="space-y-3">
                  <p className="text-xs sm:text-[13px] font-semibold text-zinc-700 dark:text-zinc-300 leading-relaxed italic">
                    "{test.quote}"
                  </p>
                  <p className="text-xs font-bold text-indigo-650 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/30 rounded-2xl p-3 leading-relaxed">
                    🌟 {test.banglaQuote}
                  </p>
                </div>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-zinc-200/60 dark:border-zinc-800/60 relative z-10">
                <div className={`w-11 h-11 rounded-xl bg-linear-to-tr ${test.avatarGradient} text-white font-extrabold flex items-center justify-center text-sm shadow-md`}>
                  {test.avatarChar}
                </div>
                <div className="text-left space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-extrabold text-zinc-950 dark:text-zinc-50">
                    {test.name}
                  </h4>
                  <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-550">
                    {test.role} &bull; <span className="text-indigo-600 dark:text-indigo-400">{test.storeName}</span>
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
