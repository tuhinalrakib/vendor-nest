"use client";

import React, { useState, useEffect } from "react";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_HOST || "http://127.0.0.1:8000";
import { BarChart } from "@/components/charts";
import { StatsCard } from "@/components/cards";

export default function SellerAnalytics() {
  const [timeRange, setTimeRange] = useState<"7days" | "30days" | "12months">("30days");
  const [forecast, setForecast] = useState<{ week: string; predicted_revenue: number }[]>([]);
  const [insights, setInsights] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [loadingForecast, setLoadingForecast] = useState(false);

  useEffect(() => {
    const fetchForecast = async () => {
      setLoadingForecast(true);
      try {
        const response = await fetch(`${BACKEND_URL}/api/ai/sales-forecast/`);
        const data = await response.json();
        if (response.ok) {
          setForecast(data.forecast || []);
          setInsights(data.insights || "");
          setRecommendations(data.recommendations || "");
        }
      } catch (err) {
        console.error("Failed to load AI Sales Forecast:", err);
      } finally {
        setLoadingForecast(false);
      }
    };
    fetchForecast();
  }, []);

  // Chart data based on selected time ranges
  const chartDataSets = {
    "7days": [
      { label: "Mon", value: 340 },
      { label: "Tue", value: 450 },
      { label: "Wed", value: 680 },
      { label: "Thu", value: 290 },
      { label: "Fri", value: 890 },
      { label: "Sat", value: 920 },
      { label: "Sun", value: 1100 },
    ],
    "30days": [
      { label: "Wk 1", value: 4200 },
      { label: "Wk 2", value: 5800 },
      { label: "Wk 3", value: 7100 },
      { label: "Wk 4", value: 9400 },
    ],
    "12months": [
      { label: "Jan", value: 12400 },
      { label: "Feb", value: 14500 },
      { label: "Mar", value: 11800 },
      { label: "Apr", value: 18900 },
      { label: "May", value: 22000 },
      { label: "Jun", value: 28500 },
      { label: "Jul", value: 31000 },
      { label: "Aug", value: 29800 },
      { label: "Sep", value: 32000 },
      { label: "Oct", value: 38000 },
      { label: "Nov", value: 42000 },
      { label: "Dec", value: 49000 },
    ],
  };

  const trafficData = [
    { label: "Direct", value: 45 },
    { label: "Google", value: 30 },
    { label: "Social", value: 15 },
    { label: "Email", value: 10 },
  ];

  return (
    <div className="space-y-6">
      {/* Title with filter dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-950">Analytics & Insights</h1>
          <p className="text-xs font-semibold text-zinc-400 mt-1">
            Examine conversions, store traffic source distributions, and sales volume trends.
          </p>
        </div>

        {/* Time filters dropdown */}
        <div className="flex gap-2">
          {(["7days", "30days", "12months"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 h-11 rounded-xl text-xs font-bold border capitalize transition-all duration-200 cursor-pointer ${
                timeRange === range
                  ? "bg-zinc-950 text-white border-zinc-950"
                  : "bg-white text-zinc-650 border-zinc-200 hover:bg-zinc-50"
              }`}
            >
              {range === "7days" ? "Last 7 Days" : range === "30days" ? "Last 30 Days" : "Last Year"}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Performance Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard label="Store Conversion Rate" value="3.42%" change="0.4%" isPositive={true} />
        <StatsCard label="Page Views" value="45,210" change="18.3%" isPositive={true} />
        <StatsCard label="Returning Customers" value="24.1%" change="1.2%" isPositive={false} />
        <StatsCard label="Bounce Rate" value="41.2%" change="2.4%" isPositive={true} />
      </div>

      {/* Analytics Custom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Sales Over Time Chart */}
        <div className="lg:col-span-2">
          <BarChart
            data={chartDataSets[timeRange]}
            height={260}
            color="indigo"
            title="Revenue Performance over selected Time Range ($)"
          />
        </div>

        {/* Traffic Sources Chart */}
        <div>
          <BarChart data={trafficData} height={260} color="violet" title="Traffic Sources Share (%)" />
        </div>
      </div>

      {/* AI Sales Forecast Card */}
      <div className="bg-white border border-zinc-200 rounded-3xl p-6 text-left shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-zinc-950 flex items-center gap-2">
              <span className="text-lg">📈</span> AI-Generated Sales Forecast & Insights
            </h3>
            <p className="text-[11px] font-semibold text-zinc-400 mt-0.5">
              Predicted revenues and predictive recommendations for the next 4 weeks.
            </p>
          </div>
          <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-150 text-indigo-750 text-[10px] font-extrabold uppercase rounded-full shrink-0">
            Powered by Gemini
          </span>
        </div>

        {loadingForecast ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-bold text-zinc-400 animate-pulse">Running predictive modeling...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Forecast Chart/Values */}
            <div className="lg:col-span-1 bg-zinc-50 border border-zinc-200/60 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-extrabold text-zinc-950 uppercase tracking-wider">Projected Weekly Revenue</h4>
              <div className="space-y-3.5">
                {forecast.length > 0 ? (
                  forecast.map((f, i) => (
                    <div key={i} className="flex justify-between items-center bg-white border border-zinc-150 p-3 rounded-xl shadow-2sm">
                      <span className="text-xs font-bold text-zinc-700">{f.week}</span>
                      <span className="text-sm font-black text-indigo-600">${f.predicted_revenue.toLocaleString()}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-zinc-400">No forecast data available.</span>
                )}
              </div>
            </div>

            {/* Analysis & Recommendations */}
            <div className="lg:col-span-2 space-y-5">
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-indigo-650 uppercase tracking-wider">Predictive Trend Insights</h4>
                <p className="text-xs font-semibold text-zinc-650 leading-relaxed bg-indigo-50/25 border border-indigo-100/50 p-4 rounded-xl">
                  {insights || "Predicting upcoming demand based on user acquisition velocity and conversion rates..."}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-emerald-650 uppercase tracking-wider">AI Business Recommendations</h4>
                <p className="text-xs font-semibold text-zinc-650 leading-relaxed bg-emerald-50/25 border border-emerald-100/50 p-4 rounded-xl">
                  {recommendations || "Analyzing historical patterns to suggest inventory adjustments and discount structures..."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Customer Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Performing Categories */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 text-left">
          <h3 className="text-sm font-bold text-zinc-950 mb-4">Top Categories Shares</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-zinc-700 mb-1.5">
                <span>Electronics</span>
                <span>55%</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: "55%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-zinc-700 mb-1.5">
                <span>Furniture</span>
                <span>25%</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-650 rounded-full" style={{ width: "25%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-zinc-700 mb-1.5">
                <span>Home & Kitchen</span>
                <span>20%</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-violet-600 rounded-full" style={{ width: "20%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Customer Cohort Retention */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 text-left">
          <h3 className="text-sm font-bold text-zinc-950 mb-4">Customer Cohort Retention</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-zinc-700 mb-1.5">
                <span>Month 1 (Activation)</span>
                <span>80%</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: "80%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-zinc-700 mb-1.5">
                <span>Month 3 (Retention)</span>
                <span>45%</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "45%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-zinc-700 mb-1.5">
                <span>Month 6 (LTV Growth)</span>
                <span>24%</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: "24%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
