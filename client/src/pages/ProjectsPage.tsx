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
import { CatalogFilterSidebar } from '../components/projects/CatalogFilterSidebar';

interface CatalogProject {
  id: string;
  slug?: string;
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

  // Live dynamic projects synchronization
  const [liveProjects, setLiveProjects] = useState<CatalogProject[]>([]);
  const [isLiveLoaded, setIsLiveLoaded] = useState(false);

  const fetchLiveCatalog = async () => {
    try {
      const res = await projectService.getProjects();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const mapped: CatalogProject[] = res.data.map((p, idx) => {
          const cat = (p.category || '').toLowerCase();
          let badgeColor = 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
          if (cat.includes('cloud') || cat.includes('devops')) badgeColor = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
          else if (cat.includes('fintech') || cat.includes('pay')) badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
          else if (cat.includes('ai') || cat.includes('intel')) badgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/30';
          else if (cat.includes('commerce') || cat.includes('retail')) badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';

          return {
            id: p._id,
            slug: p.slug || p._id,
            title: p.title,
            category: p.category || 'Web Application',
            categoryBadge: p.category || 'Web Application',
            badgeColor,
            isFeatured: Boolean(p.featured),
            projectType: (p.featured ? 'Featured' : (idx % 2 === 0 ? 'Popular' : 'Recent')) as 'Featured' | 'Popular' | 'Recent',
            description: p.shortDescription || p.description,
            technologies: p.technologies || ['React', 'TypeScript', 'Node.js'],
            image: p.thumbnail || p.images?.[0] || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
            demoUrl: p.demoUrl,
            githubUrl: p.githubUrl,
            rating: 4.8 + ((idx * 3) % 3) * 0.1,
            likesCount: 25 + ((idx * 7) % 35),
            features: p.features || [],
          };
        });
        setLiveProjects(mapped);
      } else if (res.success && Array.isArray(res.data) && res.data.length === 0) {
        setLiveProjects([]);
      }
    } catch (err) {
      console.error('Failed to load projects from API, using catalog fallback:', err);
    } finally {
      setIsLiveLoaded(true);
    }
  };

  useEffect(() => {
    fetchLiveCatalog();

    const handleSync = () => fetchLiveCatalog();
    window.addEventListener('devcraft_projects_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('devcraft_projects_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const currentCatalog = isLiveLoaded ? liveProjects : initialProjects;

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

  // Handle tech single option toggle
  const toggleTech = (tech: string) => {
    setSelectedTechs((prev) => (prev.includes(tech) ? [] : [tech]));
  };

  // Handle type single option toggle
  const toggleType = (type: string) => {
    setSelectedTypes((prev) => (prev.includes(type) ? [] : [type]));
  };

  // Reset all filters
  const handleClearFilters = () => {
    setSelectedCategory('All Projects');
    setSelectedTechs([]);
    setSelectedTypes([]);
    setSearchQuery('');
  };

  // Total active filter count
  const activeFiltersCount = useMemo(() => {
    return (
      (selectedCategory !== 'All Projects' ? 1 : 0) +
      selectedTechs.length +
      selectedTypes.length +
      (searchQuery.trim() ? 1 : 0)
    );
  }, [selectedCategory, selectedTechs, selectedTypes, searchQuery]);

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
    return currentCatalog.filter((p) => {
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
  }, [currentCatalog, selectedCategory, selectedTechs, selectedTypes, searchQuery]);

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

        {/* ========================================================================= */}
        {/* MOBILE & TABLET FILTERS & HORIZONTAL CATEGORIES CAROUSEL (< lg)           */}
        {/* ========================================================================= */}
        <div className="lg:hidden space-y-3">
          {/* Top Bar: Filter Drawer Trigger + Active Badges + Results Count */}
          <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-[#0F172A]/95 via-[#0B1222]/90 to-[#0F172A]/95 border border-white/10 backdrop-blur-xl shadow-lg">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white text-xs font-bold shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-white text-[10px] font-mono font-bold animate-pulse">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-[11px] font-semibold text-gray-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-white/5 cursor-pointer"
                  title="Clear all filters"
                >
                  <RotateCcw className="w-3 h-3 text-indigo-400" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            <span className="text-[11px] text-gray-400 font-mono bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
              {filteredProjects.length} results
            </span>
          </div>

          {/* Horizontal Swipeable Category Chips Bar for Mobile/Tablet */}
          <div className="relative">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
              {categoriesList.map((cat) => {
                const Icon = cat.icon || Layers;
                const isSelected = selectedCategory === cat.label;
                return (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => setSelectedCategory(cat.label)}
                    className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-indigo-400/40'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-400'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. MAIN CATALOG BODY (Left Filters Sidebar + Right Projects Grid)         */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: FILTERS SIDEBAR (Desktop)                    */}
          {/* ========================================================= */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 z-10">
            <CatalogFilterSidebar
              categoriesList={categoriesList}
              techOptions={techOptions}
              typeOptions={typeOptions}
              selectedCategory={selectedCategory}
              selectedTechs={selectedTechs}
              selectedTypes={selectedTypes}
              onSelectCategory={setSelectedCategory}
              onToggleTech={toggleTech}
              onToggleType={toggleType}
              onClearFilters={handleClearFilters}
              totalResultsCount={filteredProjects.length}
            />
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

            {/* Active Filters Pill Bar (Interactive & Removable Badges) */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 animate-in fade-in duration-200">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider pl-1">
                  Active:
                </span>

                {selectedCategory !== 'All Projects' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 animate-in zoom-in-95 duration-150">
                    <span>Category: {selectedCategory}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('All Projects')}
                      className="hover:text-white transition-colors cursor-pointer"
                      title="Reset category"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedTechs.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 animate-in zoom-in-95 duration-150"
                  >
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => toggleTech(tech)}
                      className="hover:text-white transition-colors cursor-pointer"
                      title={`Remove ${tech}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {selectedTypes.map((type) => (
                  <span
                    key={type}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30 animate-in zoom-in-95 duration-150"
                  >
                    <span>{type}</span>
                    <button
                      type="button"
                      onClick={() => toggleType(type)}
                      className="hover:text-white transition-colors cursor-pointer"
                      title={`Remove ${type}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {searchQuery.trim() && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-in zoom-in-95 duration-150">
                    <span>Search: "{searchQuery}"</span>
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="hover:text-white transition-colors cursor-pointer"
                      title="Clear search"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="ml-auto text-[11px] font-bold text-indigo-400 hover:text-indigo-300 hover:underline transition-colors px-1 cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}

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
                          <Link
                            to={`/projects/${project.slug || project.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors hover:underline"
                          >
                            <span>View Project</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </Link>

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
              <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Link to={`/projects/${selectedProject.slug || selectedProject.id}`}>
                    <Button variant="primary" size="sm">
                      <span>Inspect Full Architecture</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                  <Link to="/request">
                    <Button variant="secondary" size="sm">
                      <span>Commission Solution</span>
                    </Button>
                  </Link>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedProject(null)}>
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
              className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
              onClick={() => setMobileFilterOpen(false)}
            />
            {/* Drawer Body Slide In */}
            <div className="relative ml-auto w-full max-w-sm h-full bg-[#0B101D] border-l border-white/10 z-10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0F172A]/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                    <Filter className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        Filters
                      </h3>
                      {activeFiltersCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-500/25 text-indigo-300 border border-indigo-500/30">
                          {activeFiltersCount}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400">Refine project showcase</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 border border-white/5 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Filters Content */}
              <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/10">
                <CatalogFilterSidebar
                  categoriesList={categoriesList}
                  techOptions={techOptions}
                  typeOptions={typeOptions}
                  selectedCategory={selectedCategory}
                  selectedTechs={selectedTechs}
                  selectedTypes={selectedTypes}
                  onSelectCategory={setSelectedCategory}
                  onToggleTech={toggleTech}
                  onToggleType={toggleType}
                  onClearFilters={handleClearFilters}
                  totalResultsCount={filteredProjects.length}
                  isMobile={true}
                  onCloseMobile={() => setMobileFilterOpen(false)}
                />
              </div>

              {/* Sticky Bottom Actions */}
              <div className="p-4 border-t border-white/10 bg-[#080D1A] flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all cursor-pointer"
                >
                  Show {filteredProjects.length} Projects
                </button>
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
