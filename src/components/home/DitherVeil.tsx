import React, { useRef, useEffect, useState, useCallback } from 'react';

export interface DitherVeilProps {
  src: string;
  pattern?: 'floyd' | 'bayer' | 'noise' | 'atkinson' | 'lines';
  pixelSize?: number;
  inkColor?: string;
  paperColor?: string;
  revealRadius?: number;
  softness?: number;
  linger?: number;
  fit?: 'contain' | 'cover' | 'fill';
  rimColor?: string;
  palette?: 'duotone' | 'rgb' | 'indexed';
  levels?: number;
  contrast?: number;
  brightness?: number;
  rim?: number;
  reverse?: boolean;
  wander?: boolean;
  clickBurst?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

function hexToRgb(hex: string): [number, number, number] {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return [0, 0, 0];
  return [
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255,
  ];
}

const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = (a_position + 1.0) * 0.5;
  v_uv.y = 1.0 - v_uv.y; // flip Y for texture orientation
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;
varying vec2 v_uv;

uniform sampler2D u_image;
uniform sampler2D u_trail;
uniform vec2 u_resolution;
uniform vec2 u_imageRes;
uniform int u_fit; // 0: contain, 1: cover, 2: fill
uniform float u_pixelSize;
uniform vec3 u_inkColor;
uniform vec3 u_paperColor;
uniform vec3 u_rimColor;
uniform int u_palette; // 0: duotone, 1: rgb
uniform float u_levels;
uniform float u_contrast;
uniform float u_brightness;
uniform float u_rim;
uniform float u_reverse;
uniform int u_pattern; // 0: floyd, 1: bayer, 2: noise

float bayer8x8(vec2 uv) {
  vec2 p = floor(mod(uv, 8.0));
  float x = p.x;
  float y = p.y;
  vec2 p4 = floor(mod(p, 4.0));
  float v = 0.0;
  if (p4.y < 1.0) {
    if (p4.x < 1.0) v = 0.0;
    else if (p4.x < 2.0) v = 8.0;
    else if (p4.x < 3.0) v = 2.0;
    else v = 10.0;
  } else if (p4.y < 2.0) {
    if (p4.x < 1.0) v = 12.0;
    else if (p4.x < 2.0) v = 4.0;
    else if (p4.x < 3.0) v = 14.0;
    else v = 6.0;
  } else if (p4.y < 3.0) {
    if (p4.x < 1.0) v = 3.0;
    else if (p4.x < 2.0) v = 11.0;
    else if (p4.x < 3.0) v = 1.0;
    else v = 9.0;
  } else {
    if (p4.x < 1.0) v = 15.0;
    else if (p4.x < 2.0) v = 7.0;
    else if (p4.x < 3.0) v = 13.0;
    else v = 5.0;
  }
  float offset = 0.0;
  if (y >= 4.0 && x < 4.0) offset = 3.0;
  else if (y < 4.0 && x >= 4.0) offset = 2.0;
  else if (y >= 4.0 && x >= 4.0) offset = 1.0;
  return (v * 4.0 + offset) / 64.0;
}

float getDitherThreshold(vec2 coord) {
  if (u_pattern == 1) {
    return bayer8x8(coord);
  } else if (u_pattern == 2) {
    return fract(sin(dot(coord, vec2(12.9898, 78.233))) * 43758.5453);
  } else {
    // Floyd-Steinberg error diffusion hybrid
    float b = bayer8x8(coord);
    float n = fract(sin(dot(coord, vec2(12.9898, 78.233))) * 43758.5453);
    return mix(b, n, 0.4);
  }
}

vec2 computeAspectUV(vec2 uv) {
  if (u_fit == 2) return uv; // fill
  float canvasAspect = u_resolution.x / u_resolution.y;
  float imageAspect = u_imageRes.x / u_imageRes.y;
  vec2 aspectUV = uv;
  if (u_fit == 0) {
    // contain
    if (canvasAspect > imageAspect) {
      float scale = imageAspect / canvasAspect;
      aspectUV.x = (uv.x - 0.5) / scale + 0.5;
    } else {
      float scale = canvasAspect / imageAspect;
      aspectUV.y = (uv.y - 0.5) / scale + 0.5;
    }
  } else {
    // cover
    if (canvasAspect > imageAspect) {
      float scale = canvasAspect / imageAspect;
      aspectUV.y = (uv.y - 0.5) / scale + 0.5;
    } else {
      float scale = imageAspect / canvasAspect;
      aspectUV.x = (uv.x - 0.5) / scale + 0.5;
    }
  }
  return aspectUV;
}

void main() {
  vec2 uv = v_uv;
  vec2 aspectUV = computeAspectUV(uv);

  // Bounds check for contain mode
  if (u_fit == 0 && (aspectUV.x < 0.0 || aspectUV.x > 1.0 || aspectUV.y < 0.0 || aspectUV.y > 1.0)) {
    gl_FragColor = vec4(u_paperColor, 1.0);
    return;
  }

  // Pixelate coordinates for dither
  vec2 pixelCount = max(u_resolution / max(u_pixelSize, 1.0), vec2(1.0));
  vec2 pixelatedAspectUV = computeAspectUV(floor(uv * pixelCount) / pixelCount);

  vec4 fullColor = texture2D(u_image, clamp(aspectUV, 0.0, 1.0));
  vec4 ditherSource = texture2D(u_image, clamp(pixelatedAspectUV, 0.0, 1.0));

  // Tonal adjustments
  vec3 adjusted = (ditherSource.rgb - 0.5) * u_contrast + 0.5 + u_brightness;
  adjusted = clamp(adjusted, 0.0, 1.0);

  vec2 screenPixel = floor(gl_FragCoord.xy / max(u_pixelSize, 1.0));
  float threshold = getDitherThreshold(screenPixel);

  vec3 ditheredColor;
  if (u_palette == 1) {
    // RGB
    vec3 steps = floor(adjusted * (u_levels - 1.0) + threshold) / max(u_levels - 1.0, 1.0);
    ditheredColor = clamp(steps, 0.0, 1.0);
  } else {
    // Duotone
    float luma = dot(adjusted, vec3(0.299, 0.587, 0.114));
    float stepLuma = floor(luma * (u_levels - 1.0) + threshold) / max(u_levels - 1.0, 1.0);
    ditheredColor = mix(u_inkColor, u_paperColor, clamp(stepLuma, 0.0, 1.0));
  }

  // Sample cursor reveal trail
  vec4 trailSample = texture2D(u_trail, uv);
  float reveal = trailSample.r;

  if (u_reverse > 0.5) {
    reveal = 1.0 - reveal;
  }

  reveal = clamp(reveal, 0.0, 1.0);

  // Base blend between dither and full color photo
  vec3 finalColor = mix(ditheredColor, fullColor.rgb, reveal);

  // Colored rim glow along the revealing boundary
  if (u_rim > 0.0) {
    float rimFactor = smoothstep(0.05, 0.35, reveal) * (1.0 - smoothstep(0.35, 0.85, reveal));
    finalColor = mix(finalColor, u_rimColor, clamp(rimFactor * u_rim, 0.0, 1.0));
  }

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

export const DitherVeil: React.FC<DitherVeilProps> = ({
  src,
  pattern = 'floyd',
  pixelSize = 2,
  inkColor = '#120f17',
  paperColor = '#f4f1ea',
  revealRadius = 200,
  softness = 0.6,
  linger = 1,
  fit = 'contain',
  rimColor = '#a78bfa',
  palette = 'duotone',
  levels = 2,
  contrast = 1.15,
  brightness = 0,
  rim = 0,
  reverse = false,
  wander = false,
  clickBurst = false,
  className = '',
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Burst ripples state
  const burstsRef = useRef<Array<{ x: number; y: number; startTime: number; maxRadius: number }>>([]);
  const mousePosRef = useRef<{ x: number; y: number; isInside: boolean; lastMove: number }>({
    x: -9999,
    y: -9999,
    isInside: false,
    lastMove: 0,
  });

  // Handle pointer interactions
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      isInside: true,
      lastMove: performance.now(),
    };
  }, []);

  const handlePointerLeave = useCallback(() => {
    mousePosRef.current.isInside = false;
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!clickBurst || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    burstsRef.current.push({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      startTime: performance.now(),
      maxRadius: revealRadius * 1.8,
    });
  }, [clickBurst, revealRadius]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, preserveDrawingBuffer: false });
    if (!gl) {
      console.warn('WebGL not supported for DitherVeil, falling back');
      setLoadError(true);
      return;
    }

    // Helper: compile shader
    function compileShader(type: number, source: string) {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl!.getShaderInfoLog(shader));
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // Quad geometry
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
      ]),
      gl.STATIC_DRAW
    );

    const aPosition = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uImageRes = gl.getUniformLocation(program, 'u_imageRes');
    const uFit = gl.getUniformLocation(program, 'u_fit');
    const uPixelSize = gl.getUniformLocation(program, 'u_pixelSize');
    const uInkColor = gl.getUniformLocation(program, 'u_inkColor');
    const uPaperColor = gl.getUniformLocation(program, 'u_paperColor');
    const uRimColor = gl.getUniformLocation(program, 'u_rimColor');
    const uPalette = gl.getUniformLocation(program, 'u_palette');
    const uLevels = gl.getUniformLocation(program, 'u_levels');
    const uContrast = gl.getUniformLocation(program, 'u_contrast');
    const uBrightness = gl.getUniformLocation(program, 'u_brightness');
    const uRim = gl.getUniformLocation(program, 'u_rim');
    const uReverse = gl.getUniformLocation(program, 'u_reverse');
    const uPattern = gl.getUniformLocation(program, 'u_pattern');
    const uImageLoc = gl.getUniformLocation(program, 'u_image');
    const uTrailLoc = gl.getUniformLocation(program, 'u_trail');

    // Create Image Texture
    const imageTexture = gl.createTexture();
    const trailTexture = gl.createTexture();

    // Prepare trail 2D canvas
    const trailCanvas = document.createElement('canvas');
    trailCanvas.width = 512;
    trailCanvas.height = 512;
    const trailCtx = trailCanvas.getContext('2d');
    trailCanvasRef.current = trailCanvas;

    if (trailCtx) {
      trailCtx.fillStyle = '#000000';
      trailCtx.fillRect(0, 0, 512, 512);
    }

    let isDisposed = false;
    let imageWidth = 1400;
    let imageHeight = 900;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;

    img.onload = () => {
      if (isDisposed || !gl) return;
      imageWidth = img.naturalWidth || 1400;
      imageHeight = img.naturalHeight || 900;

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, imageTexture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

      setIsLoaded(true);
      setLoadError(false);
    };

    img.onerror = () => {
      console.warn('DitherVeil image failed to load:', src);
      setLoadError(true);
    };

    // Animation frame loop
    let animId: number;
    let lastTime = performance.now();

    const render = (time: number) => {
      if (isDisposed || !gl || !canvas) return;
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Ensure canvas sizing matches client
      const width = canvas.clientWidth || 300;
      const height = canvas.clientHeight || 400;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const targetWidth = Math.floor(width * dpr);
      const targetHeight = Math.floor(height * dpr);

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        gl.viewport(0, 0, targetWidth, targetHeight);
      }

      // Update trail canvas
      if (trailCtx) {
        // Fade out previous reveals based on linger
        const decayAlpha = Math.min(dt / Math.max(linger, 0.05), 1.0);
        trailCtx.fillStyle = `rgba(0, 0, 0, ${decayAlpha})`;
        trailCtx.fillRect(0, 0, 512, 512);

        // Calculate cursor position in trail coordinates (512x512)
        const scaleX = 512 / width;
        const scaleY = 512 / height;

        let curX = mousePosRef.current.x * scaleX;
        let curY = mousePosRef.current.y * scaleY;

        // Auto-wander effect if pointer is inactive or away
        if (wander && (!mousePosRef.current.isInside || time - mousePosRef.current.lastMove > 2500)) {
          const t = time * 0.001;
          curX = 256 + Math.sin(t * 1.2) * 160;
          curY = 256 + Math.cos(t * 1.6) * 160;
        }

        // Draw cursor circle if valid
        if (mousePosRef.current.isInside || wander) {
          const trailRadius = revealRadius * (512 / Math.max(width, height));
          const innerRadius = Math.max(0, trailRadius * (1.0 - softness));
          const radGrad = trailCtx.createRadialGradient(curX, curY, innerRadius, curX, curY, trailRadius);
          radGrad.addColorStop(0, '#ffffff');
          radGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          trailCtx.fillStyle = radGrad;
          trailCtx.beginPath();
          trailCtx.arc(curX, curY, trailRadius, 0, Math.PI * 2);
          trailCtx.fill();
        }

        // Process clickBurst ripples
        if (burstsRef.current.length > 0) {
          const now = performance.now();
          burstsRef.current = burstsRef.current.filter((burst) => {
            const elapsed = (now - burst.startTime) / 800; // 800ms animation
            if (elapsed >= 1.0) return false;
            const bX = burst.x * scaleX;
            const bY = burst.y * scaleY;
            const currentRadius = burst.maxRadius * elapsed * (512 / Math.max(width, height));
            const ringThickness = 40 * (1.0 - elapsed);
            const opacity = 1.0 - elapsed;

            const burstGrad = trailCtx.createRadialGradient(
              bX, bY, Math.max(0, currentRadius - ringThickness),
              bX, bY, currentRadius + ringThickness
            );
            burstGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
            burstGrad.addColorStop(0.5, `rgba(255, 255, 255, ${opacity})`);
            burstGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

            trailCtx.fillStyle = burstGrad;
            trailCtx.beginPath();
            trailCtx.arc(bX, bY, currentRadius + ringThickness, 0, Math.PI * 2);
            trailCtx.fill();

            return true;
          });
        }

        // Upload trail texture
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, trailTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, trailCanvas);
      }

      // Set uniforms
      gl.uniform2f(uResolution, targetWidth, targetHeight);
      gl.uniform2f(uImageRes, imageWidth, imageHeight);
      gl.uniform1i(uFit, fit === 'cover' ? 1 : fit === 'fill' ? 2 : 0);
      gl.uniform1f(uPixelSize, Math.max(pixelSize * dpr, 1.0));

      const inkRgb = hexToRgb(inkColor);
      const paperRgb = hexToRgb(paperColor);
      const rimRgb = hexToRgb(rimColor);

      gl.uniform3f(uInkColor, inkRgb[0], inkRgb[1], inkRgb[2]);
      gl.uniform3f(uPaperColor, paperRgb[0], paperRgb[1], paperRgb[2]);
      gl.uniform3f(uRimColor, rimRgb[0], rimRgb[1], rimRgb[2]);

      gl.uniform1i(uPalette, palette === 'rgb' ? 1 : 0);
      gl.uniform1f(uLevels, Math.max(levels, 2.0));
      gl.uniform1f(uContrast, contrast);
      gl.uniform1f(uBrightness, brightness);
      gl.uniform1f(uRim, rim);
      gl.uniform1f(uReverse, reverse ? 1.0 : 0.0);

      const patId = pattern === 'bayer' ? 1 : pattern === 'noise' ? 2 : 0;
      gl.uniform1i(uPattern, patId);

      gl.uniform1i(uImageLoc, 0);
      gl.uniform1i(uTrailLoc, 1);

      // Draw quad
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animId);
      if (gl) {
        gl.deleteTexture(imageTexture);
        gl.deleteTexture(trailTexture);
        gl.deleteBuffer(positionBuffer);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      }
    };
  }, [
    src,
    pattern,
    pixelSize,
    inkColor,
    paperColor,
    revealRadius,
    softness,
    linger,
    fit,
    rimColor,
    palette,
    levels,
    contrast,
    brightness,
    rim,
    reverse,
    wander,
  ]);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      className={`relative w-full h-full overflow-hidden select-none cursor-crosshair ${className}`}
      style={style}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block object-contain pointer-events-none"
      />

      {/* Loading Skeleton */}
      {!isLoaded && !loadError && (
        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center text-slate-400">
          <div className="w-7 h-7 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error Fallback */}
      {loadError && (
        <img
          src={src}
          alt="Visual preview"
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};

export default DitherVeil;
