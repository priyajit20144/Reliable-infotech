import React, { useState } from 'react';
import { BarChart3, ChevronDown } from 'lucide-react';

interface ChartPoint {
  label: string;
  value: number;
}

export const AdminProjectAnalyticsChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | 'year'>('7days');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<ChartPoint | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const dataSets: Record<string, { label: string; data: ChartPoint[] }> = {
    '7days': {
      label: 'Last 7 days',
      data: [
        { label: 'Apr 22', value: 18 },
        { label: 'Apr 23', value: 16 },
        { label: 'Apr 24', value: 22 },
        { label: 'Apr 25', value: 18 },
        { label: 'Apr 26', value: 26 },
        { label: 'Apr 27', value: 25 },
        { label: 'Apr 28', value: 34 },
      ],
    },
    '30days': {
      label: 'Last 30 days',
      data: [
        { label: 'Week 1', value: 20 },
        { label: 'Week 2', value: 28 },
        { label: 'Week 3', value: 24 },
        { label: 'Week 4', value: 38 },
      ],
    },
    year: {
      label: 'This Year',
      data: [
        { label: 'Q1', value: 22 },
        { label: 'Q2', value: 32 },
        { label: 'Q3', value: 28 },
        { label: 'Q4', value: 39 },
      ],
    },
  };

  const currentData = dataSets[timeRange].data;

  // Chart dimensions & scaling
  const width = 500;
  const height = 220;
  const paddingX = 40;
  const paddingY = 25;
  const maxY = 40;
  const minY = 0;

  const getX = (index: number) => {
    return paddingX + (index / (currentData.length - 1)) * (width - paddingX * 2);
  };

  const getY = (val: number) => {
    const effectiveHeight = height - paddingY * 2;
    const ratio = (val - minY) / (maxY - minY);
    return height - paddingY - ratio * effectiveHeight;
  };

  // Build smooth cubic bezier curve
  const points = currentData.map((d, i) => ({ x: getX(i), y: getY(d.value) }));

  const generateSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cx = (p0.x + p1.x) / 2;
      path += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  const linePath = generateSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  const yTicks = [40, 30, 20, 10, 0];

  return (
    <div className="h-full rounded-2xl bg-[#0D1527] border border-slate-800/80 p-5 flex flex-col justify-between relative">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm sm:text-base text-white tracking-tight">
            Project Analytics
          </h3>
        </div>

        {/* Time Range Selector */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-xs text-slate-300 font-medium border border-slate-700/60 transition-colors"
          >
            <span>{dataSets[timeRange].label}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-32 rounded-xl bg-[#0F172A] border border-slate-700/80 shadow-2xl py-1 z-30">
              {Object.entries(dataSets).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => {
                    setTimeRange(key as any);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                    timeRange === key
                      ? 'text-blue-400 font-semibold bg-blue-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {val.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SVG Interactive Chart */}
      <div className="relative w-full flex-1 pt-4 pb-1">
        {/* Hover Tooltip Floating Card */}
        {hoveredPoint && hoveredIndex !== null && (
          <div
            className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full px-2.5 py-1 rounded-lg bg-blue-950/90 border border-blue-500/50 text-white text-[11px] shadow-xl shadow-blue-900/40 backdrop-blur-md"
            style={{
              left: `${(points[hoveredIndex].x / width) * 100}%`,
              top: `${(points[hoveredIndex].y / height) * 100 - 8}%`,
            }}
          >
            <div className="font-bold text-cyan-300">{hoveredPoint.value} Projects</div>
            <div className="text-[9px] text-slate-300">{hoveredPoint.label}</div>
          </div>
        )}

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-48 sm:h-56 overflow-visible select-none"
        >
          <defs>
            {/* Area Fill Gradient */}
            <linearGradient id="analyticsAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818CF8" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#6366F1" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
            </linearGradient>

            {/* Line Neon Glow Filter */}
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Horizontal Gridlines & Y-Axis Labels */}
          {yTicks.map((tick) => {
            const y = getY(tick);
            return (
              <g key={tick}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="rgba(148, 163, 184, 0.12)"
                  strokeDasharray="3 3"
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="10"
                  fill="#64748B"
                  fontWeight="500"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#analyticsAreaGrad)" />

          {/* Main Neon Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#818CF8"
            strokeWidth="3"
            filter="url(#neonGlow)"
            strokeLinecap="round"
          />

          {/* Interactive Data Points */}
          {points.map((p, i) => {
            const d = currentData[i];
            const isHovered = hoveredIndex === i;
            return (
              <g
                key={i}
                className="cursor-pointer"
                onMouseEnter={() => {
                  setHoveredPoint(d);
                  setHoveredIndex(i);
                }}
                onMouseLeave={() => {
                  setHoveredPoint(null);
                  setHoveredIndex(null);
                }}
              >
                {/* Invisible large touch circle */}
                <circle cx={p.x} cy={p.y} r="16" fill="transparent" />

                {/* Outer Glow Circle */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? '7' : '4.5'}
                  fill="#4F46E5"
                  className="transition-all duration-200"
                />

                {/* Center Core Circle */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? '4' : '2.5'}
                  fill="#FFFFFF"
                  className="transition-all duration-200"
                />

                {/* X-axis Label */}
                <text
                  x={p.x}
                  y={height - 5}
                  textAnchor="middle"
                  fontSize="10"
                  fill={isHovered ? '#FFFFFF' : '#94A3B8'}
                  fontWeight={isHovered ? '700' : '500'}
                  className="transition-colors"
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
