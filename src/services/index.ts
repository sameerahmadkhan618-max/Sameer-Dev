/**
 * Services module
 * Centralized service layer
 */
export { projectService, isValidHttpsUrl, normalizeUrl, deriveProjectName } from './projectService';
export { authService, type AdminSession } from './authService';

export const servicesConfig = {
  version: '2.4.0-phase4',
  initialized: true,
};
