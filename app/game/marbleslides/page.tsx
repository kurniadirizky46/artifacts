'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, RotateCcw, Play, Star } from 'lucide-react';

export default function Marbleslides() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [equation, setEquation] = useState('y = 0.5 * x');
  const [marblesLaunched, setMarblesLaunched] = useState(false);
  const [starsCollected, setStarsCollected] = useState(0);
  const [level] = useState(1);

  // Simple physics simulation
  const launchMarbles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setMarblesLaunched(true);
    setStarsCollected(0);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background grid
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Parse simple equation (very basic parser for demo)
    const func = (x: number) => {
      try {
        // Very simple parser - in real version use math.js
        if (equation.includes('sin')) return Math.sin(x / 40) * 80 + 200;
        if (equation.includes('cos')) return Math.cos(x / 40) * 80 + 200;
        if (equation.includes('x^2') || equation.includes('x²')) return (x - 200) ** 2 / 80 + 100;
        return eval(equation.replace('y =', '').replace('x', `(${x - 200})`)) + 200;
      } catch {
        return 200 + (x - 200) * 0.5;
      }
    };

    // Draw the curve
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x += 2) {
      const y = func(x);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw stars
    const stars = [
      { x: 280, y: 180 },
      { x: 420, y: 260 },
      { x: 560, y: 150 },
    ];

    ctx.fillStyle = '#fbbf24';
    stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, 8, 0, Math.PI * 2);
      ctx.fill();
    });

    // Launch marbles
    let collected = 0;
    const marbles = Array.from({ length: 5 }, (_, i) => ({
      x: 80 + i * 8,
      y: 120,
      vx: 3.5 + i * 0.1,
      vy: 1.5,
    }));

    const animate = () => {
      ctx.fillStyle = 'rgba(24, 24, 27, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Redraw curve
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 2) {
        const y = func(x);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Redraw stars
      ctx.fillStyle = '#fbbf24';
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, 8, 0, Math.PI * 2);
        ctx.fill();
      });

      marbles.forEach((m, i) => {
        if (m.vx === 0) return;

        m.x += m.vx;
        m.y += m.vy;
        m.vy += 0.12; // gravity

        // Bounce on curve (simplified)
        const curveY = func(m.x);
        if (m.y > curveY - 5 && m.vy > 0) {
          m.vy = -m.vy * 0.6;
          m.y = curveY - 5;
        }

        // Collect stars
        stars.forEach((star, si) => {
          const dist = Math.hypot(m.x - star.x, m.y - star.y);
          if (dist < 18) {
            collected++;
            setStarsCollected(collected);
            stars[si] = { x: -100, y: -100 }; // remove star
          }
        });

        // Draw marble
        ctx.fillStyle = '#60a5fa';
        ctx.beginPath();
        ctx.arc(m.x, m.y, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      if (marbles.some(m => m.vx !== 0)) {
        requestAnimationFrame(animate);
      } else {
        setMarblesLaunched(false);
      }
    };

    animate();
  };

  const reset = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setMarblesLaunched(false);
    setStarsCollected(0);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <Link href="/world-map" className="flex items-center gap-2 text-zinc-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" /> Back to World Map
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-yellow-500">
              <Star className="h-5 w-5" /> {starsCollected} / 3 stars
            </div>
            <button onClick={reset} className="flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900">
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold tracking-tighter">Marbleslides</h1>
          <p className="mt-2 text-xl text-zinc-400">Edit the equation. Guide the marbles. Collect the stars.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Controls */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
              <div className="text-sm font-medium text-zinc-400 mb-3">YOUR EQUATION</div>
              <input
                type="text"
                value={equation}
                onChange={(e) => setEquation(e.target.value)}
                className="math-input w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-6 py-4 text-2xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="y = 0.5 * x"
              />
              <p className="mt-3 text-xs text-zinc-500">Try: y = 0.8*x, y = sin(x), y = x^2, y = cos(x)</p>
            </div>

            <button 
              onClick={launchMarbles}
              disabled={marblesLaunched}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 py-5 text-lg font-semibold transition hover:bg-blue-500 disabled:opacity-50"
            >
              <Play className="h-6 w-6" /> LAUNCH MARBLES
            </button>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-sm text-zinc-400">
              <div className="font-medium text-white mb-2">How to play:</div>
              <ul className="space-y-1.5 list-disc pl-5">
                <li>Edit the equation in real time</li>
                <li>Click Launch to test your curve</li>
                <li>Marbles follow physics + your graph</li>
                <li>Collect all 3 stars to complete the level</li>
              </ul>
            </div>
          </div>

          {/* Canvas */}
          <div className="lg:col-span-3">
            <div className="canvas-container">
              <canvas 
                ref={canvasRef} 
                width={700} 
                height={420} 
                className="w-full"
              />
            </div>
            <div className="mt-4 text-center text-sm text-zinc-500">
              Level {level} • Function Valley • Marbleslides
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
