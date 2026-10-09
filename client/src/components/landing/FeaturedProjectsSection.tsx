import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Heart,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  FolderGit2,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { projectService } from '../../services/projectService';
import { Project } from '../../types';

interface FeaturedItem {
  id: string;
  slug: string;
  category: string;
  categoryColor: string;
  title: string;
  image: string;
  technologies: string[];
  description: string;
  likes: number;
  features?: string[];
  demoUrl?: string;
  price?: number;
}

const getCategoryColor = (category?: string) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('cloud') || cat.includes('devops')) return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
  if (cat.includes('fintech') || cat.includes('pay')) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  if (cat.includes('ai') || cat.includes('intel')) return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
  if (cat.includes('commerce') || cat.includes('store') || cat.includes('retail')) return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  if (cat.includes('mobile')) return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
  return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
};

const mapProjectToFeaturedItem = (p: Project, idx: number): FeaturedItem => ({
  id: p._id,
  slug: p.slug || p._id,
  category: p.category || 'Web Application',
  categoryColor: getCategoryColor(p.category),
  title: p.title,
  image:
    p.thumbnail ||
    p.images?.[0] ||
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  technologies: p.technologies || ['React', 'TypeScript', 'Node.js'],
  description: p.shortDescription || p.description,
  likes: 12 + ((idx * 7) % 25),
  features: p.features || [],
  demoUrl: p.demoUrl,
  price: p.price,
});

export const FeaturedProjectsSection: React.FC = () => {
  const [projectsData, setProjectsData] = useState<FeaturedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [selectedProject, setSelectedProject] = useState<FeaturedItem | null>(null);

  const fetchFeaturedProjects = async () => {
    try {
      setLoading(true);
      const res = await projectService.getProjects();
      if (res.success && Array.isArray(res.data)) {
        // Map dynamic showcase projects from backend
        setProjectsData(res.data.map(mapProjectToFeaturedItem));
      }
    } catch (err) {
      console.error('Failed to load featured projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProjects();

    const handleSync = () => fetchFeaturedProjects();
    window.addEventListener('devcraft_projects_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('devcraft_projects_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

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
              Explore our live client builds and showcase portfolio. Each project is crafted with modern architectures, clean code, and premium UI.
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

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-2xl bg-[#0F172A]/75 border border-white/5 p-4 space-y-4 animate-pulse"
              >
                <div className="h-44 w-full bg-slate-800/80 rounded-xl" />
                <div className="h-4 w-3/4 bg-slate-800 rounded" />
                <div className="h-3 w-full bg-slate-800/60 rounded" />
                <div className="h-3 w-1/2 bg-slate-800/60 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && projectsData.length === 0 && (
          <div className="p-12 text-center rounded-3xl bg-[#0F172A]/60 border border-white/10 max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-3">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">No Showcase Projects Currently Featured</h3>
            <p className="text-xs text-gray-400 mb-5">
              Our engineering team is actively crafting new high-performance systems. Check back soon or request a bespoke platform build.
            </p>
            <Link to="/request">
              <Button variant="primary" size="sm">
                Request Custom Build
              </Button>
            </Link>
          </div>
        )}

        {/* Projects Grid (Dynamic from Database) */}
        {!loading && projectsData.length > 0 && (
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

                    {/* Price tag if present */}
                    {project.price ? (
                      <div className="absolute top-3 right-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-md font-mono">
                          ${project.price.toLocaleString()}
                        </span>
                      </div>
                    ) : null}
                  </div>

                  {/* Card Content Body */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5 text-left">
                    <div>
                      {/* Title */}
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                        {project.title}
                      </h3>

                      {/* Tech Pills */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {project.technologies.slice(0, 3).map((tech, i) => (
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
                      <Link
                        to={`/projects/${project.slug || project.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 hover:underline"
                      >
                        <span>View Project</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>

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
        )}
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
              {selectedProject.price ? (
                <div className="absolute top-3 right-3">
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-950/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                    ${selectedProject.price.toLocaleString()}
                  </span>
                </div>
              ) : null}
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

            {selectedProject.features && selectedProject.features.length > 0 && (
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

            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Link to={`/projects/${selectedProject.slug || selectedProject.id}`}>
                  <Button variant="primary" size="sm">
                    <span>Inspect Public View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
                {selectedProject.demoUrl && (
                  <a
                    href={selectedProject.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Demo</span>
                  </a>
                )}
              </div>
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
