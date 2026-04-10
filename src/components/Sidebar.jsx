'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '@/lib/store';
import {
  Grid,
  Play,
  Folder,
  Sparkles,
  Settings,
  UserMinus,
  Menu,
  X,
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: Grid, id: 'dashboard' },
  { name: 'Create Video', icon: Play, id: 'create' },
  { name: 'My Projects', icon: Folder, id: 'projects' },
  { name: 'Templates', icon: Sparkles, id: 'templates' },
  { name: 'Settings', icon: Settings, id: 'settings' },
];

export default function Sidebar() {
  const { currentPage, setCurrentPage, sidebarOpen, setSidebarOpen } =
    useAppState();

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.div
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed left-0 top-0 h-screen w-72 glass-dark border-r border-white/10 flex flex-col z-40 lg:relative lg:translate-x-0"
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Play className="w-6 h-6 text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">AI Studio</h1>
              <p className="text-xs text-gray-400">Video Generator</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6 space-y-2">
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <motion.button
            whileHover={{ x: 4 }}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors"
          >
            <UserMinus className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed bottom-6 left-6 lg:hidden z-50 w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white shadow-lg glow-accent"
      >
        <Menu className="w-6 h-6" />
      </button>
    </>
  );
}
