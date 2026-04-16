'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Copy, Cpu, PlayCircle, Sparkles, Wand2 } from 'lucide-react';
import { useAppState, useToast, useVideoStore } from '@/lib/store';

const stats = [
  { label: 'Prompt to preview', value: 'under 2 mins', accent: 'Warm' },
  { label: 'Reference uploads', value: 'up to 5', accent: 'Cool' },
  { label: 'Share-ready link', value: 'always on', accent: 'Warm' },
];

const quickStarts = [
  'Dreamy fashion film in a desert wind tunnel, dramatic tracking shot, luxury lighting',
  'Animated travel postcard of Kyoto alleys after rain, soft lantern glow, cinematic motion',
  'High-energy sneaker launch teaser, chrome reflections, bold shadows, editorial pacing',
];

export default function Dashboard() {
  const { backendHealth, projects } = useVideoStore();
  const { setCurrentPage } = useAppState();
  const { addToast } = useToast();

  const shareApp = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      addToast('App link copied for sharing.', 'success');
    } catch {
      addToast('Could not copy the app link.', 'error');
    }
  };

  const backendMode =
    backendHealth?.mode === 'demo'
      ? 'Demo mode for public testing'
      : backendHealth?.gpu?.available
        ? 'Real GPU backend connected'
        : 'GPU backend still pending';

  return (
    <div className="min-h-screen px-6 py-6 lg:px-8 lg:py-8">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]"
      >
        <div className="glass relative overflow-hidden p-7 lg:p-9">
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[#f4c95d]/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-40 w-40 rounded-full bg-[#0e7c86]/16 blur-3xl" />

          <div className="relative">
            <div className="pill pill-warm">
              <Wand2 className="h-4 w-4" />
              Creator workspace
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight text-[#1d2430] lg:text-5xl">
              Turn your prompt into something you can confidently send to friends.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#5b6472]">
              MotionMint Studio keeps the public experience simple: write a prompt, upload references, watch the render, and share the app without explaining your setup.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentPage('create')}
                className="inline-flex items-center gap-2 rounded-full bg-[#1d2430] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(29,36,48,0.18)]"
              >
                Start a new video
                <ArrowRight className="h-4 w-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={shareApp}
                className="inline-flex items-center gap-2 rounded-full border border-[#1d2430]/10 bg-white/76 px-5 py-3 text-sm font-semibold text-[#1d2430]"
              >
                <Copy className="h-4 w-4" />
                Copy public link
              </motion.button>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {stats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="rounded-[1.5rem] border border-white/55 bg-white/68 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a6f55]">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-2xl font-bold text-[#1d2430]">{stat.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-dark p-7 text-white">
          <div className="pill pill-dark">
            <Cpu className="h-4 w-4" />
            Backend status
          </div>
          <h2 className="mt-5 text-2xl font-bold">{backendMode}</h2>
          <p className="mt-3 text-sm leading-7 text-white/72">
            {backendHealth?.gpu?.available
              ? backendHealth.gpu.reason
              : backendHealth?.gpu?.reason || 'Checking backend hardware'}
          </p>
          <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/6 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-white/55">Public sharing note</p>
            <p className="mt-3 text-sm leading-7 text-white/78">
              Your friends can use the live Vercel app right now. When you connect a GPU backend, they keep the same link and just get stronger generation quality.
            </p>
          </div>
        </div>
      </motion.section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="glass p-7"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8a6f55]">
                Prompt starters
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[#1d2430]">Fast ideas for your next shareable clip</h2>
            </div>
            <Sparkles className="h-5 w-5 text-[#ec6b2d]" />
          </div>

          <div className="mt-6 space-y-3">
            {quickStarts.map((idea, idx) => (
              <button
                key={idea}
                onClick={() => setCurrentPage('create')}
                className="flex w-full items-start justify-between rounded-[1.3rem] border border-[#1d2430]/8 bg-white/70 px-4 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(29,36,48,0.08)]"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6f55]">
                    Idea {idx + 1}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#364152]">{idea}</p>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 text-[#0e7c86]" />
              </button>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-7"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8a6f55]">
                Recent outputs
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[#1d2430]">What people will see first</h2>
            </div>
            <PlayCircle className="h-5 w-5 text-[#0e7c86]" />
          </div>

          <div className="mt-6 space-y-3">
            {projects.slice(0, 4).map((video, idx) => (
              <motion.div
                key={video.id || idx}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.24 + idx * 0.05 }}
                className="flex items-center justify-between rounded-[1.3rem] border border-[#1d2430]/8 bg-white/72 px-4 py-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff3eb] text-xl">
                    {video.thumbnail || '🎬'}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1d2430]">{video.title}</p>
                    <p className="mt-1 text-sm text-[#6b7280]">{video.date}</p>
                  </div>
                </div>
                <span className="rounded-full bg-[#0e7c86]/10 px-3 py-1 text-xs font-semibold text-[#0f5f66]">
                  Ready
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
