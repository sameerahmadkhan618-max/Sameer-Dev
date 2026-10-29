import React, { useState, useEffect } from 'react';
import { Project } from '../../types';
import { isValidHttpsUrl, normalizeUrl, deriveProjectName } from '../../services';
import { X, Globe, Sparkles, Layers, FileText, Image, AlertCircle, Check } from 'lucide-react';

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    url: string;
    description?: string;
    screenshot?: string;
    category?: string;
    technologies?: string[];
  }) => void;
  editingProject?: Project | null;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  isOpen,
  onClose,
  onSave,
  editingProject,
}) => {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [screenshot, setScreenshot] = useState('');
  const [category, setCategory] = useState('');
  const [techInput, setTechInput] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);

  useEffect(() => {
    if (editingProject) {
      setUrl(editingProject.url || '');
      setName(editingProject.name || '');
      setDescription(editingProject.description || '');
      setScreenshot(editingProject.screenshot || '');
      setCategory(editingProject.category || '');
      setTechInput(editingProject.technologies?.join(', ') || '');
    } else {
      setUrl('');
      setName('');
      setDescription('');
      setScreenshot('');
      setCategory('');
      setTechInput('');
    }
    setUrlError(null);
  }, [editingProject, isOpen]);

  if (!isOpen) return null;

  // Auto-fill project name suggestion if URL is entered and name is empty
  const handleUrlBlur = () => {
    if (url.trim() && !name.trim()) {
      const derived = deriveProjectName(url.trim());
      if (derived && derived !== 'New Web Project') {
        setName(derived);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError(null);

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setUrlError('Project URL is required.');
      return;
    }

    if (!isValidHttpsUrl(trimmedUrl)) {
      setUrlError('Please provide a valid HTTPS URL (e.g. https://my-project.netlify.app/).');
      return;
    }

    const normalized = normalizeUrl(trimmedUrl);
    const finalName = name.trim() || deriveProjectName(normalized);

    const technologies = techInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onSave({
      name: finalName,
      url: normalized,
      description: description.trim() || undefined,
      screenshot: screenshot.trim() || undefined,
      category: category.trim() || undefined,
      technologies: technologies.length > 0 ? technologies : undefined,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-form-title"
    >
      <div className="relative w-full max-w-xl my-8 rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-mono text-blue-600 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{editingProject ? 'Modify Project' : 'New Project'}</span>
            </div>
            <h2 id="project-form-title" className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {editingProject ? 'Edit Portfolio Project' : 'Add New Project'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Required: Project URL */}
          <div className="space-y-1.5">
            <label htmlFor="form-project-url" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Website URL <span className="text-amber-600">* (Required HTTPS)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Globe className="w-4 h-4" />
              </div>
              <input
                id="form-project-url"
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (urlError) setUrlError(null);
                }}
                onBlur={handleUrlBlur}
                placeholder="https://my-app.netlify.app/"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                  urlError
                    ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500/30'
                    : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-500/40'
                }`}
                required
              />
            </div>
            {urlError ? (
              <p className="text-xs text-rose-600 flex items-center gap-1.5 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{urlError}</span>
              </p>
            ) : (
              <p className="text-[11px] text-slate-500">
                Live URL of the website. If name is left empty, it will be automatically derived from the domain.
              </p>
            )}
          </div>

          {/* Optional: Project Name */}
          <div className="space-y-1.5">
            <label htmlFor="form-project-name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Project Name <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <input
              id="form-project-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. AI Prompt Generator"
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500/40 transition-all"
            />
          </div>

          {/* Optional: Category */}
          <div className="space-y-1.5">
            <label htmlFor="form-project-category" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Category <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <input
              id="form-project-category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Web Utility, E-Commerce, Productivity"
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500/40 transition-all"
            />
          </div>

          {/* Optional: Technologies (comma separated) */}
          <div className="space-y-1.5">
            <label htmlFor="form-project-tech" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Technologies <span className="text-slate-400 font-normal lowercase">(comma-separated)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Layers className="w-4 h-4" />
              </div>
              <input
                id="form-project-tech"
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="React, TypeScript, Tailwind CSS, Netlify"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500/40 transition-all"
              />
            </div>
          </div>

          {/* Optional: Description */}
          <div className="space-y-1.5">
            <label htmlFor="form-project-description" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Short Description <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <textarea
              id="form-project-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of what this website or web application does..."
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500/40 transition-all resize-y"
            />
          </div>

          {/* Optional: Screenshot URL */}
          <div className="space-y-1.5">
            <label htmlFor="form-project-screenshot" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Custom Screenshot URL <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Image className="w-4 h-4" />
              </div>
              <input
                id="form-project-screenshot"
                type="url"
                value={screenshot}
                onChange={(e) => setScreenshot(e.target.value)}
                placeholder="https://... image link (leave empty for auto preview / fallback)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500/40 transition-all"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              If omitted or if the link fails, our polished browser mockup fallback will automatically be used.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 btn-micro-fx shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl btn-micro-fx shadow-lg shadow-blue-600/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Check className="w-4 h-4" />
              <span>{editingProject ? 'Save Changes' : 'Create Project'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
