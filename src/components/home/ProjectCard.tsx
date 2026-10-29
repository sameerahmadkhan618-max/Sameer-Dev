import React from 'react';
import { Project } from '../../types';
import { ProjectPreviewImage } from './ProjectPreviewImage';
import { ArrowUpRight, Sparkles } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onViewDetails: (projectId: string) => void;
  variant?: 'featured' | 'medium' | 'standard';
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onViewDetails,
  variant = 'standard'
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onViewDetails(project.id);
  };

  const isFeatured = variant === 'featured';

  if (isFeatured) {
    return (
      <article
        onClick={handleClick}
        className="group cursor-pointer rounded-3xl bg-white border border-slate-200/90 hover:border-blue-400 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
        aria-label={`View featured case study for ${project.name}`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Large Browser Preview */}
          <div className="lg:col-span-7 overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50">
            <div className="transition-transform duration-500 ease-out group-hover:scale-[1.02]">
              <ProjectPreviewImage project={project} large={true} />
            </div>
          </div>

          {/* Featured Content Column */}
          <div className="lg:col-span-5 p-8 sm:p-10 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold text-blue-700 bg-blue-50 border border-blue-200">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Featured Project</span>
                </span>
                {project.category && (
                  <span className="text-xs font-mono text-slate-500">
                    {project.category}
                  </span>
                )}
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight group-hover:text-blue-600 transition-colors">
                {project.name}
              </h3>

              {project.description && (
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                  {project.description}
                </p>
              )}

              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 group-hover:border-blue-200 group-hover:text-blue-600 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* CTA Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Production Web Application</span>
              <button
                type="button"
                onClick={handleClick}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/20 hover:shadow-blue-600/40 transition-all"
              >
                <span>View Case Study</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Medium / Standard cards
  return (
    <article
      onClick={handleClick}
      className="group cursor-pointer rounded-3xl bg-white border border-slate-200/90 hover:border-blue-400 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden h-full"
      aria-label={`View details for ${project.name}`}
    >
      <div>
        {/* Browser Mockup Preview */}
        <div className="relative overflow-hidden border-b border-slate-100 bg-slate-50">
          <div className="transition-transform duration-500 ease-out group-hover:scale-[1.03]">
            <ProjectPreviewImage project={project} />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-7 space-y-3.5">
          <div className="flex items-center justify-between gap-2">
            {project.category && (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-600 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" aria-hidden="true" />
                {project.category}
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight group-hover:text-blue-600 transition-colors">
            {project.name}
          </h3>

          {project.description && (
            <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 font-normal">
              {project.description}
            </p>
          )}

          {/* Tech Badges */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700 group-hover:border-blue-200 group-hover:text-blue-600 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-7 pb-6 pt-3 border-t border-slate-100/80 flex items-center justify-between">
        <span className="text-xs font-mono text-slate-400">Live Web App</span>
        <button
          type="button"
          onClick={handleClick}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors group-hover:translate-x-1 duration-200"
        >
          <span>View Details</span>
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </article>
  );
};
