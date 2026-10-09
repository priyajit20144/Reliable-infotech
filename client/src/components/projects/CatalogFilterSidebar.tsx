import React, { useState } from 'react';
import {
  Filter,
  RotateCcw,
  Check,
  ChevronDown,
  Layers,
  Monitor,
  ShoppingCart,
  Code2,
  Palette,
  Smartphone,
  Cpu,
  Sparkles,
  TrendingUp,
  Clock,
  SlidersHorizontal,
} from 'lucide-react';

export interface CategoryOption {
  label: string;
  count: number;
  icon: React.ElementType;
}

export interface TechOption {
  name: string;
  count: number;
}

export interface TypeOption {
  name: string;
  count: number;
  icon?: React.ElementType;
}

interface CatalogFilterSidebarProps {
  categoriesList: CategoryOption[];
  techOptions: TechOption[];
  typeOptions: TypeOption[];
  selectedCategory: string;
  selectedTechs: string[];
  selectedTypes: string[];
  onSelectCategory: (category: string) => void;
  onToggleTech: (tech: string) => void;
  onToggleType: (type: string) => void;
  onClearFilters: () => void;
  totalResultsCount?: number;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export const CatalogFilterSidebar: React.FC<CatalogFilterSidebarProps> = ({
  categoriesList,
  techOptions,
  typeOptions,
  selectedCategory,
  selectedTechs,
  selectedTypes,
  onSelectCategory,
  onToggleTech,
  onToggleType,
  onClearFilters,
  totalResultsCount,
  isMobile = false,
  onCloseMobile,
}) => {
  type SectionKey = 'category' | 'technology' | 'projectType';
  // Single active accordion section (only one section can be open at a time)
  const [activeSection, setActiveSection] = useState<SectionKey | null>('category');

  const toggleSection = (section: SectionKey) => {
    setActiveSection((current) => (current === section ? null : section));
  };

  const activeFiltersCount =
    (selectedCategory !== 'All Projects' ? 1 : 0) +
    selectedTechs.length +
    selectedTypes.length;

  const getTypeIcon = (typeName: string) => {
    switch (typeName.toLowerCase()) {
      case 'featured':
        return Sparkles;
      case 'popular':
        return TrendingUp;
      case 'recent':
        return Clock;
      default:
        return SlidersHorizontal;
    }
  };

  return (
    <div
      className={`relative select-none text-left ${
        isMobile
          ? 'space-y-4 pb-3'
          : 'rounded-2xl bg-gradient-to-b from-[#0F172A]/95 via-[#0B1222]/90 to-[#080D1A]/95 backdrop-blur-2xl border border-white/10 p-3.5 sm:p-4 space-y-4 shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:border-indigo-500/30 transition-all duration-300'
      }`}
    >
      {/* Background Decorative Ambient Glows (Desktop only) */}
      {!isMobile && (
        <>
          <div className="absolute -top-20 -left-20 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      {/* =================================================================== */}
      {/* 1. SIDEBAR HEADER: Icon, Title & Active Filter Counter             */}
      {/* =================================================================== */}
      <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-cyan-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-sm">
            <Filter className="w-3 h-3" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-[11px] font-extrabold text-white tracking-wider uppercase">
                Filters
              </h3>
              {activeFiltersCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-indigo-500/25 text-indigo-300 border border-indigo-500/40 animate-pulse">
                  {activeFiltersCount} Active
                </span>
              )}
            </div>
            <p className="text-[9px] text-gray-400">Single option refine</p>
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={onClearFilters}
            className="group/reset inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 cursor-pointer"
            title="Reset all filters"
          >
            <RotateCcw className="w-2.5 h-2.5 text-indigo-400 group-hover/reset:-rotate-180 transition-transform duration-500" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* =================================================================== */}
      {/* 2. CATEGORY SECTION (Single Option Expandable)                      */}
      {/* =================================================================== */}
      <div className="relative z-10 space-y-1.5">
        <button
          type="button"
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between py-1 group/header cursor-pointer text-left transition-colors"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-300 group-hover/header:text-white transition-colors">
              Category
            </h4>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-indigo-300 font-semibold truncate max-w-[100px] px-1.5 py-0.2 rounded bg-indigo-500/15 border border-indigo-500/25">
              {selectedCategory}
            </span>
            <ChevronDown
              className={`w-3 h-3 text-gray-400 group-hover/header:text-white transition-transform duration-300 ${
                activeSection === 'category' ? 'rotate-180 text-indigo-400' : 'rotate-0'
              }`}
            />
          </div>
        </button>

        {activeSection === 'category' && (
          <div className="space-y-0.5 pt-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
            {categoriesList.map((cat) => {
              const Icon = cat.icon || Layers;
              const isSelected = selectedCategory === cat.label;

              return (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => {
                    onSelectCategory(cat.label);
                    if (isMobile && onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] transition-all duration-200 group/cat cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-semibold shadow-[0_0_15px_rgba(99,102,241,0.35)] border border-indigo-400/40 translate-x-0.5'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.05] hover:translate-x-0.5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon
                      className={`w-3 h-3 shrink-0 transition-transform duration-200 ${
                        isSelected
                          ? 'text-white scale-110'
                          : 'text-gray-400 group-hover/cat:text-indigo-400 group-hover/cat:scale-110'
                      }`}
                    />
                    <span className="truncate">{cat.label}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-1.5">
                    {isSelected && (
                      <span className="w-1 h-1 rounded-full bg-white shadow-[0_0_6px_white] animate-pulse" />
                    )}
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full transition-colors ${
                        isSelected
                          ? 'bg-white/20 text-white border border-white/20'
                          : 'bg-white/5 text-gray-400 group-hover/cat:bg-white/10 group-hover/cat:text-gray-200'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* 3. TECHNOLOGY SECTION (Single Option Expandable Radio)              */}
      {/* =================================================================== */}
      <div className="relative z-10 space-y-1.5 pt-3 border-t border-white/10">
        <button
          type="button"
          onClick={() => toggleSection('technology')}
          className="w-full flex items-center justify-between py-1 group/header cursor-pointer text-left transition-colors"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-300 group-hover/header:text-white transition-colors">
              Technology
            </h4>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-cyan-300 font-semibold truncate max-w-[100px] px-1.5 py-0.2 rounded bg-cyan-500/15 border border-cyan-500/25">
              {selectedTechs.length > 0 ? selectedTechs[0] : 'All'}
            </span>
            <ChevronDown
              className={`w-3 h-3 text-gray-400 group-hover/header:text-white transition-transform duration-300 ${
                activeSection === 'technology' ? 'rotate-180 text-cyan-400' : 'rotate-0'
              }`}
            />
          </div>
        </button>

        {activeSection === 'technology' && (
          <div className="space-y-0.5 pt-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
            {/* All Technologies Option */}
            <div
              onClick={() => {
                if (selectedTechs.length > 0) onToggleTech(selectedTechs[0]);
              }}
              className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-[11px] transition-all duration-200 group/tech cursor-pointer active:scale-[0.98] border ${
                selectedTechs.length === 0
                  ? 'bg-cyan-500/15 border-cyan-500/35 text-white shadow-sm'
                  : 'border-transparent hover:bg-white/[0.04] text-gray-400 hover:text-gray-200'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all duration-200 shrink-0 ${
                    selectedTechs.length === 0
                      ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                      : 'border-slate-700 bg-slate-900/80 group-hover/tech:border-cyan-400/50'
                  }`}
                >
                  {selectedTechs.length === 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22D3EE] animate-in zoom-in-50 duration-150" />
                  )}
                </div>
                <span className={`truncate text-[11px] ${selectedTechs.length === 0 ? 'font-bold text-white' : 'font-normal'}`}>
                  All Technologies
                </span>
              </div>
              <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-md ${selectedTechs.length === 0 ? 'bg-cyan-500/30 text-cyan-200 font-bold' : 'text-gray-500'}`}>
                50
              </span>
            </div>

            {/* Individual Tech Single Options */}
            {techOptions.map((t) => {
              const isChecked = selectedTechs.includes(t.name);

              return (
                <div
                  key={t.name}
                  onClick={() => onToggleTech(t.name)}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-[11px] transition-all duration-200 group/tech cursor-pointer active:scale-[0.98] border ${
                    isChecked
                      ? 'bg-cyan-500/15 border-cyan-500/35 text-white shadow-sm'
                      : 'border-transparent hover:bg-white/[0.04] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all duration-200 shrink-0 ${
                        isChecked
                          ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                          : 'border-slate-700 bg-slate-900/80 group-hover/tech:border-cyan-400/50'
                      }`}
                    >
                      {isChecked && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22D3EE] animate-in zoom-in-50 duration-150" />
                      )}
                    </div>

                    <span
                      className={`truncate text-[11px] ${
                        isChecked
                          ? 'font-bold text-white'
                          : 'font-normal group-hover/tech:text-gray-200'
                      }`}
                    >
                      {t.name}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded-md transition-colors ${
                      isChecked
                        ? 'bg-cyan-500/30 text-cyan-200 font-bold'
                        : 'text-gray-500 group-hover/tech:text-gray-300'
                    }`}
                  >
                    {t.count}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* 4. PROJECT TYPE SECTION (Single Option Expandable Radio)            */}
      {/* =================================================================== */}
      <div className="relative z-10 space-y-1.5 pt-3 border-t border-white/10">
        <button
          type="button"
          onClick={() => toggleSection('projectType')}
          className="w-full flex items-center justify-between py-1 group/header cursor-pointer text-left transition-colors"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-300 group-hover/header:text-white transition-colors">
              Project Type
            </h4>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-purple-300 font-semibold truncate max-w-[100px] px-1.5 py-0.2 rounded bg-purple-500/15 border border-purple-500/25">
              {selectedTypes.length > 0 ? selectedTypes[0] : 'All'}
            </span>
            <ChevronDown
              className={`w-3 h-3 text-gray-400 group-hover/header:text-white transition-transform duration-300 ${
                activeSection === 'projectType' ? 'rotate-180 text-purple-400' : 'rotate-0'
              }`}
            />
          </div>
        </button>

        {activeSection === 'projectType' && (
          <div className="space-y-0.5 pt-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
            {/* All Types Option */}
            <div
              onClick={() => {
                if (selectedTypes.length > 0) onToggleType(selectedTypes[0]);
              }}
              className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-[11px] transition-all duration-200 group/type cursor-pointer active:scale-[0.98] border ${
                selectedTypes.length === 0
                  ? 'bg-purple-500/15 border-purple-500/35 text-white shadow-sm'
                  : 'border-transparent hover:bg-white/[0.04] text-gray-400 hover:text-gray-200'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all duration-200 shrink-0 ${
                    selectedTypes.length === 0
                      ? 'border-purple-400 bg-purple-500/20 shadow-[0_0_8px_rgba(168,85,247,0.5)]'
                      : 'border-slate-700 bg-slate-900/80 group-hover/type:border-purple-400/50'
                  }`}
                >
                  {selectedTypes.length === 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_#C084FC] animate-in zoom-in-50 duration-150" />
                  )}
                </div>
                <SlidersHorizontal className={`w-3 h-3 shrink-0 ${selectedTypes.length === 0 ? 'text-purple-300' : 'text-gray-400'}`} />
                <span className={`truncate text-[11px] ${selectedTypes.length === 0 ? 'font-bold text-white' : 'font-normal'}`}>
                  All Types
                </span>
              </div>
              <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-md ${selectedTypes.length === 0 ? 'bg-purple-500/30 text-purple-200 font-bold' : 'text-gray-500'}`}>
                50
              </span>
            </div>

            {/* Individual Project Type Single Options */}
            {typeOptions.map((type) => {
              const isChecked = selectedTypes.includes(type.name);
              const Icon = getTypeIcon(type.name);

              return (
                <div
                  key={type.name}
                  onClick={() => onToggleType(type.name)}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-[11px] transition-all duration-200 group/type cursor-pointer active:scale-[0.98] border ${
                    isChecked
                      ? 'bg-purple-500/15 border-purple-500/35 text-white shadow-sm'
                      : 'border-transparent hover:bg-white/[0.04] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all duration-200 shrink-0 ${
                        isChecked
                          ? 'border-purple-400 bg-purple-500/20 shadow-[0_0_8px_rgba(168,85,247,0.5)]'
                          : 'border-slate-700 bg-slate-900/80 group-hover/type:border-purple-400/50'
                      }`}
                    >
                      {isChecked && (
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_#C084FC] animate-in zoom-in-50 duration-150" />
                      )}
                    </div>

                    <Icon
                      className={`w-3 h-3 shrink-0 transition-colors ${
                        isChecked ? 'text-purple-300' : 'text-gray-400 group-hover/type:text-gray-300'
                      }`}
                    />

                    <span
                      className={`truncate text-[11px] ${
                        isChecked
                          ? 'font-bold text-white'
                          : 'font-normal group-hover/type:text-gray-200'
                      }`}
                    >
                      {type.name}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded-md transition-colors ${
                      isChecked
                        ? 'bg-purple-500/30 text-purple-200 font-bold'
                        : 'text-gray-500 group-hover/type:text-gray-300'
                    }`}
                  >
                    {type.count}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* 5. BOTTOM CLEAR FILTERS CTA BUTTON                                 */}
      {/* =================================================================== */}
      <div className="relative z-10 pt-1">
        <button
          type="button"
          onClick={onClearFilters}
          className="w-full py-2 px-3 rounded-xl text-[11px] font-bold text-slate-300 hover:text-white bg-gradient-to-r from-white/[0.04] to-white/[0.02] hover:from-white/10 hover:to-white/5 border border-white/10 hover:border-indigo-500/40 shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5 group/clear active:scale-[0.98] cursor-pointer"
        >
          <RotateCcw className="w-3 h-3 text-indigo-400 group-hover/clear:-rotate-180 transition-transform duration-500" />
          <span>Clear Filters</span>
          {activeFiltersCount > 0 && (
            <span className="w-3.5 h-3.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-[8px] flex items-center justify-center font-mono font-bold">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
