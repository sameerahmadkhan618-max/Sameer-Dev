import React, { useState } from 'react';
import { Project } from '../../types';
import { Globe, Lock, ExternalLink, Sparkles } from 'lucide-react';

interface ProjectPreviewImageProps {
  project: Project;
  large?: boolean;
}

export const ProjectPreviewImage: React.FC<ProjectPreviewImageProps> = ({
  project,
  large = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Extract clean hostname for the browser mockup address bar
  let displayDomain = 'website.preview';
  try {
    const urlObj = new URL(project.url);
    displayDomain = urlObj.hostname;
  } catch {
    displayDomain = project.url.replace(/^https?:\/\//, '');
  }

  // Determine thumbnail candidate if automatic or custom URL
  const candidateUrl =
    project.screenshot ||
    (project.screenshotSource === 'automatic'
      ? `https://api.microlink.io?url=${encodeURIComponent(project.url)}&screenshot=true&meta=false&embed=screenshot.url`
      : undefined);

  const showFallback = imageError || !candidateUrl;

  return (
    <div className={`relative w-full overflow-hidden bg-slate-100 ${large ? 'aspect-[16/10]' : 'aspect-[16/10]'} select-none`}>
      {/* Browser Bar Mockup (Light Slate Chrome) */}
      <div className="absolute top-0 inset-x-0 h-8 sm:h-9 bg-slate-100/95 border-b border-slate-200 px-3.5 flex items-center justify-between z-20">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
        </div>

        {/* Address Bar Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-slate-200 text-[11px] font-mono text-slate-700 max-w-[65%] sm:max-w-[70%] truncate shadow-2xs">
          <Lock className="w-3 h-3 text-emerald-500 shrink-0" />
          <span className="truncate">{displayDomain}</span>
        </div>

        <div className="w-6 flex justify-end">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      {/* Main Image View or Premium Light Fallback */}
      <div className="pt-8 sm:pt-9 w-full h-full relative">
        {!showFallback ? (
          <>
            {/* Loading placeholder skeleton */}
            {!isLoaded && (
              <div className="absolute inset-0 pt-9 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 animate-pulse flex items-center justify-center">
                <span className="text-xs font-mono text-slate-500">Loading website preview...</span>
              </div>
            )}
            <img
              src={candidateUrl}
              alt={`${project.name} live preview`}
              loading="lazy"
              className={`w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setIsLoaded(true)}
              onError={() => setImageError(true)}
            />
          </>
        ) : (
          /* Polished Fallback Preview Card (Clean Light Aesthetic) */
          <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/50 to-sky-50/30 p-6 flex flex-col justify-between relative overflow-hidden group-hover:brightness-102 transition-all">
            {/* Background pattern & soft glow */}
            <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -top-10 -left-10 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-2">
              {project.category && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium text-blue-700 bg-blue-100 border border-blue-200">
                  <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                  {project.category}
                </span>
              )}
              <h4 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                {project.name}
              </h4>
            </div>

            <div className="relative z-10 flex items-end justify-between">
              <div className="flex flex-wrap gap-1.5 max-w-[80%]">
                {project.technologies?.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono text-slate-700 shadow-2xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
