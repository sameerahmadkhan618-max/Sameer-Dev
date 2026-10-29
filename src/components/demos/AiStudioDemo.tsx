import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Play, RotateCcw, Copy, Check, Sliders, Cpu, 
  Terminal, ShieldCheck, Zap, Layers, ChevronDown, 
  BookOpen, Code, RefreshCw, Send, HelpCircle, FileText
} from 'lucide-react';

interface PromptPreset {
  id: string;
  name: string;
  category: string;
  template: string;
  defaultVariables: Record<string, string>;
  systemPrompt: string;
  defaultOutput: string;
  suggestedTemp: number;
}

const PRESETS: PromptPreset[] = [
  {
    id: 'cyberpunk-story',
    name: 'Cyberpunk Narrative Generator',
    category: 'Creative Story',
    template: `You are a visionary narrative writer specializing in {{genre}}.
Create an atmospheric scene introducing {{protagonist}}, an elite hacker in {{setting}}.
The character is hunting for {{macguffin}} while evading {{antagonist}}.
Format the story in evocative prose with high sensory detail and dialogue in {{tone}} tone.`,
    defaultVariables: {
      genre: 'cyberpunk neo-noir',
      protagonist: 'Kaelen Thorne, a rogue neural engineer',
      setting: 'Neo-Kowloon under relentless holographic acid rain',
      macguffin: 'an unencrypted cryogenic memory core',
      antagonist: 'Arasaka orbital strike drones',
      tone: 'gritty and cinematic'
    },
    systemPrompt: 'Maintain high cinematic contrast, tactile auditory sensory descriptions, and tight cadence.',
    defaultOutput: `Neon-drenched vapor hissed through the exhaust grates of Sector 9 as Kaelen Thorne pulled his carbon-mesh cowl tighter. The rain didn't wash Neo-Kowloon clean; it only dissolved the synthetic pigment from the holographic billboards overhead, dripping magenta into the storm drains.

In his right trenchcoat pocket, the cryogenic memory core pulsed with a faint 12Hz amber rhythm. Cold enough to frost the tips of his cybernetic fingers.

"Triangulating localized telemetry," the sub-dermal audio receiver chimed against his mastoid bone. "Orbital strike drones have dropped beneath cloud level. Intercept probability: ninety-two percent."

Kaelen tapped the haptic interface stitched into his wrist. "Let them drop. They're scanning for biological heat signatures. They don't know I vented my cooling circuit ten minutes ago."

He slipped into the dark canyon of Alley 14, where the neon flickered out and the real shadows began.`,
    suggestedTemp: 0.85
  },
  {
    id: 'system-architect',
    name: 'Full-Stack Distributed Architect',
    category: 'Engineering',
    template: `Act as a Principal Software Architect.
Provide a production-grade blueprint for {{systemName}} designed to handle {{scale}}.
Key architectural priorities are {{priorityOne}} and {{priorityTwo}}.
Target stack: {{techStack}}.
Include API contracts, state synchronization strategy, and resilience patterns.`,
    defaultVariables: {
      systemName: 'Multi-Tenant Collaborative Canvas Engine',
      scale: '250,000 concurrent active room sessions with sub-20ms broadcast latency',
      priorityOne: 'zero-conflict state synchronization (CRDT / Yjs)',
      priorityTwo: 'horizontal edge auto-scaling with scale-to-zero persistence',
      techStack: 'TypeScript, WebSockets, Redis pub/sub, Cloudflare Workers, PostgreSQL'
    },
    systemPrompt: 'Provide concrete architectural trade-offs, sequence flow, and failover topologies with zero fluff.',
    defaultOutput: `### Architecture Specification: Multi-Tenant Collaborative Canvas Engine

#### 1. Data Flow & Synchronization Strategy
- **State Model:** Hybrid Yjs CRDT document instances stored in-memory at distributed Edge durable objects.
- **Transport:** Multiplexed Binary WebSockets over TLS with delta-state packet compression (<45 bytes per cursor/op).
- **Conflict Resolution:** State vectors synchronize monotonically without server lockouts; split-brain network partitions reconcile upon socket reconnect.

#### 2. Network Topology & Edge Sharding
\`\`\`
[Clients] <---WebSocket TLS---> [Edge Workers / Durable Objects]
                                     |
                               (Pub/Sub Buffer)
                                     v
                           [Distributed Redis Cluster]
                                     |
                             (Snapshot Sync 30s)
                                     v
                       [PostgreSQL (JSONB Event Store)]
\`\`\`

#### 3. Latency & Resilience SLA
- **P99 Sync Latency:** 18ms within continental regions.
- **Failover:** Heartbeat loss triggers automatic state reconciliation from the latest WAL snapshot in under 350ms.`,
    suggestedTemp: 0.2
  },
  {
    id: 'saas-copywriter',
    name: 'High-Conversion SaaS Copywriter',
    category: 'Marketing',
    template: `You are an elite conversion rate copywriter for B2B SaaS.
Write a punchy landing page hero section for {{productName}}, a tool that {{coreValueProp}}.
The primary audience is {{targetAudience}} suffering from {{painPoint}}.
Include:
1. Irresistible H1 Headline
2. Supporting Subhead with proof metrics
3. High-intent Primary CTA button label
4. 3 Micro-trust social proof badges`,
    defaultVariables: {
      productName: 'TracePulse',
      coreValueProp: 'detects database query bottlenecks and auto-generates optimized indexes',
      targetAudience: 'Senior DevOps & Backend Engineers',
      painPoint: 'late-night incident alerts caused by unindexed SQL queries degrading production database pools'
    },
    systemPrompt: 'Direct response tone. Punchy, developer-fluent, no generic marketing cliches.',
    defaultOutput: `### Hero Section: TracePulse

**Headline (H1):**
# Stop waking up at 3 AM to kill unindexed PostgreSQL queries.

**Subheadline:**
TracePulse analyzes production query plans in real-time, surfaces slow sequential scans before they starve connection pools, and writes the exact indexes your database needs—zero configuration required.

**Primary CTA:**
[ Start Profiling Free (No Credit Card) -> ]
*Deploy in 3 minutes via lightweight read-only proxy*

**Micro-Trust Badges:**
✓ P99 latency overhead < 0.2%  
✓ SOC2 Type II Certified & HIPAA compliant  
✓ Trusted across 42,000+ production clusters`,
    suggestedTemp: 0.7
  }
];

export const AiStudioDemo: React.FC = () => {
  const [activePreset, setActivePreset] = useState<PromptPreset>(PRESETS[0]);
  const [variables, setVariables] = useState<Record<string, string>>(PRESETS[0].defaultVariables);
  const [templateText, setTemplateText] = useState<string>(PRESETS[0].template);
  const [systemPrompt, setSystemPrompt] = useState<string>(PRESETS[0].systemPrompt);
  
  // Model Parameters
  const [model, setModel] = useState<string>('gemini-2.5-pro');
  const [temperature, setTemperature] = useState<number>(PRESETS[0].suggestedTemp);
  const [maxTokens, setMaxTokens] = useState<number>(2048);
  const [topP, setTopP] = useState<number>(0.9);

  // Execution & Output State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedOutput, setGeneratedOutput] = useState<string>(PRESETS[0].defaultOutput);
  const [copied, setCopied] = useState<boolean>(false);
  const [tokenCount, setTokenCount] = useState<number>(342);
  const [generationTimeMs, setGenerationTimeMs] = useState<number>(418);
  const [runCount, setRunCount] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'prompt' | 'system' | 'stats'>('prompt');

  const typewriterTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Switch preset
  const handleSelectPreset = (preset: PromptPreset) => {
    setActivePreset(preset);
    setTemplateText(preset.template);
    setVariables(preset.defaultVariables);
    setSystemPrompt(preset.systemPrompt);
    setGeneratedOutput(preset.defaultOutput);
    setTemperature(preset.suggestedTemp);
  };

  // Extract variables dynamically from template with regex {{variableName}}
  const detectedVariables = React.useMemo(() => {
    const matches = templateText.match(/\{\{([a-zA-Z0-9_-]+)\}\}/g);
    if (!matches) return [];
    return Array.from(new Set(matches.map((m) => m.replace(/\{\{|\}\}/g, ''))));
  }, [templateText]);

  // Compute interpolated prompt preview
  const interpolatedPrompt = React.useMemo(() => {
    let result = templateText;
    detectedVariables.forEach((key) => {
      const val = variables[key] || `[${key}]`;
      result = result.replaceAll(`{{${key}}}`, val);
    });
    return result;
  }, [templateText, variables, detectedVariables]);

  // Run generation with simulated streaming typewriter
  const handleRunPrompt = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setGeneratedOutput('');

    const targetOutput = activePreset.defaultOutput;
    let charIndex = 0;
    const startTime = performance.now();

    if (typewriterTimeoutRef.current) {
      clearInterval(typewriterTimeoutRef.current);
    }

    const interval = setInterval(() => {
      // Stream chunks of 4-8 chars for realistic fast LLM streaming
      const step = Math.floor(Math.random() * 5) + 4;
      charIndex += step;
      if (charIndex >= targetOutput.length) {
        setGeneratedOutput(targetOutput);
        setIsGenerating(false);
        const elapsed = Math.round(performance.now() - startTime);
        setGenerationTimeMs(elapsed);
        setTokenCount(Math.round(targetOutput.length / 3.8));
        setRunCount((prev) => prev + 1);
        clearInterval(interval);
      } else {
        setGeneratedOutput(targetOutput.slice(0, charIndex));
      }
    }, 18);

    typewriterTimeoutRef.current = interval as unknown as NodeJS.Timeout;
  };

  useEffect(() => {
    return () => {
      if (typewriterTimeoutRef.current) {
        clearInterval(typewriterTimeoutRef.current);
      }
    };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 font-sans h-full overflow-hidden select-none">
      {/* Top Demo Sub-Header */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight text-white">NeuroStudio</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                AI Prompt Workbench
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Dynamic Variable Templating & Parameter Playground</p>
          </div>
        </div>

        {/* Model Selector & Live Stats */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400 mr-1.5" />
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="bg-transparent text-xs font-mono text-cyan-300 outline-none cursor-pointer"
            >
              <option value="gemini-2.5-pro" className="bg-slate-900 text-white">Gemini 2.5 Pro (Thinking)</option>
              <option value="gemini-2.5-flash" className="bg-slate-900 text-white">Gemini 2.5 Flash (Ultra-Fast)</option>
              <option value="claude-3-5-sonnet" className="bg-slate-900 text-white">Claude 3.5 Sonnet</option>
              <option value="gpt-4o" className="bg-slate-900 text-white">GPT-4o Omnimodal</option>
            </select>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-[11px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Interactive Simulator</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left/Middle Column: Template Editor & Dynamic Variable Binding */}
        <div className="lg:col-span-7 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 overflow-y-auto">
          {/* Preset Selector Bar */}
          <div className="p-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Presets
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p)}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                    activePreset.id === p.id
                      ? 'bg-cyan-600 text-white shadow-xs'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {p.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Editor Tabs */}
          <div className="flex items-center border-b border-slate-800 px-3 bg-slate-950">
            <button
              onClick={() => setActiveTab('prompt')}
              className={`px-3 py-2 text-xs font-mono font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'prompt'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              Prompt Template ({`{{vars}}`})
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`px-3 py-2 text-xs font-mono font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'system'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              System Directives
            </button>
          </div>

          <div className="p-4 space-y-4 flex-1">
            {activeTab === 'prompt' ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Template Editor</span>
                  <span className="text-cyan-400 text-[11px]">
                    Use {`{{variable}}`} to declare dynamic slots
                  </span>
                </div>
                <div className="relative rounded-xl border border-slate-800 bg-slate-900/90 focus-within:border-cyan-500/80 transition-all p-3 shadow-inner">
                  <textarea
                    value={templateText}
                    onChange={(e) => setTemplateText(e.target.value)}
                    rows={6}
                    className="w-full bg-transparent font-mono text-xs sm:text-sm text-slate-100 outline-none resize-none leading-relaxed"
                    placeholder="Enter prompt template with {{variables}}..."
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>System Instructions</span>
                  <span className="text-slate-400 text-[11px]">Enforces style & guardrails</span>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/90 focus-within:border-cyan-500/80 transition-all p-3 shadow-inner">
                  <textarea
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    rows={6}
                    className="w-full bg-transparent font-mono text-xs sm:text-sm text-slate-100 outline-none resize-none leading-relaxed"
                    placeholder="Set global constraints and tone guidelines..."
                  />
                </div>
              </div>
            )}

            {/* Variable Slots Grid */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Dynamic Variable Slots ({detectedVariables.length})
                </span>
                <span className="text-[11px] text-slate-400">Live slot interpolation</span>
              </div>

              {detectedVariables.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  No variables found in template. Add tokens like <code className="text-cyan-400">{`{{topic}}`}</code> to create interactive slots.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {detectedVariables.map((v) => (
                    <div
                      key={v}
                      className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus-within:border-cyan-500/60 transition-all space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-mono text-cyan-400 font-semibold truncate">
                          {`{{${v}}}`}
                        </label>
                      </div>
                      <input
                        type="text"
                        value={variables[v] || ''}
                        onChange={(e) =>
                          setVariables((prev) => ({ ...prev, [v]: e.target.value }))
                        }
                        placeholder={`Enter ${v}...`}
                        className="w-full bg-slate-950 border border-slate-800/80 rounded-lg px-2.5 py-1 text-xs font-sans text-slate-200 outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Parameter Tuning Sliders */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  Model Hyperparameters
                </span>
                <span className="text-[11px] font-mono text-slate-400">Tuned for {model}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Temperature Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Temperature</span>
                    <span className="text-cyan-400 font-bold">{temperature.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1.5"
                    step="0.05"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                    <span>Deterministic</span>
                    <span>Creative</span>
                  </div>
                </div>

                {/* Top P Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Top-P</span>
                    <span className="text-cyan-400 font-bold">{topP.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={topP}
                    onChange={(e) => setTopP(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                    <span>Focused</span>
                    <span>Diverse</span>
                  </div>
                </div>

                {/* Max Tokens */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Max Tokens</span>
                    <span className="text-cyan-400 font-bold">{maxTokens}</span>
                  </div>
                  <input
                    type="range"
                    min="256"
                    max="4096"
                    step="256"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                    <span>256</span>
                    <span>4096</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Execution Bar */}
          <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
            <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
              {interpolatedPrompt.length} chars • ~{Math.round(interpolatedPrompt.length / 4)} prompt tokens
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  setTemplateText(activePreset.template);
                  setVariables(activePreset.defaultVariables);
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Reset to preset defaults"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>

              <button
                onClick={handleRunPrompt}
                disabled={isGenerating}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold text-xs font-mono transition-all duration-200 flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                  isGenerating
                    ? 'bg-cyan-800 text-cyan-200 cursor-not-allowed opacity-80'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Streaming Generation...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Execute Prompt</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Execution Output Stream & Telemetry */}
        <div className="lg:col-span-5 flex flex-col bg-slate-950 overflow-hidden">
          {/* Top Bar for Output */}
          <div className="p-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-slate-200">
                Streaming Output
              </span>
              {isGenerating && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!generatedOutput}
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Telemetry Status Bar */}
          <div className="px-4 py-2 bg-slate-900/40 border-b border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400 shrink-0">
            <div className="flex items-center gap-3">
              <span>Tokens: <strong className="text-cyan-400">{tokenCount}</strong></span>
              <span>TTFT: <strong className="text-emerald-400">{generationTimeMs}ms</strong></span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <span>Runs: #{runCount}</span>
              <span>Cost: ~$0.0003</span>
            </div>
          </div>

          {/* Output Display Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-4 min-h-[220px]">
              {generatedOutput ? (
                <div className="font-mono text-xs sm:text-[13px] text-slate-200 whitespace-pre-wrap leading-relaxed select-text">
                  {generatedOutput}
                  {isGenerating && (
                    <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse align-middle" />
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
                  <Play className="w-6 h-6 text-slate-600 animate-bounce" />
                  <p className="text-xs font-mono">Click "Execute Prompt" to stream output</p>
                </div>
              )}
            </div>

            {/* Quality Analysis Inspector Cards */}
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/90 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Prompt Quality Grading
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/50">
                  A+ Grade (95/100)
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] font-mono mb-1">
                    <span className="text-slate-400">Context Clarity & Structure</span>
                    <span className="text-slate-200">98%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: '98%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-mono mb-1">
                    <span className="text-slate-400">Constraint Adherence</span>
                    <span className="text-slate-200">94%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '94%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-mono mb-1">
                    <span className="text-slate-400">Token Efficiency Ratio</span>
                    <span className="text-slate-200">92%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 leading-relaxed font-sans pt-1">
                Zero ambiguity detected in slot delimiters. Template is fully deterministic across all major foundation models.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
