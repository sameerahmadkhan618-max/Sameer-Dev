export interface DemoWebsite {
  id: string;
  title: string;
  category: 'Game' | 'E-Commerce' | 'Utility' | 'SaaS' | 'AI Tool';
  tagline: string;
  description: string;
  technologies: string[];
  highlights: string[];
  clientTakeaway: string;
  badge: string;
  accentColor: string;
  previewImage: string;
}

export const DEMO_WEBSITES: DemoWebsite[] = [
  {
    id: 'game-reflex',
    title: 'Cyber Reflex: Arcade Gem Runner',
    category: 'Game',
    tagline: 'High-speed 60FPS canvas reflex & gem collector game',
    description: 'An interactive browser arcade game featuring HTML5 Canvas physics, particle explosion effects, custom Web Audio synthesis, responsive keyboard & touch controls, and persistent high scores.',
    technologies: ['HTML5 Canvas', 'TypeScript', 'Web Audio API', 'Physics Loop', 'Local Storage'],
    highlights: [
      '60 FPS custom requestAnimationFrame game engine',
      'Power-up shields, magnet pull, and multiplier combos',
      'Dual control modes: Keyboard (Arrow/WASD) and Touch joypad',
      'Retro synth sound effects with mute toggle'
    ],
    clientTakeaway: 'Demonstrates complex animation math, high-performance rendering, sound design, and responsive mobile game controls.',
    badge: 'Playable Web Game',
    accentColor: 'blue',
    previewImage: '/src/assets/images/game_screenshot_1791460882590.jpg'
  },
  {
    id: 'ai-neurostudio',
    title: 'NeuroStudio: AI Prompt Engineering Lab',
    category: 'AI Tool',
    tagline: 'Interactive prompt IDE with dynamic variable interpolation, streaming simulation & telemetry',
    description: 'An advanced AI prompt engineering workbench featuring variable templating ({{variable}} parsing), live token telemetry, model parameter tuning (temperature, top-p, max tokens), streaming simulation engine, and prompt efficiency grading.',
    technologies: ['React 19', 'TypeScript', 'AST Regex Parser', 'Tailwind CSS', 'Simulation Loop'],
    highlights: [
      'Dynamic {{variable}} template syntax parser with instant slot binding',
      'Real-time streaming generation simulation with realistic token rate',
      'Fine-grained parameter controls: Temperature, Top-P, and Max Tokens',
      'Built-in prompt quality scoring (Clarity, Specificity, Context Efficiency)'
    ],
    clientTakeaway: 'Demonstrates modern AI application UI architecture, complex state orchestration, reactive parameter tuning, and developer tooling design.',
    badge: 'Interactive AI Studio',
    accentColor: 'cyan',
    previewImage: '/src/assets/images/ai_studio_screenshot_1793276338305.jpg'
  },
  {
    id: 'ecommerce-luxe',
    title: 'Aura Luxe: Modern Headless Storefront',
    category: 'E-Commerce',
    tagline: 'High-conversion lifestyle & tech boutique with live cart and checkout',
    description: 'A boutique e-commerce web application featuring instantaneous category filtering, live keyword search, dynamic product modal with variant selection, slide-over cart with coupon code system, and an interactive 2-step checkout simulation.',
    technologies: ['React 19', 'TypeScript', 'State Management', 'Tailwind CSS', 'Conversion UX'],
    highlights: [
      'Instant search and category filtering with price sorting',
      'Interactive product quick-view modal with variant selection',
      'Slide-out cart drawer with live subtotal, shipping, and discount codes',
      'Complete 2-step checkout flow with instant order confirmation receipt'
    ],
    clientTakeaway: 'Demonstrates production-ready e-commerce UX, state management, basket calculations, and frictionless checkout flow.',
    badge: 'Full Storefront Demo',
    accentColor: 'indigo',
    previewImage: '/src/assets/images/ecommerce_screenshot_1791460866215.jpg'
  },
  {
    id: 'utility-omni',
    title: 'OmniDev: Client-Side Utility Toolkit',
    category: 'Utility',
    tagline: 'Multi-tool productivity suite with zero-latency client-side algorithms',
    description: 'A fast developer and web utility suite packaging 4 real, operational tools: JSON Formatter & Validator, WCAG Color Contrast & Palette Generator, Cryptographic Key/Password Generator, and CSS Fluid Clamp Calculator.',
    technologies: ['Client Algorithms', 'WCAG 2.1 Math', 'Crypto API', 'Clipboard API', 'Reactive UI'],
    highlights: [
      'JSON validator, syntax beautifier, and minifier with error detection',
      'WCAG AA/AAA color contrast ratio tester with 5-step tint generator',
      'Configurable password & secret key generator with entropy bar',
      'CSS rem/px converter and fluid responsive clamp() generator'
    ],
    clientTakeaway: 'Demonstrates deep algorithmic logic, accessible color math, clean tabbed architecture, and zero-latency client utilities.',
    badge: 'Multi-Tool Utility',
    accentColor: 'emerald',
    previewImage: '/src/assets/images/utility_screenshot_1791460898904.jpg'
  },
  {
    id: 'saas-pulseflow',
    title: 'PulseFlow: Modern Agile Task Workspace',
    category: 'SaaS',
    tagline: 'Linear-inspired project board with live Kanban workflow and analytics',
    description: 'A modern SaaS project management application with interactive Kanban columns, custom task creation, status advancement, live progress tracking, priority tags, and responsive search.',
    technologies: ['React 19', 'TypeScript', 'Kanban Architecture', 'Interactive State', 'Dashboard Analytics'],
    highlights: [
      'Four-column agile workflow (Backlog, In Progress, Review, Shipped)',
      '1-click task state advancement and priority filtering',
      'Task creator modal with priority tagging and assignee selection',
      'Real-time sprint progress bar and velocity metric cards'
    ],
    clientTakeaway: 'Demonstrates SaaS dashboard design, agile board logic, component modularity, and enterprise application craftsmanship.',
    badge: 'SaaS Dashboard Demo',
    accentColor: 'amber',
    previewImage: '/src/assets/images/saas_screenshot_1791460916290.jpg'
  }
];
