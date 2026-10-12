import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ExternalLink,
  Github,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Layers,
  ShieldCheck,
  Zap,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/adminService';
import { projectService } from '../services/projectService';
import { Project } from '../types';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Textarea } from '../components/common/Textarea';
import { BrandLoader } from '../components/common/BrandLoader';
import { PublicNavbar } from '../components/landing/PublicNavbar';
import { Footer } from '../components/layout/Footer';
import { AdminDeleteProjectModal } from '../components/admin/AdminDeleteProjectModal';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState<string>('');
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Inquiry form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      try {
        const res = await projectService.getProjectById(id);
        if (res.success && res.data) {
          setProject(res.data);
          setSelectedImg(res.data.thumbnail || res.data.images[0]);
          setMessage(`Hi Reliable Info Tech team, I am interested in acquiring ${res.data.title}. Please provide delivery details.`);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !name || !email || !message) return;
    try {
      setSubmitting(true);
      const res = await projectService.createInquiry({
        projectId: project._id,
        name,
        email,
        message,
      });
      if (res.success) {
        setSuccessMsg('Your inquiry has been submitted! Our lead architect will reach out within 24 hours.');
        setName('');
        setEmail('');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit inquiry');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!project) return;
    try {
      setDeleting(true);
      await adminService.deleteProject(project._id || project.slug);
      window.dispatchEvent(new Event('devcraft_projects_updated'));
      localStorage.setItem('devcraft_last_project_update', Date.now().toString());
      setDeleteModalOpen(false);
      navigate('/admin?tab=projects');
    } catch (err: any) {
      alert(err.message || 'Failed to delete showcase project');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <BrandLoader message="Loading project specifications..." />;
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-[#F8FAFC]">
        <PublicNavbar />
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <h2 className="text-2xl font-bold text-white">Project Not Found</h2>
          <p className="text-sm text-gray-400 mt-2">The requested project could not be located in our showcase catalog.</p>
          <Link to="/projects" className="mt-6 inline-block">
            <Button variant="primary">Return to Showcase</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white font-sans">
      <PublicNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Admin Management Bar */}
        {user?.role === 'ADMIN' && (
          <div className="nf-frame relative mb-6">
            <span className="nf-c nf-c-tl" />
            <span className="nf-c nf-c-tr" />
            <span className="nf-c nf-c-bl" />
            <span className="nf-c nf-c-br" />
            <div className="p-4 rounded bg-[#121212] border border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-[#181818] text-[#EEEEEE] border border-[#262626] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-[#4ADE80]" />
                </div>
                <div>
                  <span className="text-xs font-mono font-semibold text-white block">ADMINISTRATOR CONTROL BAR</span>
                  <span className="text-[11px] text-[#A1A1AA] font-mono">
                    Managing showcase portfolio item: <strong className="text-white">{project.title}</strong>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/admin?tab=projects"
                  className="px-3 py-1.5 rounded bg-[#181818] hover:bg-[#262626] text-xs font-mono text-[#A1A1AA] hover:text-white border border-[#262626] transition-colors"
                >
                  BACK TO CATALOG
                </Link>
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(true)}
                  className="px-3.5 py-1.5 rounded bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-mono font-semibold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>DELETE SHOWCASE PROJECT</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Breadcrumb / Back Link */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#A1A1AA] hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO ALL SHOWCASE PROJECTS</span>
        </Link>

        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-[#262626] mb-8">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2.5">
              <Badge variant="purple" size="md">{project.category}</Badge>
              {project.featured && <Badge variant="emerald" size="sm">Featured Project</Badge>}
            </div>
            <h1 className="text-3xl sm:text-4xl font-medium text-white tracking-tight">
              {project.title}
            </h1>
            <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed">
              {project.shortDescription}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {project.price ? (
              <div className="px-4 py-2 rounded bg-[#121212] border border-[#262626] text-right font-mono">
                <p className="text-[10px] text-[#71717A] uppercase tracking-wider">Estimated Price</p>
                <p className="text-xl font-bold text-white">${project.price.toLocaleString()}</p>
              </div>
            ) : null}
            <Button
              variant="primary"
              size="lg"
              onClick={() => setInquiryModalOpen(true)}
              className="w-full sm:w-auto"
            >
              Acquire / Inquire Project
            </Button>
          </div>
        </div>

        {/* 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left 2 Cols: Gallery & Description */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Preview Image with Corner Brackets */}
            <div className="nf-frame relative">
              <span className="nf-c nf-c-tl" />
              <span className="nf-c nf-c-tr" />
              <span className="nf-c nf-c-bl" />
              <span className="nf-c nf-c-br" />
              <div className="rounded overflow-hidden border border-[#262626] shadow-2xl bg-[#121212] h-80 sm:h-[420px] relative">
                <img
                  src={selectedImg || project.images[0]}
                  alt={project.title}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {project.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {project.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(img)}
                    className={`w-24 h-16 rounded overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      selectedImg === img ? 'border-[#EEEEEE] scale-105' : 'border-[#262626] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Detailed Description */}
            <Card brackets={true} className="space-y-4">
              <h3 className="text-lg font-semibold text-white">System Architecture & Overview</h3>
              <p className="text-sm text-[#A1A1AA] leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </Card>

            {/* Core Features */}
            <Card brackets={true} className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Key Functional Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-2 rounded bg-[#181818] border border-[#262626]/50">
                    <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0 mt-0.5" />
                    <span className="text-xs text-[#EEEEEE] leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right 1 Col: Tech Stack & Live Links */}
          <div className="space-y-6">
            <Card brackets={true} className="space-y-5">
              <h3 className="text-base font-semibold text-white">Technology Specification</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((t, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1.5 rounded bg-[#181818] text-[#EEEEEE] border border-[#262626] font-mono"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Demo and Github Links */}
              <div className="pt-4 border-t border-[#262626] space-y-3">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 rounded bg-[#EEEEEE] hover:bg-white text-[#0B0B0B] text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    <span>Launch Live Demo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 rounded bg-[#181818] hover:bg-[#262626] text-white text-xs font-semibold border border-[#262626] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>View Source Repository</span>
                  </a>
                )}
              </div>
            </Card>

            {/* Customization Guarantee Card */}
            <Card brackets={true} className="space-y-3 bg-[#121212] border-[#262626]">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <ShieldCheck className="w-5 h-5 text-[#4ADE80]" />
                <span>Reliable Info Tech Quality Guarantee</span>
              </div>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Every project includes full source code transfer, 30 days of complimentary bug-fix support, documentation, and database setup assistance.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      <Modal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        title={`Inquire: ${project.title}`}
      >
        {successMsg ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">Inquiry Received</h4>
            <p className="text-xs text-gray-300">{successMsg}</p>
            <Button
              className="mt-4"
              variant="secondary"
              onClick={() => setInquiryModalOpen(false)}
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmitInquiry} className="space-y-4">
            <Input
              label="Your Full Name *"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
            />
            <Input
              label="Email Address *"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. rahul@example.com"
            />
            <Textarea
              label="Project Inquiry Message *"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setInquiryModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={submitting}>
                Submit Inquiry
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Showcase Project Modal */}
      <AdminDeleteProjectModal
        isOpen={deleteModalOpen}
        project={project}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteProject}
        isDeleting={deleting}
      />

      <Footer />
    </div>
  );
};
