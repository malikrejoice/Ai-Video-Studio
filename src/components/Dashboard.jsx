'use client';

import React, { useRef } from 'react';
import {
  motion,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowRight, Copy, Cpu, PlayCircle, Sparkles, Wand2 } from 'lucide-react';
import { useAppState, useToast, useVideoStore } from '@/lib/store';

const stats = [
  { label: 'Prompt to preview', value: 'under 2 mins' },
  { label: 'Reference uploads', value: 'up to 5' },
  { label: 'Share-ready link', value: 'always on' },
];

const quickStarts = [
  'Dreamy fashion film in a desert wind tunnel, dramatic tracking shot, luxury lighting',
  'Animated travel postcard of Kyoto alleys after rain, soft lantern glow, cinematic motion',
  'High-energy sneaker launch teaser, chrome reflections, bold shadows, editorial pacing',
];

const orbitCards = [
  { title: 'Launch Reel', caption: 'Chrome product frames', x: '12%', y: '14%' },
  { title: 'Travel Story', caption: 'Kyoto rain sequence', x: '67%', y: '18%' },
  { title: 'Fashion Clip', caption: 'Desert editorial motion', x: '21%', y: '68%' },
];

function FloatingOrb({ className }) {
  return (
    <motion.div
      animate={{ y: [0, -18, 0], x: [0, 10, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      className={className}
    />
  );
}

export default function Dashboard() {
  const { backendHealth, projects } = useVideoStore();
  const { setCurrentPage } = useAppState();
  const { addToast } = useToast();
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const heroRotate = useTransform(scrollYProgress, [0, 1], [0, -5]);
  const foregroundY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 70]);

  const mouseX = useSpring(0, { stiffness: 110, damping: 18, mass: 0.6 });
  const mouseY = useSpring(0, { stiffness: 110, damping: 18, mass: 0.6 });
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);
  const heroGlow = useMotionTemplate`radial-gradient(circle at ${useTransform(
    mouseX,
    [-0.5, 0.5],
    ['35%', '65%']
  )} ${useTransform(mouseY, [-0.5, 0.5], ['30%', '60%'])}, rgba(244,201,93,0.34), transparent 32%)`;

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
    <div ref={containerRef} className="min-h-screen px-6 py-6 lg:px-8 lg:py-8">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-6 xl:grid-cols-[1.55fr_0.88fr]"
      >
        <motion.div
          className="glass relative min-h-[540px] overflow-hidden p-7 lg:p-9"
          style={{ rotateX, rotateY }}
          onMouseMove={(event) => {
            const bounds = event.currentTarget.getBoundingClientRect();
            mouseX.set((event.clientX - bounds.left) / bounds.width - 0.5);
            mouseY.set((event.clientY - bounds.top) / bounds.height - 0.5);
          }}
          onMouseLeave={() => {
            mouseX.set(0);
            mouseY.set(0);
          }}
        >
          <motion.div className="absolute inset-0" style={{ background: heroGlow }} />
          <motion.div
            className="absolute inset-x-0 top-0 h-56 rounded-b-[40%] bg-[radial-gradient(circle_at_top,rgba(236,107,45,0.22),transparent_60%)]"
            style={{ y: backgroundY }}
          />
          <motion.div
            className="absolute -right-12 top-10 h-56 w-56 rounded-full bg-[#f4c95d]/30 blur-3xl"
            style={{ y: heroY }}
          />
          <motion.div
            className="absolute left-1/3 top-20 h-48 w-48 rounded-full bg-[#0e7c86]/18 blur-3xl"
            style={{ y: foregroundY }}
          />
          <FloatingOrb className="absolute left-[14%] top-[20%] h-16 w-16 rounded-full bg-white/45 blur-xl" />
          <FloatingOrb className="absolute right-[14%] top-[34%] h-24 w-24 rounded-full bg-[#0e7c86]/18 blur-2xl" />

          {orbitCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, scale: 0.84, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.09 }}
              style={{
                left: card.x,
                top: card.y,
                y: index % 2 === 0 ? foregroundY : backgroundY,
                rotate: index === 1 ? heroRotate : undefined,
              }}
              className="absolute hidden w-52 rounded-[1.6rem] border border-white/55 bg-white/72 p-4 shadow-[0_18px_38px_rgba(29,36,48,0.08)] md:block"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a6f55]">
                Scene card
              </p>
              <h3 className="mt-3 text-lg font-bold text-[#1d2430]">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#5b6472]">{card.caption}</p>
            </motion.div>
          ))}

          <div className="relative z-10 max-w-3xl">
            <div className="pill pill-warm">
              <Wand2 className="h-4 w-4" />
              Creator workspace
            </div>
            <motion.h1
              className="mt-5 max-w-3xl text-4xl font-bold leading-tight text-[#1d2430] lg:text-6xl"
              style={{ y: heroY }}
            >
              Turn your prompt into a scroll-stopping video your friends will actually open twice.
            </motion.h1>
            <motion.p
              className="mt-4 max-w-2xl text-base leading-7 text-[#5b6472]"
              style={{ y: useTransform(scrollYProgress, [0, 1], [0, 60]) }}
            >
              MotionMint Studio now opens with a layered React parallax scene, clearer product framing, and a smoother path from prompt to share link.
            </motion.p>

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
        </motion.div>

        <motion.div
          className="glass-dark p-7 text-white"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
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
              Your friends can use the live app now. When you connect a GPU backend, they keep the same link and simply get stronger generation quality.
            </p>
          </div>
          <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/0 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-white/55">Visual system</p>
            <p className="mt-3 text-sm leading-7 text-white/72">
              Warm editorial tones, layered motion, floating scene cards, and scroll-based parallax replace the flatter dashboard feel.
            </p>
          </div>
        </motion.div>
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
              <motion.button
                key={idea}
                whileHover={{ y: -3 }}
                onClick={() => setCurrentPage('create')}
                className="flex w-full items-start justify-between rounded-[1.3rem] border border-[#1d2430]/8 bg-white/70 px-4 py-4 text-left transition hover:shadow-[0_18px_36px_rgba(29,36,48,0.08)]"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6f55]">
                    Idea {idx + 1}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#364152]">{idea}</p>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 text-[#0e7c86]" />
              </motion.button>
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
                whileHover={{ y: -2 }}
                className="flex items-center justify-between rounded-[1.3rem] border border-[#1d2430]/8 bg-white/72 px-4 py-4 shadow-[0_12px_24px_rgba(29,36,48,0.04)]"
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
