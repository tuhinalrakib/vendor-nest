import React from "react";

interface ChartDataPoint {
  label: string;
  value: number;
}

interface MiniBarChartProps {
  data: ChartDataPoint[];
  height?: number;
  color?: string;
  title?: string;
}

export function BarChart({
  data,
  height = 200,
  color = "indigo",
  title,
}: MiniBarChartProps) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  
  // Dynamic color helper
  const barColors = {
    indigo: "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/10",
    emerald: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/10",
    violet: "bg-violet-600 hover:bg-violet-500 shadow-violet-500/10",
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
      {title && (
        <h3 className="text-sm font-bold text-zinc-900 mb-6 text-left">{title}</h3>
      )}
      
      {/* Bars container */}
      <div 
        className="flex items-end justify-between gap-3 w-full"
        style={{ height: `${height}px` }}
      >
        {data.map((item, idx) => {
          const percentage = (item.value / maxVal) * 100;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
              {/* Tooltip value */}
              <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-950 text-white text-[10px] font-bold px-1.5 py-0.5 rounded absolute -translate-y-8 pointer-events-none">
                {item.value}
              </span>
              
              {/* Bar */}
              <div 
                className={`w-full rounded-t-lg transition-all duration-500 origin-bottom scale-y-0 animate-chart-grow ${barColors[color as keyof typeof barColors] || barColors.indigo}`}
                style={{ 
                  height: `${percentage}%`,
                  animation: `chartGrow 0.8s ease-out forwards ${idx * 0.05}s`
                }}
              />
              
              {/* Label */}
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Embedded Animation Styles */}
      <style>{`
        @keyframes chartGrow {
          from {
            transform: scaleY(0);
            opacity: 0;
          }
          to {
            transform: scaleY(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
