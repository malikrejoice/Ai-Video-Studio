'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Copy, Cpu, Search, Share2, Sparkles } from 'lucide-react';
import { useAppState, useToast, useVideoStore } from '@/lib/store';

const getModeLabel = (health) => {
  if (!health?.mode) return 'Checking backend';
  if (health.mode === 'demo') return 'Demo backend';
  if (health.gpu?.available) return 'GPU live';
  return 'GPU not attached';
};

export default function Navbar() {
  const { backendHealth, setBackendHealth } = useVideoStore();
  const { setCurrentPage } = useAppState();
  const { addToast } = useToast();
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    let ignore = false;

    const loadHealth = async () => {
      try {
        const response = await fetch('/api/health', { cache: 'no-store' });
        const data = await response.json();
        if (!ignore && response.ok) {
          setBackendHealth(data);
        }
      } catch (error) {
        if (!ignore) {
          setBackendHealth({
            mode: 'offline',
            gpu: { available: false, reason: 'Backend health check failed.' },
          });
        }
      }
    };

    loadHealth();
    const interval = setInterval(loadHealth, 15000);
    return () => {
      ignore = true;
      clearInterval(interval);
    };
  }, [setBackendHealth]);

  const handleCopyLink = async () => {
    const targetUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'https://ai-video-studio-five-flax.vercel.app';

    try {
      await navigator.clipboard.writeText(targetUrl);
      addToast('Share link copied.', 'success');
    } catch {
      addToast('Unable to copy link right now.', 'error');
    }
  };

  return (
    <nav className="border-b border-[#1e293b]/8 bg-white/55 px-5 py-5 backdrop-blur-xl lg:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-4">
          <div className="hidden lg:flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ec6b2d] via-[#f3a23a] to-[#0e7c86] text-white shadow-lg">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8a6f55]">
              Share-ready workspace
            </p>
            <div className="mt-1 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#1d2430]">MotionMint Studio</h2>
                <p className="mt-1 text-sm text-[#697383]">
                  Image-first AI video workspace with cleaner navigation and faster sharing.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentPage('create')}
                className="inline-flex items-center gap-2 rounded-full bg-[#1d2430] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(29,36,48,0.18)]"
              >
                New video
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 xl:justify-end">
          <div className="flex items-center gap-2 rounded-full border border-[#0e7c86]/15 bg-[#0e7c86]/8 px-4 py-2 text-sm text-[#184b54]">
            <Cpu className="h-4 w-4" />
            <span className="font-semibold">{getModeLabel(backendHealth)}</span>
          </div>

          <div className="hidden rounded-full border border-[#1d2430]/8 bg-white/70 px-4 py-2 text-sm text-[#5b6472] md:flex">
            {backendHealth?.gpu?.available
              ? backendHealth.gpu.reason
              : backendHealth?.gpu?.reason || 'Waiting for backend status'}
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 rounded-full bg-[#1d2430] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(29,36,48,0.18)]"
          >
            <Share2 className="h-4 w-4" />
            Share app
            <Copy className="h-4 w-4 opacity-70" />
          </motion.button>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-[#1d2430]/8 bg-white/70 px-4 py-3 shadow-[0_12px_34px_rgba(29,36,48,0.06)]">
          <Search className="h-4 w-4 text-[#8b95a7]" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search your scenes, styles, prompts, and projects"
            className="w-full bg-transparent text-sm text-[#1d2430] outline-none placeholder:text-[#8b95a7]"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-[#1d2430]/8 bg-white/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#7b8494]">
            Studio home
          </span>
          <span className="rounded-full border border-[#1d2430]/8 bg-white/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#7b8494]">
            Visual dashboard
          </span>
          <span className="rounded-full border border-[#1d2430]/8 bg-white/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#7b8494]">
            Share mode
          </span>
        </div>
      </div>
    </nav>
  );
}
