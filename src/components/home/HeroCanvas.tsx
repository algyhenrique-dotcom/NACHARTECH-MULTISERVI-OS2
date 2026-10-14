import React, { useEffect, useRef } from 'react';

interface HeroCanvasProps {
  activeBeat: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: string;
}

interface TracePulse {
  traceIndex: number;
  progress: number;
  speed: number;
  color: string;
  size: number;
}

export const HeroCanvas: React.FC<HeroCanvasProps> = ({ activeBeat }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let width = 0;
    let height = 0;
    let time = 0;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Handle high DPI resize
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Track mouse for subtle parallax
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = (e.clientX - rect.left) / rect.width;
      mouseRef.current.targetY = (e.clientY - rect.top) / rect.height;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Spark Particles
    const sparks: Particle[] = [];
    const createSpark = (originX: number, originY: number) => {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.4;
      const speed = 1.5 + Math.random() * 4.5;
      const colors = ['#00e5ff', '#38bdf8', '#67e8f9', '#ffffff', '#ff7a1a', '#fb923c'];
      sparks.push({
        x: originX + (Math.random() - 0.5) * 20,
        y: originY + (Math.random() - 0.5) * 10,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1 + Math.random() * 2.2,
        alpha: 1,
        life: 0,
        maxLife: 30 + Math.random() * 45,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    };

    // Cool Air Particles from AC
    const coolAir: Particle[] = [];
    const createCoolAir = (originX: number, originY: number) => {
      coolAir.push({
        x: originX + (Math.random() - 0.5) * 120,
        y: originY,
        vx: (Math.random() - 0.5) * 0.8,
        vy: 0.8 + Math.random() * 1.2,
        size: 15 + Math.random() * 25,
        alpha: 0.18,
        life: 0,
        maxLife: 60 + Math.random() * 50,
        color: 'rgba(95, 201, 189, ',
      });
    };

    // Circuit board trace lines (2D paths projected onto perspective floor)
    const traces = [
      // Left cluster (networking)
      { start: [0.15, 0.95], mid1: [0.25, 0.82], mid2: [0.35, 0.72], end: [0.46, 0.65], color: '#38bdf8' },
      { start: [0.08, 0.9], mid1: [0.2, 0.84], mid2: [0.3, 0.76], end: [0.42, 0.66], color: '#5fc9bd' },
      { start: [0.28, 0.98], mid1: [0.32, 0.88], mid2: [0.38, 0.78], end: [0.45, 0.68], color: '#ff7a1a' },
      // Center bus lines (CPU)
      { start: [0.42, 0.98], mid1: [0.44, 0.84], mid2: [0.47, 0.72], end: [0.5, 0.64], color: '#38bdf8' },
      { start: [0.5, 0.98], mid1: [0.5, 0.85], mid2: [0.5, 0.73], end: [0.5, 0.64], color: '#00e5ff' },
      { start: [0.58, 0.98], mid1: [0.56, 0.84], mid2: [0.53, 0.72], end: [0.5, 0.64], color: '#38bdf8' },
      // Right cluster (CCTV & power)
      { start: [0.72, 0.98], mid1: [0.68, 0.88], mid2: [0.62, 0.78], end: [0.55, 0.68], color: '#ff7a1a' },
      { start: [0.85, 0.92], mid1: [0.78, 0.84], mid2: [0.7, 0.76], end: [0.58, 0.66], color: '#38bdf8' },
      { start: [0.92, 0.96], mid1: [0.82, 0.85], mid2: [0.72, 0.74], end: [0.62, 0.67], color: '#5fc9bd' },
      // Cross branches
      { start: [0.25, 0.82], mid1: [0.25, 0.75], mid2: [0.22, 0.7], end: [0.2, 0.65], color: '#38bdf8' },
      { start: [0.78, 0.84], mid1: [0.82, 0.78], mid2: [0.85, 0.72], end: [0.88, 0.65], color: '#ff7a1a' },
    ];

    // Pulses running along traces
    const pulses: TracePulse[] = traces.map((_, i) => ({
      traceIndex: i,
      progress: Math.random(),
      speed: 0.003 + Math.random() * 0.005,
      color: traces[i].color,
      size: 3 + Math.random() * 2.5,
    }));

    // Interpolate a point on a trace with 4 control points
    const getTracePoint = (trace: typeof traces[0], t: number): [number, number] => {
      // 3 segments
      if (t < 0.333) {
        const localT = t / 0.333;
        return [
          trace.start[0] + (trace.mid1[0] - trace.start[0]) * localT,
          trace.start[1] + (trace.mid1[1] - trace.start[1]) * localT,
        ];
      } else if (t < 0.666) {
        const localT = (t - 0.333) / 0.333;
        return [
          trace.mid1[0] + (trace.mid2[0] - trace.mid1[0]) * localT,
          trace.mid1[1] + (trace.mid2[1] - trace.mid1[1]) * localT,
        ];
      } else {
        const localT = (t - 0.666) / 0.334;
        return [
          trace.mid2[0] + (trace.end[0] - trace.mid2[0]) * localT,
          trace.mid2[1] + (trace.end[1] - trace.mid2[1]) * localT,
        ];
      }
    };

    // Main animation loop
    const render = () => {
      time += 0.02;

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;
      const mx = (mouseRef.current.x - 0.5) * 30;
      const my = (mouseRef.current.y - 0.5) * 15;

      // 1. Clear & Background Gradient (seamlessly blends with the page, no pitch-black box)
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#0f1115';
      ctx.fillRect(0, 0, width, height);

      // Deep cyan/blue ambient glow at center bottom
      const bgGlow = ctx.createRadialGradient(
        width * 0.55 + mx * 0.5,
        height * 0.68 + my * 0.5,
        20,
        width * 0.55,
        height * 0.68,
        width * 0.65
      );
      bgGlow.addColorStop(0, 'rgba(14, 75, 120, 0.45)');
      bgGlow.addColorStop(0.35, 'rgba(8, 38, 65, 0.28)');
      bgGlow.addColorStop(0.7, 'rgba(5, 18, 32, 0.12)');
      bgGlow.addColorStop(1, 'rgba(7, 8, 11, 0)');
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, width, height);

      // Orange ambient accent glow on the floor (representing NacharTech orange brand)
      const orangeGlow = ctx.createRadialGradient(
        width * 0.48 + mx * 0.4,
        height * 0.88,
        10,
        width * 0.48,
        height * 0.88,
        width * 0.35
      );
      orangeGlow.addColorStop(0, 'rgba(255, 122, 26, 0.25)');
      orangeGlow.addColorStop(0.5, 'rgba(217, 90, 5, 0.08)');
      orangeGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = orangeGlow;
      ctx.fillRect(0, 0, width, height);

      // 2. Perspective Circuit Board Grid on the Floor
      const horizonY = height * 0.58 + my * 0.3;
      ctx.save();
      ctx.lineWidth = 1;

      // Perspective grid lines
      const gridCount = 28;
      for (let i = 0; i <= gridCount; i++) {
        const xBottom = (i / gridCount) * width * 1.4 - width * 0.2 + mx * 1.2;
        const xTop = width * 0.5 + ((i - gridCount / 2) / (gridCount / 2)) * (width * 0.35) + mx * 0.3;

        ctx.strokeStyle = 'rgba(40, 65, 95, 0.12)';
        ctx.beginPath();
        ctx.moveTo(xTop, horizonY);
        ctx.lineTo(xBottom, height);
        ctx.stroke();
      }

      // Horizontal perspective rungs
      for (let j = 0; j < 14; j++) {
        const progress = Math.pow(j / 13, 2.2);
        const y = horizonY + progress * (height - horizonY);
        const alpha = 0.05 + progress * 0.18;
        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      // 3. Motherboard Trace Paths with Glowing PCB Circuit Lines
      ctx.save();
      traces.forEach((trace) => {
        // Base dark trace groove
        ctx.strokeStyle = 'rgba(25, 45, 70, 0.6)';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        const p0 = [trace.start[0] * width + mx * 0.8, trace.start[1] * height];
        const p1 = [trace.mid1[0] * width + mx * 0.6, trace.mid1[1] * height];
        const p2 = [trace.mid2[0] * width + mx * 0.4, trace.mid2[1] * height];
        const p3 = [trace.end[0] * width + mx * 0.2, trace.end[1] * height];
        ctx.moveTo(p0[0], p0[1]);
        ctx.lineTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.lineTo(p3[0], p3[1]);
        ctx.stroke();

        // Neon glowing inner trace
        ctx.strokeStyle = trace.color === '#ff7a1a' ? 'rgba(255, 122, 26, 0.45)' : 'rgba(0, 229, 255, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Small solder nodes at corners
        ctx.fillStyle = trace.color;
        [p0, p1, p2, p3].forEach((pt) => {
          ctx.beginPath();
          ctx.arc(pt[0], pt[1], 2, 0, Math.PI * 2);
          ctx.fill();
        });
      });
      ctx.restore();

      // 4. Moving Energy Pulses on Traces
      if (!reducedMotion) {
        ctx.save();
        pulses.forEach((pulse) => {
          pulse.progress += pulse.speed;
          if (pulse.progress > 1) pulse.progress = 0;

          const trace = traces[pulse.traceIndex];
          const [normX, normY] = getTracePoint(trace, pulse.progress);
          const px = normX * width + mx * (1 - pulse.progress * 0.6);
          const py = normY * height;

          // Glowing energy head
          const pulseGlow = ctx.createRadialGradient(px, py, 0, px, py, pulse.size * 3.5);
          pulseGlow.addColorStop(0, '#ffffff');
          pulseGlow.addColorStop(0.3, pulse.color);
          pulseGlow.addColorStop(1, 'rgba(0,0,0,0)');

          ctx.fillStyle = pulseGlow;
          ctx.beginPath();
          ctx.arc(px, py, pulse.size * 3.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(px, py, pulse.size * 0.7, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }

      // 5. Central Technological Hardware Core (Matching uploaded frames: Laptop, CCTV, Router, AC, Fiber Optic)
      const coreX = width * 0.58 + mx * 0.5;
      const coreY = height * 0.65 + my * 0.3;

      // 5.1 Fiber Optic Tree behind the laptop
      ctx.save();
      const fiberBaseX = coreX - 40;
      const fiberBaseY = coreY - 20;
      for (let f = 0; f < 32; f++) {
        const fAngle = -Math.PI / 2 + ((f - 16) / 16) * 0.85;
        const fLen = 90 + Math.sin(time + f) * 15 + (f % 5) * 18;
        const tipX = fiberBaseX + Math.cos(fAngle) * fLen;
        const tipY = fiberBaseY + Math.sin(fAngle) * fLen;

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(fiberBaseX, fiberBaseY);
        ctx.quadraticCurveTo(fiberBaseX + (f - 16) * 2, fiberBaseY - 40, tipX, tipY);
        ctx.stroke();

        // Bright sparkling tip
        const tipGlow = Math.sin(time * 3 + f) * 0.5 + 0.5;
        ctx.fillStyle = f % 6 === 0 ? `rgba(255, 122, 26, ${0.4 + tipGlow * 0.6})` : `rgba(0, 229, 255, ${0.5 + tipGlow * 0.5})`;
        ctx.beginPath();
        ctx.arc(tipX, tipY, 1.8 + tipGlow * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 5.2 Motherboard Base Plate (Metallic dark rectangle with illuminated ICs)
      ctx.save();
      const mbW = Math.min(width * 0.52, 540);
      const mbH = mbW * 0.42;
      const mbLeft = coreX - mbW * 0.46;
      const mbTop = coreY - mbH * 0.15;

      // Isometric motherboard plate
      ctx.fillStyle = '#0c0e14';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(mbLeft, mbTop + mbH * 0.3);
      ctx.lineTo(mbLeft + mbW * 0.35, mbTop);
      ctx.lineTo(mbLeft + mbW, mbTop + mbH * 0.4);
      ctx.lineTo(mbLeft + mbW * 0.65, mbTop + mbH);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Capacitors (cylinders on the board)
      const capPositions = [
        [0.25, 0.5], [0.29, 0.53], [0.33, 0.56],
        [0.72, 0.65], [0.76, 0.68], [0.8, 0.71],
      ];
      capPositions.forEach(([rx, ry]) => {
        const cx = mbLeft + rx * mbW;
        const cy = mbTop + ry * mbH;
        // Shadow
        ctx.fillStyle = '#06070a';
        ctx.beginPath();
        ctx.ellipse(cx, cy + 4, 6, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        // Cylinder top
        ctx.fillStyle = '#222834';
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(cx, cy - 6, 5, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
      ctx.restore();

      // 5.3 High-Tech Laptop (Central device - Informática & Suporte)
      ctx.save();
      const lapW = Math.min(width * 0.32, 340);
      const lapH = lapW * 0.62;
      const lapX = coreX - lapW * 0.45;
      const lapY = coreY - lapH * 0.75;

      // Laptop Base / Keyboard deck
      ctx.fillStyle = '#161922';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(lapX - 10, lapY + lapH * 0.88, lapW + 20, lapH * 0.28, [4, 4, 10, 10]);
      ctx.fill();
      ctx.stroke();

      // Keyboard glow
      ctx.fillStyle = 'rgba(0, 229, 255, 0.25)';
      ctx.fillRect(lapX + lapW * 0.1, lapY + lapH * 0.93, lapW * 0.8, lapH * 0.14);

      // Laptop Screen Bezel
      ctx.fillStyle = '#0b0d12';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(lapX, lapY, lapW, lapH * 0.88, [8, 8, 2, 2]);
      ctx.fill();
      ctx.stroke();

      // Screen Display Area (Glowing Cyan Blue with Tech Schematics)
      const screenGlow = ctx.createLinearGradient(lapX, lapY, lapX, lapY + lapH * 0.85);
      screenGlow.addColorStop(0, '#041624');
      screenGlow.addColorStop(0.5, '#07243a');
      screenGlow.addColorStop(1, '#051b2c');
      ctx.fillStyle = screenGlow;
      ctx.fillRect(lapX + 6, lapY + 6, lapW - 12, lapH * 0.88 - 12);

      // Digital Circuit Blueprint on screen
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.55)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      // Waveform / system heart-beat on screen
      const waveY = lapY + lapH * 0.45;
      ctx.moveTo(lapX + 16, waveY);
      for (let w = 0; w < lapW - 32; w += 4) {
        const pulseVal = Math.sin(time * 4 + w * 0.15) * 8 * Math.exp(-Math.pow((w - (lapW * 0.5)) / 40, 2));
        ctx.lineTo(lapX + 16 + w, waveY + pulseVal);
      }
      ctx.stroke();

      // HUD Text / telemetry on screen
      ctx.fillStyle = '#38bdf8';
      ctx.font = '9px monospace';
      ctx.fillText('NACHARTECH SYS // ONLINE', lapX + 14, lapY + 22);
      ctx.fillStyle = '#ff7a1a';
      ctx.fillText('NAMPULA MZ', lapX + lapW - 84, lapY + 22);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('CCTV • REDES • AC • TI', lapX + 14, lapY + lapH * 0.75);

      // Blue screen ambient bloom
      const screenBloom = ctx.createRadialGradient(
        lapX + lapW * 0.5,
        lapY + lapH * 0.45,
        10,
        lapX + lapW * 0.5,
        lapY + lapH * 0.45,
        lapW * 0.85
      );
      screenBloom.addColorStop(0, 'rgba(0, 229, 255, 0.18)');
      screenBloom.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = screenBloom;
      ctx.fillRect(lapX - 40, lapY - 40, lapW + 80, lapH + 80);
      ctx.restore();

      // 5.4 CCTV Security Cameras on the right (Segurança & CCTV)
      ctx.save();
      const cctvX = coreX + lapW * 0.65;
      const cctvY = coreY - lapH * 0.25;

      // Bullet Camera Body
      ctx.fillStyle = '#e2e8f0';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cctvX + 24, cctvY - 14, 22, 10, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Camera Mount
      ctx.fillStyle = '#475569';
      ctx.fillRect(cctvX + 18, cctvY - 4, 6, 26);
      ctx.beginPath();
      ctx.arc(cctvX + 21, cctvY + 24, 12, 0, Math.PI);
      ctx.fill();

      // Lens with red recording LED & cyan reflection
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.ellipse(cctvX + 6, cctvY - 11, 6, 8, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Blinking red recording LED
      const recBlink = Math.floor(time * 3) % 2 === 0;
      ctx.fillStyle = recBlink ? '#ef4444' : '#7f1d1d';
      ctx.beginPath();
      ctx.arc(cctvX + 34, cctvY - 20, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Dome Camera (360 security dome)
      const domeX = cctvX + 38;
      const domeY = cctvY + 45;
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(domeX, domeY, 18, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(domeX, domeY, 12, Math.PI, 0);
      ctx.fill();

      // Laser Scanner Cone from dome camera
      const scanAngle = Math.sin(time * 1.5) * 0.4 + 0.2;
      const scanGrad = ctx.createRadialGradient(domeX, domeY, 5, domeX - 70, domeY + 110, 140);
      scanGrad.addColorStop(0, 'rgba(0, 229, 255, 0.35)');
      scanGrad.addColorStop(1, 'rgba(0, 229, 255, 0)');
      ctx.fillStyle = scanGrad;
      ctx.beginPath();
      ctx.moveTo(domeX, domeY);
      ctx.lineTo(domeX - 90 + Math.cos(scanAngle) * 30, domeY + 90);
      ctx.lineTo(domeX - 20 + Math.cos(scanAngle) * 30, domeY + 105);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 5.5 Network Router / Switch on the left (Redes & Conectividade)
      ctx.save();
      const rtrX = coreX - lapW * 0.85;
      const rtrY = coreY + 15;
      const rtrW = 100;
      const rtrH = 40;

      // Router chassis
      ctx.fillStyle = '#111319';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(rtrX, rtrY, rtrW, rtrH, 4);
      ctx.fill();
      ctx.stroke();

      // Ethernet Activity LEDs (blinking green/cyan)
      for (let p = 0; p < 6; p++) {
        const ledOn = Math.sin(time * 6 + p * 2.3) > 0;
        ctx.fillStyle = ledOn ? '#22c55e' : '#14532d';
        ctx.beginPath();
        ctx.arc(rtrX + 16 + p * 14, rtrY + 14, 2, 0, Math.PI * 2);
        ctx.fill();

        // RJ45 Port outlines
        ctx.strokeStyle = '#334155';
        ctx.strokeRect(rtrX + 11 + p * 14, rtrY + 22, 10, 10);
      }

      // Router Antennas
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(rtrX + 15, rtrY);
      ctx.lineTo(rtrX + 5, rtrY - 45);
      ctx.moveTo(rtrX + rtrW - 15, rtrY);
      ctx.lineTo(rtrX + rtrW - 5, rtrY - 45);
      ctx.stroke();
      ctx.restore();

      // 5.6 Wall Air-Conditioner Unit at top wall (Climatização)
      ctx.save();
      const acW = Math.min(width * 0.28, 280);
      const acH = acW * 0.26;
      const acX = coreX - acW * 0.5;
      const acY = Math.max(height * 0.08, 55) + my * 0.15;

      // AC Chassis
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(acX, acY, acW, acH, [6, 6, 12, 12]);
      ctx.fill();
      ctx.stroke();

      // Bottom air vent slot
      ctx.fillStyle = '#334155';
      ctx.fillRect(acX + 14, acY + acH - 8, acW - 28, 4);

      // Digital Temperature Readout
      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('21°C', acX + acW - 48, acY + acH * 0.6);

      // Emit Cool Air Mist particles
      if (!reducedMotion && Math.random() < 0.25) {
        createCoolAir(acX + acW * 0.5, acY + acH);
      }
      ctx.restore();

      // 5.7 Spark Emitter at processor socket (Matching frames 15-35)
      if (!reducedMotion) {
        const sparkOriginX = coreX - 30;
        const sparkOriginY = coreY + 12;

        if (Math.random() < 0.5) {
          createSpark(sparkOriginX, sparkOriginY);
        }

        // Render Sparks
        ctx.save();
        for (let s = sparks.length - 1; s >= 0; s--) {
          const sp = sparks[s];
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.vy += 0.08; // gravity
          sp.life++;
          sp.alpha = 1 - sp.life / sp.maxLife;

          if (sp.life >= sp.maxLife) {
            sparks.splice(s, 1);
            continue;
          }

          ctx.fillStyle = sp.color;
          ctx.globalAlpha = Math.max(0, sp.alpha);
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Render Cool Air Particles
        ctx.save();
        for (let a = coolAir.length - 1; a >= 0; a--) {
          const ca = coolAir[a];
          ca.x += ca.vx;
          ca.y += ca.vy;
          ca.life++;
          const airAlpha = (1 - ca.life / ca.maxLife) * 0.15;

          if (ca.life >= ca.maxLife) {
            coolAir.splice(a, 1);
            continue;
          }

          const airGrad = ctx.createRadialGradient(ca.x, ca.y, 0, ca.x, ca.y, ca.size);
          airGrad.addColorStop(0, `${ca.color}${airAlpha})`);
          airGrad.addColorStop(1, `${ca.color}0)`);
          ctx.fillStyle = airGrad;
          ctx.beginPath();
          ctx.arc(ca.x, ca.y, ca.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 6. Cinematic Vignette and Left Overlay Scrim (Ensuring text on left is 100% legible)
      ctx.save();
      const textScrim = ctx.createLinearGradient(0, 0, width * 0.72, 0);
      textScrim.addColorStop(0, 'rgba(7, 8, 11, 0.95)');
      textScrim.addColorStop(0.45, 'rgba(7, 8, 11, 0.82)');
      textScrim.addColorStop(0.75, 'rgba(7, 8, 11, 0.35)');
      textScrim.addColorStop(1, 'rgba(7, 8, 11, 0)');
      ctx.fillStyle = textScrim;
      ctx.fillRect(0, 0, width, height);

      // Bottom shadow fade into page
      const bottomShadow = ctx.createLinearGradient(0, height - 90, 0, height);
      bottomShadow.addColorStop(0, 'rgba(7, 8, 11, 0)');
      bottomShadow.addColorStop(1, '#0f1115');
      ctx.fillStyle = bottomShadow;
      ctx.fillRect(0, height - 90, width, 90);
      ctx.restore();

      if (!reducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // Pause when offscreen
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !reducedMotion) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
      style={{ display: 'block' }}
    />
  );
};
