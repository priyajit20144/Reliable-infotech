import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  ChevronRight,
  Code2,
  Heart,
  ShieldCheck,
  Search,
  Filter,
  X,
  LayoutGrid,
  List,
  Sparkles,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  ExternalLink,
  ChevronLeft,
  RotateCcw,
  Smartphone,
  Layers,
  Monitor,
  ShoppingCart,
  Palette,
  Cpu,
  TrendingUp,
} from 'lucide-react';
import { PublicNavbar } from '../components/landing/PublicNavbar';
import { Footer } from '../components/layout/Footer';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { projectService } from '../services/projectService';
import { Project } from '../types';

interface CatalogProject {
  id: string;
  title: string;
  category: string;
  categoryBadge: string;
  badgeColor: string;
  isFeatured?: boolean;
  projectType: 'Featured' | 'Popular' | 'Recent';
  description: string;
  technologies: string[];
  image: string;
  demoUrl?: string;
  githubUrl?: string;
  rating?: number;
  likesCount?: number;
  features?: string[];
}

export const ProjectsPage: React.FC = () => {
  // Pre-populated catalog matching the reference image
  const initialProjects: CatalogProject[] = [
    {
      id: 'proj_management',
      title: 'Project Management System',
      category: 'Web Application',
      categoryBadge: 'Web Application',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      isFeatured: true,
      projectType: 'Featured',
      description:
        'A complete project management solution with tasks, team collaboration and real-time updates.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Tailwind'],
      image:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      features: [
        'Real-time WebSocket Kanban boards',
        'Multi-member role permissions',
        'Sprint milestone burndown charts',
      ],
      rating: 4.9,
      likesCount: 38,
    },
    {
      id: 'online_store',
      title: 'Online Store Platform',
      category: 'E-Commerce',
      categoryBadge: 'E-Commerce',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      isFeatured: true,
      projectType: 'Featured',
      description:
        'A modern e-commerce platform with secure payments, inventory management and admin panel.',
      technologies: ['Next.js', 'Node.js', 'MongoDB', 'Stripe'],
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      features: [
        'Stripe Checkout & localized currencies',
        'Instant stock reservation lock',
        'Live order fulfillment telemetry',
      ],
      rating: 5.0,
      likesCount: 52,
    },
    {
      id: 'fitness_tracking',
      title: 'Fitness Tracking App',
      category: 'Mobile App',
      categoryBadge: 'Mobile App',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      isFeatured: false,
      projectType: 'Recent',
      description:
        'A feature-rich fitness app with workout plans, progress tracking and health analytics.',
      technologies: ['React Native', 'Firebase', 'Expo'],
      image:
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
      features: [
        'Live biometric data telemetry',
        'Automated workout scheduler',
        'Offline caching with cloud sync',
      ],
      rating: 4.8,
      likesCount: 41,
    },
    {
      id: 'travel_booking',
      title: 'Travel Booking Website',
      category: 'Website Development',
      categoryBadge: 'Website',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      isFeatured: false,
      projectType: 'Popular',
      description:
        'A responsive travel booking platform with search, booking and review system.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Tailwind'],
      image:
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
      features: [
        'Interactive map destination finder',
        'Real-time hotel availability query',
        'Automated PDF invoice generation',
      ],
      rating: 4.7,
      likesCount: 29,
    },
    {
      id: 'analytics_dashboard',
      title: 'Business Analytics Dashboard',
      category: 'Web Application',
      categoryBadge: 'SaaS Platform',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      isFeatured: false,
      projectType: 'Popular',
      description:
        'Gain insights with powerful analytics and real-time data visualization.',
      technologies: ['React', 'Node.js', 'Express', 'Chart.js'],
      image:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      features: [
        'Multi-tenant telemetry streaming',
        'Exportable CSV and PDF reports',
        'Role-based access matrix',
      ],
      rating: 4.9,
      likesCount: 64,
    },
    {
      id: 'food_delivery',
      title: 'Food Delivery App',
      category: 'Mobile App',
      categoryBadge: 'Food & Restaurant',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      isFeatured: false,
      projectType: 'Recent',
      description:
        'A complete food delivery solution with live tracking and multiple payment options.',
      technologies: ['React Native', 'Firebase', 'Stripe'],
      image:
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
      features: [
        'Driver GPS tracking on interactive map',
        'Instant kitchen order webhook',
        'One-click tip & review system',
      ],
      rating: 4.8,
      likesCount: 33,
    },
    {
      id: 'creative_portfolio',
      title: 'Creative Portfolio',
      category: 'Website Development',
      categoryBadge: 'Personal Website',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      isFeatured: false,
      projectType: 'Popular',
      description:
        'A modern portfolio website for creative professionals and freelancers.',
      technologies: ['Next.js', 'Tailwind', 'Framer'],
      image:
        'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      features: [
        '60fps WebGL transition shaders',
        'Interactive light/dark theme switch',
        'Contact form with anti-spam protection',
      ],
      rating: 4.9,
      likesCount: 45,
    },
    {
      id: 'hr_management',
      title: 'HR Management System',
      category: 'Web Application',
      categoryBadge: 'Web Application',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      isFeatured: false,
      projectType: 'Recent',
      description:
        'Streamline your HR processes with employee management and attendance tracking.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Material UI'],
      image:
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
      features: [
        'Automated leave approval pipelines',
        'Timesheet and biometric integration',
        'Employee performance evaluations',
      ],
      rating: 4.7,
      likesCount: 27,
    },
    {
      id: 'real_estate',
      title: 'Real Estate Platform',
      category: 'Website Development',
      categoryBadge: 'Website',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      isFeatured: false,
      projectType: 'Recent',
      description:
        'Find your dream home with our modern real estate listing platform.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Tailwind'],
      image:
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      features: [
        'Virtual 3D property walkthroughs',
        'Mortgage calculator widget',
        'Direct realtor messaging portal',
      ],
      rating: 4.8,
      likesCount: 39,
    },
  ];

  // State Management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Projects');
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular' | 'rating'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [interestedMap, setInterestedMap] = useState<Record<string, boolean>>({});
  const [selectedProject, setSelectedProject] = useState<CatalogProject | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Categories config matching reference image sidebar
  const categoriesList = [
    { label: 'All Projects', count: 50, icon: Layers },
    { label: 'Website Development', count: 18, icon: Monitor },
    { label: 'E-Commerce', count: 12, icon: ShoppingCart },
    { label: 'Web Application', count: 8, icon: Code2 },
    { label: 'UI/UX Design', count: 6, icon: Palette },
    { label: 'Mobile App', count: 4, icon: Smartphone },
    { label: 'Custom Software', count: 2, icon: Cpu },
  ];

  // Tech items config matching reference image
  const techOptions = [
    { name: 'React', count: 32 },
    { name: 'Node.js', count: 28 },
    { name: 'Next.js', count: 18 },
    { name: 'Tailwind CSS', count: 24 },
    { name: 'MongoDB', count: 16 },
    { name: 'Firebase', count: 8 },
    { name: 'Express.js', count: 12 },
  ];

  // Project Type config
  const typeOptions = [
    { name: 'Featured', count: 10 },
    { name: 'Popular', count: 20 },
    { name: 'Recent', count: 30 },
  ];

  // Handle tech toggle
  const toggleTech = (tech: string) => {
    setSelectedTechs((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  // Handle type toggle
  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Reset all filters
  const handleClearFilters = () => {
    setSelectedCategory('All Projects');
    setSelectedTechs([]);
    setSelectedTypes([]);
    setSearchQuery('');
  };

  // Toggle Interested
  const handleToggleInterested = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setInterestedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filtered & Sorted Projects
  const filteredProjects = useMemo(() => {
    return initialProjects.filter((p) => {
      // Category filter
      if (selectedCategory !== 'All Projects') {
        const matchesCat =
          p.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          selectedCategory.toLowerCase().includes(p.category.toLowerCase());
        if (!matchesCat) return false;
      }

      // Tech filter
      if (selectedTechs.length > 0) {
        const hasAnyTech = selectedTechs.some((st) =>
          p.technologies.some((t) =>
            t.toLowerCase().includes(st.toLowerCase().replace('.js', '').replace(' css', ''))
          )
        );
        if (!hasAnyTech) return false;
      }

      // Project Type filter
      if (selectedTypes.length > 0) {
        if (!selectedTypes.includes(p.projectType)) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.technologies.some((t) => t.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [initialProjects, selectedCategory, selectedTechs, selectedTypes, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F8FAFC]">
      <PublicNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION (Breadcrumbs, Title, Metrics, 3D Mockup Visual)          */}
        {/* ========================================================================= */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A]/90 via-[#0B0F19] to-indigo-950/30 border border-white/8 p-6 sm:p-10 shadow-2xl">
          {/* Ambient glow light trails */}
          <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-gradient-to-r from-cyan-500/15 via-indigo-600/20 to-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Column: Breadcrumb, Title, Subtitle, Metrics */}
            <div className="lg:col-span-7 space-y-5 text-left">
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                <Link to="/" className="hover:text-white flex items-center gap-1 transition-colors">
                  <Home className="w-3.5 h-3.5 text-gray-400" />
                  <span>Home</span>
                </Link>
                <ChevronRight className="w-3 h-3 text-gray-400" />
                <span className="text-indigo-400 font-semibold">Projects</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Our <span className="text-gradient-brand">Projects</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xl font-normal">
                Explore our latest work and discover how we turn ideas into powerful digital solutions. Each project is crafted with modern technology, clean code and a focus on great user experience.
              </p>

              {/* Metrics Row (3 Counters with Icons) */}
              <div className="pt-3 flex flex-wrap items-center gap-6">
                {/* Metric 1: 50+ */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xl font-black text-white leading-none">50+</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Projects Completed</p>
                  </div>
                </div>

                {/* Metric 2: 30+ */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-sm">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xl font-black text-white leading-none">30+</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Happy Clients</p>
                  </div>
                </div>

                {/* Metric 3: 5+ */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-sm">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xl font-black text-white leading-none">5+</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Years Experience</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Laptop, Smartphone & Floating Badges */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-[380px] h-[240px] flex items-center justify-center">
                
                {/* Floating "Build Something Amazing" Pill */}
                <div className="absolute top-2 left-2 z-20 animate-float">
                  <div className="px-3 py-1.5 rounded-full bg-[#0F172A]/90 border border-indigo-500/40 text-[10px] font-bold text-indigo-300 shadow-lg backdrop-blur-md">
                    <span>Build Something Amazing</span>
                  </div>
                </div>

                {/* Floating "</>" Code Badge */}
                <div className="absolute top-8 right-2 z-20 animate-float-delayed">
                  <div className="p-2.5 rounded-xl bg-[#0F172A]/90 border border-cyan-500/40 text-cyan-400 shadow-lg backdrop-blur-md">
                    <Code2 className="w-4 h-4" />
                  </div>
                </div>

                {/* 3D Laptop Mockup */}
                <div className="relative z-10 w-[240px] sm:w-[280px]">
                  <div className="rounded-t-xl bg-[#090D16] border-2 border-slate-700 p-1.5 shadow-2xl">
                    <div className="rounded-lg bg-[#070A12] p-2 font-mono text-[8px] text-gray-300 space-y-1">
                      <div className="flex items-center gap-1 pb-1 border-b border-white/10 text-gray-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="ml-1 text-[7px]">App.tsx</span>
                      </div>
                      <p className="text-cyan-400">const devcraft = () =&gt; &#123;</p>
                      <p className="text-purple-400 pl-2">return &lt;Project /&gt;;</p>
                      <p className="text-cyan-400">&#125;;</p>
                    </div>
                  </div>
                  <div className="h-2.5 bg-slate-700 rounded-b-md shadow-lg" />
                </div>

                {/* Smartphone Mockup */}
                <div className="absolute -right-2 bottom-2 z-20 w-16 h-32 rounded-xl bg-[#0A0E17] border-2 border-slate-600 p-1 shadow-2xl animate-float-slow">
                  <div className="w-full h-full rounded-lg bg-[#0B0F19] p-1 flex flex-col justify-between">
                    <div className="w-5 h-1 rounded-full bg-slate-800 mx-auto" />
                    <div className="space-y-1">
                      <div className="h-1.5 bg-cyan-500/40 rounded" />
                      <div className="h-1.5 bg-indigo-500/40 rounded" />
                      <div className="h-1.5 bg-purple-500/40 rounded" />
                    </div>
                    <div className="w-5 h-0.5 rounded-full bg-white/20 mx-auto" />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Toggle Button (< lg) */}
        <div className="lg:hidden flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/10">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-devcraft-primary text-white text-xs font-semibold shadow-sm"
          >
            <Filter className="w-4 h-4" />
            <span>Open Filters ({selectedCategory !== 'All Projects' || selectedTechs.length > 0 ? 'Active' : 'All'})</span>
          </button>
          <span className="text-xs text-gray-400 font-mono">
            {filteredProjects.length} results
          </span>
        </div>

        {/* ========================================================================= */}
        {/* 2. MAIN CATALOG BODY (Left Filters Sidebar + Right Projects Grid)         */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: FILTERS SIDEBAR (Desktop)                    */}
          {/* ========================================================= */}
          <aside className="hidden lg:block lg:col-span-3 rounded-2xl bg-[#0F172A]/80 border border-white/8 p-5 space-y-6 text-left shadow-xl sticky top-24">
            {/* Filter Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/8">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Filters
                </h3>
              </div>
              {(selectedCategory !== 'All Projects' ||
                selectedTechs.length > 0 ||
                selectedTypes.length > 0 ||
                searchQuery) && (
                <button
                  onClick={handleClearFilters}
                  className="text-[11px] font-semibold text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Filter Group 1: Category */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Category
              </h4>
              <div className="space-y-1">
                {categoriesList.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.label;
                  return (
                    <button
                      key={cat.label}
                      type="button"
                      onClick={() => setSelectedCategory(cat.label)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                        isSelected
                          ? 'bg-devcraft-primary text-white font-semibold shadow-glow-primary'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-3.5 h-3.5" />
                        <span>{cat.label}</span>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                          isSelected ? 'bg-white/20 text-white' : 'text-gray-400'
                        }`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter Group 2: Technology */}
            <div className="space-y-2.5 pt-3 border-t border-white/8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Technology
              </h4>
              <div className="space-y-2">
                {techOptions.map((t) => {
                  const isChecked = selectedTechs.includes(t.name);
                  return (
                    <label
                      key={t.name}
                      className="flex items-center justify-between text-xs text-gray-300 hover:text-white cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleTech(t.name)}
                          className="w-3.5 h-3.5 rounded bg-[#111827] border-white/20 text-indigo-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                        <span className={isChecked ? 'font-semibold text-white' : ''}>
                          {t.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-gray-400">
                        {t.count}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Filter Group 3: Project Type */}
            <div className="space-y-2.5 pt-3 border-t border-white/8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Project Type
              </h4>
              <div className="space-y-2">
                {typeOptions.map((type) => {
                  const isChecked = selectedTypes.includes(type.name);
                  return (
                    <label
                      key={type.name}
                      className="flex items-center justify-between text-xs text-gray-300 hover:text-white cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleType(type.name)}
                          className="w-3.5 h-3.5 rounded bg-[#111827] border-white/20 text-indigo-600 focus:ring-0 cursor-pointer"
                        />
                        <span className={isChecked ? 'font-semibold text-white' : ''}>
                          {type.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-gray-400">
                        {type.count}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Clear Filters Button at Bottom */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleClearFilters}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Filters</span>
              </button>
            </div>
          </aside>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: SEARCH, CONTROLS, AND PROJECTS CARDS GRID  */}
          {/* ========================================================= */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Top Search & Controls Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              
              {/* Wide Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects..."
                  className="w-full bg-[#111827]/90 text-white text-xs sm:text-sm rounded-xl border border-white/10 pl-9 pr-8 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sorting & View Toggle */}
              <div className="flex items-center gap-2.5 self-end sm:self-auto">
                {/* Sort By Dropdown */}
                <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-[#111827] border border-white/10 rounded-xl px-3 py-1.5">
                  <span className="hidden sm:inline">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent text-white text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="newest" className="bg-[#111827] text-white">Newest First</option>
                    <option value="oldest" className="bg-[#111827] text-white">Oldest First</option>
                    <option value="popular" className="bg-[#111827] text-white">Most Popular</option>
                    <option value="rating" className="bg-[#111827] text-white">Highest Rated</option>
                  </select>
                </div>

                {/* View Mode Toggle: Grid vs List */}
                <div className="flex items-center p-1 rounded-xl bg-[#111827] border border-white/10">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-devcraft-primary text-white shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'list'
                        ? 'bg-devcraft-primary text-white shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    title="List View"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* Showing Count Banner */}
            <div className="flex items-center justify-between text-xs text-gray-400 px-1">
              <span>
                Showing <strong>{filteredProjects.length}</strong> of 50 projects
              </span>
              {selectedCategory !== 'All Projects' && (
                <span className="text-indigo-400 font-medium">
                  Category: {selectedCategory}
                </span>
              )}
            </div>

            {/* Empty Search / Filter Feedback */}
            {filteredProjects.length === 0 ? (
              <div className="rounded-2xl bg-[#0F172A]/70 border border-white/10 p-12 text-center space-y-3">
                <p className="text-base font-bold text-white">No projects found</p>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  We could not find any projects matching your current filter criteria.
                </p>
                <Button variant="secondary" size="sm" onClick={handleClearFilters}>
                  Reset All Filters
                </Button>
              </div>
            ) : viewMode === 'grid' ? (
              /* ========================================================= */
              /* RESPONSIVE GRID VIEW (3 Columns Desktop, 2 Tablet, 1 Mobile) */
              /* ========================================================= */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => {
                  const isInterested = Boolean(interestedMap[project.id]);
                  return (
                    <div
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className="rounded-2xl bg-[#0F172A]/75 hover:bg-[#131B33]/90 border border-white/8 hover:border-indigo-500/40 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group shadow-xl cursor-pointer"
                    >
                      {/* Image Preview with Category Badge & Featured pill */}
                      <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-85" />

                        {/* Top Left Badges */}
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          {project.isFeatured && (
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-600/90 text-white shadow-sm backdrop-blur-md">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5 text-left">
                        <div>
                          {/* Category Badge */}
                          <div className="mb-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${project.badgeColor}`}
                            >
                              {project.categoryBadge}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                            {project.title}
                          </h3>

                          {/* Description */}
                          <p className="text-xs text-gray-400 leading-relaxed mt-2 line-clamp-2">
                            {project.description}
                          </p>

                          {/* Tech Pills */}
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {project.technologies.map((tech, i) => (
                              <span
                                key={i}
                                className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/5 font-mono"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Bottom Row: View Project link & Interested button */}
                        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors">
                            <span>View Project</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </span>

                          <button
                            type="button"
                            onClick={(e) => handleToggleInterested(project.id, e)}
                            className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-all ${
                              isInterested
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                            title="Mark as Interested"
                          >
                            <Bookmark
                              className={`w-3.5 h-3.5 ${
                                isInterested ? 'fill-amber-400 text-amber-400' : ''
                              }`}
                            />
                            <span>{isInterested ? 'Saved' : 'Interested'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* ========================================================= */
              /* LIST VIEW MODE                                            */
              /* ========================================================= */
              <div className="space-y-4">
                {filteredProjects.map((project) => {
                  const isInterested = Boolean(interestedMap[project.id]);
                  return (
                    <div
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className="rounded-2xl bg-[#0F172A]/75 hover:bg-[#131B33]/90 border border-white/8 hover:border-indigo-500/40 p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 transition-all duration-300 hover:-translate-y-0.5 group shadow-lg cursor-pointer"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-left">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full sm:w-28 h-24 object-cover rounded-xl"
                        />
                        <div className="space-y-1.5 max-w-xl">
                          <div className="flex items-center gap-2">
                            {project.isFeatured && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                                Featured
                              </span>
                            )}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${project.badgeColor}`}>
                              {project.categoryBadge}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-xs text-gray-400 line-clamp-2">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {project.technologies.map((t, idx) => (
                              <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-300 font-mono">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                        <button
                          type="button"
                          onClick={(e) => handleToggleInterested(project.id, e)}
                          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border ${
                            isInterested
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold'
                              : 'text-gray-400 hover:text-white border-white/10'
                          }`}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isInterested ? 'fill-amber-400 text-amber-400' : ''}`} />
                          <span>{isInterested ? 'Saved' : 'Interested'}</span>
                        </button>
                        <Button variant="primary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                          <span>View Details</span>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls matching reference image */}
            <div className="flex items-center justify-center gap-1.5 pt-8">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center text-xs transition-colors"
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {[1, 2, 3, 4, 5].map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                    currentPage === pageNum
                      ? 'bg-indigo-600 text-white shadow-glow-primary'
                      : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(5, p + 1))}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center text-xs transition-colors"
                disabled={currentPage === 5}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. PROJECT DETAIL INSPECTION MODAL                                        */}
        {/* ========================================================================= */}
        <Modal
          isOpen={Boolean(selectedProject)}
          onClose={() => setSelectedProject(null)}
          title={selectedProject?.title || 'Project Specifications'}
        >
          {selectedProject && (
            <div className="space-y-4 text-left text-xs">
              <div className="relative h-56 rounded-xl overflow-hidden bg-slate-900 border border-white/10">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-md ${selectedProject.badgeColor}`}>
                    {selectedProject.categoryBadge}
                  </span>
                  {selectedProject.isFeatured && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-600 text-white">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{selectedProject.title}</h3>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Technologies */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Technology Architecture
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.technologies.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-mono font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Capabilities */}
              {selectedProject.features && (
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Core Capabilities
                  </p>
                  <div className="space-y-1">
                    {selectedProject.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-gray-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions in Footer */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                <Link to="/request" className="flex-1">
                  <Button variant="primary" size="sm" className="w-full">
                    <span>Commission Custom Solution</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
                <Button variant="secondary" size="sm" onClick={() => setSelectedProject(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* ========================================================================= */}
        {/* 4. MOBILE FILTERS DRAWER (< lg)                                           */}
        {/* ========================================================================= */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
              onClick={() => setMobileFilterOpen(false)}
            />
            {/* Drawer Body */}
            <div className="relative w-80 max-w-[85vw] h-full bg-[#0F172A] z-10 shadow-2xl p-5 overflow-y-auto space-y-6 text-left animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Filters
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-gray-400 uppercase">Category</p>
                {categoriesList.map((cat) => (
                  <button
                    key={cat.label}
                    onClick={() => {
                      setSelectedCategory(cat.label);
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs ${
                      selectedCategory === cat.label
                        ? 'bg-devcraft-primary text-white font-semibold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className="text-[10px] font-mono">{cat.count}</span>
                  </button>
                ))}
              </div>

              {/* Technologies */}
              <div className="space-y-2 pt-3 border-t border-white/10">
                <p className="text-xs font-bold text-gray-400 uppercase">Technology</p>
                {techOptions.map((t) => (
                  <label key={t.name} className="flex items-center justify-between text-xs text-gray-300">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedTechs.includes(t.name)}
                        onChange={() => toggleTech(t.name)}
                        className="rounded bg-[#111827] text-indigo-600"
                      />
                      <span>{t.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400">{t.count}</span>
                  </label>
                ))}
              </div>

              {/* Clear button */}
              <div className="pt-2">
                <Button variant="secondary" size="sm" className="w-full" onClick={handleClearFilters}>
                  Clear All Filters
                </Button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer matching reference image layout */}
      <Footer />
    </div>
  );
};
