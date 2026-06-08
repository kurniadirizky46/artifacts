'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, Star } from 'lucide-react';

const realms = [
  { 
    id: 1, 
    name: "Arithmetic Realm", 
    description: "Master the fundamentals", 
    unlocked: true, 
    stars: 12,
    color: "emerald",
    games: ["Number Dash", "Operation Forge", "Balance Puzzle"]
  },
  { 
    id: 2, 
    name: "Algebra Kingdom", 
    description: "Solve for the unknown", 
    unlocked: true, 
    stars: 9,
    color: "blue",
    games: ["Variable Vault", "Equation Empire", "Function Builder"]
  },
  { 
    id: 3, 
    name: "Trigonometry Peaks", 
    description: "Angles, waves & circles", 
    unlocked: true, 
    stars: 7,
    color: "violet",
    games: ["Trig Archer", "Unit Circle Defense", "Wave Rider"]
  },
  { 
    id: 4, 
    name: "Function Valley", 
    description: "Graphs come alive", 
    unlocked: true, 
    stars: 5,
    color: "amber",
    games: ["Marbleslides", "Graph Manipulator", "Function Duel"]
  },
  { 
    id: 5, 
    name: "Derivative Mountains", 
    description: "Rates of change", 
    unlocked: false, 
    stars: 0,
    color: "rose",
    games: ["Derivative Racer", "Tangent Slider", "Optimization Challenge"]
  },
  { 
    id: 6, 
    name: "Integral Ocean", 
    description: "Accumulation & area", 
    unlocked: false, 
    stars: 0,
    color: "cyan",
    games: ["Area Builder", "Accumulation Defense", "Calculus Mixer"]
  },
];

export default function WorldMap() {
  const playerName = typeof window !== 'undefined' ? localStorage.getItem('playerName') || 'Math Hero' : 'Math Hero';

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" /> Back to Home
          </Link>
          <div className="text-right">
            <div className="text-sm text-zinc-500">Welcome back,</div>
            <div className="font-semibold text-xl">{playerName}</div>
          </div>
        </div>

        <div className="mt-8">
          <h1 className="text-5xl font-bold tracking-tighter">The Mathiverse</h1>
          <p className="mt-2 text-2xl text-zinc-400">Choose your realm and begin your journey</p>
        </div>

        {/* Realms Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {realms.map((realm) => (
            <div 
              key={realm.id} 
              className={`realm-card rounded-3xl border p-8 ${realm.unlocked ? 'border-zinc-700 bg-zinc-900 unlocked' : 'border-zinc-800 bg-zinc-950 locked'}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className={`inline-block rounded-full px-3 py-1 text-xs font-medium bg-${realm.color}-500/10 text-${realm.color}-400`}>
                    REALM {realm.id}
                  </div>
                  <h3 className="mt-4 text-3xl font-semibold tracking-tight">{realm.name}</h3>
                  <p className="mt-1 text-zinc-400">{realm.description}</p>
                </div>
                {!realm.unlocked && <Lock className="h-6 w-6 text-zinc-600" />}
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-4 w-4" /> {realm.stars} / 12
                </div>
                <div className="text-zinc-600">•</div>
                <div>{realm.games.length} mini-games</div>
              </div>

              {realm.unlocked ? (
                <Link 
                  href={`/game/${realm.id}`} 
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 font-semibold text-black transition hover:bg-zinc-200"
                >
                  Enter Realm <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <div className="mt-8 w-full rounded-2xl border border-zinc-800 py-4 text-center text-sm text-zinc-500">
                  Collect more stars to unlock
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-zinc-500">
          More realms and mini-games coming soon • Battle mode available in any unlocked realm
        </div>
      </div>
    </div>
  );
}
