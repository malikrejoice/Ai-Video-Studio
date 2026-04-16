'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAppState, useVideoStore } from '@/lib/store';
import {
  Clapperboard,
  FolderOpen,
  LayoutGrid,
  Menu,
  Settings,
  Sparkles,
  Wand2,
  X,
} from 'lucide-react';

const menuItems = [
  { name: 'Studio Home', icon: LayoutGrid, id: 'dashboard' },
  { name: 'Create Video', icon: Clapperboard, id: 'create' },
  { name: 'Projects', icon: FolderOpen, id: 'projects' },
  { name: 'Prompt Library', icon: Sparkles, id: 'templates' },
  { name: 'Settings', icon: Settings, id: 'settings' },
];

export default function Sidebar() {
  const { currentPage, setCurrentPage, sidebarOpen, setSidebarOpen } = useAppState();
  const { backendHealth } = useVideoStore();

  const statusText =
    backendHealth?.mode === 'demo'
      ? 'Demo mode'
      : backendHealth?.gpu?.available
        ? 'GPU ready'
        : 'GPU setup pending';

  return (
    <>
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-[#1b2330]/35 backdrop-blur-sm lg:hidden"
        />
      )}

      <motion.aside
        animate={{ x: sidebarOpen ? 0 : -320 }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed left-0 top-0 z-40 flex h-screen w-[290px] flex-col border-r border-white/35 bg-[rgba(255,248,240,0.82)] px-5 py-6 shadow-[0_24px_80px_rgba(29,36,48,0.14)] backdrop-blur-2xl lg:relative lg:translate-x-0"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[1.35rem] bg-gradient-to-br from-[#ec6b2d] via-[#f2a13c] to-[#0e7c86] text-white shadow-[0_18px_36px_rgba(236,107,45,0.24)]">
              <Wand2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8a6f55]">
                MotionMint
              </p>
              <h1 className="text-xl font-bold text-[#1d2430]">Studio</h1>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-full p-2 text-[#6b7280] transition hover:bg-white/70 hover:text-[#1d2430] lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 rounded-[1.8rem] bg-[#1d2430] p-5 text-white shadow-[0_24px_50px_rgba(29,36,48,0.22)]">
          <div className="pill pill-dark">
            <span className="h-2 w-2 rounded-full bg-[#f4c95d]" />
            {statusText}
          </div>
          <h2 className="mt-4 text-2xl font-bold">Make shareable AI clips in one flow.</h2>
          <p className="mt-3 text-sm leading-6 text-white/72">
            Prompt, upload references, review output, and send the app to friends without needing them to understand your backend stack.
          </p>
        </div>

        <nav className="mt-6 flex-1 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                onClick={() => {
                  setCurrentPage(item.id);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-[1.1rem] px-4 py-3.5 text-left transition-all ${
                  isActive
                    ? 'bg-white text-[#1d2430] shadow-[0_16px_30px_rgba(29,36,48,0.08)]'
                    : 'text-[#5b6472] hover:bg-white/65 hover:text-[#1d2430]'
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                    isActive ? 'bg-[#fff3eb] text-[#ec6b2d]' : 'bg-white/60 text-[#5b6472]'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{item.name}</div>
                </div>
              </motion.button>
            );
          })}
        </nav>

        <div className="rounded-[1.4rem] border border-[#1d2430]/8 bg-white/72 p-4 text-sm text-[#5b6472]">
          <p className="font-semibold text-[#1d2430]">Friend-share tip</p>
          <p className="mt-2 leading-6">
            Keep the public app on Vercel and swap only the backend URL when your GPU host is ready.
          </p>
        </div>
      </motion.aside>

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#1d2430] text-white shadow-[0_18px_36px_rgba(29,36,48,0.24)] lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>
    </>
  );
}
