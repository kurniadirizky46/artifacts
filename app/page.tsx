'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Users, Trophy, Zap, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';

export default function MathOdysseyLanding() {
  const [nickname, setNickname] = useState('');

  const handleStartJourney = () => {
    if (nickname.trim()) {
      localStorage.setItem('playerName', nickname.trim());
      window.location.href = '/world-map';
    } else {
      alert('Please enter your nickname to begin your math adventure!');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-[length:4px_4px] opacity-40" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-4xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-1 text-sm">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>Now with advanced calculus mechanics</span>
          </div>

          <h1 className="text-6xl font-bold tracking-tighter sm:text-7xl md:text-8xl">
            Math Odyssey
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-2xl text-zinc-400">
            Master mathematics from basic arithmetic to advanced calculus<br />through truly interactive gameplay.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <div className="flex w-full max-w-sm items-center gap-3">
              <input
                type="text"
                placeholder="Enter your nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStartJourney()}
                className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4 text-lg placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleStartJourney}
                className="flex h-14 items-center justify-center gap-2 rounded-xl bg-white px-8 font-semibold text-black transition hover:bg-zinc-200 active:scale-[0.985]"
              >
                Start Journey <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <p className="mt-4 text-sm text-zinc-500">
            Free • No signup required to start • Play with friends online
          </p>
        </motion.div>

        <div className="absolute bottom-8 flex gap-8 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <Play className="h-4 w-4" /> Single Player Campaign
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Real-time Battle Rooms
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4" /> From Arithmetic to Integrals
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="border-t border-zinc-800 bg-zinc-900/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-4xl font-semibold tracking-tight">Why players love Math Odyssey</h2>
            <p className="mt-3 text-xl text-zinc-400">Mathematics has never felt this good.</p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: <Zap className="h-6 w-6" />,
                title: "Deeply Interactive",
                desc: "Math isn't answered — it's used as a gameplay mechanic. Edit graphs, adjust angles, optimize derivatives in real time."
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: "Battle with Friends",
                desc: "Create private rooms and compete in real-time math duels. Race to solve Marbleslides or out-aim in Trig Archer."
              },
              {
                icon: <Trophy className="h-6 w-6" />,
                title: "True Progression",
                desc: "6 beautiful realms from basic arithmetic to advanced calculus. Unlock new mechanics as you master concepts."
              }
            ].map((feature, index) => (
              <div key={index} className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800 text-blue-400">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-zinc-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Realms Preview */}
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <h2 className="text-4xl font-semibold tracking-tight">6 Realms of Mathematical Mastery</h2>
          <p className="mt-3 text-xl text-zinc-400">Each realm introduces new interactive mechanics</p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Arithmetic Realm", level: "Basic", color: "emerald" },
            { name: "Algebra Kingdom", level: "Intermediate", color: "blue" },
            { name: "Trigonometry Peaks", level: "Intermediate", color: "violet" },
            { name: "Function Valley", level: "Advanced", color: "amber" },
            { name: "Derivative Mountains", level: "Advanced", color: "rose" },
            { name: "Integral Ocean", level: "Expert", color: "cyan" },
          ].map((realm, index) => (
            <div key={index} className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <div>
                <div className="font-semibold text-lg">{realm.name}</div>
                <div className="text-sm text-zinc-500">{realm.level}</div>
              </div>
              <div className={`rounded-full px-4 py-1 text-xs font-medium bg-${realm.color}-500/10 text-${realm.color}-400`}>
                {realm.level}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/world-map" 
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 font-semibold text-black transition hover:bg-zinc-200"
          >
            Explore the World Map <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
