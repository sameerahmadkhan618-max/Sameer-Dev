import React from 'react';
import { NAV_ITEMS } from '../../data/navigation';
import { MessageCircle, ArrowUpRight, Github, Linkedin } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface FooterProps {
  onNavigate?: (href: string) => void;
}

const WHATSAPP_NUMBER = '923087628720';
const DEFAULT_WHATSAPP_MESSAGE = 'Hello Sameer, I would like to discuss a website project with you.';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)}`;
const LINKEDIN_URL = 'https://linkedin.com/in/sameer-web-dev';
const GITHUB_URL = 'https://github.com/sameer-dev-pk';

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const prefersReducedMotion = useReducedMotion();

  const handleLinkClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(href);
    } else {
      const targetId = href.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    }
  };

  return (
    <footer className="border-t border-slate-200/80 bg-white py-20 px-4 sm:px-6 lg:px-8 text-slate-600 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start justify-between">
          
          {/* Brand Info with Large Wordmark */}
          <div className="md:col-span-5 space-y-4">
            <a
              href="#home"
              onClick={(e) => handleLinkClick('#home', e)}
              className="inline-flex items-center gap-2 text-2xl sm:text-3xl font-black tracking-[-0.03em] text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md transition-transform duration-200 hover:scale-[1.01]"
            >
              <span>Sameer<span className="text-blue-600">Dev</span></span>
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.6)]" aria-hidden="true" />
            </a>

            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Professional web developer crafting modern digital experiences, responsive websites, and high-performance applications.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-semibold transition-all border border-slate-200"
                aria-label="Sameer's LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4 text-blue-600" />
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400" />
              </a>

              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all border border-slate-200"
                aria-label="Sameer's GitHub Profile"
              >
                <Github className="w-4 h-4 text-slate-800" />
                <span>GitHub</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Navigation
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleLinkClick(item.href, e)}
                  className="text-slate-600 hover:text-blue-600 transition-colors py-1 font-medium"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Direct WhatsApp CTA */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Contact Channel
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Available for modern web development projects &amp; consultations.
            </p>
            <div>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 text-xs font-semibold shadow-xs hover:bg-emerald-50/50 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp: 03087628720</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>

        </div>

        {/* Minimal Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <p>© {new Date().getFullYear()} SameerDev. All rights reserved.</p>
          <p>Engineered with React, TypeScript &amp; Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
};
