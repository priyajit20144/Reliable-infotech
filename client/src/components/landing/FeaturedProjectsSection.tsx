import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Heart,
  ExternalLink,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface FeaturedItem {
  id: string;
  category: string;
  categoryColor: string;
  title: string;
  image: string;
  technologies: string[];
  description: string;
  likes: number;
  features?: string[];
}

export const FeaturedProjectsSection: React.FC = () => {
  const [projectsData, setProjectsData] = useState<FeaturedItem[]>([
    {
      id: 'taskflow-pro',
      category: 'Web App',
      categoryColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      title: 'TaskFlow Pro',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      technologies: ['React', 'Node.js', 'MongoDB'],
      description:
        'A modern task management application with real-time collaboration, built for teams.',
      likes: 12,
      features: [
        'Real-time WebSocket Kanban boards',
        'Role-based permissions & audit logs',
        'Sprint milestone burndown telemetry',
      ],
    },
    {
      id: 'trendstore',
      category: 'E-Commerce',
      categoryColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      title: 'TrendStore',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      technologies: ['Next.js', 'Stripe', 'Tailwind'],
      description:
        'A complete e-commerce platform with secure payments and admin panel.',
      likes: 18,
      features: [
        'Stripe Checkout & localized currencies',
        'Inventory reservation engine',
        'Real-time order tracking & invoices',
      ],
    },
    {
      id: 'creative-portfolio',
      category: 'Portfolio',
      categoryColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      title: 'Creative Portfolio',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      technologies: ['React', 'Framer Motion', 'Tailwind'],
      description:
        'A stunning portfolio website for a creative professional with smooth animations.',
      likes: 10,
      features: [
        'Fluid 60fps WebGL transitions',
        'Interactive case study showcases',
        'Custom light/dark themes with token presets',
      ],
    },
    {
      id: 'fitlife',
      category: 'Mobile App',
      categoryColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      title: 'FitLife',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
      technologies: ['React Native', 'Firebase', 'Redux'],
      description:
        'A fitness tracking mobile app with workout plans and progress tracking.',
      likes: 15,
      features: [
        'Workout telemetry & calorie graphing',
        'Custom personal coaching plans',
        'Offline syncing with cloud recovery',
      ],
    },
  ]);

  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [selectedProject, setSelectedProject] = useState<FeaturedItem | null>(null);

  const handleToggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setLikedMap((prev) => {
      const isLiked = !prev[id];
      setProjectsData((currentList) =>
        currentList.map((item) =>
          item.id === id
            ? { ...item, likes: item.likes + (isLiked ? 1 : -1) }
            : item
        )
      );
      return { ...prev, [id]: isLiked };
    });
  };

  return (
    <section id="projects" className="py-20 bg-[#0B0F19] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-1.5 text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <span>«</span>
              <span>FEATURED PROJECTS</span>
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Our Latest Projects
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-xl leading-relaxed">
              Explore some of our recent work and see how we turn ideas into functional and beautiful digital products.
            </p>
          </div>

          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors shrink-0"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Projects Grid (1 col mobile, 2 col tablet, 4 col desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {projectsData.map((project) => {
            const isLiked = Boolean(likedMap[project.id]);
            return (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="rounded-2xl bg-[#0F172A]/75 hover:bg-[#131B33]/90 border border-white/8 hover:border-indigo-500/40 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group shadow-xl cursor-pointer"
              >
                {/* Image Container with Category Badge */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-85" />

                  {/* Top Left Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border backdrop-blur-md ${project.categoryColor}`}
                    >
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5 text-left">
                  <div>
                    {/* Title */}
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {project.title}
                    </h3>

                    {/* Tech Pills */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {project.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/5 font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-400 leading-relaxed mt-2.5 line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  {/* Card Bottom: View Project link & Heart Like button */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                      <span>View Project</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleToggleLike(project.id, e)}
                      className={`flex items-center gap-1.5 text-xs font-mono transition-colors p-1 rounded-lg ${
                        isLiked
                          ? 'text-rose-400'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                      title="Like Project"
                    >
                      <span className="text-[11px] font-bold">{project.likes}</span>
                      <Heart
                        className={`w-3.5 h-3.5 transition-transform active:scale-125 ${
                          isLiked ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Project Details Modal */}
      <Modal
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
        title={selectedProject?.title || 'Project Details'}
      >
        {selectedProject && (
          <div className="space-y-4 text-left text-xs">
            <div className="relative h-52 rounded-xl overflow-hidden bg-slate-900 border border-white/10">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span
                  className={`text-[10px] font-bold px-3 py-1 rounded-full border backdrop-blur-md ${selectedProject.categoryColor}`}
                >
                  {selectedProject.category}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">{selectedProject.title}</h3>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                {selectedProject.description}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Built With
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

            {selectedProject.features && (
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Key Capabilities
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

            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
              <Link to="/request" className="flex-1">
                <Button variant="primary" size="sm" className="w-full">
                  <span>Commission Similar System</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedProject(null)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};
