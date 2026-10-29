/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useRouter } from './hooks/useRouter';
import { HomePage } from './pages/HomePage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  const { currentPath, currentHash, navigate, isProjectDetail, projectId } = useRouter();

  // Route matching
  if (currentPath === '/' || currentPath === '') {
    return <HomePage onNavigate={navigate} currentHash={currentHash} />;
  }

  if (isProjectDetail && projectId) {
    return <ProjectDetailPage projectId={projectId} onNavigate={navigate} />;
  }

  if (currentPath === '/admin' || currentPath === '/admin/') {
    return <AdminPage onNavigate={navigate} />;
  }

  return <NotFoundPage onNavigate={navigate} />;
}
