import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Shield, Trophy, Flame, Zap, ArrowLeft, ArrowRight, Pause } from 'lucide-react';

interface Gem {
  x: number;
  y: number;
  radius: number;
  type: 'blue' | 'gold' | 'diamond' | 'shield';
  points: number;
  speed: number;
  color: string;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  speedY: number;
  speedX: number;
  color: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  life: number;
}

export const GameDemo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('cyber_reflex_high_score') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [combo, setCombo] = useState<number>(1);
  const [hasShield, setHasShield] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<'normal' | 'arcade' | 'hyper'>('arcade');

  // Internal mutable state for 60fps canvas loop
  const gameStateRef = useRef({
    player: {
      x: 320,
      y: 400,
      width: 36,
      height: 36,
      speed: 7,
      shield: false,
    },
    keys: {
      left: false,
      right: false,
      up: false,
      down: false,
    },
    gems: [] as Gem[],
    obstacles: [] as Obstacle[],
    particles: [] as Particle[],
    score: 0,
    combo: 1,
    comboTimer: 0,
    lastSpawn: 0,
    lastObsSpawn: 0,
    animFrameId: 0,
    difficultyMultiplier: 1.2,
  });

  // Simple Web Audio Synthesizer
  const playSound = useCallback((type: 'gem' | 'diamond' | 'shield' | 'hit' | 'gameOver') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'gem') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'diamond') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(784, now); // G5
        osc.frequency.exponentialRampToValueAtTime(1318.5, now + 0.2); // E6
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'shield') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.25);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(60, now + 0.2);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'gameOver') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(55, now + 0.5);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch {
      // AudioContext unavailable or restricted
    }
  }, [soundEnabled]);

  // Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA', 'a'].includes(e.code) || ['ArrowLeft', 'a', 'A'].includes(e.key)) {
        gameStateRef.current.keys.left = true;
      }
      if (['ArrowRight', 'KeyD', 'd'].includes(e.code) || ['ArrowRight', 'd', 'D'].includes(e.key)) {
        gameStateRef.current.keys.right = true;
      }
      if (['ArrowUp', 'KeyW', 'w'].includes(e.code) || ['ArrowUp', 'w', 'W'].includes(e.key)) {
        gameStateRef.current.keys.up = true;
      }
      if (['ArrowDown', 'KeyS', 's'].includes(e.code) || ['ArrowDown', 's', 'S'].includes(e.key)) {
        gameStateRef.current.keys.down = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA', 'a'].includes(e.code) || ['ArrowLeft', 'a', 'A'].includes(e.key)) {
        gameStateRef.current.keys.left = false;
      }
      if (['ArrowRight', 'KeyD', 'd'].includes(e.code) || ['ArrowRight', 'd', 'D'].includes(e.key)) {
        gameStateRef.current.keys.right = false;
      }
      if (['ArrowUp', 'KeyW', 'w'].includes(e.code) || ['ArrowUp', 'w', 'W'].includes(e.key)) {
        gameStateRef.current.keys.up = false;
      }
      if (['ArrowDown', 'KeyS', 's'].includes(e.code) || ['ArrowDown', 's', 'S'].includes(e.key)) {
        gameStateRef.current.keys.down = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const spawnParticles = (x: number, y: number, color: string, count: number = 12) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      const speed = 1.5 + Math.random() * 3.5;
      gameStateRef.current.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 3,
        color,
        alpha: 1,
        life: 0,
      });
    }
  };

  const startGame = () => {
    const diffMap = { normal: 1.0, arcade: 1.4, hyper: 2.0 };
    gameStateRef.current = {
      player: {
        x: 320,
        y: 400,
        width: 36,
        height: 36,
        speed: 7,
        shield: false,
      },
      keys: { left: false, right: false, up: false, down: false },
      gems: [],
      obstacles: [],
      particles: [],
      score: 0,
      combo: 1,
      comboTimer: 0,
      lastSpawn: 0,
      lastObsSpawn: 0,
      animFrameId: 0,
      difficultyMultiplier: diffMap[difficulty],
    };
    setScore(0);
    setCombo(1);
    setHasShield(false);
    setGameOver(false);
    setIsPaused(false);
    setIsPlaying(true);
  };

  // Main game loop
  useEffect(() => {
    if (!isPlaying || isPaused || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const state = gameStateRef.current;
      const { player, keys } = state;

      // 1. Move Player
      if (keys.left) player.x -= player.speed;
      if (keys.right) player.x += player.speed;
      if (keys.up) player.y -= player.speed * 0.8;
      if (keys.down) player.y += player.speed * 0.8;

      // Clamp player within boundaries (Canvas width 640, height 480)
      player.x = Math.max(20, Math.min(620 - player.width, player.x));
      player.y = Math.max(100, Math.min(460 - player.height, player.y));

      // 2. Spawn Gems
      if (now - state.lastSpawn > 900 / state.difficultyMultiplier) {
        state.lastSpawn = now;
        const rand = Math.random();
        let type: Gem['type'] = 'blue';
        let points = 10;
        let color = '#38BDF8';
        let radius = 10;

        if (rand > 0.92) {
          type = 'shield';
          points = 25;
          color = '#A855F7';
          radius = 12;
        } else if (rand > 0.75) {
          type = 'diamond';
          points = 100;
          color = '#F59E0B';
          radius = 11;
        } else if (rand > 0.45) {
          type = 'gold';
          points = 50;
          color = '#10B981';
          radius = 10;
        }

        state.gems.push({
          x: 40 + Math.random() * 560,
          y: -20,
          radius,
          type,
          points,
          speed: (120 + Math.random() * 80) * state.difficultyMultiplier,
          color,
        });
      }

      // 3. Spawn Obstacles
      if (now - state.lastObsSpawn > 1400 / state.difficultyMultiplier) {
        state.lastObsSpawn = now;
        const width = 32 + Math.random() * 24;
        const height = 32 + Math.random() * 24;
        state.obstacles.push({
          x: 30 + Math.random() * (580 - width),
          y: -30,
          width,
          height,
          speedY: (140 + Math.random() * 110) * state.difficultyMultiplier,
          speedX: (Math.random() - 0.5) * 60,
          color: '#EF4444',
        });
      }

      // 4. Update Gems & Player Collisions
      for (let i = state.gems.length - 1; i >= 0; i--) {
        const gem = state.gems[i];
        gem.y += gem.speed * dt;

        // Player collection check
        const playerCenterX = player.x + player.width / 2;
        const playerCenterY = player.y + player.height / 2;
        const dist = Math.hypot(playerCenterX - gem.x, playerCenterY - gem.y);

        if (dist < gem.radius + player.width / 2) {
          // Collected!
          spawnParticles(gem.x, gem.y, gem.color, 14);
          if (gem.type === 'shield') {
            player.shield = true;
            setHasShield(true);
            playSound('shield');
          } else {
            const addedScore = gem.points * state.combo;
            state.score += addedScore;
            state.combo = Math.min(state.combo + 1, 8);
            state.comboTimer = 3.0; // 3 seconds to keep combo
            setScore(state.score);
            setCombo(state.combo);
            playSound(gem.type === 'diamond' ? 'diamond' : 'gem');
          }
          state.gems.splice(i, 1);
          continue;
        }

        // Off bottom edge
        if (gem.y > 500) {
          state.gems.splice(i, 1);
        }
      }

      // 5. Update Combo decay
      if (state.combo > 1) {
        state.comboTimer -= dt;
        if (state.comboTimer <= 0) {
          state.combo = 1;
          setCombo(1);
        }
      }

      // 6. Update Obstacles & Hazard Collision
      for (let i = state.obstacles.length - 1; i >= 0; i--) {
        const obs = state.obstacles[i];
        obs.y += obs.speedY * dt;
        obs.x += obs.speedX * dt;

        // Bounce horizontally
        if (obs.x < 10 || obs.x + obs.width > 630) {
          obs.speedX *= -1;
        }

        // Check AABB collision with player
        const hit =
          player.x < obs.x + obs.width &&
          player.x + player.width > obs.x &&
          player.y < obs.y + obs.height &&
          player.y + player.height > obs.y;

        if (hit) {
          if (player.shield) {
            // Shield absorbed hit
            player.shield = false;
            setHasShield(false);
            spawnParticles(player.x + player.width / 2, player.y + player.height / 2, '#A855F7', 24);
            playSound('hit');
            state.obstacles.splice(i, 1);
            continue;
          } else {
            // Game Over!
            spawnParticles(player.x + player.width / 2, player.y + player.height / 2, '#EF4444', 36);
            playSound('gameOver');
            setGameOver(true);
            setIsPlaying(false);
            if (state.score > highScore) {
              setHighScore(state.score);
              try {
                localStorage.setItem('cyber_reflex_high_score', state.score.toString());
              } catch {
                // ignore
              }
            }
            return;
          }
        }

        if (obs.y > 520) {
          state.obstacles.splice(i, 1);
        }
      }

      // 7. Update Particles
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.025;
        if (p.alpha <= 0) {
          state.particles.splice(i, 1);
        }
      }

      // ================== RENDER FRAME ==================
      ctx.clearRect(0, 0, 640, 480);

      // Background Cyber Grid
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, 640, 480);

      // Grid lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      const gridOffset = (now * 0.05) % 40;
      for (let x = 0; x < 640; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 480);
        ctx.stroke();
      }
      for (let y = gridOffset; y < 480; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(640, y);
        ctx.stroke();
      }

      // Render Gems
      state.gems.forEach((gem) => {
        ctx.save();
        ctx.shadowColor = gem.color;
        ctx.shadowBlur = 12;
        ctx.fillStyle = gem.color;
        ctx.beginPath();
        if (gem.type === 'diamond') {
          // Diamond polygon
          ctx.moveTo(gem.x, gem.y - gem.radius);
          ctx.lineTo(gem.x + gem.radius, gem.y);
          ctx.lineTo(gem.x, gem.y + gem.radius);
          ctx.lineTo(gem.x - gem.radius, gem.y);
          ctx.closePath();
        } else {
          ctx.arc(gem.x, gem.y, gem.radius, 0, Math.PI * 2);
        }
        ctx.fill();

        // Inner shine
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(gem.x - 2, gem.y - 2, gem.radius * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Render Obstacles (Red cyber spikes / hazard cubes)
      state.obstacles.forEach((obs) => {
        ctx.save();
        ctx.shadowColor = '#EF4444';
        ctx.shadowBlur = 14;
        ctx.fillStyle = '#EF4444';
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

        // Core accent
        ctx.fillStyle = '#FCA5A5';
        ctx.fillRect(obs.x + 4, obs.y + 4, obs.width - 8, obs.height - 8);
        ctx.restore();
      });

      // Render Particles
      state.particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Render Player Ship
      ctx.save();
      const px = player.x;
      const py = player.y;
      const pw = player.width;
      const ph = player.height;

      // Shield Aura
      if (player.shield) {
        ctx.strokeStyle = '#C084FC';
        ctx.shadowColor = '#C084FC';
        ctx.shadowBlur = 18;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(px + pw / 2, py + ph / 2, pw * 0.8, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Ship body (Sleek cyber arrow/jet)
      ctx.shadowColor = '#38BDF8';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#2563EB';
      ctx.beginPath();
      ctx.moveTo(px + pw / 2, py);
      ctx.lineTo(px + pw, py + ph);
      ctx.lineTo(px + pw / 2, py + ph * 0.75);
      ctx.lineTo(px, py + ph);
      ctx.closePath();
      ctx.fill();

      // Cockpit Glow
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(px + pw / 2, py + ph * 0.45, 4, 0, Math.PI * 2);
      ctx.fill();

      // Thruster flame particle
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.moveTo(px + pw * 0.35, py + ph * 0.75);
      ctx.lineTo(px + pw * 0.65, py + ph * 0.75);
      ctx.lineTo(px + pw / 2, py + ph + Math.random() * 8);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      state.animFrameId = requestAnimationFrame(loop);
    };

    gameStateRef.current.animFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(gameStateRef.current.animFrameId);
    };
  }, [isPlaying, isPaused, gameOver, difficulty, highScore, playSound]);

  // Touch control helper
  const handleTouchMove = (direction: 'left' | 'right' | 'stop') => {
    if (direction === 'left') {
      gameStateRef.current.keys.left = true;
      gameStateRef.current.keys.right = false;
    } else if (direction === 'right') {
      gameStateRef.current.keys.right = true;
      gameStateRef.current.keys.left = false;
    } else {
      gameStateRef.current.keys.left = false;
      gameStateRef.current.keys.right = false;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white font-sans select-none overflow-hidden rounded-xl border border-slate-800 shadow-2xl">
      {/* Top Game Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-sm tracking-wide text-sky-400">
            <Zap className="w-4 h-4 text-sky-400 animate-pulse" />
            <span>CYBER REFLEX</span>
          </div>
          <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-800/50 font-mono">
            v1.4 ENGINE
          </span>
        </div>

        {/* Live HUD Stats */}
        <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-mono">
          <div className="flex items-center gap-1.5 text-amber-400">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400 hidden sm:inline">BEST:</span>
            <span className="font-bold">{highScore}</span>
          </div>

          <div className="flex items-center gap-1.5 text-sky-300">
            <span className="text-slate-400 hidden sm:inline">SCORE:</span>
            <span className="font-bold text-base text-white">{score}</span>
          </div>

          {combo > 1 && (
            <div className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 animate-bounce">
              <Flame className="w-3.5 h-3.5" />
              <span>{combo}X COMBO</span>
            </div>
          )}

          {hasShield && (
            <div className="flex items-center gap-1 text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/60">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline text-xs">SHIELD ACTIVE</span>
            </div>
          )}
        </div>

        {/* Audio & Control Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            aria-label={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {isPlaying && !gameOver && (
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title={isPaused ? 'Resume Game' : 'Pause Game'}
              aria-label={isPaused ? 'Resume Game' : 'Pause Game'}
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
            </button>
          )}
        </div>
      </div>

      {/* Main Canvas Container */}
      <div className="relative flex-1 flex items-center justify-center bg-slate-950 p-2 sm:p-4">
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="w-full max-w-[640px] max-h-[460px] aspect-[4/3] bg-slate-900 rounded-lg shadow-inner border border-slate-800/80 object-contain"
        />

        {/* Start / Pause / GameOver Overlays */}
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center mb-4 text-sky-400 shadow-lg shadow-blue-500/20">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
              CYBER REFLEX
            </h3>
            <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
              Dodge red laser hazards and collect energy gems. Chain consecutive gems to build an 8x multiplier streak!
            </p>

            {/* Difficulty Selector */}
            <div className="flex items-center gap-2 mb-6 p-1 bg-slate-900 border border-slate-800 rounded-lg">
              {(['normal', 'arcade', 'hyper'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setDifficulty(lvl)}
                  className={`px-3 py-1 text-xs uppercase font-mono font-semibold rounded-md transition-all ${
                    difficulty === lvl
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <button
              onClick={startGame}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer text-sm"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>START PLAYING</span>
            </button>

            <div className="mt-6 flex items-center gap-4 text-xs font-mono text-slate-500">
              <span>KEYS: ← → / A D to Steer</span>
              <span>•</span>
              <span>TOUCH: On-screen buttons</span>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center mb-3 text-red-400 shadow-lg shadow-red-500/20">
              <Flame className="w-7 h-7" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
              GAME OVER
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mb-5">
              Shield collapsed! Excellent reaction time run.
            </p>

            {/* Score Summary Card */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-xs p-4 bg-slate-900/90 border border-slate-800 rounded-xl mb-6">
              <div className="text-center">
                <div className="text-xs font-mono text-slate-400 mb-1">FINAL SCORE</div>
                <div className="text-2xl font-black text-sky-400 font-mono">{score}</div>
              </div>
              <div className="text-center border-l border-slate-800">
                <div className="text-xs font-mono text-slate-400 mb-1">BEST RECORD</div>
                <div className="text-2xl font-black text-amber-400 font-mono">{highScore}</div>
              </div>
            </div>

            <button
              onClick={startGame}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>PLAY AGAIN</span>
            </button>
          </div>
        )}

        {isPaused && isPlaying && !gameOver && (
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
            <h3 className="text-xl font-bold text-white mb-3">GAME PAUSED</h3>
            <button
              onClick={() => setIsPaused(false)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>RESUME</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Controls Bar (Touch / Mobile Friendly Controls) */}
      <div className="px-4 py-3 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block mr-1" />
          <span>Canvas 60FPS</span>
          <span className="hidden sm:inline">• Web Audio Engine</span>
        </div>

        {/* On-screen touch buttons for mobile testing */}
        <div className="flex items-center gap-2">
          <button
            onMouseDown={() => handleTouchMove('left')}
            onMouseUp={() => handleTouchMove('stop')}
            onTouchStart={() => handleTouchMove('left')}
            onTouchEnd={() => handleTouchMove('stop')}
            className="flex items-center justify-center w-11 h-9 bg-slate-800 active:bg-blue-600 text-slate-200 rounded-lg border border-slate-700 transition-colors"
            title="Steer Left"
            aria-label="Steer Left"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onMouseDown={() => handleTouchMove('right')}
            onMouseUp={() => handleTouchMove('stop')}
            onTouchStart={() => handleTouchMove('right')}
            onTouchEnd={() => handleTouchMove('stop')}
            className="flex items-center justify-center w-11 h-9 bg-slate-800 active:bg-blue-600 text-slate-200 rounded-lg border border-slate-700 transition-colors"
            title="Steer Right"
            aria-label="Steer Right"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
