import React, { useState, useEffect } from 'react';
import { Project } from '../../types';
import { projectService } from '../../services';
import { ProjectCard } from './ProjectCard';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SEED_PROJECTS } from '../../data/seedProjects';
import { Plus, X, Globe, FileText, AlertCircle, Sparkles } from 'lucide-react';

interface ProjectsSectionProps {
  onViewDetails: (projectId: string) => void;
}

// Set of original 7 seed project IDs that should not show the remove button
const SEED_PROJECT_IDS = new Set(SEED_PROJECTS.map((p) => p.id));

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onViewDetails }) => {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.08 });
  const prefersReducedMotion = useReducedMotion();
  const [projects, setProjects] = useState<Project[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  // Load projects from projectService (localStorage backed)
  const refreshProjects = () => {
    const data = projectService.getProjects();
    setProjects(data);
  };

  useEffect(() => {
    refreshProjects();
  }, []);

  const handleOpenModal = () => {
    setUrl('');
    setName('');
    setDescription('');
    setUrlError(null);
    setNameError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    // Validate URL (Must start with https://)
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setUrlError('Website URL is required.');
      valid = false;
    } else if (!/^https:\/\/[^\s$.?#].[^\s]*$/i.test(trimmedUrl)) {
      setUrlError('URL must start with https:// (e.g. https://my-site.netlify.app)');
      valid = false;
    } else {
      setUrlError(null);
    }

    // Validate Name
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError('Project name is required.');
      valid = false;
    } else {
      setNameError(null);
    }

    if (!valid) return;

    // Call projectService.addProject with required automatic settings
    projectService.addProject({
      url: trimmedUrl,
      name: trimmedName,
      description: description.trim() || undefined,
      category: 'Web Project',
      technologies: ['React', 'Netlify'],
      screenshotSource: 'automatic',
    });

    // Update projects state immediately so new project appears at the top
    refreshProjects();
    setIsModalOpen(false);
  };

  const handleRemoveProject = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = window.confirm(`Remove ${project.name}?`);
    if (confirmed) {
      projectService.deleteProject(project.id);
      refreshProjects();
    }
  };

  return (
    <section
      id="projects"
      ref={ref}
      className="scroll-mt-20 py-28 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200/80 relative overflow-hidden"
      aria-label="Selected Production Projects"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div 
          className={`space-y-14 transition-all duration-700 ease-out ${
            prefersReducedMotion || isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Section Header with + Add Project Button */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-slate-200/80">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-blue-600 font-semibold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" aria-hidden="true" />
                <span>04 / SELECTED WORK</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-[-0.03em]">
                Featured <span className="text-blue-600">Projects</span>
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <p className="text-sm font-mono text-slate-500 max-w-sm">
                Live websites and modern web applications engineered by Sameer, featuring responsive architectures and production code.
              </p>

              {/* + Add Project Button */}
              <button
                type="button"
                onClick={handleOpenModal}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>
          </div>

          {/* Visual Portfolio Grid with Hierarchy */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {projects.map((project, idx) => {
              // Hierarchy rules:
              // Index 0 -> Featured (span 12)
              // Index 1, 2 -> Medium (span 6 each)
              // Index 3, 4, 5, 6... -> Standard (span 6 each)
              const isFirst = idx === 0;
              const isMedium = idx === 1 || idx === 2;
              const colSpan = isFirst ? 'lg:col-span-12' : 'lg:col-span-6';
              const variant = isFirst ? 'featured' : isMedium ? 'medium' : 'standard';
              const isRemovable = !SEED_PROJECT_IDS.has(project.id);

              return (
                <div
                  key={project.id}
                  style={{
                    transitionDelay: prefersReducedMotion ? '0ms' : `${idx * 70}ms`,
                  }}
                  className={`${colSpan} relative group/card transition-all duration-500 ${
                    prefersReducedMotion || isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  }`}
                >
                  {/* Small "✕ Remove" button for custom-added projects, visible on hover */}
                  {isRemovable && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveProject(project, e)}
                      title={`Remove ${project.name}`}
                      className="absolute top-4 right-4 z-20 opacity-0 group-hover/card:opacity-100 transition-opacity inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold shadow-lg shadow-red-600/30"
                    >
                      <X className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  )}

                  <ProjectCard
                    project={project}
                    onViewDetails={onViewDetails}
                    variant={variant}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Project Modal Popup */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-project-title"
        >
          <div 
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform animate-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 id="add-project-title" className="text-base font-bold text-slate-900 tracking-tight">
                    Add New Project
                  </h3>
                  <p className="text-xs text-slate-500">
                    Directly showcase your live website in the portfolio.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddProject} className="p-6 space-y-4">
              {/* Website URL */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="new-project-url" 
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                >
                  Website URL <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <input
                    id="new-project-url"
                    type="url"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      if (urlError) setUrlError(null);
                    }}
                    placeholder="https://my-site.netlify.app"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                      urlError 
                        ? 'border-red-500 ring-2 ring-red-500/20' 
                        : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20'
                    }`}
                    required
                  />
                </div>
                {urlError && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{urlError}</span>
                  </p>
                )}
              </div>

              {/* Project Name */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="new-project-name" 
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                >
                  Project Name <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <input
                    id="new-project-name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (nameError) setNameError(null);
                    }}
                    placeholder="e.g. Modern E-commerce Store"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                      nameError 
                        ? 'border-red-500 ring-2 ring-red-500/20' 
                        : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20'
                    }`}
                    required
                  />
                </div>
                {nameError && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{nameError}</span>
                  </p>
                )}
              </div>

              {/* Description (Optional) */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="new-project-desc" 
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                >
                  Description <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <textarea
                  id="new-project-desc"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description of the website features, architecture, or purpose..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all resize-y"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
