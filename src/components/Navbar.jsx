'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Settings, User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="h-20 glass-dark border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6 ml-6">
        {/* Credits */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg glass"
        >
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 animate-pulse" />
          <span className="text-sm font-medium text-white">
            2,450 <span className="text-gray-400">Credits</span>
          </span>
        </motion.div>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-10 h-10 rounded-lg glass flex items-center justify-center text-gray-400 hover:text-white transition-colors group"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <div className="absolute top-12 right-0 mt-2 hidden group-hover:block bg-dark-800 border border-white/10 rounded-lg p-3 text-sm w-64 shadow-xl">
            <p className="text-gray-300">Your video is ready!</p>
          </div>
        </motion.button>

        {/* Settings */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-lg glass flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5" />
        </motion.button>

        {/* User Profile */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-lg glow-accent-sm"
        >
          <User className="w-5 h-5" />
        </motion.button>
      </div>
    </nav>
  );
}
