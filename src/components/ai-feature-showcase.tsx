"use client";

import React, { useState, useEffect, useRef } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_HOST || "http://127.0.0.1:8000";

// Feature Definition
interface Feature {
  id: string;
  name: string;
  badge: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function AIFeatureShowcase() {
  const [activeTab, setActiveTab] = useState<string>("summarizer");

  // 1. AI Review Summarizer States
  const [summarizerState, setSummarizerState] = useState<"idle" | "loading" | "typing" | "completed">("idle");
  const [summarizerStep, setSummarizerStep] = useState<string>("");
  const [typedSummary, setTypedSummary] = useState<string>("");
  const typewritingTimer = useRef<NodeJS.Timeout | null>(null);

  const mockReviews = [
    { name: "Sarah K.", rating: 5, text: "The active noise cancelation is next-level, but the headband feels slightly tight after 3 hours." },
    { name: "David M.", rating: 4, text: "Superb audio clarity, especially deep bass! Battery easily lasts 40 hours. Mic is decent." },
    { name: "Elena R.", rating: 5, text: "Very premium materials. Charging is incredibly fast. Highly recommended!" }
  ];

  const fullSummary = `<strong>AI Consensus Summary:</strong><br/>
• <strong>Pros:</strong> Outstanding active noise cancelation (ANC), deep immersive bass, and exceptional 40-hour battery life. Charging speeds are incredibly fast.<br/>
• <strong>Cons:</strong> A few users reported minor tightness/pressure during extended wearing sessions (3+ hours).<br/>
• <strong>Verdict:</strong> 96% of buyers recommend this product. Excellent value for audiophiles and travelers.`;

  const handleStartSummarizer = async () => {
    if (summarizerState !== "idle") return;
    setSummarizerState("loading");
    setSummarizerStep("Connecting to VendorNest AI Engine...");
    setTypedSummary("");

    try {
      const response = await fetch(`${BACKEND_URL}/api/ai/review-summary/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: "" }),
      });
      const data = await response.json();
      if (response.ok && data.summary) {
        setSummarizerStep("Structuring consensus formatting...");
        setTimeout(() => {
          setSummarizerState("typing");
          startTypewriter(data.summary);
        }, 600);
      } else {
        throw new Error(data.error || "Backend failed");
      }
    } catch (err) {
      console.warn("AI backend offline, using client-side simulated fallback.", err);
      // Fallback
      setTimeout(() => {
        setSummarizerStep("Analyzing review sentiment (Fallback)...");
      }, 600);
      setTimeout(() => {
        setSummarizerStep("Extracting key pros & cons...");
      }, 1200);
      setTimeout(() => {
        setSummarizerStep("Generating natural language summary...");
      }, 1800);
      setTimeout(() => {
        setSummarizerState("typing");
        startTypewriter(fullSummary);
      }, 2400);
    }
  };

  const startTypewriter = (text: string) => {
    let index = 0;
    let currentHTML = "";
    
    // Clean text if it has markdown formatting
    let cleanText = text;
    if (cleanText.includes("```")) {
      cleanText = cleanText.replace(/```html/g, "").replace(/```/g, "").trim();
    }
    // Convert markdown bullets to HTML list
    if (cleanText.includes("\n-") || cleanText.includes("\n*")) {
      cleanText = cleanText
        .replace(/\n- /g, "<br/>• ")
        .replace(/\n\* /g, "<br/>• ")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    }

    const interval = setInterval(() => {
      if (index >= cleanText.length) {
        clearInterval(interval);
        setSummarizerState("completed");
        return;
      }
      
      if (cleanText[index] === "<") {
        const closeIndex = cleanText.indexOf(">", index);
        if (closeIndex !== -1) {
          currentHTML += cleanText.slice(index, closeIndex + 1);
          index = closeIndex + 1;
        } else {
          currentHTML += cleanText[index];
          index++;
        }
      } else {
        currentHTML += cleanText[index];
        index++;
      }
      
      setTypedSummary(currentHTML);
    }, 15);

    typewritingTimer.current = interval;
  };

  const resetSummarizer = () => {
    if (typewritingTimer.current) clearInterval(typewritingTimer.current);
    setSummarizerState("idle");
    setTypedSummary("");
    setSummarizerStep("");
  };

  // 2. AI Recommendations States
  const [recommendationsAdded, setRecommendationsAdded] = useState(false);
  const [hoveredReason, setHoveredReason] = useState<string | null>(null);

  const defaultMockRecommendations = [
    {
      id: "rec-1",
      name: "UltraSleek Headphone Stand",
      category: "Accessories",
      price: 35.00,
      confidence: "94% Match",
      reason: "Purchased by 89% of audiophiles within 7 days of buying headphones.",
      icon: (
        <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2" />
        </svg>
      )
    },
    {
      id: "rec-2",
      name: "USB-C Fast Charging Hub",
      category: "Electronics",
      price: 49.00,
      confidence: "98% Match",
      reason: "Recommended to charge AuraLink 2.5x faster than standard wall adaptors.",
      icon: (
        <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      id: "rec-3",
      name: "Hard-shell Travel Case",
      category: "Accessories",
      price: 25.00,
      confidence: "87% Match",
      reason: "Protective purchase trend analysis based on user commute and travel patterns.",
      icon: (
        <svg className="w-6 h-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    }
  ];

  const [recs, setRecs] = useState<any[]>(defaultMockRecommendations);
  const [recsLoading, setRecsLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "recommendations") {
      const fetchRecs = async () => {
        setRecsLoading(true);
        try {
          const response = await fetch(`${BACKEND_URL}/api/ai/recommendations/`);
          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
              const mapped = data.map((item: any, idx: number) => ({
                id: item.id || `rec-${idx}`,
                name: item.name,
                category: item.category || "General",
                price: item.price || 0.0,
                confidence: item.confidence || `${85 + Math.floor(Math.random() * 14)}% Match`,
                reason: item.reason || "Recommended by AI match based on viewing pattern.",
                icon: idx % 3 === 0 ? (
                  <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2" />
                  </svg>
                ) : idx % 3 === 1 ? (
                  <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                )
              }));
              setRecs(mapped);
            }
          }
        } catch (err) {
          console.warn("Backend recommendations offline, falling back to mock listings.", err);
          setRecs(defaultMockRecommendations);
        } finally {
          setRecsLoading(false);
        }
      };
      fetchRecs();
    }
  }, [activeTab]);

  // 3. AI Chat Support States
  const [messages, setMessages] = useState<{ sender: "bot" | "user"; text: string }[]>([
    { sender: "bot", text: "Hello! I am your AI assistant. Ask me anything or select a prompt to see actual AI generation in real-time." }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { label: "✍️ Write Description", query: "Write a product description for an organic lavender candle." },
    { label: "💸 Dynamic Pricing", query: "How does the VendorNest AI Dynamic Pricing work?" },
    { label: "📦 Refund Assistant", query: "Draft an automated kind email refund response." }
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isBotTyping) return;
    
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setIsBotTyping(true);
    setInputValue("");

    try {
      const response = await fetch(`${BACKEND_URL}/api/ai/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-10).map(m => ({ sender: m.sender, text: m.text })),
        }),
      });
      const data = await response.json();
      if (response.ok && data.reply) {
        setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
      } else {
        throw new Error(data.error || "Chat failed");
      }
    } catch (err) {
      console.warn("AI Chat server offline, executing local simulation responder.", err);
      // Simulate Bot fallback response
      setTimeout(() => {
        let responseText = "";
        if (text.toLowerCase().includes("candle")) {
          responseText = "✨ AI Generated Description:\nEscape to a tranquil oasis with our Serene Lavender Soy Candle. Hand-poured with 100% natural soy wax and infused with organic lavender and soft vanilla essential oils. Featuring a clean, eco-friendly 50-hour burn time, it's perfect for winding down after a long day. 100% vegan & cruelty-free.";
        } else if (text.toLowerCase().includes("pricing")) {
          responseText = "📈 AI Pricing Engine Insight:\nVendorNest's AI analyzes search volume, competitor prices, and current inventory stock levels in real time. It automatically increases margins when demand surges and suggests promo bundle discounts when inventory turns slow, boosting merchant conversion by up to 28%.";
        } else {
          responseText = "✉️ AI Customer Support Template:\n\"Hi [Customer Name], thank you for contacting us. We're very sorry the item wasn't a perfect fit! We have initiated a full refund back to your payment method, and you'll receive a confirmation email shortly. No return is necessary for this item. Have a wonderful day!\"";
        }

        setMessages((prev) => [...prev, { sender: "bot", text: responseText }]);
      }, 1000);
    } finally {
      setIsBotTyping(false);
    }
  };

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isBotTyping]);

  useEffect(() => {
    return () => {
      if (typewritingTimer.current) clearInterval(typewritingTimer.current);
    };
  }, []);

  const features: Feature[] = [
    {
      id: "summarizer",
      name: "AI Review Analysis",
      badge: "Smart Consensus",
      title: "Synthesize reviews instantly",
      description: "Don't let customers get overwhelmed. Our AI processes product reviews and generates a concise, honest pros & cons summary automatically.",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: "recommendations",
      name: "AI Recommendations",
      badge: "Hyper-Personalized",
      title: "Match buyers with the perfect add-ons",
      description: "Increase Average Order Value (AOV). Our predictive model analyzes user journeys, session intent, and vendor catalogs to suggest highly relevant items.",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      id: "chatbot",
      name: "AI Support & Writer",
      badge: "24/7 Agent",
      title: "Write listings and assist users in real-time",
      description: "Free up merchant hours. AI writes high-converting copy, responds to support inquiries, and assists shoppers directly inside the chat.",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    }
  ];

  return (
    <section className="relative py-24 bg-zinc-50 border-t border-zinc-200/80 overflow-hidden font-sans">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700 select-none">
            ✨ Platform intelligence
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-950 leading-tight">
            Supercharge Commerce With <br className="hidden sm:inline" />
            <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
              Integrated AI Engines
            </span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-500 max-w-2xl mx-auto font-medium">
            VendorNest comes standard with pre-built, production-ready AI models to optimize conversion, generate descriptions, and guide shoppers instantly.
          </p>
        </div>

        {/* Feature Split Console Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch min-h-[580px]">
          
          {/* Left Column: Feature Selection Cards */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
            {features.map((feat) => {
              const isActive = activeTab === feat.id;
              return (
                <button
                  key={feat.id}
                  onClick={() => {
                    setActiveTab(feat.id);
                    if (feat.id !== "summarizer") {
                      resetSummarizer();
                    }
                  }}
                  className={`text-left p-6 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden group ${
                    isActive
                      ? "bg-white border-zinc-200/90 shadow-xl shadow-indigo-600/5 scale-[1.02] z-10"
                      : "bg-transparent border-transparent hover:bg-zinc-100/60 hover:border-zinc-200/50"
                  }`}
                >
                  {/* Glowing active indicator dot */}
                  {isActive && (
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-linear-to-b from-indigo-600 to-purple-600 rounded-l-2xl" />
                  )}

                  <div className="flex gap-4 items-start">
                    <div className={`p-3 rounded-xl shrink-0 transition-colors ${
                      isActive 
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" 
                        : "bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200/80 group-hover:text-zinc-700"
                    }`}>
                      {feat.icon}
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-extrabold text-zinc-900">{feat.name}</h4>
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isActive 
                            ? "bg-indigo-650/15 text-indigo-700" 
                            : "bg-zinc-200/60 text-zinc-500"
                        }`}>
                          {feat.badge}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                        {feat.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Interactive Demo Panel */}
          <div className="lg:col-span-7 flex">
            <div className="w-full bg-zinc-950 text-white rounded-3xl border border-zinc-800 shadow-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group/console">
              {/* Top Bar Decoration */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-indigo-500 via-purple-600 to-pink-500" />
              <div className="flex justify-between items-center border-b border-zinc-800/60 pb-4 mb-6">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase flex items-center gap-1.5 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
                  Live AI Console
                </div>
              </div>

              {/* DEMO 1: REVIEW SUMMARIZER */}
              {activeTab === "summarizer" && (
                <div className="flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-zinc-300">Target Product: <span className="text-white">AuraLink ANC Headphones</span></h4>
                      <span className="text-[9px] font-bold text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">3 Customer Reviews</span>
                    </div>

                    {/* Review Snippets */}
                    <div className="space-y-2">
                      {mockReviews.map((rev, i) => (
                        <div key={i} className="text-left bg-zinc-900/50 border border-zinc-800/60 p-3 rounded-xl text-xs space-y-1">
                          <div className="flex justify-between items-center text-[10px] text-zinc-400 font-bold">
                            <span>{rev.name}</span>
                            <span className="text-amber-400">{"★".repeat(rev.rating)}</span>
                          </div>
                          <p className="text-zinc-350 italic font-medium leading-relaxed">"{rev.text}"</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Output Block */}
                  <div className="bg-zinc-900 border border-indigo-900/60 rounded-xl p-4 min-h-[140px] flex flex-col justify-between text-left relative overflow-hidden">
                    {/* Glowing AI Corner Aura */}
                    <div className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full bg-indigo-600/10 blur-xl" />
                    
                    {summarizerState === "idle" && (
                      <div className="flex-1 flex flex-col items-center justify-center py-6 text-center space-y-3">
                        <p className="text-xs text-zinc-400">Ready to synthesize reviews from AI Backend API</p>
                        <button
                          onClick={handleStartSummarizer}
                          className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/20 hover:scale-[1.03] cursor-pointer flex items-center gap-1.5"
                        >
                          <svg className="w-3.5 h-3.5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Run AI Summary API
                        </button>
                      </div>
                    )}

                    {summarizerState === "loading" && (
                      <div className="flex-1 flex flex-col items-center justify-center py-8 text-center space-y-3">
                        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs font-mono text-indigo-400 animate-pulse">{summarizerStep}</p>
                      </div>
                    )}

                    {(summarizerState === "typing" || summarizerState === "completed") && (
                      <div className="space-y-3 flex-1 flex flex-col justify-between">
                        <div 
                          className="text-xs text-zinc-300 leading-relaxed font-semibold transition-all"
                          dangerouslySetInnerHTML={{ __html: typedSummary }}
                        />
                        {summarizerState === "completed" && (
                          <div className="pt-2 border-t border-zinc-800/60 flex justify-between items-center">
                            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                              Consensus Summary Synthesized
                            </span>
                            <button
                              onClick={resetSummarizer}
                              className="text-[10px] font-bold text-zinc-450 hover:text-zinc-350 transition-colors cursor-pointer"
                            >
                              Reset Demo
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* DEMO 2: AI RECOMMENDATIONS */}
              {activeTab === "recommendations" && (
                <div className="flex-1 flex flex-col justify-between space-y-6">
                  {/* Hero Product Anchor */}
                  <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800/80 p-4 rounded-2xl text-left">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold shadow">
                      🎧
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider">Shopping Cart Anchor</span>
                      <h4 className="text-sm font-black text-white">Wireless ANC Headphones Pro</h4>
                      <p className="text-xs font-bold text-zinc-450 mt-0.5">$129.99</p>
                    </div>
                  </div>

                  {/* Recommendations Cards */}
                  <div className="space-y-3 text-left">
                    <h5 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span>🎯</span> Recommended Cross-Sells (Loaded via API)
                    </h5>

                    {recsLoading ? (
                      <div className="h-28 flex flex-col items-center justify-center space-y-2">
                        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs text-zinc-500">Querying AI catalog matching model...</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {recs.map((item) => (
                          <div
                            key={item.id}
                            onMouseEnter={() => setHoveredReason(item.id)}
                            onMouseLeave={() => setHoveredReason(null)}
                            className="bg-zinc-900 border border-zinc-800 hover:border-indigo-500/80 p-3.5 rounded-xl flex flex-col justify-between relative cursor-help transition-all duration-300 group/rec-card hover:-translate-y-0.5"
                          >
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-start">
                                <span className="text-[8px] font-bold text-zinc-400 bg-zinc-950 border border-zinc-800 px-1.5 py-0.5 rounded">
                                  {item.confidence}
                                </span>
                                <span className="text-xs font-bold text-white">${item.price}</span>
                              </div>
                              <h6 className="text-[11px] font-bold text-zinc-200 line-clamp-1 mt-1">{item.name}</h6>
                            </div>

                            <div className="pt-2 border-t border-zinc-800/60 mt-3 flex justify-between items-center">
                              <span className="text-[9px] text-zinc-550 font-bold">{item.category}</span>
                              <span className="text-[8px] text-indigo-400 font-extrabold flex items-center gap-0.5 opacity-80 group-hover/rec-card:opacity-100 transition-opacity">
                                Why match?
                              </span>
                            </div>

                            {/* Hover Tooltip/Popup Reason */}
                            {hoveredReason === item.id && (
                              <div className="absolute inset-0 bg-zinc-950 border border-indigo-500 rounded-xl p-3 z-20 flex flex-col justify-between text-left animate-in fade-in zoom-in-95 duration-150">
                                <p className="text-[10px] text-zinc-300 leading-relaxed font-semibold">
                                  <span className="text-indigo-400 font-extrabold">AI Reasoning:</span><br />
                                  {item.reason}
                                </p>
                                <div className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest text-right mt-1">
                                  Match Confirmed ✨
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add bundle to cart action */}
                  <div className="bg-zinc-900/50 border border-zinc-800/80 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-left space-y-0.5">
                      <p className="text-xs font-bold text-zinc-350">Add Recommended Bundle Package</p>
                      <p className="text-[10px] text-zinc-500 font-semibold">Get Headphones + stand + charger (Save $15.00)</p>
                    </div>
                    <button
                      onClick={() => {
                        setRecommendationsAdded(true);
                        setTimeout(() => setRecommendationsAdded(false), 2500);
                      }}
                      className={`w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        recommendationsAdded
                          ? "bg-emerald-600 text-white"
                          : "bg-indigo-650 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-600/10"
                      }`}
                    >
                      {recommendationsAdded ? "✓ Added Bundle!" : "Add Bundle package"}
                    </button>
                  </div>
                </div>
              )}

              {/* DEMO 3: AI CHATBOT & WRITER */}
              {activeTab === "chatbot" && (
                <div className="flex-1 flex flex-col justify-between h-[360px]">
                  {/* Chat Message Box */}
                  <div className="flex-1 bg-zinc-900 border border-zinc-800/80 rounded-2xl p-4 overflow-y-auto space-y-3.5 scrollbar-thin text-left font-semibold">
                    {messages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed font-semibold ${
                          msg.sender === "user"
                            ? "bg-indigo-650 text-white rounded-tr-none"
                            : "bg-zinc-950 border border-zinc-800/80 text-zinc-300 rounded-tl-none prose prose-invert max-w-none"
                        }`}>
                          {msg.text.split("\n").map((line, lIdx) => (
                            <p key={lIdx} className={lIdx > 0 ? "mt-1.5" : ""}>
                              {line.startsWith("✨") || line.startsWith("📈") || line.startsWith("✉️") ? (
                                <strong className="text-indigo-400 block mb-1">{line}</strong>
                              ) : line}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                    {isBotTyping && (
                      <div className="flex justify-start">
                        <div className="bg-zinc-950 border border-zinc-800/80 px-3.5 py-2.5 rounded-2xl rounded-tl-none flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce delay-75"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce delay-150"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce delay-220"></span>
                        </div>
                      </div>
                    )}
                    <div ref={chatBottomRef} />
                  </div>

                  {/* Prompts and Input bar */}
                  <div className="mt-4 space-y-3 text-left">
                    <div className="flex flex-wrap gap-2">
                      {quickPrompts.map((p, idx) => (
                        <button
                          key={idx}
                          disabled={isBotTyping}
                          onClick={() => handleSendMessage(p.query)}
                          className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 rounded-lg text-[10px] font-bold text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>

                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (inputValue.trim()) {
                          handleSendMessage(inputValue);
                        }
                      }}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        placeholder="Ask the AI helper..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={isBotTyping}
                        className="flex-1 h-9 px-3.5 bg-zinc-900 border border-zinc-800 focus:border-indigo-650 text-xs font-semibold text-white rounded-xl outline-none transition-colors"
                      />
                      <button
                        type="submit"
                        disabled={isBotTyping || !inputValue.trim()}
                        className="h-9 px-4 bg-indigo-650 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                      >
                        Ask AI
                      </button>
                    </form>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
