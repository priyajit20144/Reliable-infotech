import React, { useState } from 'react';
import { PieChart, ChevronDown } from 'lucide-react';

interface RequestTypeItem {
  id: string;
  label: string;
  percent: number;
  count: number;
  color: string;
}

export const AdminRequestTypesDonut: React.FC = () => {
  const [filterPeriod, setFilterPeriod] = useState<'month' | 'last_month' | 'all'>('month');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const items: RequestTypeItem[] = [
    { id: 'custom', label: 'Custom Website', percent: 46, count: 22, color: '#8B5CF6' },
    { id: 'inquiry', label: 'Project Inquiry', percent: 25, count: 12, color: '#3B82F6' },
    { id: 'existing', label: 'Existing Project', percent: 15, count: 7, color: '#06B6D4' },
    { id: 'support', label: 'Support', percent: 10, count: 5, color: '#F59E0B' },
    { id: 'other', label: 'Other', percent: 4, count: 2, color: '#64748B' },
  ];

  const totalCount = items.reduce((sum, item) => sum + item.count, 0);

  // SVG Donut calculation
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Compute stroke offsets
  let accumulatedPercent = 0;
  const segments = items.map((item) => {
    const strokeDasharray = `${(item.percent / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += item.percent;
    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="h-full rounded-2xl bg-[#0D1527] border border-slate-800/80 p-4 sm:p-5 flex flex-col justify-between relative">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
            <PieChart className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm sm:text-base text-white tracking-tight">
            Request Types
          </h3>
        </div>

        {/* Period dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-xs text-slate-300 font-medium border border-slate-700/60 transition-colors"
          >
            <span>
              {filterPeriod === 'month'
                ? 'This Month'
                : filterPeriod === 'last_month'
                ? 'Last Month'
                : 'All Time'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-32 rounded-xl bg-[#0F172A] border border-slate-700/80 shadow-2xl py-1 z-30">
              <button
                onClick={() => {
                  setFilterPeriod('month');
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800/50"
              >
                This Month
              </button>
              <button
                onClick={() => {
                  setFilterPeriod('last_month');
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800/50"
              >
                Last Month
              </button>
              <button
                onClick={() => {
                  setFilterPeriod('all');
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800/50"
              >
                All Time
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Donut Chart + Legend Grid */}
      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 sm:gap-5 pt-3 pb-1 flex-1">
        {/* SVG Donut Center */}
        <div className="relative w-40 h-40 sm:w-44 sm:h-44 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform overflow-visible" viewBox={`0 0 ${size} ${size}`}>
            {/* Background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#1E293B"
              strokeWidth={strokeWidth}
            />

            {/* Segments */}
            {segments.map((seg) => {
              const isHovered = hoveredSegment === seg.id;
              return (
                <circle
                  key={seg.id}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-300 cursor-pointer"
                  style={{
                    filter: isHovered ? `drop-shadow(0 0 8px ${seg.color})` : 'none',
                  }}
                  onMouseEnter={() => setHoveredSegment(seg.id)}
                  onMouseLeave={() => setHoveredSegment(null)}
                />
              );
            })}
          </svg>

          {/* Center text in donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">
              {hoveredSegment
                ? items.find((i) => i.id === hoveredSegment)?.count ?? totalCount
                : totalCount}
            </span>
            <span className="text-[11px] font-medium text-slate-400 mt-1">
              {hoveredSegment
                ? items.find((i) => i.id === hoveredSegment)?.label
                : 'Total'}
            </span>
          </div>
        </div>

        {/* Legend on the right */}
        <div className="flex-1 w-full space-y-2.5 pl-0 sm:pl-2">
          {items.map((item) => {
            const isHovered = hoveredSegment === item.id;
            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredSegment(item.id)}
                onMouseLeave={() => setHoveredSegment(null)}
                className={`flex items-center justify-between text-xs cursor-pointer p-1 rounded-lg transition-colors ${
                  isHovered ? 'bg-slate-800/60' : 'hover:bg-slate-800/30'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm transition-transform duration-200"
                    style={{
                      backgroundColor: item.color,
                      transform: isHovered ? 'scale(1.3)' : 'scale(1)',
                    }}
                  />
                  <span
                    className={`truncate font-medium transition-colors ${
                      isHovered ? 'text-white font-semibold' : 'text-slate-300'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 pl-2">
                  <span className="font-bold text-white text-xs">{item.percent}%</span>
                  <span className="text-[11px] text-slate-400">({item.count})</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
