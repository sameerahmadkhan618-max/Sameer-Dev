export type RoutePath = '/' | '/admin' | string;

export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface SectionAnchor {
  id: string;
  title: string;
}

export type ScreenshotSource = 'automatic' | 'uploaded' | 'url' | 'fallback';

export interface Project {
  id: string;
  name: string;
  url: string;
  description?: string;
  screenshot?: string;
  screenshotSource?: ScreenshotSource;
  category?: string;
  technologies?: string[];
  createdAt: string;
  updatedAt?: string;
}
