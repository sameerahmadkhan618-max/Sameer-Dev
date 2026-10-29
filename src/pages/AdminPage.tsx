import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { AdminLogin } from '../components/admin/AdminLogin';
import { AdminDashboard } from '../components/admin/AdminDashboard';

interface AdminPageProps {
  onNavigate: (href: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return authService.isAuthenticated();
  });

  useEffect(() => {
    // Sync authentication state
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        onNavigateHome={() => onNavigate('/')}
      />
    );
  }

  return (
    <AdminDashboard
      onLogout={handleLogout}
      onNavigateHome={() => onNavigate('/')}
    />
  );
};
