"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTheme } from "@/components/ThemeProvider";

const CANVAS_SIZE = 400;
const PARTICLE_COUNT = 60;
const TRAIL_LENGTH = 10;
const COLORS = [
  "rgba(6,182,212,",   // cyan
  "rgba(20,184,166,",  // teal
  "rgba(139,92,246,",  // violet
  "rgba(236,72,153,",  // pink
];

interface Particle {
  angle: number;
  radius: number;
  speed: number;
  angularSpeed: number;
  color: string;
  size: number;
  trail: { x: number; y: number }[];
}

function createParticle(): Particle {
  const angle = Math.random() * Math.PI * 2;
  const radius = 160 + Math.random() * 40;
  return {
    angle,
    radius,
    speed: 0.004 + Math.random() * 0.007,
    angularSpeed: 0.0003 + Math.random() * 0.0004,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 1.5 + Math.random() * 2,
    trail: [],
  };
}

export default function PlasmaCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Retina DPI
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_SIZE * dpr;
    canvas.height = CANVAS_SIZE * dpr;
    ctx.scale(dpr, dpr);

    const center = CANVAS_SIZE / 2;
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, createParticle);
    let pulsePhase = 0;
    let animId = 0;

    function tick() {
      ctx!.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Center pulse glow
      pulsePhase += 0.03;
      const pulseAlpha = 0.06 + Math.sin(pulsePhase) * 0.04;
      const pulseRadius = 40 + Math.sin(pulsePhase) * 8;
      const glow = ctx!.createRadialGradient(center, center, 0, center, center, pulseRadius);
      glow.addColorStop(0, `rgba(6,182,212,${pulseAlpha})`);
      glow.addColorStop(1, "rgba(6,182,212,0)");
      ctx!.fillStyle = glow;
      ctx!.beginPath();
      ctx!.arc(center, center, pulseRadius, 0, Math.PI * 2);
      ctx!.fill();

      // Update & draw particles
      for (const p of particles) {
        p.angle += p.angularSpeed;
        p.radius -= p.speed;

        const x = center + Math.cos(p.angle) * p.radius;
        const y = center + Math.sin(p.angle) * p.radius;

        p.trail.push({ x, y });
        if (p.trail.length > TRAIL_LENGTH) p.trail.shift();

        // Draw trail
        for (let i = 0; i < p.trail.length; i++) {
          const alpha = (i / p.trail.length) * 0.6;
          const size = p.size * (i / p.trail.length);
          ctx!.fillStyle = `${p.color}${alpha})`;
          ctx!.beginPath();
          ctx!.arc(p.trail[i].x, p.trail[i].y, size, 0, Math.PI * 2);
          ctx!.fill();
        }

        // Draw head
        ctx!.fillStyle = `${p.color}0.8)`;
        ctx!.beginPath();
        ctx!.arc(x, y, p.size, 0, Math.PI * 2);
        ctx!.fill();

        // Reset when reaching center
        if (p.radius <= 10) {
          const reset = createParticle();
          Object.assign(p, reset);
        }
      }

      animId = requestAnimationFrame(tick);
    }

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative" style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}>
      <canvas
        ref={canvasRef}
        style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
        className="absolute inset-0"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/logo.png"
          alt="TokamakLearn[:run]"
          width={300}
          height={300}
          priority
          className={`drop-shadow-[0_0_30px_rgba(6,182,212,0.3)] ${theme === "light" ? "brightness-200 contrast-125 saturate-150" : ""}`}
        />
      </div>
    </div>
  );
}
