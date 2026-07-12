"use client";

import React from "react";

export default function PlatformStats() {
  const stats = [
    {
      id: "stat-sellers",
      value: "1,200+",
      label: "Active Sellers",
      banglaLabel: "সফল এক্টিভ মার্চেন্ট",
      description: "Growing global community of verified independent creators and vendors.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    },
    {
      id: "stat-tx",
      value: "$5.4M+",
      label: "Transactions Processed",
      banglaLabel: "সফল ট্রানজ্যাকশন ভলিউম",
      description: "Secure automated payments processed globally for shops this year.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      id: "stat-countries",
      value: "100+",
      label: "Countries Reached",
      banglaLabel: "গ্লোবাল ডেলিভারি কভারেজ",
      description: "Seamless localized shipping & tax compliance across global borders.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2a2.5 2.5 0 002.5-2.5V8a2 2 0 00-2-2h-.5a2 2 0 01-2-2V3.065M12 21a9 9 0 100-18 9 9 0 000 18z" />
        </svg>
      ),
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      id: "stat-uptime",
      value: "99.99%",
      label: "Platform SLA Uptime",
      banglaLabel: "নিরাপদ সিস্টেম আপটাইম",
      description: "Enterprise tier hosting ensures your digital shop is online 24/7.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: "text-purple-600 bg-purple-50 border-purple-100",
    },
  ];

  return (
    <section className="relative py-24 bg-zinc-50 border-t border-zinc-200/80 overflow-hidden font-sans">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700 select-none">
            📊 Platform Statistics
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950">
            Empowering Merchants Worldwide <br />
            <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              বিশ্বাসযোগ্যতার পরিসংখ্যান
            </span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-550 max-w-xl mx-auto font-medium">
            Discover the metrics driving our next-generation collaborative commerce network.
          </p>
        </div>

        {/* Stats Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white border border-zinc-200/80 hover:border-zinc-300 rounded-3xl p-6 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Icon Box */}
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${stat.color} group-hover:scale-105 transition-transform duration-300`}>
                  {stat.icon}
                </div>

                <div className="space-y-2">
                  <p className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
                    {stat.value}
                  </p>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 leading-snug">
                      {stat.label}
                    </h4>
                    <p className="text-[11px] font-extrabold text-indigo-600 mt-0.5">
                      {stat.banglaLabel}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-zinc-450 mt-4 leading-relaxed font-semibold">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
