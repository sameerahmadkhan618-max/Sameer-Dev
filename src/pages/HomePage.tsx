import React, { useState } from 'react';
import { Hero } from '../components/home/Hero';
import { AboutSection } from '../components/home/AboutSection';
import { ServicesSection } from '../components/home/ServicesSection';
import { SkillsSection } from '../components/home/SkillsSection';
import { LiveDemosSection } from '../components/home/LiveDemosSection';
import { DemoViewerModal } from '../components/demos/DemoViewerModal';
import { ProjectsSection } from '../components/home/ProjectsSection';
import { ContactSection } from '../components/home/ContactSection';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { BackToTop } from '../components/layout/BackToTop';

interface HomePageProps {
  onNavigate: (href: string) => void;
  currentHash: string;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, currentHash }) => {
  const [activeDemoId, setActiveDemoId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-blue-500/20 selection:text-blue-900">
      {/* Top Navbar */}
      <Navbar onNavigate={onNavigate} currentHash={currentHash} />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section with Video Background and 3D Developer Portrait */}
        <Hero onNavigate={onNavigate} />

        {/* Phase 2: About Section */}
        <AboutSection />

        {/* Phase 2: Services Section */}
        <ServicesSection />

        {/* Phase 2: Skills Section */}
        <SkillsSection />

        {/* Live Client Demos: Game, E-Commerce, Utility, SaaS */}
        <LiveDemosSection onLaunchDemo={(id) => setActiveDemoId(id)} />

        {/* Phase 3: Real Featured Projects Section */}
        <ProjectsSection
          onViewDetails={(projectId) => onNavigate(`/projects/${projectId}`)}
        />

        {/* Phase 2: Contact Section with WhatsApp Integration */}
        <ContactSection />
      </main>

      {/* Interactive Sandbox Demo Viewer Modal */}
      <DemoViewerModal
        demoId={activeDemoId}
        onClose={() => setActiveDemoId(null)}
        onSelectDemo={(id) => setActiveDemoId(id)}
      />

      {/* Phase 2: Full Footer */}
      <Footer onNavigate={onNavigate} />

      {/* Floating Back to Top Button */}
      <BackToTop />
    </div>
  );
};

