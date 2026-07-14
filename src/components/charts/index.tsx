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
    <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col justify-between hover-neon-glow">
      {title && (
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 mb-6 text-left">{title}</h3>
      )}
      
      {/* Bars container */}
      <div 
        className="flex items-end justify-between gap-3 w-full animate-in fade-in duration-300"
        style={{ height: `${height}px` }}
      >
        {data.map((item, idx) => {
          const percentage = (item.value / maxVal) * 100;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
              {/* Tooltip value */}
              <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-950 text-white text-[10px] font-bold px-1.5 py-0.5 rounded absolute -translate-y-8 pointer-events-none z-10 shadow-xs">
                {item.value}
              </span>
              
              {/* Bar */}
              <div 
                className={`w-full rounded-t-lg transition-all duration-500 origin-bottom scale-y-0 ${barColors[color as keyof typeof barColors] || barColors.indigo}`}
                style={{ 
                  height: `${percentage}%`,
                  animation: `chartGrow 0.8s ease-out forwards ${idx * 0.05}s`
                }}
              />
              
              {/* Label */}
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
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

interface AreaChartProps {
  data: ChartDataPoint[];
  height?: number;
  color?: string; // 'indigo' | 'emerald' | 'violet'
  title?: string;
}

export function AreaChart({
  data,
  height = 200,
  color = "indigo",
  title,
}: AreaChartProps) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const width = 500;
  const svgHeight = height - 40;

  // Generate SVG coordinates
  const points = data.map((item, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = svgHeight - (item.value / maxVal) * (svgHeight - 20);
    return { x, y, label: item.label, value: item.value };
  });

  // SVG Line path
  const linePath = points.reduce(
    (acc, p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ""
  );

  // SVG Area path (closing to bottom)
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${svgHeight} L ${points[0].x} ${svgHeight} Z`;

  const colorThemes = {
    indigo: {
      stroke: "stroke-indigo-650 dark:stroke-indigo-400",
      fill: `url(#indigoGrad)`,
      stopColor: "#4f46e5",
    },
    emerald: {
      stroke: "stroke-emerald-600 dark:stroke-emerald-400",
      fill: `url(#emeraldGrad)`,
      stopColor: "#059669",
    },
    violet: {
      stroke: "stroke-violet-650 dark:stroke-violet-400",
      fill: `url(#violetGrad)`,
      stopColor: "#7c3aed",
    },
  };

  const theme = colorThemes[color as keyof typeof colorThemes] || colorThemes.indigo;

  return (
    <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col justify-between hover-neon-glow">
      {title && (
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 mb-6 text-left">{title}</h3>
      )}

      {/* SVG Canvas */}
      <div className="relative w-full overflow-hidden" style={{ height: `${svgHeight}px` }}>
        <svg
          viewBox={`0 0 ${width} ${svgHeight}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={`${color}Grad`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.stopColor} stopOpacity="0.25" />
              <stop offset="100%" stopColor={theme.stopColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1={svgHeight * 0.25} x2={width} y2={svgHeight * 0.25} className="stroke-zinc-100 dark:stroke-zinc-800/40 stroke-1 stroke-dashed" />
          <line x1="0" y1={svgHeight * 0.5} x2={width} y2={svgHeight * 0.5} className="stroke-zinc-100 dark:stroke-zinc-800/40 stroke-1 stroke-dashed" />
          <line x1="0" y1={svgHeight * 0.75} x2={width} y2={svgHeight * 0.75} className="stroke-zinc-100 dark:stroke-zinc-800/40 stroke-1 stroke-dashed" />

          {/* Area under the line */}
          <path d={areaPath} fill={theme.fill} className="animate-area-fade" />

          {/* Smooth Line */}
          <path
            d={linePath}
            fill="none"
            className={`${theme.stroke} stroke-2`}
            style={{
              strokeDasharray: 1000,
              strokeDashoffset: 1000,
              animation: "lineDraw 1.5s ease-out forwards",
            }}
          />

          {/* Interactive circles */}
          {points.map((p, idx) => (
            <g key={idx} className="group/circle cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                className={`fill-white dark:fill-zinc-900 ${theme.stroke} stroke-2 hover:r-6 transition-all`}
              />
              {/* Tooltip on hover */}
              <foreignObject
                x={p.x - 30}
                y={p.y - 32}
                width="60"
                height="28"
                className="opacity-0 group-hover/circle:opacity-100 transition-opacity pointer-events-none"
              >
                <div className="bg-zinc-950 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm text-center">
                  ${p.value}
                </div>
              </foreignObject>
            </g>
          ))}
        </svg>
      </div>

      {/* X Axis Labels */}
      <div className="flex justify-between mt-3 px-1">
        {data.map((item, idx) => (
          <span key={idx} className="text-[9px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider">
            {item.label}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes lineDraw {
          to {
            strokeDashoffset: 0;
          }
        }
        @keyframes areaFade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-area-fade {
          animation: areaFade 1s ease-out forwards 0.4s;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
