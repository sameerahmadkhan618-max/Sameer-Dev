import React, { useState, useEffect } from 'react';
import { Project } from '../../types';
import { projectService, authService } from '../../services';
import { ProjectForm } from './ProjectForm';
import { DeleteProjectDialog } from './DeleteProjectDialog';
import { Toast, ToastMessage } from './Toast';
import { 
  Plus, 
  ArrowLeft, 
  LogOut, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Globe, 
  RotateCcw, 
  Layers, 
  CheckCircle2,
  FolderOpen
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
  onNavigateHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
  onNavigateHome,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadProjects = () => {
    const data = projectService.getProjects();
    setProjects(data);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleOpenAdd = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleSaveProject = (data: {
    name: string;
    url: string;
    description?: string;
    screenshot?: string;
    category?: string;
    technologies?: string[];
  }) => {
    try {
      if (editingProject) {
        projectService.updateProject(editingProject.id, data);
        addToast(`Project "${data.name}" updated successfully.`, 'success');
      } else {
        projectService.addProject(data);
        addToast(`Project "${data.name}" added successfully.`, 'success');
      }
      loadProjects();
    } catch {
      addToast('Unable to save project. Please check data.', 'error');
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingProject) return;
    try {
      const success = projectService.deleteProject(deletingProject.id);
      if (success) {
        addToast(`Project "${deletingProject.name}" deleted successfully.`, 'success');
        loadProjects();
      } else {
        addToast('Failed to delete project.', 'error');
      }
    } catch {
      addToast('Error during project deletion.', 'error');
    } finally {
      setDeletingProject(null);
    }
  };

  const handleResetToSeed = () => {
    const seeded = projectService.resetToSeed();
    setProjects(seeded);
    addToast('Restored original 7 portfolio projects.', 'info');
  };

  const handleLogoutClick = () => {
    authService.logout();
    addToast('Logged out successfully.', 'info');
    onLogout();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-500/20 selection:text-blue-900">
      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Top Admin Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Brand & Portal Title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Return to Public Portfolio"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-sm font-bold tracking-tight text-slate-900">
                <span>Sameer<span className="text-blue-600">Dev</span></span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  Admin System
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Portfolio Projects &amp; Live Deployment Management
              </p>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onNavigateHome}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 transition-colors border border-slate-200 shadow-2xs"
            >
              <span>View Public Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={handleLogoutClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 transition-colors border border-rose-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        {/* Controls Bar & Metrics */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm shadow-slate-200/50">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              Project Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage website listings displayed on your public portfolio ({projects.length} {projects.length === 1 ? 'project' : 'projects'} active)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleResetToSeed}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 btn-micro-fx shadow-2xs"
              title="Reset to 7 original seed projects"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset to Seeds</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl btn-micro-fx shadow-md shadow-blue-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Project</span>
            </button>
          </div>
        </div>

        {/* Projects List */}
        {projects.length === 0 ? (
          /* Empty State */
          <div className="p-12 sm:p-16 rounded-2xl bg-white border border-slate-200 text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
              <FolderOpen className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Your project list is empty
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Add a new project with its live HTTPS website URL, or restore the 7 original seed projects.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Project</span>
              </button>

              <button
                type="button"
                onClick={handleResetToSeed}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore 7 Seed Projects</span>
              </button>
            </div>
          </div>
        ) : (
          /* Responsive Project Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => {
              let domain = project.url;
              try {
                domain = new URL(project.url).hostname;
              } catch {
                domain = project.url;
              }

              return (
                <div
                  key={project.id}
                  className="rounded-2xl bg-white border border-slate-200 hover:border-blue-300 p-6 flex flex-col justify-between space-y-4 shadow-sm shadow-slate-200/50 hover:shadow-lg hover:shadow-blue-500/10 card-hover-fx"
                >
                  <div className="space-y-3">
                    {/* Header with index & Category */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono text-slate-400 font-semibold">
                        #{index + 1}
                      </span>
                      {project.category && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-blue-700 bg-blue-50 border border-blue-200 truncate max-w-[70%]">
                          {project.category}
                        </span>
                      )}
                    </div>

                    {/* Name & URL */}
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight truncate">
                        {project.name}
                      </h3>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-600 hover:text-blue-700 transition-colors truncate max-w-full"
                        title={project.url}
                      >
                        <Globe className="w-3.5 h-3.5 shrink-0 text-blue-500" />
                        <span className="truncate">{domain}</span>
                        <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                      </a>
                    </div>

                    {/* Description */}
                    {project.description && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    )}

                    {/* Technologies */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.technologies.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-[10px] font-mono text-slate-600"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Live Item</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(project)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
                        aria-label={`Edit ${project.name}`}
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeletingProject(project)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                        aria-label={`Delete ${project.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Add / Edit Project Dialog */}
      <ProjectForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveProject}
        editingProject={editingProject}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteProjectDialog
        isOpen={Boolean(deletingProject)}
        project={deletingProject}
        onCancel={() => setDeletingProject(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
