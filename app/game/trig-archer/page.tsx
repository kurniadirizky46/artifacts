'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, RotateCcw, Target, Award } from 'lucide-react';

interface Target {
  x: number;
  y: number;
  radius: number;
  hit: boolean;
}

export default function TrigArcher() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(45);
  const [power, setPower] = useState(70);
  const [score, setScore] = useState(0);
  const [shots, setShots] = useState(0);
  const [targets, setTargets] = useState<Target[]>([
    { x: 450, y: 180, radius: 18, hit: false },
    { x: 520, y: 280, radius: 15, hit: false },
    { x: 620, y: 150, radius: 20, hit: false },
  ]);
  const [isShooting, setIsShooting] = useState(false);
  const [message, setMessage] = useState('');

  const gravity = 0.25;
  const canvasWidth = 720;
  const canvasHeight = 420;

  // Draw everything on canvas
  const draw = (currentTargets: Target[], projectile?: { x: number; y: number }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Background
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Ground
    ctx.fillStyle = '#27272a';
    ctx.fillRect(0, 340, canvasWidth, 80);

    // Archer tower
    ctx.fillStyle = '#3f3f46';
    ctx.fillRect(60, 260, 50, 80);

    // Archer
    ctx.fillStyle = '#60a5fa';
    ctx.beginPath();
    ctx.arc(85, 280, 18, 0, Math.PI * 2);
    ctx.fill();

    // Bow
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(100, 280, 25, -0.8, 0.8);
    ctx.stroke();

    // Draw targets
    currentTargets.forEach((target, index) => {
      if (target.hit) return;
      
      // Target stand
      ctx.strokeStyle = '#52525b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(target.x, target.y + target.radius);
      ctx.lineTo(target.x, target.y + 60);
      ctx.stroke();

      // Target circles
      ctx.fillStyle = index % 2 === 0 ? '#ef4444' : '#f97316';
      ctx.beginPath();
      ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(target.x, target.y, target.radius * 0.6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(target.x, target.y, target.radius * 0.25, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw projectile if shooting
    if (projectile) {
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Trail
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(projectile.x - 15, projectile.y + 8);
      ctx.lineTo(projectile.x, projectile.y);
      ctx.stroke();
    }

    // Draw aiming line (preview)
    if (!isShooting) {
      const rad = (angle * Math.PI) / 180;
      const startX = 100;
      const startY = 280;
      const endX = startX + Math.cos(rad) * (power * 1.2);
      const endY = startY - Math.sin(rad) * (power * 1.2);

      ctx.strokeStyle = 'rgba(234, 179, 8, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  };

  // Shoot arrow with proper trig
  const shoot = () => {
    if (isShooting) return;

    setIsShooting(true);
    setShots(prev => prev + 1);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rad = (angle * Math.PI) / 180;
    const velocityX = Math.cos(rad) * (power / 3);
    const velocityY = -Math.sin(rad) * (power / 3);

    let projX = 100;
    let projY = 280;
    let velX = velocityX;
    let velY = velocityY;

    const animateShot = () => {
      velY += gravity;
      projX += velX;
      projY += velY;

      // Redraw scene
      const currentTargets = [...targets];
      draw(currentTargets, { x: projX, y: projY });

      // Check collision with targets
      let hit = false;
      const newTargets = currentTargets.map(target => {
        if (target.hit) return target;

        const dist = Math.hypot(projX - target.x, projY - target.y);
        if (dist < target.radius + 8) {
          hit = true;
          const points = Math.floor(150 - dist * 2);
          setScore(prev => prev + Math.max(points, 20));
          return { ...target, hit: true };
        }
        return target;
      });

      if (hit) {
        setTargets(newTargets);
        setMessage('Nice shot!');
        setTimeout(() => setMessage(''), 1200);
      }

      // Continue animation or stop
      if (projY < canvasHeight + 30 && projX < canvasWidth + 50) {
        requestAnimationFrame(animateShot);
      } else {
        setIsShooting(false);
        // Check if all targets hit
        if (newTargets.every(t => t.hit)) {
          setMessage('All targets destroyed! Great job!');
        }
      }
    };

    animateShot();
  };

  const resetGame = () => {
    setTargets([
      { x: 450, y: 180, radius: 18, hit: false },
      { x: 520, y: 280, radius: 15, hit: false },
      { x: 620, y: 150, radius: 20, hit: false },
    ]);
    setScore(0);
    setShots(0);
    setMessage('');
    setIsShooting(false);
    draw([
      { x: 450, y: 180, radius: 18, hit: false },
      { x: 520, y: 280, radius: 15, hit: false },
      { x: 620, y: 150, radius: 20, hit: false },
    ]);
  };

  // Initial draw and redraw when angle/power changes
  useEffect(() => {
    draw(targets);
  }, [angle, power, targets]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/world-map" className="flex items-center gap-2 text-zinc-400 hover:text-white transition">
            <ArrowLeft className="h-5 w-5" /> Back to World Map
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-red-500" /> 
              Score: <span className="font-mono text-xl font-semibold text-yellow-400">{score}</span>
            </div>
            <div>Shots: {shots}</div>
            <button 
              onClick={resetGame}
              className="flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900 transition"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold tracking-tighter">Trig Archer</h1>
          <p className="mt-2 text-xl text-zinc-400">Use trigonometry to hit every target</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Controls */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
              <div className="space-y-8">
                {/* Angle Slider */}
                <div>
                  <div className="flex justify-between mb-3">
                    <div className="font-medium">Angle</div>
                    <div className="font-mono text-2xl text-yellow-400">{angle}°</div>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="85"
                    step="1"
                    value={angle}
                    onChange={(e) => setAngle(parseInt(e.target.value))}
                    className="w-full accent-yellow-500"
                  />
                  <div className="flex justify-between text-xs text-zinc-500 mt-1">
                    <div>10°</div>
                    <div>85°</div>
                  </div>
                </div>

                {/* Power Slider */}
                <div>
                  <div className="flex justify-between mb-3">
                    <div className="font-medium">Power</div>
                    <div className="font-mono text-2xl text-yellow-400">{power}</div>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    step="1"
                    value={power}
                    onChange={(e) => setPower(parseInt(e.target.value))}
                    className="w-full accent-yellow-500"
                  />
                  <div className="flex justify-between text-xs text-zinc-500 mt-1">
                    <div>Low</div>
                    <div>High</div>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={shoot}
              disabled={isShooting}
              className="w-full flex items-center justify-center gap-3 rounded-2xl bg-yellow-500 py-5 text-lg font-semibold text-black transition hover:bg-yellow-400 active:scale-[0.985] disabled:opacity-60"
            >
              <Target className="h-6 w-6" /> SHOOT ARROW
            </button>

            {message && (
              <div className="text-center py-3 text-emerald-400 font-medium">
                {message}
              </div>
            )}

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-sm">
              <div className="font-semibold mb-3 text-white">How to use Trigonometry:</div>
              <ul className="space-y-2 text-zinc-400 text-sm">
                <li>• <strong>Angle</strong> controls direction (sin & cos)</li>
                <li>• <strong>Power</strong> controls initial velocity</li>
                <li>• Higher angle = higher arc</li>
                <li>• Adjust both to hit all 3 targets</li>
              </ul>
            </div>
          </div>

          {/* Canvas */}
          <div className="lg:col-span-3">
            <div className="canvas-container">
              <canvas 
                ref={canvasRef} 
                width={canvasWidth} 
                height={canvasHeight}
                className="w-full rounded-2xl"
              />
            </div>
            <p className="text-center text-xs text-zinc-500 mt-3">
              Trigonometry Peaks • Use sin & cos to calculate trajectory
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
