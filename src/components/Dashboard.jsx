'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: 'Videos Generated', value: '24', icon: Sparkles },
    { label: 'Credits Used', value: '15,240', icon: Zap },
    { label: 'Avg Quality', value: '4.8/5', icon: TrendingUp },
  ];

  const recentVideos = [
    { title: 'Mountain Sunset', status: 'Completed', date: '2 days ago' },
    { title: 'Ocean Waves', status: 'Completed', date: '1 week ago' },
    { title: 'Forest Path', status: 'Completed', date: '2 weeks ago' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's your video generation activity</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-dark p-6 rounded-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm font-medium">{stat.label}</h3>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-dark p-6 rounded-lg"
      >
        <h2 className="text-white text-lg font-semibold mb-4">Recent Videos</h2>
        <div className="space-y-3">
          {recentVideos.map((video, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.05 }}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-purple-500/30 transition-all"
            >
              <div>
                <p className="text-white font-medium">{video.title}</p>
                <p className="text-xs text-gray-500">{video.date}</p>
              </div>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                {video.status}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
