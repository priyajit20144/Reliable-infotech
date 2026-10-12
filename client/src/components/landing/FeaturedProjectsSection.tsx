import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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

const mapProjectToFeaturedItem = (p: Project, idx: number): FeaturedItem => ({
  id: p._id,
  slug: p.slug || p._id,
  category: p.category || 'Web Application',
  categoryColor: 'border-[#363636] text-[#C9C9C9] bg-[#1E1E1E]',
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
    <section id="projects" className="py-16 md:py-24 relative border-t border-[#262626]">
      <div className="max-w-7xl 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-mono tracking-wider text-[#A1A1AA] bg-[#181818] border border-[#262626]">
              <span>SHOWCASE · PORTFOLIO</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#EEEEEE]">
              <span>Proven Engineering, </span>
              <span className="font-serif italic text-[#C9C9C9]">Measurable Results</span>
            </h2>
            <p className="text-sm text-[#8D8D8D] max-w-xl leading-relaxed">
              Explore recent production systems crafted with scalable cloud foundations, clean architecture, and delightful micro-interactions.
            </p>
          </div>

          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#EEEEEE] hover:text-white bg-[#181818] hover:bg-[#1E1E1E] px-4 py-2 rounded border border-[#262626] transition-colors shrink-0 group"
          >
            <span>View Complete Archive</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded bg-[#181818] border border-[#262626] p-4 space-y-4 animate-pulse"
              >
                <div className="h-44 w-full bg-[#1F1F1F] rounded" />
                <div className="h-4 w-3/4 bg-[#1F1F1F] rounded" />
                <div className="h-3 w-full bg-[#1F1F1F] rounded" />
                <div className="h-3 w-1/2 bg-[#1F1F1F] rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && projectsData.length === 0 && (
          <div className="p-12 text-center rounded bg-[#181818] border border-[#262626] max-w-xl mx-auto">
            <div className="w-12 h-12 rounded bg-[#1E1E1E] border border-[#363636] text-[#A1A1AA] flex items-center justify-center mx-auto mb-3">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-[#EEEEEE] mb-1">No Showcase Projects Currently Featured</h3>
            <p className="text-xs text-[#8D8D8D] mb-5">
              Our engineering team is actively crafting new high-performance systems. Check back soon or request a bespoke platform build.
            </p>
            <Link to="/request">
              <Button variant="primary" size="sm">
                Request Custom Build
              </Button>
            </Link>
          </div>
        )}

        {/* Projects Grid with Framer Motion & Corner Brackets */}
        {!loading && projectsData.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {projectsData.map((project, idx) => {
              const isLiked = Boolean(likedMap[project.id]);
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.07 }}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedProject(project)}
                  className="nf-frame nf-frame-hover cursor-pointer"
                >
                  <span className="nf-c nf-c-tl" />
                  <span className="nf-c nf-c-tr" />
                  <span className="nf-c nf-c-bl" />
                  <span className="nf-c nf-c-br" />

                  <div className="h-full rounded bg-[#181818] border border-[#262626] hover:border-[#363636] overflow-hidden flex flex-col justify-between transition-colors shadow-sm group">
                    {/* Image Container with Telemetry Category Badge */}
                    <div className="relative h-44 w-full overflow-hidden bg-[#121212]">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent opacity-90" />

                      {/* Category Tag */}
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded border border-[#363636] bg-[#121212]/80 backdrop-blur-sm text-[#C9C9C9]">
                          {project.category}
                        </span>
                      </div>

                      {/* Price tag */}
                      {project.price ? (
                        <div className="absolute top-3 right-3">
                          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-[#121212]/85 text-[#EEEEEE] border border-[#363636] backdrop-blur-sm">
                            ${project.price.toLocaleString()}
                          </span>
                        </div>
                      ) : null}
                    </div>

                    {/* Card Content Body */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5 text-left">
                      <div>
                        <h3 className="text-[15px] font-semibold text-[#EEEEEE] group-hover:text-white transition-colors line-clamp-1">
                          {project.title}
                        </h3>

                        {/* Tech Pills */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {project.technologies.slice(0, 3).map((tech, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-[#121212] text-[#8D8D8D] border border-[#262626] font-mono"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        <p className="text-xs text-[#8D8D8D] leading-relaxed mt-2.5 line-clamp-2">
                          {project.description}
                        </p>
                      </div>

                      {/* Card Bottom: View Project link & Heart Like button */}
                      <div className="pt-3 border-t border-[#262626] flex items-center justify-between">
                        <Link
                          to={`/projects/${project.slug || project.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#C9C9C9] group-hover:text-white transition-colors"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <button
                          type="button"
                          onClick={(e) => handleToggleLike(project.id, e)}
                          className={`flex items-center gap-1.5 text-xs font-mono transition-colors p-1 rounded ${
                            isLiked
                              ? 'text-[#EEEEEE]'
                              : 'text-[#8D8D8D] hover:text-[#EEEEEE]'
                          }`}
                          title="Like Project"
                        >
                          <span className="text-[11px]">{project.likes}</span>
                          <Heart
                            className={`w-3.5 h-3.5 transition-transform active:scale-125 ${
                              isLiked ? 'fill-current text-[#EEEEEE]' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
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
            <div className="relative h-52 rounded overflow-hidden bg-[#121212] border border-[#262626]">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#363636] bg-[#121212]/80 text-[#C9C9C9]">
                  {selectedProject.category}
                </span>
              </div>
              {selectedProject.price ? (
                <div className="absolute top-3 right-3">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#121212]/90 text-[#EEEEEE] border border-[#363636]">
                    ${selectedProject.price.toLocaleString()}
                  </span>
                </div>
              ) : null}
            </div>

            <div>
              <h3 className="text-base font-semibold text-[#EEEEEE]">{selectedProject.title}</h3>
              <p className="text-xs text-[#8D8D8D] mt-1 leading-relaxed">
                {selectedProject.description}
              </p>
            </div>

            <div className="p-3 rounded bg-[#121212] border border-[#262626] space-y-2">
              <p className="text-[10px] font-mono text-[#8D8D8D] uppercase tracking-wider">
                Technology Stack
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedProject.technologies.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-0.5 rounded bg-[#181818] text-[#EEEEEE] border border-[#363636] font-mono"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {selectedProject.features && selectedProject.features.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-mono text-[#8D8D8D] uppercase tracking-wider">
                  Key Capabilities
                </p>
                <div className="space-y-1">
                  {selectedProject.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[#C9C9C9]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#EEEEEE] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-[#262626] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Link to={`/projects/${selectedProject.slug || selectedProject.id}`}>
                  <button className="px-4 py-2 rounded text-xs font-medium bg-[#EEEEEE] text-[#121212] hover:bg-white inline-flex items-center gap-1.5 transition-colors">
                    <span>Inspect Public View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
                {selectedProject.demoUrl && (
                  <a
                    href={selectedProject.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded bg-[#181818] hover:bg-[#1E1E1E] text-xs font-medium text-[#C9C9C9] hover:text-white border border-[#262626] flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Demo</span>
                  </a>
                )}
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="px-3 py-2 rounded text-xs font-medium text-[#8D8D8D] hover:text-[#EEEEEE]"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};
