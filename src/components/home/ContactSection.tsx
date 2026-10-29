import React, { useState } from 'react';
import { 
  MessageCircle, 
  Send, 
  Mail, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const WHATSAPP_NUMBER = '923087628720';
const DEFAULT_WHATSAPP_MESSAGE = 'Hello Sameer, I would like to discuss a website project with you.';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)}`;

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export const ContactSection: React.FC = () => {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });
  const prefersReducedMotion = useReducedMotion();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedWhatsAppUrl, setGeneratedWhatsAppUrl] = useState<string>('');

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please provide your name.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please enter your message.';
    } else if (formData.message.trim().length < 5) {
      newErrors.message = 'Message should be at least 5 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Constructs the WhatsApp URL with user's formatted message:
   * 
   * Hi Sameer! 👋
   * 
   * Name: [user ka naam]
   * Email: [user ki email]
   * 
   * Message:
   * [user ka message]
   */
  const constructWhatsAppUrl = (data: FormData): string => {
    const text = `Hi Sameer! 👋\n\nName: ${data.name.trim()}\nEmail: ${data.email.trim()}\n\nMessage:\n${data.message.trim()}`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const waUrl = constructWhatsAppUrl(formData);
    setGeneratedWhatsAppUrl(waUrl);

    // Open WhatsApp in a new tab safely
    try {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.warn('Browser popup blocked window.open, fallback button available', err);
    }

    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', message: '' });
    setErrors({});
    setIsSubmitted(false);
    setGeneratedWhatsAppUrl('');
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="scroll-mt-20 py-28 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] border-t border-slate-200/80 relative overflow-hidden"
      aria-label="Contact Sameer"
    >
      {/* Background ambient lighting */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        
        <div 
          className={`transition-all duration-700 ease-out ${
            prefersReducedMotion || isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-mono font-medium mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              <span>GET IN TOUCH</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Let's Build Something <span className="text-blue-600">Exceptional</span>
            </h2>
            
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              Have a web application or client project in mind? Reach out directly via WhatsApp or fill the form below to initiate a discussion.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Direct Contact Details & WhatsApp Card */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-blue-200 transition-colors shadow-sm shadow-slate-200/50 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
                    Direct Contact Channels
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Prefer direct messaging or have urgent project timelines? Reach out via WhatsApp for immediate response.
                  </p>
                </div>

                {/* Primary Channels */}
                <div className="space-y-3 pt-2">
                  
                  {/* WhatsApp Direct */}
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all text-slate-800"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                          Direct WhatsApp (Instant)
                        </div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          03087628720
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </a>

                  {/* Email Direct */}
                  <a
                    href="mailto:sameerahmadkhan618@gmail.com"
                    className="group flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-slate-800"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                          Direct Email
                        </div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                          sameerahmadkhan618@gmail.com
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </a>

                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs font-mono text-slate-500">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Typically responds within 2-4 hours</span>
                </div>

              </div>

              {/* Informational Callout */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-800 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  For fastest response regarding timelines, scope, and technical requirements, WhatsApp is recommended.
                </span>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-2xl bg-white border border-slate-200 hover:border-blue-200 transition-colors shadow-sm shadow-slate-200/50">
                
                {isSubmitted ? (
                  /* Success Feedback State */
                  <div className="py-6 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
                    <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                      <MessageCircle className="w-8 h-8" />
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Your message is opening in WhatsApp!
                      </h3>
                      <p className="text-base font-semibold text-emerald-700 max-w-md mx-auto">
                        Please press Send in WhatsApp to deliver it.
                      </p>
                      <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed pt-1">
                        If WhatsApp did not open automatically, click the button below to send your prepared message:
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                      <a
                        href={generatedWhatsAppUrl || WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl btn-micro-fx shadow-md shadow-emerald-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-all"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Open in WhatsApp</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 underline underline-offset-4 transition-colors"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Write another message</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Standard Form State */
                  <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-1">
                        Send a Message
                      </h3>
                      <p className="text-xs text-slate-500">
                        Fill in your details below. Your message will be formatted and opened directly in WhatsApp.
                      </p>
                    </div>

                    {/* Name Field */}
                    <div className="space-y-1.5">
                      <label 
                        htmlFor="contact-name" 
                        className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                      >
                        Your Name <span className="text-amber-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          id="contact-name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value });
                            if (errors.name) setErrors({ ...errors, name: undefined });
                          }}
                          placeholder="Sameer Ahmad"
                          className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white border text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                            errors.name 
                              ? 'border-red-500 focus:border-red-500 ring-2 ring-red-500/20' 
                              : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20'
                          }`}
                          aria-invalid={Boolean(errors.name)}
                          aria-describedby={errors.name ? 'contact-name-error' : undefined}
                          required
                        />
                      </div>
                      {errors.name && (
                        <p id="contact-name-error" className="text-xs text-red-500 flex items-center gap-1 mt-1 animate-in fade-in duration-200">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-1.5">
                      <label 
                        htmlFor="contact-email" 
                        className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                      >
                        Email Address <span className="text-amber-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (errors.email) setErrors({ ...errors, email: undefined });
                          }}
                          placeholder="you@company.com"
                          className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white border text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                            errors.email 
                              ? 'border-red-500 focus:border-red-500 ring-2 ring-red-500/20' 
                              : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20'
                          }`}
                          aria-invalid={Boolean(errors.email)}
                          aria-describedby={errors.email ? 'contact-email-error' : undefined}
                          required
                        />
                      </div>
                      {errors.email && (
                        <p id="contact-email-error" className="text-xs text-red-500 flex items-center gap-1 mt-1 animate-in fade-in duration-200">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>

                    {/* Message Field */}
                    <div className="space-y-1.5">
                      <label 
                        htmlFor="contact-message" 
                        className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                      >
                        Message <span className="text-amber-500">*</span>
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => {
                          setFormData({ ...formData, message: e.target.value });
                          if (errors.message) setErrors({ ...errors, message: undefined });
                        }}
                        placeholder="Tell me about your project, goals, or requirements..."
                        className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all resize-y ${
                          errors.message 
                            ? 'border-red-500 focus:border-red-500 ring-2 ring-red-500/20' 
                            : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20'
                        }`}
                        aria-invalid={Boolean(errors.message)}
                        aria-describedby={errors.message ? 'contact-message-error' : undefined}
                        required
                      />
                      {errors.message && (
                        <p id="contact-message-error" className="text-xs text-red-500 flex items-center gap-1 mt-1 animate-in fade-in duration-200">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.message}</span>
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl btn-micro-fx shadow-lg shadow-blue-600/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                      >
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </button>
                    </div>
                  </form>
                )}

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
