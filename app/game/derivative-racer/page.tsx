'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, RotateCcw, Zap } from 'lucide-react';

export default function DerivativeRacer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [acceleration, setAcceleration] = useState(0.8); // First derivative concept
  const [braking, setBraking] = useState(0.4);           // Second derivative concept
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState('');

  const gameRef = useRef({
    carX: 80,
    carY: 220,
    velocity: 0,
    time: 0,
  });

  const draw = (carX: number, velocity: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 720, 380);

    // Sky / Background
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, 720, 380);

    // Road
    ctx.fillStyle = '#27272a';
    ctx.fillRect(0, 260, 720, 120);

    // Road lines
    ctx.strokeStyle = '#3f3f46';
    ctx.lineWidth = 3;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo((i * 100) - (gameRef.current.time % 100), 320);
      ctx.lineTo((i * 100) - (gameRef.current.time % 100) + 50, 320);
      ctx.stroke();
    }

    // Car
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(carX, 205, 70, 35);
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(carX + 10, 195, 50, 12);

    // Wheels
    ctx.fillStyle = '#111827';
    ctx.beginPath();
    ctx.arc(carX + 18, 242, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(carX + 52, 242, 10, 0, Math.PI * 2);
    ctx.fill();

    // Velocity indicator (derivative visualization)
    ctx.fillStyle = '#eab308';
    ctx.fillRect(20, 20, Math.min(velocity * 8, 180), 8);
    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    ctx.fillText(`Velocity: ${velocity.toFixed(1)}`, 20, 45);

    // Acceleration graph (educational)
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, 70);
    ctx.lineTo(20 + acceleration * 60, 70);
    ctx.stroke();
    ctx.fillStyle = '#22c55e';
    ctx.fillText(`Acceleration (1st deriv): ${acceleration.toFixed(1)}`, 20, 90);
  };

  const gameLoop = () => {
    const g = gameRef.current;
    g.time += 1;

    // Apply acceleration (1st derivative)
    g.velocity += acceleration * 0.03;

    // Apply braking effect (2nd derivative influence)
    if (g.velocity > 0) {
      g.velocity -= braking * 0.015;
    }

    // Move car
    g.carX += g.velocity;

    // Simple obstacles
    if (g.carX > 300 && g.carX < 320 && g.velocity > 4) {
      g.velocity *= 0.6;
      setMessage('Too fast! Use braking (2nd derivative)');
      setTimeout(() => setMessage(''), 1400);
    }

    // Update distance
    setDistance(Math.floor(g.carX / 3));
    setScore(prev => prev + Math.floor(g.velocity));

    draw(g.carX, g.velocity);

    if (g.carX < 650 && isRunning) {
      requestAnimationFrame(gameLoop);
    } else {
      setIsRunning(false);
      if (g.carX >= 650) {
        setMessage('Great driving! You understood derivatives well.');
      }
    }
  };

  const startRace = () => {
    if (isRunning) return;
    
    const g = gameRef.current;
    g.carX = 80;
    g.velocity = 1.5;
    g.time = 0;
    
    setScore(0);
    setDistance(0);
    setIsRunning(true);
    setMessage('');

    gameLoop();
  };

  const reset = () => {
    const g = gameRef.current;
    g.carX = 80;
    g.velocity = 0;
    setIsRunning(false);
    setScore(0);
    setDistance(0);
    setMessage('');
    draw(80, 0);
  };

  // Redraw when acceleration or braking changes
  useEffect(() => {
    if (!isRunning) {
      draw(gameRef.current.carX, gameRef.current.velocity);
    }
  }, [acceleration, braking]);

  // Initial draw
  useEffect(() => {
    draw(80, 0);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <Link href="/world-map" className="flex items-center gap-2 text-zinc-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" /> Back to World Map
          </Link>
          <div className="flex items-center gap-6">
            <div>Distance: <span className="font-mono text-yellow-400">{distance}m</span></div>
            <div>Score: <span className="font-mono text-xl text-emerald-400">{score}</span></div>
            <button onClick={reset} className="flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900">
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold tracking-tighter">Derivative Racer</h1>
          <p className="mt-2 text-xl text-zinc-400">Control your speed using derivatives</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Controls */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
              <div className="space-y-8">
                {/* Acceleration (1st Derivative) */}
                <div>
                  <div className="flex justify-between mb-2">
                    <div>
                      <div className="font-medium">Acceleration</div>
                      <div className="text-xs text-emerald-400">1st Derivative</div>
                    </div>
                    <div className="font-mono text-2xl text-emerald-400">{acceleration.toFixed(1)}</div>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="1.8"
                    step="0.1"
                    value={acceleration}
                    onChange={(e) => setAcceleration(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <div className="text-xs text-zinc-500 mt-1">Higher = faster speed gain</div>
                </div>

                {/* Braking (2nd Derivative) */}
                <div>
                  <div className="flex justify-between mb-2">
                    <div>
                      <div className="font-medium">Braking Strength</div>
                      <div className="text-xs text-rose-400">2nd Derivative Influence</div>
                    </div>
                    <div className="font-mono text-2xl text-rose-400">{braking.toFixed(1)}</div>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.2"
                    step="0.1"
                    value={braking}
                    onChange={(e) => setBraking(parseFloat(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                  <div className="text-xs text-zinc-500 mt-1">Higher = stronger slowing effect</div>
                </div>
              </div>
            </div>

            <button 
              onClick={startRace}
              disabled={isRunning}
              className="w-full flex items-center justify-center gap-3 rounded-2xl bg-emerald-600 py-5 text-lg font-semibold transition hover:bg-emerald-500 disabled:opacity-60"
            >
              <Zap className="h-6 w-6" /> START RACE
            </button>

            {message && (
              <div className="text-center text-emerald-400 font-medium py-2">{message}</div>
            )}

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-sm text-zinc-400">
              <div className="text-white font-semibold mb-2">Derivative Concepts:</div>
              <ul className="space-y-1.5">
                <li>• <strong>Acceleration</strong> = rate of change of velocity (1st derivative)</li>
                <li>• <strong>Braking</strong> = rate of change of acceleration (2nd derivative)</li>
                <li>• Balance both to maintain optimal speed through obstacles</li>
              </ul>
            </div>
          </div>

          {/* Canvas */}
          <div className="lg:col-span-3">
            <div className="canvas-container">
              <canvas ref={canvasRef} width={720} height={380} className="w-full rounded-2xl" />
            </div>
            <p className="text-center text-xs text-zinc-500 mt-3">
              Derivative Mountains • Master rates of change to win the race
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
