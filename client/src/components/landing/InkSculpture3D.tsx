import React, { useEffect, useRef, useState, useCallback } from 'react';

interface InkSculpture3DProps {
  className?: string;
  initialSeed?: number;
  height?: string;
  spin?: number;
  interactive?: boolean;
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

// Deterministic fast pseudo-random generator
function createRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 1831565813) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function cubicEase(t: number): number {
  const c = clamp(t, 0, 1);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
}

function hexToRgb(hex: string): [number, number, number] {
  let c = hex.replace('#', '').trim();
  if (c.length === 3) {
    c = c.split('').map((x) => x + x).join('');
  }
  if (!/^[0-9a-f]{6}$/i.test(c)) return [0, 0, 0];
  const num = parseInt(c, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function lerpColor(c1: string, c2: string, t: number): string {
  const rgb1 = hexToRgb(c1);
  const rgb2 = hexToRgb(c2);
  const k = clamp(t, 0, 1);
  const r = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * k);
  const g = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * k);
  const b = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * k);
  return `rgb(${r},${g},${b})`;
}

function lerpColorAlpha(c1: string, c2: string, t: number, a: number): string {
  return lerpColor(c1, c2, t).replace('rgb(', 'rgba(').replace(')', `,${a})`);
}

function nextSeed(seed: number): number {
  const c = Math.abs(Math.floor(seed)) || 1;
  const h = ((c * 48271 + 11) % 2147483647) % 100000;
  return h === c ? (h + 7919) % 100000 : h;
}

function formatHeading(radians: number): number {
  return ((Math.round((radians * 180) / Math.PI) % 360) + 360) % 360;
}

const CORE_POINTS = 2800;
const GRAIN_POINTS = 14000;
const SPIKES_COUNT = 16;
const GLASS_RADIUS_RATIO = 0.3;

interface GeometryData {
  core: Float32Array;
  grain: Float32Array;
  spikes: Float32Array;
}

function generateSculpture(seed: number): GeometryData {
  const rng = createRng(seed * 2654435761 + 1);

  const randomDir = (): [number, number, number] => {
    const z = rng() * 2 - 1;
    const phi = rng() * Math.PI * 2;
    const r = Math.sqrt(1 - z * z);
    return [r * Math.cos(phi), r * Math.sin(phi), z];
  };

  const cross = (a: number[], b: number[]): [number, number, number] => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];

  const normalize = (v: number[]): [number, number, number] => {
    const len = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / len, v[1] / len, v[2] / len];
  };

  const ribbonPaths: number[][] = [];
  const numRibbons = 3 + Math.floor(rng() * 2);
  const baseThickness = 0.092;

  for (let r = 0; r < numRibbons; r++) {
    const normal = randomDir();
    const tangent = normalize(
      cross(normal, Math.abs(normal[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0])
    );
    const bitangent = cross(normal, tangent);
    const phases = Array.from({ length: 8 }, () => rng() * Math.PI * 2);
    const radius = 0.9 + rng() * 0.16;
    const path: number[] = [];
    const segments = 220;

    for (let k = 0; k <= segments; k++) {
      const theta = (k / segments) * Math.PI * 2;
      const rad =
        radius *
        (1 +
          0.15 * Math.sin(2 * theta + phases[0]) +
          0.07 * Math.sin(3 * theta + phases[1]) +
          0.04 * Math.sin(5 * theta + phases[2]));
      const altitude =
        radius *
        (0.24 * Math.sin(2 * theta + phases[3]) +
          0.08 * Math.sin(3 * theta + phases[4]));
      const x = Math.cos(theta) * rad;
      const y = Math.sin(theta) * rad;
      const thick =
        baseThickness *
        (0.3 + 0.7 * Math.pow(0.5 + 0.5 * Math.sin(3 * theta + phases[5]), 1.5)) *
        (0.72 + 0.28 * Math.sin(7 * theta + phases[6]));

      path.push(
        tangent[0] * x + bitangent[0] * y + normal[0] * altitude,
        tangent[1] * x + bitangent[1] * y + normal[1] * altitude,
        tangent[2] * x + bitangent[2] * y + normal[2] * altitude,
        Math.max(0.018, thick)
      );
    }
    ribbonPaths.push(path);
  }

  // Cross-connecting bezier arcs
  for (let b = 0; b < 3; b++) {
    const pathA = ribbonPaths[Math.floor(rng() * numRibbons)];
    const pathB = ribbonPaths[Math.floor(rng() * numRibbons)];
    const idxA = Math.floor(rng() * (pathA.length / 4)) * 4;
    const idxB = Math.floor(rng() * (pathB.length / 4)) * 4;
    const ptA = [pathA[idxA], pathA[idxA + 1], pathA[idxA + 2]];
    const ptB = [pathB[idxB], pathB[idxB + 1], pathB[idxB + 2]];
    const mid = normalize([(ptA[0] + ptB[0]) / 2, (ptA[1] + ptB[1]) / 2, (ptA[2] + ptB[2]) / 2]);
    const ctrlDist = 1.08 + rng() * 0.18;
    const ctrl = [mid[0] * ctrlDist, mid[1] * ctrlDist, mid[2] * ctrlDist];

    const arc: number[] = [];
    for (let s = 0; s <= 40; s++) {
      const t = s / 40;
      const inv = 1 - t;
      arc.push(
        inv * inv * ptA[0] + 2 * inv * t * ctrl[0] + t * t * ptB[0],
        inv * inv * ptA[1] + 2 * inv * t * ctrl[1] + t * t * ptB[1],
        inv * inv * ptA[2] + 2 * inv * t * ctrl[2] + t * t * ptB[2],
        baseThickness * (0.16 + 0.42 * Math.sin(Math.PI * t))
      );
    }
    ribbonPaths.push(arc);
  }

  // Compute cumulative length
  const segmentsList: { path: number[]; offset: number; len: number }[] = [];
  let totalLength = 0;
  for (const path of ribbonPaths) {
    for (let i = 0; i + 4 < path.length; i += 4) {
      const len = Math.hypot(
        path[i + 4] - path[i],
        path[i + 5] - path[i + 1],
        path[i + 6] - path[i + 2]
      );
      segmentsList.push({ path, offset: i, len });
      totalLength += len;
    }
  }

  const core = new Float32Array(CORE_POINTS * 4);
  const tangents = new Float32Array(CORE_POINTS * 3);
  let segIdx = 0;
  let accumulated = 0;

  for (let i = 0; i < CORE_POINTS; i++) {
    const targetDist = ((i + 0.5) / CORE_POINTS) * totalLength;
    while (
      segIdx < segmentsList.length - 1 &&
      accumulated + segmentsList[segIdx].len < targetDist
    ) {
      accumulated += segmentsList[segIdx++].len;
    }
    const { path, offset, len } = segmentsList[segIdx];
    const frac = len ? clamp((targetDist - accumulated) / len, 0, 1) : 0;
    for (let c = 0; c < 4; c++) {
      core[i * 4 + c] = path[offset + c] + (path[offset + 4 + c] - path[offset + c]) * frac;
    }
    tangents.set(
      normalize([
        path[offset + 4] - path[offset],
        path[offset + 5] - path[offset + 1],
        path[offset + 6] - path[offset + 2],
      ]),
      i * 3
    );
  }

  // Particle dust cloud
  const grain = new Float32Array(GRAIN_POINTS * 3);
  for (let i = 0; i < GRAIN_POINTS; i++) {
    const parentIdx = Math.floor(rng() * CORE_POINTS);
    const tan = [tangents[parentIdx * 3], tangents[parentIdx * 3 + 1], tangents[parentIdx * 3 + 2]];
    const rand = randomDir();
    const dot = rand[0] * tan[0] + rand[1] * tan[1] + rand[2] * tan[2];
    const ortho = normalize([rand[0] - dot * tan[0], rand[1] - dot * tan[1], rand[2] - dot * tan[2]]);
    const thickness = core[parentIdx * 4 + 3];
    const spread = rng() < 0.05
      ? thickness * (1.3 + rng() * 1.6)
      : thickness * (0.35 + 0.82 * Math.sqrt(rng()));

    for (let c = 0; c < 3; c++) {
      grain[i * 3 + c] = core[parentIdx * 4 + c] + ortho[c] * spread;
    }
  }

  // Spikes
  const spikes = new Float32Array(SPIKES_COUNT * 6);
  for (let i = 0; i < SPIKES_COUNT; i++) {
    const parentIdx = Math.floor(rng() * CORE_POINTS);
    const pt = [core[parentIdx * 4], core[parentIdx * 4 + 1], core[parentIdx * 4 + 2]];
    const rand = randomDir();
    const dir = normalize([pt[0] + rand[0] * 0.45, pt[1] + rand[1] * 0.45, pt[2] + rand[2] * 0.45]);
    const length = 0.18 + rng() * 0.42;
    spikes.set(
      [pt[0], pt[1], pt[2], pt[0] + dir[0] * length, pt[1] + dir[1] * length, pt[2] + dir[2] * length],
      i * 6
    );
  }

  return { core, grain, spikes };
}

// 3D Perspective projection
function project3D(
  x: number,
  y: number,
  z: number,
  yaw: number,
  pitch: number,
  focal: number
): [number, number, number, number] {
  const cosY = Math.cos(yaw);
  const sinY = Math.sin(yaw);
  const x1 = x * cosY + z * sinY;
  const z1 = -x * sinY + z * cosY;

  const cosP = Math.cos(pitch);
  const sinP = Math.sin(pitch);
  const y2 = y * cosP - z1 * sinP;
  const z2 = y * sinP + z1 * cosP;

  const scale = focal / (focal - z2);
  return [x1 * scale, y2 * scale, z2, scale];
}

export const InkSculpture3D: React.FC<InkSculpture3DProps> = ({
  className = '',
  initialSeed = 4211,
  height = '100%',
  spin = 0.18,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const headingRef = useRef<HTMLSpanElement | null>(null);
  const [seed, setSeed] = useState(initialSeed);

  const colors = {
    ink: '#EEEEEE',
    bg: '#0E0E0E',
    faint: '#444444',
  };

  const state = useRef({
    yaw: 0.6,
    pitch: 0.18,
    vyaw: 0,
    vpitch: 0,
    leanYaw: 0,
    leanPitch: 0,
    tLeanYaw: 0,
    tLeanPitch: 0,
    drag: false,
    lastX: 0,
    lastY: 0,
    downX: 0,
    downY: 0,
    lastT: 0,
    from: null as GeometryData | null,
    to: null as GeometryData | null,
    morphT: 1,
    ring: 0,
    dirty: true,
    visible: true,
    heading: -1,
  });

  const reforge = useCallback(() => {
    const n = nextSeed(seed);
    setSeed(n);
  }, [seed]);

  useEffect(() => {
    const geo = generateSculpture(seed);
    const s = state.current;
    if (s.to) {
      s.from = s.to;
      s.morphT = 0;
      s.ring = 1;
    }
    s.to = geo;
    s.dirty = true;
  }, [seed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Buffer canvas for glass refraction
    const glassBuffer = document.createElement('canvas');
    const glassCtx = glassBuffer.getContext('2d');

    const s = state.current;
    let width = 0;
    let heightPx = 0;
    let dpr = 1;

    const resize = () => {
      dpr = clamp(window.devicePixelRatio || 1, 1, 2);
      width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      heightPx = Math.max(1, Math.round(canvas.clientHeight * dpr));
      canvas.width = width;
      canvas.height = heightPx;
      s.dirty = true;
    };
    resize();

    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null;
    ro?.observe(canvas);

    const DEPTH_LAYERS = 7;
    const projX = new Float32Array(CORE_POINTS + GRAIN_POINTS);
    const projY = new Float32Array(CORE_POINTS + GRAIN_POINTS);
    const projThick = new Float32Array(CORE_POINTS);
    const depthLayer = new Uint8Array(CORE_POINTS + GRAIN_POINTS);

    let animId = 0;

    const render = (time: number) => {
      animId = requestAnimationFrame(render);
      const dt = s.lastT ? Math.min(0.05, (time - s.lastT) / 1000) : 0.016;
      s.lastT = time;

      const targetGeo = s.to;
      if (!s.visible || !targetGeo) return;

      if (!s.drag) {
        s.vyaw += (spin - s.vyaw) * Math.min(1, dt * 1.6);
        s.yaw += s.vyaw * dt;
        s.pitch += s.vpitch * dt;
        s.vpitch *= Math.pow(0.04, dt);
        s.pitch += (0.18 - s.pitch) * Math.min(1, dt * 0.9);
      }

      s.pitch = clamp(s.pitch, -0.95, 1.25);
      s.leanYaw += (s.tLeanYaw - s.leanYaw) * Math.min(1, dt * 3);
      s.leanPitch += (s.tLeanPitch - s.leanPitch) * Math.min(1, dt * 3);

      if (s.morphT < 1) s.morphT = Math.min(1, s.morphT + dt / 1.2);
      if (s.ring > 0) s.ring = Math.max(0, s.ring - dt / 1.1);

      const effectiveYaw = s.yaw + s.leanYaw;
      const effectivePitch = s.pitch + s.leanPitch;
      const curHeading = formatHeading(effectiveYaw);

      if (curHeading !== s.heading && headingRef.current) {
        s.heading = curHeading;
        headingRef.current.textContent = `N ${String(curHeading).padStart(3, '0')}°`;
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, width, heightPx);

      const cx = width / 2;
      const cy = heightPx / 2;
      const scaleRadius = Math.min(width, heightPx) * 0.35;
      const focal = 3.4;
      const morphProgress = cubicEase(s.morphT);
      const fromGeo = s.from;

      const interpolate = (arrTarget: Float32Array, arrFrom: Float32Array | undefined, idx: number) =>
        arrFrom && morphProgress < 1
          ? arrFrom[idx] + (arrTarget[idx] - arrFrom[idx]) * morphProgress
          : arrTarget[idx];

      // Subtle background grid crosshairs
      const crossSize = scaleRadius * 1.35;
      const gradH = ctx.createLinearGradient(cx - crossSize, cy, cx + crossSize, cy);
      gradH.addColorStop(0, lerpColor(colors.ink, colors.bg, 1));
      gradH.addColorStop(0.5, lerpColor(colors.ink, colors.bg, 0.45));
      gradH.addColorStop(1, lerpColor(colors.ink, colors.bg, 1));

      ctx.lineWidth = Math.max(1, dpr);
      ctx.strokeStyle = gradH;
      ctx.beginPath();
      ctx.moveTo(cx - crossSize, cy);
      ctx.lineTo(cx + crossSize, cy);
      ctx.stroke();

      const gradV = ctx.createLinearGradient(cx, cy - crossSize, cx, cy + crossSize);
      gradV.addColorStop(0, lerpColor(colors.ink, colors.bg, 1));
      gradV.addColorStop(0.5, lerpColor(colors.ink, colors.bg, 0.45));
      gradV.addColorStop(1, lerpColor(colors.ink, colors.bg, 1));

      ctx.strokeStyle = gradV;
      ctx.beginPath();
      ctx.moveTo(cx, cy - crossSize);
      ctx.lineTo(cx, cy + crossSize);
      ctx.stroke();

      // Expanding Shockwave ring upon reforge
      if (s.ring > 0) {
        const ringProgress = 1 - s.ring;
        ctx.strokeStyle = lerpColorAlpha(colors.ink, colors.bg, 0.2 + 0.7 * ringProgress, s.ring * 0.8);
        ctx.lineWidth = Math.max(1, dpr * (1 + 2 * s.ring));
        ctx.beginPath();
        ctx.arc(cx, cy, scaleRadius * (0.32 + ringProgress * 1.25), 0, Math.PI * 2);
        ctx.stroke();
      }

      // Project core ribbons
      for (let i = 0; i < CORE_POINTS; i++) {
        const [px, py, pz, pScale] = project3D(
          interpolate(targetGeo.core, fromGeo?.core, i * 4),
          interpolate(targetGeo.core, fromGeo?.core, i * 4 + 1),
          interpolate(targetGeo.core, fromGeo?.core, i * 4 + 2),
          effectiveYaw,
          effectivePitch,
          focal
        );
        projX[i] = cx + px * scaleRadius;
        projY[i] = cy + py * scaleRadius;
        projThick[i] = interpolate(targetGeo.core, fromGeo?.core, i * 4 + 3) * scaleRadius * pScale * 0.78;
        depthLayer[i] = clamp(Math.floor(((pz + 1.25) / 2.5) * DEPTH_LAYERS), 0, DEPTH_LAYERS - 1);
      }

      // Project stippled grain particles
      for (let i = 0; i < GRAIN_POINTS; i++) {
        const offset = CORE_POINTS + i;
        const [px, py, pz] = project3D(
          interpolate(targetGeo.grain, fromGeo?.grain, i * 3),
          interpolate(targetGeo.grain, fromGeo?.grain, i * 3 + 1),
          interpolate(targetGeo.grain, fromGeo?.grain, i * 3 + 2),
          effectiveYaw,
          effectivePitch,
          focal
        );
        projX[offset] = cx + px * scaleRadius;
        projY[offset] = cy + py * scaleRadius;
        depthLayer[offset] = clamp(Math.floor(((pz + 1.25) / 2.5) * DEPTH_LAYERS), 0, DEPTH_LAYERS - 1);
      }

      const pointSize = Math.max(1, 1.15 * dpr);

      // Render layer function
      const renderLayer = (layer: number) => {
        const factor = 0.62 * (1 - layer / (DEPTH_LAYERS - 1));
        ctx.fillStyle = lerpColor(colors.ink, colors.bg, factor);
        ctx.beginPath();
        for (let i = 0; i < CORE_POINTS; i++) {
          if (depthLayer[i] === layer) {
            ctx.moveTo(projX[i] + projThick[i], projY[i]);
            ctx.arc(projX[i], projY[i], projThick[i], 0, Math.PI * 2);
          }
        }
        ctx.fill();

        ctx.fillStyle = lerpColor(colors.ink, colors.bg, Math.min(0.85, factor + 0.12));
        for (let i = CORE_POINTS; i < CORE_POINTS + GRAIN_POINTS; i++) {
          if (depthLayer[i] === layer) {
            ctx.fillRect(projX[i], projY[i], pointSize, pointSize);
          }
        }
      };

      // Spikes helper
      const renderSpikes = (front: boolean) => {
        ctx.lineWidth = Math.max(0.75, 0.8 * dpr);
        for (let i = 0; i < SPIKES_COUNT; i++) {
          const off = i * 6;
          const ptA = project3D(
            interpolate(targetGeo.spikes, fromGeo?.spikes, off),
            interpolate(targetGeo.spikes, fromGeo?.spikes, off + 1),
            interpolate(targetGeo.spikes, fromGeo?.spikes, off + 2),
            effectiveYaw,
            effectivePitch,
            focal
          );
          const ptB = project3D(
            interpolate(targetGeo.spikes, fromGeo?.spikes, off + 3),
            interpolate(targetGeo.spikes, fromGeo?.spikes, off + 4),
            interpolate(targetGeo.spikes, fromGeo?.spikes, off + 5),
            effectiveYaw,
            effectivePitch,
            focal
          );
          if ((ptA[2] >= 0) !== front) continue;

          const spikeGrad = ctx.createLinearGradient(
            cx + ptA[0] * scaleRadius,
            cy + ptA[1] * scaleRadius,
            cx + ptB[0] * scaleRadius,
            cy + ptB[1] * scaleRadius
          );
          spikeGrad.addColorStop(0, lerpColor(colors.ink, colors.bg, front ? 0.1 : 0.5));
          spikeGrad.addColorStop(1, lerpColor(colors.ink, colors.bg, 1));
          ctx.strokeStyle = spikeGrad;
          ctx.beginPath();
          ctx.moveTo(cx + ptA[0] * scaleRadius, cy + ptA[1] * scaleRadius);
          ctx.lineTo(cx + ptB[0] * scaleRadius, cy + ptB[1] * scaleRadius);
          ctx.stroke();
        }
      };

      // Render back spikes & back layers
      renderSpikes(false);
      const halfLayers = Math.floor(DEPTH_LAYERS / 2) + 1;
      for (let l = 0; l < halfLayers; l++) {
        renderLayer(l);
      }

      // Render Refraction Glass Orb in Center
      const glassRadius = GLASS_RADIUS_RATIO * scaleRadius;
      const bufferDim = glassRadius * 3.1;
      if (glassCtx) {
        const side = Math.max(1, Math.ceil(glassRadius * 2));
        if (glassBuffer.width !== side) {
          glassBuffer.width = side;
          glassBuffer.height = side;
        }
        glassCtx.setTransform(1, 0, 0, 1, 0, 0);
        glassCtx.fillStyle = colors.bg;
        glassCtx.fillRect(0, 0, side, side);
        glassCtx.drawImage(
          canvas,
          cx - bufferDim,
          cy - bufferDim,
          bufferDim * 2,
          bufferDim * 2,
          0,
          0,
          side,
          side
        );
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, glassRadius, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = colors.bg;
      ctx.fillRect(cx - glassRadius, cy - glassRadius, glassRadius * 2, glassRadius * 2);

      if (glassCtx) {
        ctx.translate(cx, cy);
        ctx.rotate(Math.PI + effectiveYaw * 0.15);
        ctx.globalAlpha = 0.85;
        ctx.drawImage(glassBuffer, -glassRadius, -glassRadius, glassRadius * 2, glassRadius * 2);
        ctx.globalAlpha = 1;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }

      // Radial specular highlight & shadows
      const radialGrad = ctx.createRadialGradient(
        cx - glassRadius * 0.25,
        cy - glassRadius * 0.3,
        glassRadius * 0.1,
        cx,
        cy,
        glassRadius
      );
      radialGrad.addColorStop(0, 'rgba(255,255,255,0.55)');
      radialGrad.addColorStop(0.55, 'rgba(255,255,255,0.12)');
      radialGrad.addColorStop(0.86, lerpColorAlpha(colors.ink, colors.bg, 0.82, 0.25));
      radialGrad.addColorStop(1, lerpColorAlpha(colors.ink, colors.bg, 0.3, 0.7));
      ctx.fillStyle = radialGrad;
      ctx.fillRect(cx - glassRadius, cy - glassRadius, glassRadius * 2, glassRadius * 2);

      const specularSpot = ctx.createRadialGradient(
        cx - glassRadius * 0.38,
        cy - glassRadius * 0.42,
        0,
        cx - glassRadius * 0.38,
        cy - glassRadius * 0.42,
        glassRadius * 0.42
      );
      specularSpot.addColorStop(0, 'rgba(255,255,255,0.9)');
      specularSpot.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = specularSpot;
      ctx.fillRect(cx - glassRadius, cy - glassRadius, glassRadius * 2, glassRadius * 2);
      ctx.restore();

      ctx.strokeStyle = lerpColor(colors.ink, colors.bg, 0.45);
      ctx.lineWidth = Math.max(1, dpr);
      ctx.beginPath();
      ctx.arc(cx, cy, glassRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Render front layers & front spikes
      for (let l = halfLayers; l < DEPTH_LAYERS; l++) {
        renderLayer(l);
      }
      renderSpikes(true);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      ro?.disconnect();
    };
  }, [spin]);

  // Pointer interactions
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    const s = state.current;
    s.drag = true;
    s.lastX = s.downX = e.clientX;
    s.lastY = s.downY = e.clientY;
    s.vyaw = 0;
    s.vpitch = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    const s = state.current;
    if (s.drag) {
      const dx = e.clientX - s.lastX;
      const dy = e.clientY - s.lastY;
      s.lastX = e.clientX;
      s.lastY = e.clientY;
      s.yaw += dx * 0.01;
      s.pitch += dy * 0.008;
      s.vyaw = dx * 0.6;
      s.vpitch = dy * 0.45;
    } else if (e.pointerType === 'mouse') {
      const rect = e.currentTarget.getBoundingClientRect();
      s.tLeanYaw = ((e.clientX - rect.left) / rect.width - 0.5) * 0.5;
      s.tLeanPitch = ((e.clientY - rect.top) / rect.height - 0.5) * 0.5;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = state.current;
    if (s.drag) {
      s.drag = false;
      s.vyaw = clamp(s.vyaw, -6, 6);
      s.vpitch = clamp(s.vpitch, -3, 3);
      if (Math.hypot(e.clientX - s.downX, e.clientY - s.downY) < 4) {
        reforge();
      }
    }
  };

  const handlePointerLeave = () => {
    state.current.tLeanYaw = 0;
    state.current.tLeanPitch = 0;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    const s = state.current;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      s.vyaw = e.key === 'ArrowLeft' ? -2.4 : 2.4;
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      s.vpitch = e.key === 'ArrowUp' ? -1.6 : 1.6;
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      reforge();
    }
  };

  return (
    <div
      className={`relative w-full overflow-hidden select-none nf-frame border border-[#262626] bg-[#121212] ${className}`}
      style={{ height }}
    >
      {/* Corner bracket markers */}
      <span className="nf-c nf-c-tl" />
      <span className="nf-c nf-c-tr" />
      <span className="nf-c nf-c-bl" />
      <span className="nf-c nf-c-br" />

      {/* Top Telemetry HUD */}
      <div className="absolute top-3 left-4 right-4 z-10 flex justify-between items-center font-mono text-[11px] text-[#71717A] tracking-wider pointer-events-none tabular-nums">
        <span ref={headingRef} className="text-[#A1A1AA]">
          N 000°
        </span>
        <span className="border border-[#262626] px-2 py-0.5 rounded text-[10px] bg-[#181818]/60 backdrop-blur-sm text-[#E4E4E7]">
          FORGE · 3D
        </span>
      </div>

      {/* Main 3D Canvas */}
      <canvas
        ref={canvasRef}
        role="img"
        tabIndex={interactive ? 0 : -1}
        aria-label="Interactive 3D Generative Ink Sculpture. Drag to rotate, click to reforge."
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onKeyDown={handleKeyDown}
        className="w-full h-full block cursor-grab active:cursor-grabbing outline-none"
      />

      {/* Bottom Telemetry HUD */}
      <div className="absolute bottom-3 left-4 right-4 z-10 flex justify-between items-center font-mono text-[11px] text-[#71717A] tracking-wider pointer-events-none tabular-nums">
        <span className="text-[#A1A1AA] text-[10px]">
          Drag to rotate · Click to reforge
        </span>
        <span className="text-[#A1A1AA] text-[10px] bg-[#181818]/60 px-2 py-0.5 rounded border border-[#262626]">
          seed {String(seed).padStart(5, '0')}
        </span>
      </div>
    </div>
  );
};
