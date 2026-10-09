import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Textarea } from '../components/common/Textarea';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { PublicNavbar } from '../components/landing/PublicNavbar';
import { Footer } from '../components/layout/Footer';
import { apiRequest } from '../services/api';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    try {
      setLoading(true);
      await apiRequest('/contact', {
        method: 'POST',
        body: JSON.stringify({ name, email, phone, subject, message }),
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      alert(err.message || 'Failed to submit contact message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F8FAFC]">
      <PublicNavbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <Badge variant="purple" size="md">Direct Communication</Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Contact DevCraft Team
          </h1>
          <p className="text-sm text-gray-400">
            Have a custom inquiry, partnership proposal, or architectural question? We'll reply within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Details */}
          <Card className="space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-white/8 pb-3">
              Direct Inquiries
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Email Address</p>
                  <a href="mailto:contact@devcraft.io" className="text-sm font-semibold text-white hover:text-indigo-300">
                    contact@devcraft.io
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Phone & WhatsApp</p>
                  <p className="text-sm font-semibold text-white">+1 (555) 019-2834</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Headquarters</p>
                  <p className="text-sm font-semibold text-white">San Francisco, CA & Remote Global</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/8">
              <p className="text-xs text-gray-400 leading-relaxed">
                Guaranteed response within 1 business day for all custom development inquiries.
              </p>
            </div>
          </Card>

          {/* Form */}
          <Card className="md:col-span-2 p-6 sm:p-8">
            {success ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
                <h3 className="text-xl font-bold text-white">Message Delivered</h3>
                <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto">
                  Thank you for reaching out to DevCraft. Our lead architect has received your inquiry and will contact you shortly.
                </p>
                <Button variant="outline" size="sm" onClick={() => setSuccess(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-white border-b border-white/8 pb-3">
                  Send Us a Direct Message
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Your Name *"
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
                    label="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                  <Input
                    label="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Custom SaaS Collaboration"
                  />
                </div>

                <Textarea
                  label="Message *"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your project, questions, or architectural needs..."
                />

                <div className="flex justify-end pt-2">
                  <Button type="submit" variant="primary" loading={loading} icon={<Send className="w-4 h-4" />}>
                    Send Message
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};
