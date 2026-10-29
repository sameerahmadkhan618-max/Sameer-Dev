import React, { useEffect, useState } from 'react';
import { Project } from '../types';
import { projectService } from '../services';
import { ProjectPreviewImage } from '../components/home/ProjectPreviewImage';
import { BackToTop } from '../components/layout/BackToTop';
import { 
  ArrowLeft, 
  ExternalLink, 
  Globe, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  Layers 
} from 'lucide-react';

interface ProjectDetailPageProps {
  projectId: string;
  onNavigate: (href: string) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  projectId,
  onNavigate,
}) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const p = projectService.getProjectById(projectId);
    setProject(p);
    setLoading(false);
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-slate-600">
        <div className="flex items-center gap-3">
          <span className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-mono">Loading project details...</span>
        </div>
      </div>
    );
  }

  // Not Found fallback if invalid ID is passed
  if (!project) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-6 shadow-xl animate-in fade-in duration-300">
          <div className="w-14 h-14 mx-auto rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Globe className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono text-amber-600 font-semibold">Project Not Found</div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Requested Project Unavailable
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              The project you are looking for may have been moved or the link is invalid.
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={() => onNavigate('/#projects')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl btn-micro-fx shadow-md shadow-blue-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Projects</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Extract clean domain for display
  let cleanDomain = project.url;
  try {
    cleanDomain = new URL(project.url).hostname;
  } catch {
    cleanDomain = project.url;
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-blue-500/20 selection:text-blue-900">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('/#projects')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md px-2 py-1 btn-micro-fx"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </button>

          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg btn-micro-fx shadow-md shadow-blue-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span>Live Demo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Main Detail Body with smooth entrance animation */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {/* Project Intro Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {project.category && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium text-blue-700 bg-blue-50 border border-blue-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {project.category}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500">
              <Lock className="w-3 h-3 text-emerald-500" />
              <span>{cleanDomain}</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            {project.name}
          </h1>

          {project.description && (
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
              {project.description}
            </p>
          )}
        </div>

        {/* Large Mockup Preview Frame */}
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/60 bg-slate-100 hover:border-blue-300 transition-all duration-300">
          <ProjectPreviewImage project={project} large={true} />
        </div>

        {/* Project Technical Details & Live Demo Action Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Tech Stack & Highlights */}
          <div className="lg:col-span-8 space-y-8">
            {/* Tech Stack */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="p-6 sm:p-7 rounded-2xl bg-slate-50/60 border border-slate-200 hover:border-blue-200 transition-all duration-300 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-blue-600 font-semibold">
                  <Layers className="w-4 h-4" />
                  <span>Technologies &amp; Architecture</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-300 text-xs font-mono text-blue-700 shadow-2xs transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Core Verification Notes */}
            <div className="p-6 sm:p-7 rounded-2xl bg-slate-50/60 border border-slate-200 hover:border-blue-200 transition-all duration-300 space-y-4">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Project Highlights
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Fully functional live deployment hosted on modern high-speed edge infrastructure.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Responsive layout engineered for seamless usage across smartphones, tablets, and desktops.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Clean component hierarchy, modern styling, and optimized web performance.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Prominent Live Demo Card */}
          <div className="lg:col-span-4 p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-200/50 space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Experience Live
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Open the production web application in a new tab to explore the real interactive experience.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600 truncate flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">{cleanDomain}</span>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl btn-micro-fx shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => onNavigate('/#projects')}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 btn-micro-fx focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Portfolio</span>
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Floating Back to Top */}
      <BackToTop />

      {/* Detail Footer */}
      <footer className="border-t border-slate-200 py-8 text-center text-xs text-slate-500 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <p>© {new Date().getFullYear()} SameerDev. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
