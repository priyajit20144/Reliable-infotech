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
  // Collapsible accordion state for sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true,
    technology: true,
    projectType: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
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
          ? 'space-y-6 pb-4'
          : 'rounded-3xl bg-gradient-to-b from-[#0F172A]/95 via-[#0B1222]/90 to-[#080D1A]/95 backdrop-blur-2xl border border-white/10 p-5 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:border-indigo-500/30 transition-all duration-300'
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
      <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-cyan-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-sm">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-extrabold text-white tracking-widest uppercase">
                Filters
              </h3>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/25 text-indigo-300 border border-indigo-500/40 animate-pulse">
                  {activeFiltersCount} Active
                </span>
              )}
            </div>
            <p className="text-[10px] text-gray-400">Refine catalog showcase</p>
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={onClearFilters}
            className="group/reset inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200"
            title="Reset all filters"
          >
            <RotateCcw className="w-3 h-3 text-indigo-400 group-hover/reset:-rotate-180 transition-transform duration-500" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* =================================================================== */}
      {/* 2. CATEGORY ACCORDION (Interactive Animated Gradient Pills)        */}
      {/* =================================================================== */}
      <div className="relative z-10 space-y-2">
        <button
          type="button"
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between py-1 group/header cursor-pointer text-left"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-300 group-hover/header:text-white transition-colors">
              Category
            </h4>
          </div>
          <div className="flex items-center gap-1.5">
            {selectedCategory !== 'All Projects' && (
              <span className="text-[10px] text-indigo-400 font-semibold truncate max-w-[100px]">
                {selectedCategory}
              </span>
            )}
            <ChevronDown
              className={`w-3.5 h-3.5 text-gray-400 group-hover/header:text-white transition-transform duration-300 ${
                openSections.category ? 'rotate-180' : 'rotate-0'
              }`}
            />
          </div>
        </button>

        {openSections.category && (
          <div className="space-y-1 pt-1 animate-in fade-in slide-in-from-top-1 duration-200">
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
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-200 group/cat cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-semibold shadow-[0_0_20px_rgba(99,102,241,0.35)] border border-indigo-400/40 translate-x-1'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.05] hover:translate-x-1 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                        isSelected
                          ? 'text-white scale-110'
                          : 'text-gray-400 group-hover/cat:text-indigo-400 group-hover/cat:scale-110'
                      }`}
                    />
                    <span className="truncate">{cat.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white] animate-pulse" />
                    )}
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full transition-colors ${
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
      {/* 3. TECHNOLOGY ACCORDION (Custom Animated Checkbox Badges)          */}
      {/* =================================================================== */}
      <div className="relative z-10 space-y-2 pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={() => toggleSection('technology')}
          className="w-full flex items-center justify-between py-1 group/header cursor-pointer text-left"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-300 group-hover/header:text-white transition-colors">
              Technology
            </h4>
          </div>
          <div className="flex items-center gap-1.5">
            {selectedTechs.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold font-mono">
                {selectedTechs.length}
              </span>
            )}
            <ChevronDown
              className={`w-3.5 h-3.5 text-gray-400 group-hover/header:text-white transition-transform duration-300 ${
                openSections.technology ? 'rotate-180' : 'rotate-0'
              }`}
            />
          </div>
        </button>

        {openSections.technology && (
          <div className="space-y-1.5 pt-1 animate-in fade-in slide-in-from-top-1 duration-200">
            {techOptions.map((t) => {
              const isChecked = selectedTechs.includes(t.name);

              return (
                <div
                  key={t.name}
                  onClick={() => onToggleTech(t.name)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all duration-200 group/tech cursor-pointer active:scale-[0.98] border ${
                    isChecked
                      ? 'bg-indigo-500/15 border-indigo-500/35 text-white shadow-sm'
                      : 'border-transparent hover:bg-white/[0.04] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Custom Animated Checkbox Badge */}
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all duration-200 shrink-0 ${
                        isChecked
                          ? 'bg-gradient-to-tr from-indigo-500 to-purple-500 border-indigo-400 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)] scale-105'
                          : 'bg-slate-900/80 border-slate-700/80 group-hover/tech:border-indigo-400/50'
                      }`}
                    >
                      {isChecked && (
                        <Check className="w-2.5 h-2.5 text-white stroke-[3] animate-in zoom-in-50 duration-150" />
                      )}
                    </div>

                    <span
                      className={`truncate text-xs ${
                        isChecked
                          ? 'font-bold text-white'
                          : 'font-normal group-hover/tech:text-gray-200'
                      }`}
                    >
                      {t.name}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full transition-colors ${
                      isChecked
                        ? 'bg-indigo-500/30 text-indigo-200 font-bold'
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
      {/* 4. PROJECT TYPE ACCORDION (Interactive Badges with Icons)          */}
      {/* =================================================================== */}
      <div className="relative z-10 space-y-2 pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={() => toggleSection('projectType')}
          className="w-full flex items-center justify-between py-1 group/header cursor-pointer text-left"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-300 group-hover/header:text-white transition-colors">
              Project Type
            </h4>
          </div>
          <div className="flex items-center gap-1.5">
            {selectedTypes.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold font-mono">
                {selectedTypes.length}
              </span>
            )}
            <ChevronDown
              className={`w-3.5 h-3.5 text-gray-400 group-hover/header:text-white transition-transform duration-300 ${
                openSections.projectType ? 'rotate-180' : 'rotate-0'
              }`}
            />
          </div>
        </button>

        {openSections.projectType && (
          <div className="space-y-1.5 pt-1 animate-in fade-in slide-in-from-top-1 duration-200">
            {typeOptions.map((type) => {
              const isChecked = selectedTypes.includes(type.name);
              const Icon = getTypeIcon(type.name);

              return (
                <div
                  key={type.name}
                  onClick={() => onToggleType(type.name)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all duration-200 group/type cursor-pointer active:scale-[0.98] border ${
                    isChecked
                      ? 'bg-purple-500/15 border-purple-500/35 text-white shadow-sm'
                      : 'border-transparent hover:bg-white/[0.04] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Custom Animated Checkbox */}
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all duration-200 shrink-0 ${
                        isChecked
                          ? 'bg-gradient-to-tr from-purple-500 to-indigo-500 border-purple-400 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)] scale-105'
                          : 'bg-slate-900/80 border-slate-700/80 group-hover/type:border-purple-400/50'
                      }`}
                    >
                      {isChecked && (
                        <Check className="w-2.5 h-2.5 text-white stroke-[3] animate-in zoom-in-50 duration-150" />
                      )}
                    </div>

                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                        isChecked ? 'text-purple-300' : 'text-gray-400 group-hover/type:text-gray-300'
                      }`}
                    />

                    <span
                      className={`truncate text-xs ${
                        isChecked
                          ? 'font-bold text-white'
                          : 'font-normal group-hover/type:text-gray-200'
                      }`}
                    >
                      {type.name}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full transition-colors ${
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
      <div className="relative z-10 pt-2">
        <button
          type="button"
          onClick={onClearFilters}
          className="w-full py-2.5 px-4 rounded-2xl text-xs font-bold text-slate-300 hover:text-white bg-gradient-to-r from-white/[0.04] to-white/[0.02] hover:from-white/10 hover:to-white/5 border border-white/10 hover:border-indigo-500/40 shadow-sm transition-all duration-200 flex items-center justify-center gap-2 group/clear active:scale-[0.98] cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-indigo-400 group-hover/clear:-rotate-180 transition-transform duration-500" />
          <span>Clear Filters</span>
          {activeFiltersCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-[9px] flex items-center justify-center font-mono font-bold">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
