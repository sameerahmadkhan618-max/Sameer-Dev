import React, { useState, useMemo } from 'react';
import { 
  FileJson, Palette, KeyRound, Calculator, Copy, Check, RefreshCw, 
  Sparkles, CheckCircle2, AlertCircle, Shield, Sliders 
} from 'lucide-react';

export const UtilityDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'json' | 'contrast' | 'password' | 'clamp'>('json');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // ================= 1. JSON TOOL STATE =================
  const DEFAULT_SAMPLE_JSON = JSON.stringify(
    {
      developer: 'Sameer',
      brand: 'SameerDev',
      role: 'Full-Stack Web Developer',
      skills: ['React 19', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js'],
      metrics: {
        satisfactionRate: 100,
        completedProjects: 45,
        avgResponseHours: 1.5,
      },
      availableForHire: true,
    },
    null,
    2
  );

  const [jsonInput, setJsonInput] = useState<string>(DEFAULT_SAMPLE_JSON);
  const [jsonError, setJsonError] = useState<string | null>(null);

  const formatJson = (indent: number) => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, indent));
      setJsonError(null);
    } catch (err: any) {
      setJsonError(err.message || 'Invalid JSON syntax');
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed));
      setJsonError(null);
    } catch (err: any) {
      setJsonError(err.message || 'Invalid JSON syntax');
    }
  };

  // Validate on change
  useMemo(() => {
    try {
      if (!jsonInput.trim()) {
        setJsonError(null);
        return;
      }
      JSON.parse(jsonInput);
      setJsonError(null);
    } catch (err: any) {
      setJsonError(err.message);
    }
  }, [jsonInput]);

  // ================= 2. CONTRAST TOOL STATE =================
  const [textColor, setTextColor] = useState<string>('#0F172A');
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');

  // Relative Luminance calculation for WCAG
  const getLuminance = (hex: string) => {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

    const transform = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * transform(r) + 0.7152 * transform(g) + 0.0722 * transform(b);
  };

  const contrastRatio = useMemo(() => {
    try {
      const lum1 = getLuminance(textColor);
      const lum2 = getLuminance(bgColor);
      const brightest = Math.max(lum1, lum2);
      const darkest = Math.min(lum1, lum2);
      return (brightest + 0.05) / (darkest + 0.05);
    } catch {
      return 1;
    }
  }, [textColor, bgColor]);

  const passesAANormal = contrastRatio >= 4.5;
  const passesAALarge = contrastRatio >= 3.0;
  const passesAAANormal = contrastRatio >= 7.0;

  // ================= 3. PASSWORD TOOL STATE =================
  const [passLength, setPassLength] = useState<number>(18);
  const [useUpper, setUseUpper] = useState<boolean>(true);
  const [useLower, setUseLower] = useState<boolean>(true);
  const [useNums, setUseNums] = useState<boolean>(true);
  const [useSyms, setUseSyms] = useState<boolean>(true);
  const [generatedPassword, setGeneratedPassword] = useState<string>('k9#Vp!8mQw2$Zt9@Lx');

  const generateNewPassword = () => {
    let chars = '';
    if (useUpper) chars += 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    if (useLower) chars += 'abcdefghijkmnopqrstuvwxyz';
    if (useNums) chars += '23456789';
    if (useSyms) chars += '!@#$%^&*()-_=+[]{}|;:,.<>?';

    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

    let res = '';
    const array = new Uint32Array(passLength);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < passLength; i++) {
      res += chars[array[i] % chars.length];
    }
    setGeneratedPassword(res);
  };

  // Password entropy calculation
  const entropyBits = useMemo(() => {
    let pool = 0;
    if (useUpper) pool += 24;
    if (useLower) pool += 24;
    if (useNums) pool += 8;
    if (useSyms) pool += 28;
    if (pool === 0) pool = 24;
    return Math.round(passLength * (Math.log(pool) / Math.log(2)));
  }, [passLength, useUpper, useLower, useNums, useSyms]);

  // ================= 4. CSS CLAMP CALCULATOR =================
  const [minFontSize, setMinFontSize] = useState<number>(18); // px
  const [maxFontSize, setMaxFontSize] = useState<number>(36); // px
  const [minViewport, setMinViewport] = useState<number>(375); // px
  const [maxViewport, setMaxViewport] = useState<number>(1280); // px

  const clampResult = useMemo(() => {
    const minRem = (minFontSize / 16).toFixed(3);
    const maxRem = (maxFontSize / 16).toFixed(3);
    const slope = (maxFontSize - minFontSize) / (maxViewport - minViewport);
    const yAxisIntersection = -minViewport * slope + minFontSize;
    const slopeVw = (slope * 100).toFixed(3);
    const intersectionRem = (yAxisIntersection / 16).toFixed(3);

    return `clamp(${minRem}rem, ${intersectionRem}rem + ${slopeVw}vw, ${maxRem}rem)`;
  }, [minFontSize, maxFontSize, minViewport, maxViewport]);

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 font-sans select-none overflow-y-auto">
      {/* Utility Suite Header */}
      <div className="border-b border-slate-800 bg-slate-950/80 p-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-sm shadow-sm">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
              OMNIDEV <span className="text-emerald-400">UTILITY SUITE</span>
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              Zero-latency client-side productivity utilities
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'json' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">JSON</span>
          </button>

          <button
            onClick={() => setActiveTab('contrast')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'contrast' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Contrast</span>
          </button>

          <button
            onClick={() => setActiveTab('password')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'password' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Secrets</span>
          </button>

          <button
            onClick={() => setActiveTab('clamp')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'clamp' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CSS Clamp</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 p-4 sm:p-6 max-w-5xl mx-auto w-full">
        {/* ================= 1. JSON TOOL ================= */}
        {activeTab === 'json' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-white text-base">JSON Formatter & Validator</h3>
                <p className="text-xs text-slate-400">Format, minify, and inspect JSON payloads client-side.</p>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => formatJson(2)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700"
                >
                  Prettify (2 sp)
                </button>
                <button
                  onClick={() => formatJson(4)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700"
                >
                  Prettify (4 sp)
                </button>
                <button
                  onClick={minifyJson}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700"
                >
                  Minify
                </button>
                <button
                  onClick={() => copyToClipboard(jsonInput, 'json')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  {copiedKey === 'json' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'json' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Validation Feedback banner */}
            <div className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
              jsonError 
                ? 'bg-red-950/50 border-red-800/80 text-red-300' 
                : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
            }`}>
              <div className="flex items-center gap-2">
                {jsonError ? <AlertCircle className="w-4 h-4 text-red-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                <span className="font-mono">{jsonError ? `Error: ${jsonError}` : 'Valid JSON Structure'}</span>
              </div>
              <span className="text-[10px] font-mono opacity-70">
                {jsonInput.length} chars • {jsonInput.split('\n').length} lines
              </span>
            </div>

            {/* Editor Area */}
            <div className="relative">
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                rows={14}
                className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/50 selection:bg-emerald-600/30 resize-y leading-relaxed"
                spellCheck={false}
              />
            </div>
          </div>
        )}

        {/* ================= 2. CONTRAST TOOL ================= */}
        {activeTab === 'contrast' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-white text-base">WCAG Color Contrast & Accessibility</h3>
              <p className="text-xs text-slate-400">Mathematical luminance ratio analysis per W3C WCAG 2.1 criteria.</p>
            </div>

            {/* Color Pickers & Ratio Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Text Color (Foreground)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="flex-1 p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono uppercase text-white"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Background Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono uppercase text-white"
                  />
                </div>
              </div>

              {/* Big Ratio Score */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col justify-center items-center text-center">
                <span className="text-xs font-mono text-slate-400 uppercase">Contrast Ratio</span>
                <span className="text-3xl font-black font-mono text-emerald-400 mt-1">
                  {contrastRatio.toFixed(2)} : 1
                </span>
              </div>
            </div>

            {/* WCAG Compliance Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                passesAANormal ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-red-950/40 border-red-800 text-red-300'
              }`}>
                <div>
                  <div className="text-xs font-bold">WCAG AA Normal Text</div>
                  <div className="text-[10px] opacity-75">Required &ge; 4.5:1</div>
                </div>
                {passesAANormal ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              </div>

              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                passesAALarge ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-red-950/40 border-red-800 text-red-300'
              }`}>
                <div>
                  <div className="text-xs font-bold">WCAG AA Large Text</div>
                  <div className="text-[10px] opacity-75">Required &ge; 3.0:1</div>
                </div>
                {passesAALarge ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              </div>

              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                passesAAANormal ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-amber-950/40 border-amber-800 text-amber-300'
              }`}>
                <div>
                  <div className="text-xs font-bold">WCAG AAA Enhanced</div>
                  <div className="text-[10px] opacity-75">Required &ge; 7.0:1</div>
                </div>
                {passesAAANormal ? <Check className="w-5 h-5" /> : <span className="text-xs font-mono">WARN</span>}
              </div>
            </div>

            {/* Live Visual Preview Card */}
            <div
              style={{ backgroundColor: bgColor, color: textColor }}
              className="p-6 rounded-2xl border border-slate-700 shadow-md transition-colors"
            >
              <h4 className="text-xl font-bold mb-2">Live Text Preview On Selected Background</h4>
              <p className="text-sm leading-relaxed mb-4">
                This live card simulates how real typography, buttons, and readable body text render with your exact chosen contrast ratio.
              </p>
              <button
                style={{ backgroundColor: textColor, color: bgColor }}
                className="px-4 py-2 rounded-lg font-bold text-xs"
              >
                Sample Interactive Action
              </button>
            </div>
          </div>
        )}

        {/* ================= 3. PASSWORD TOOL ================= */}
        {activeTab === 'password' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-white text-base">Cryptographic Password & Key Generator</h3>
              <p className="text-xs text-slate-400">Generates high-entropy cryptographically secure random credentials.</p>
            </div>

            {/* Output Box */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
              <span className="font-mono text-base sm:text-lg text-emerald-400 select-all break-all">
                {generatedPassword}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={generateNewPassword}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Generate New"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => copyToClipboard(generatedPassword, 'pwd')}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  {copiedKey === 'pwd' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey === 'pwd' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Entropy Score Meter */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-medium">Entropy Strength:</span>
                <span className="font-mono text-emerald-400 font-bold">{entropyBits} bits (Very High Security)</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${Math.min(100, (entropyBits / 128) * 100)}%` }}
                />
              </div>
            </div>

            {/* Length Slider & Config Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>Character Length:</span>
                  <span className="font-mono text-emerald-400 text-sm font-bold">{passLength}</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="48"
                  value={passLength}
                  onChange={(e) => {
                    setPassLength(parseInt(e.target.value, 10));
                    setTimeout(generateNewPassword, 0);
                  }}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl grid grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useUpper}
                    onChange={(e) => setUseUpper(e.target.checked)}
                    className="accent-emerald-500"
                  />
                  <span>Uppercase (A-Z)</span>
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useLower}
                    onChange={(e) => setUseLower(e.target.checked)}
                    className="accent-emerald-500"
                  />
                  <span>Lowercase (a-z)</span>
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useNums}
                    onChange={(e) => setUseNums(e.target.checked)}
                    className="accent-emerald-500"
                  />
                  <span>Numbers (0-9)</span>
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useSyms}
                    onChange={(e) => setUseSyms(e.target.checked)}
                    className="accent-emerald-500"
                  />
                  <span>Symbols (!@#$)</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ================= 4. CSS CLAMP TOOL ================= */}
        {activeTab === 'clamp' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-white text-base">CSS Fluid Clamp() Typography Generator</h3>
              <p className="text-xs text-slate-400">Generates smooth responsive fluid typography rules without breakpoint jumps.</p>
            </div>

            {/* Output Rule */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
              <code className="font-mono text-xs sm:text-sm text-emerald-400 break-all">
                font-size: {clampResult};
              </code>
              <button
                onClick={() => copyToClipboard(`font-size: ${clampResult};`, 'clamp')}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shrink-0"
              >
                {copiedKey === 'clamp' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedKey === 'clamp' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[11px] text-slate-400 font-mono">Min Font Size</span>
                <div className="flex items-center gap-1 mt-1">
                  <input
                    type="number"
                    value={minFontSize}
                    onChange={(e) => setMinFontSize(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white font-mono"
                  />
                  <span className="text-xs text-slate-400">px</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[11px] text-slate-400 font-mono">Max Font Size</span>
                <div className="flex items-center gap-1 mt-1">
                  <input
                    type="number"
                    value={maxFontSize}
                    onChange={(e) => setMaxFontSize(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white font-mono"
                  />
                  <span className="text-xs text-slate-400">px</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[11px] text-slate-400 font-mono">Min Viewport</span>
                <div className="flex items-center gap-1 mt-1">
                  <input
                    type="number"
                    value={minViewport}
                    onChange={(e) => setMinViewport(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white font-mono"
                  />
                  <span className="text-xs text-slate-400">px</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[11px] text-slate-400 font-mono">Max Viewport</span>
                <div className="flex items-center gap-1 mt-1">
                  <input
                    type="number"
                    value={maxViewport}
                    onChange={(e) => setMaxViewport(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white font-mono"
                  />
                  <span className="text-xs text-slate-400">px</span>
                </div>
              </div>
            </div>

            {/* Live responsive heading sample */}
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl text-center">
              <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">Live Fluid Scaled Text Sample:</span>
              <h2
                style={{ fontSize: clampResult }}
                className="font-black text-white tracking-tight mt-2"
              >
                Smooth Responsive Heading
              </h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
