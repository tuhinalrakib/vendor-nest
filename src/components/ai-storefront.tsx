"use client";

import React, { useState, useEffect } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_HOST || "http://127.0.0.1:8000";

// 1. AI Review Summary Component
export function AIReviewSummary({ productId }: { productId: string }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateSummary = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/ai/review-summary/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId }),
      });
      const data = await response.json();
      if (response.ok) {
        setSummary(data.summary);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      console.error(err);
      setSummary("Failed to generate summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 text-left space-y-4">
      <div className="flex justify-between items-center border-b border-zinc-800/60 pb-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
          <span>✨</span> AI Review Analysis Summary
        </h4>
        <button
          onClick={handleGenerateSummary}
          disabled={loading}
          className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
        >
          {loading ? "Analyzing..." : summary ? "Re-Analyze Reviews" : "Generate Summary"}
        </button>
      </div>
      {loading ? (
        <div className="py-4 flex justify-center items-center">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : summary ? (
        <div
          className="text-xs text-zinc-300 leading-relaxed space-y-2 ai-summary-content"
          dangerouslySetInnerHTML={{ __html: summary }}
        />
      ) : (
        <p className="text-xs text-zinc-500 italic">
          Click above to generate a smart AI consensus summary based on customer reviews.
        </p>
      )}
    </div>
  );
}

// 2. AI Product Recommendations Component
export function AIRecommendations({ productId }: { productId: string }) {
  const [recs, setRecs] = useState<{ id: string; name: string; category: string; price: number; reason: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecs = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BACKEND_URL}/api/ai/recommendations/?product_id=${productId}`);
        const data = await response.json();
        if (response.ok) {
          setRecs(data);
        }
      } catch (err) {
        console.error("Failed to load recommendations", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, [productId]);

  if (loading) {
    return (
      <div className="py-8 flex justify-center items-center">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (recs.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span>🎯</span> Smart AI Recommendations
        </h3>
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Frequently bought together</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recs.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/30 flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-colors"
          >
            <div>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{item.category}</span>
                <span className="text-sm font-bold text-white">${item.price.toFixed(2)}</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-1.5 text-left">{item.name}</h4>
              <p className="text-[11px] text-zinc-400 font-medium leading-relaxed bg-zinc-950/40 border border-zinc-900 p-2.5 rounded-xl mt-3 text-left">
                <span className="font-bold text-indigo-400">AI Reason: </span>
                {item.reason}
              </p>
            </div>
            <button className="w-full h-8 rounded bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-bold text-[11px] transition-colors cursor-pointer border border-indigo-500/20">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. AI Chat Support Component
export function AIChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([
    { sender: "bot", text: "Hello! I am your AI assistant for VendorNest. How can I help you today?" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || sending) return;

    const userText = inputValue;
    setInputValue("");
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setSending(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/ai/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: messages.slice(-10),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, I am having trouble connecting to my servers right now." },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Floating Chat Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition-all z-50 cursor-pointer hover:scale-105"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chatbox Container */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 h-[450px] rounded-3xl border border-zinc-800 bg-zinc-950/95 backdrop-blur-md shadow-2xl flex flex-col justify-between overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="px-5 py-4 border-b border-zinc-850 bg-indigo-600/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow">
              AI
            </div>
            <div>
              <h4 className="text-xs font-bold text-white text-left">Vendor Support Assistant</h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] text-zinc-500 font-semibold uppercase">Online</span>
              </div>
            </div>
          </div>

          {/* Message List */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 text-left">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed font-semibold ${
                    m.sender === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 rounded-2xl rounded-tl-none flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce delay-150"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce delay-220"></span>
                </div>
              </div>
            )}
          </div>

          {/* Form Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-800 bg-zinc-950 flex gap-2">
            <input
              type="text"
              placeholder="Ask a question about products..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 h-9 px-3.5 bg-zinc-900 border border-zinc-800 focus:border-indigo-600 text-xs font-semibold text-white rounded-xl outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={sending}
              className="h-9 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors shrink-0 cursor-pointer"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
