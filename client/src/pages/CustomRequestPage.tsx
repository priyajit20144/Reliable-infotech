import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Plus,
  X,
  FileText,
} from 'lucide-react';
import { requestService } from '../services/requestService';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Textarea } from '../components/common/Textarea';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { PublicNavbar } from '../components/landing/PublicNavbar';
import { Footer } from '../components/layout/Footer';

export const CustomRequestPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [businessName, setBusinessName] = useState('');
  const [websiteType, setWebsiteType] = useState('Custom SaaS Platform');
  const [description, setDescription] = useState('');
  const [budgetMin, setBudgetMin] = useState(1500);
  const [budgetMax, setBudgetMax] = useState(4000);
  const [deadline, setDeadline] = useState('2026-12-01');
  const [contactMethod, setContactMethod] = useState<'EMAIL' | 'PHONE' | 'WHATSAPP'>('EMAIL');

  useEffect(() => {
    if (user) {
      if (!name) setName(user.name || '');
      if (!email) setEmail(user.email || '');
      if (!phone && user.phone) setPhone(user.phone);
    }
  }, [user]);

  // Feature tags
  const [features, setFeatures] = useState<string[]>([
    'Responsive Dark Mode UI',
    'User Authentication & Roles',
    'Database Integration',
  ]);
  const [featureInput, setFeatureInput] = useState('');

  // Reference URLs
  const [refUrls, setRefUrls] = useState<string[]>(['https://linear.app']);
  const [refInput, setRefInput] = useState('');

  // Files
  const [attachments, setAttachments] = useState<string[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  const websiteTypes = [
    'Custom SaaS Platform',
    'E-Commerce Store',
    'Enterprise Portal',
    'Creative Agency Portfolio',
    'FinTech Web Application',
    'AI & Knowledge Base Platform',
  ];

  const handleAddFeature = () => {
    if (featureInput.trim() && !features.includes(featureInput.trim())) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (item: string) => {
    setFeatures(features.filter((f) => f !== item));
  };

  const handleAddRefUrl = () => {
    if (refInput.trim() && !refUrls.includes(refInput.trim())) {
      setRefUrls([...refUrls, refInput.trim()]);
      setRefInput('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingFile(true);
      const res = await requestService.uploadFile(file);
      if (res.success && res.file) {
        setAttachments((prev) => [...prev, res.file.url]);
      }
    } catch (err: any) {
      alert(err.message || 'File upload failed');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !description) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await requestService.createCustomRequest({
        name,
        email,
        phone,
        businessName,
        websiteType,
        description,
        requiredFeatures: features,
        budgetMin,
        budgetMax,
        deadline,
        referenceUrls: refUrls,
        attachments,
        contactMethod,
      });

      if (res.success && res.data) {
        setSuccessData(res.data);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F8FAFC]">
      <PublicNavbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {successData ? (
          <div className="glass-card rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">Project Request Created!</h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Your custom website request for <strong>{successData.businessName || successData.websiteType}</strong> has been received by our lead architect.
            </p>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-400 text-left space-y-1">
              <p><strong className="text-white">Request ID:</strong> {successData._id}</p>
              <p><strong className="text-white">Status:</strong> {successData.status}</p>
              <p><strong className="text-white">Assigned Team:</strong> {successData.assignedTo}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => navigate(`/dashboard/requests/${successData._id}`)}
              >
                Track Live Status
              </Button>
              {user?.role === 'ADMIN' || user?.role === 'TEAM_MEMBER' ? (
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => navigate('/admin?tab=requests')}
                >
                  View in Admin Console
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => navigate('/dashboard/requests')}
                >
                  Go to My Requests
                </Button>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <Badge variant="purple" size="md">Custom Website Builder</Badge>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Request a Custom Website
              </h1>
              <p className="text-xs sm:text-sm text-gray-400">
                Provide your requirements, feature expectations, and timeline. Our team will review and formulate a fixed-scope quotation.
              </p>
            </div>

            {/* Step 1: Contact & Business Information */}
            <Card className="space-y-4">
              <h3 className="text-base font-bold text-white border-b border-white/8 pb-3">
                1. Client & Organization Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
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
                <Input
                  label="Phone / WhatsApp Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
                <Input
                  label="Business / Project Name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. NextGen Studio"
                />
              </div>
            </Card>

            {/* Step 2: Website Specifications */}
            <Card className="space-y-5">
              <h3 className="text-base font-bold text-white border-b border-white/8 pb-3">
                2. Project Scope & Architecture
              </h3>

              {/* Website Type Selector */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">
                  Select Website Archetype *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {websiteTypes.map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setWebsiteType(type)}
                      className={`p-3 rounded-xl text-xs font-semibold text-left transition-all border ${
                        websiteType === type
                          ? 'bg-devcraft-primary text-white border-indigo-400 shadow-sm'
                          : 'bg-white/[0.02] text-gray-400 hover:text-white border-white/8 hover:bg-white/[0.05]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Detailed Description */}
              <Textarea
                label="Detailed Description & Requirements *"
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what your platform needs to do, target audience, specific workflows, and must-have pages..."
              />

              {/* Feature Tags List */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Key Functional Features
                </label>
                <div className="flex gap-2">
                  <Input
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="e.g. Stripe checkout, Client dashboard, Live chat"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                  />
                  <Button type="button" variant="secondary" onClick={handleAddFeature}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {features.map((feat) => (
                    <span
                      key={feat}
                      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-medium"
                    >
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(feat)}
                        className="hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            {/* Step 3: Budget, Timeline & Attachments */}
            <Card className="space-y-5">
              <h3 className="text-base font-bold text-white border-b border-white/8 pb-3">
                3. Budget, Timeline & References
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Budget Minimum (USD) *"
                  type="number"
                  min={200}
                  step={100}
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(Number(e.target.value))}
                />
                <Input
                  label="Budget Maximum (USD) *"
                  type="number"
                  min={500}
                  step={100}
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(Number(e.target.value))}
                />
                <Input
                  label="Target Launch Deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Preferred Contact Channel
                  </label>
                  <select
                    value={contactMethod}
                    onChange={(e) => setContactMethod(e.target.value as any)}
                    className="w-full bg-[#111827]/80 text-white text-sm rounded-xl border border-white/10 px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="EMAIL">Email</option>
                    <option value="PHONE">Phone Call</option>
                    <option value="WHATSAPP">WhatsApp</option>
                  </select>
                </div>
              </div>

              {/* Reference URLs */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Reference Websites / Design Inspiration
                </label>
                <div className="flex gap-2">
                  <Input
                    value={refInput}
                    onChange={(e) => setRefInput(e.target.value)}
                    placeholder="https://example.com"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddRefUrl();
                      }
                    }}
                  />
                  <Button type="button" variant="secondary" onClick={handleAddRefUrl}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {refUrls.map((url) => (
                    <span
                      key={url}
                      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-white/5 text-gray-300 border border-white/10"
                    >
                      <span>{url}</span>
                      <button
                        type="button"
                        onClick={() => setRefUrls(refUrls.filter((u) => u !== url))}
                        className="hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* File Attachment Upload */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">
                  Upload Requirements Document / Wireframes (PDF, PNG, ZIP)
                </label>
                <label className="border-2 border-dashed border-white/15 hover:border-indigo-500/40 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white/[0.01]">
                  <UploadCloud className="w-8 h-8 text-indigo-400 mb-2" />
                  <span className="text-xs font-semibold text-white">
                    {uploadingFile ? 'Uploading file to storage...' : 'Click or drop files here'}
                  </span>
                  <span className="text-[11px] text-gray-400 mt-0.5">
                    Maximum file size 10MB
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={uploadingFile}
                  />
                </label>
                {attachments.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    {attachments.map((att, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-xs text-indigo-300"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span className="truncate max-w-xs">{att}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))}
                          className="hover:text-red-400"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Submission CTA */}
            <div className="text-center pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={submitting}
                className="w-full sm:w-auto px-10 text-base shadow-glow-primary"
              >
                <span>Submit Requirements & Request Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        )}
      </div>

      <Footer />
    </div>
  );
};
