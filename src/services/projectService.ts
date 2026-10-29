import { Project } from '../types';
import { SEED_PROJECTS } from '../data/seedProjects';

const STORAGE_KEY = 'sameerdev_projects_v1';

/**
 * Validates whether a string is a valid, secure HTTPS URL.
 */
export function isValidHttpsUrl(urlString: string): boolean {
  if (!urlString || typeof urlString !== 'string') return false;
  const trimmed = urlString.trim();
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' && parsed.hostname.length > 0;
  } catch {
    return false;
  }
}

/**
 * Normalizes an HTTPS URL.
 */
export function normalizeUrl(urlString: string): string {
  const trimmed = urlString.trim();
  try {
    const parsed = new URL(trimmed);
    return parsed.href;
  } catch {
    return trimmed;
  }
}

/**
 * Derives a clean project name from a URL if none is provided.
 */
export function deriveProjectName(urlString: string): string {
  try {
    const parsed = new URL(urlString);
    const host = parsed.hostname.replace(/^www\./, '').split('.')[0];
    if (!host) return 'New Web Project';
    return host
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  } catch {
    return 'New Web Project';
  }
}

/**
 * Project repository service layer with localStorage persistence.
 * Initializes with SEED_PROJECTS if localStorage is empty.
 */
export const projectService = {
  /**
   * Retrieves all projects from localStorage, falling back to SEED_PROJECTS.
   */
  getProjects(): Project[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Check if any seed projects are missing in stored localStorage
          const storedIds = new Set(parsed.map((p: Project) => p.id));
          const missingSeedProjects = SEED_PROJECTS.filter((sp) => !storedIds.has(sp.id));
          if (missingSeedProjects.length > 0) {
            // New seed projects were added to the codebase: prepend them so they appear at the top
            const updated = [...missingSeedProjects, ...parsed];
            this.saveProjects(updated);
            return updated;
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to read projects from localStorage:', e);
    }
    // Seed initial state into localStorage
    this.saveProjects([...SEED_PROJECTS]);
    return [...SEED_PROJECTS];
  },

  /**
   * Retrieves a single project by its unique ID.
   */
  getProjectById(id: string): Project | null {
    if (!id) return null;
    const projects = this.getProjects();
    return projects.find((p) => p.id === id) || null;
  },

  /**
   * Saves project list to localStorage.
   */
  saveProjects(projects: Project[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects to localStorage:', e);
    }
  },

  /**
   * Adds a new project to the top of localStorage and returns it.
   */
  addProject(data: Omit<Project, 'id' | 'createdAt'>): Project {
    const projects = this.getProjects();
    const rawName = data.name?.trim();
    const finalName = rawName || deriveProjectName(data.url);
    const normalizedUrl = normalizeUrl(data.url);

    const slug = finalName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || `proj-${Date.now()}`;

    // Ensure unique ID
    const uniqueId = projects.some((p) => p.id === slug)
      ? `${slug}-${Date.now().toString().slice(-4)}`
      : slug;

    const newProject: Project = {
      ...data,
      id: uniqueId,
      name: finalName,
      url: normalizedUrl,
      createdAt: new Date().toISOString(),
    };

    const updated = [newProject, ...projects];
    this.saveProjects(updated);
    return newProject;
  },

  /**
   * Updates an existing project in localStorage.
   */
  updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>): Project | null {
    const projects = this.getProjects();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const updatedProject: Project = {
      ...projects[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    projects[index] = updatedProject;
    this.saveProjects(projects);
    return updatedProject;
  },

  /**
   * Deletes a project by ID from localStorage.
   */
  deleteProject(id: string): boolean {
    const projects = this.getProjects();
    const filtered = projects.filter((p) => p.id !== id);
    if (filtered.length !== projects.length) {
      this.saveProjects(filtered);
      return true;
    }
    return false;
  },

  /**
   * Resets projects back to SEED_PROJECTS.
   */
  resetToSeed(): Project[] {
    this.saveProjects([...SEED_PROJECTS]);
    return [...SEED_PROJECTS];
  },
};
