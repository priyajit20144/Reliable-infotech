import React, { useState } from 'react';
import { TrendingUp, Calendar } from 'lucide-react';
import { Card } from '../common/Card';

export const AnalyticsChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'month' | 'last_month' | 'quarter' | 'year'>('month');

  // SVG Area Chart points (normalized 800 x 200 coordinate space)
  const datasets = {
    month: {
      points: [
        { x: 50, y: 160, label: 'Week 1', val: 2 },
        { x: 200, y: 120, label: 'Week 2', val: 4 },
        { x: 350, y: 140, label: 'Week 3', val: 3 },
        { x: 500, y: 80, label: 'Week 4', val: 7 },
        { x: 650, y: 95, label: 'Week 5', val: 6 },
        { x: 750, y: 40, label: 'Now', val: 9 },
      ],
      path: 'M 50 160 Q 125 140, 200 120 T 350 140 T 500 80 T 650 95 T 750 40',
      areaPath: 'M 50 160 Q 125 140, 200 120 T 350 140 T 500 80 T 650 95 T 750 40 L 750 200 L 50 200 Z',
    },
    last_month: {
      points: [
        { x: 50, y: 180, label: 'W1', val: 1 },
        { x: 200, y: 150, label: 'W2', val: 2 },
        { x: 350, y: 120, label: 'W3', val: 4 },
        { x: 500, y: 100, label: 'W4', val: 5 },
        { x: 650, y: 90, label: 'W5', val: 6 },
        { x: 750, y: 80, label: 'End', val: 6 },
      ],
      path: 'M 50 180 Q 125 165, 200 150 T 350 120 T 500 100 T 650 90 T 750 80',
      areaPath: 'M 50 180 Q 125 165, 200 150 T 350 120 T 500 100 T 650 90 T 750 80 L 750 200 L 50 200 Z',
    },
    quarter: {
      points: [
        { x: 50, y: 150, label: 'Jan', val: 3 },
        { x: 250, y: 110, label: 'Feb', val: 5 },
        { x: 500, y: 70, label: 'Mar', val: 8 },
        { x: 750, y: 30, label: 'Current', val: 12 },
      ],
      path: 'M 50 150 Q 150 130, 250 110 T 500 70 T 750 30',
      areaPath: 'M 50 150 Q 150 130, 250 110 T 500 70 T 750 30 L 750 200 L 50 200 Z',
    },
    year: {
      points: [
        { x: 50, y: 170, label: 'Q1', val: 2 },
        { x: 280, y: 120, label: 'Q2', val: 5 },
        { x: 510, y: 80, label: 'Q3', val: 8 },
        { x: 750, y: 25, label: 'Q4', val: 15 },
      ],
      path: 'M 50 170 Q 165 145, 280 120 T 510 80 T 750 25',
      areaPath: 'M 50 170 Q 165 145, 280 120 T 510 80 T 750 25 L 750 200 L 50 200 Z',
    },
  };

  const currentData = datasets[timeRange];

  return (
    <Card className="p-5 sm:p-6 w-full overflow-hidden">
      {/* Top Header & Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/8 mb-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Project & Request Velocity</span>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Live Telemetry
            </span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Deliverable throughput and sprint milestones over time
          </p>
        </div>

        {/* Timeframe Selector Pill */}
        <div className="inline-flex rounded-xl bg-white/5 p-1 border border-white/10 shrink-0 text-xs">
          {[
            { key: 'month', label: 'This Month' },
            { key: 'last_month', label: 'Last Month' },
            { key: 'quarter', label: 'Quarter' },
            { key: 'year', label: 'Year' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTimeRange(t.key as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                timeRange === t.key
                  ? 'bg-devcraft-primary text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Summary Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
          <p className="text-[11px] text-gray-400">Completed Requests</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-bold text-white">1</span>
            <span className="text-[10px] font-semibold text-emerald-400 flex items-center">
              <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> 100%
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
          <p className="text-[11px] text-gray-400">Active Builds</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-bold text-white">2</span>
            <span className="text-[10px] font-semibold text-emerald-400 flex items-center">
              <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> 100%
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
          <p className="text-[11px] text-gray-400">Team Messages</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-bold text-white">8</span>
            <span className="text-[10px] font-semibold text-indigo-400 flex items-center">
              <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> 33%
            </span>
          </div>
        </div>
      </div>

      {/* SVG Glowing Area Chart Container */}
      <div className="w-full relative h-48 sm:h-56">
        <svg
          viewBox="0 0 800 220"
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#8B5CF6" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
            </linearGradient>
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1="50" x2="800" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
          <line x1="0" y1="100" x2="800" y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
          <line x1="0" y1="150" x2="800" y2="150" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
          <line x1="0" y1="200" x2="800" y2="200" stroke="rgba(255,255,255,0.08)" />

          {/* Area fill */}
          <path d={currentData.areaPath} fill="url(#chartGradient)" />

          {/* Glowing Line */}
          <path
            d={currentData.path}
            fill="none"
            stroke="#818CF8"
            strokeWidth="3.5"
            filter="url(#glowFilter)"
            strokeLinecap="round"
          />

          {/* Data Points */}
          {currentData.points.map((pt, i) => (
            <g key={i} className="cursor-pointer group">
              <circle
                cx={pt.x}
                cy={pt.y}
                r="5"
                fill="#0B0F19"
                stroke="#6366F1"
                strokeWidth="2.5"
                className="transition-transform group-hover:scale-125"
              />
              <circle cx={pt.x} cy={pt.y} r="2" fill="#FFFFFF" />
              <text
                x={pt.x}
                y="215"
                textAnchor="middle"
                fill="#6B7280"
                fontSize="11"
                fontFamily="sans-serif"
              >
                {pt.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </Card>
  );
};
