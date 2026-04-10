'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Copy, ArrowRight } from 'lucide-react';
import { useToast } from '@/lib/store';

export default function TemplatesPage() {
  const { addToast } = useToast();

  const templates = [
    {
      title: 'Cinematic Travel',
      description: 'Explore breathtaking destinations with stunning visuals',
      category: 'Travel',
      prompt:
        'Cinematic travel montage of exotic locations with dynamic transitions',
      emoji: '✈️',
    },
    {
      title: 'Product Showcase',
      description: 'Professional product demonstrations and unboxing videos',
      category: 'Product',
      prompt: 'Ultra-realistic product showcase with smooth rotations and highlights',
      emoji: '📦',
    },
    {
      title: 'Anime Eye Catch',
      description: 'Anime-style opening sequence with vibrant colors',
      category: 'Animation',
      prompt: 'Anime opening sequence with fast cuts and dramatic music timing',
      emoji: '🎌',
    },
    {
      title: '3D Tech Animation',
      description: '3D rendered tech product and UI demonstrations',
      category: '3D',
      prompt: '3D rendered technology interface with glowing effects and transitions',
      emoji: '🎮',
    },
    {
      title: 'Nature Documentary',
      description: 'BBC documentary style nature footage',
      category: 'Documentary',
      prompt: 'BBC nature documentary style with wildlife and scenic landscapes',
      emoji: '🦁',
    },
    {
      title: 'Music Video Vibes',
      description: 'Artists and performers with dynamic effects',
      category: 'Music',
      prompt: 'Music video style with rhythm-synced transitions and effects',
      emoji: '🎵',
    },
  ];

  const handleUseTemplate = (prompt) => {
    navigator.clipboard.writeText(prompt);
    addToast('Template prompt copied to clipboard!', 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Templates</h1>
        <p className="text-gray-400">
          Get inspired with ready-to-use video templates
        </p>
      </motion.div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group glass-dark rounded-lg overflow-hidden hover:border-purple-500/50 transition-all hover:shadow-lg"
          >
            {/* Header */}
            <div className="relative h-24 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border-b border-white/10 flex items-center justify-center text-5xl">
              {template.emoji}
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    {template.title}
                  </h3>
                  <span className="inline-block mt-2 px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded-full">
                    {template.category}
                  </span>
                </div>
              </div>

              <p className="text-gray-400 text-sm mt-3 line-clamp-2">
                {template.description}
              </p>

              {/* Prompt Preview */}
              <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-xs text-gray-500 mb-2">Sample Prompt</p>
                <p className="text-xs text-gray-300 line-clamp-2">
                  {template.prompt}
                </p>
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleUseTemplate(template.prompt)}
                className="w-full mt-4 py-2 bg-white/5 border border-white/20 text-white font-medium rounded-lg hover:bg-white/10 flex items-center justify-center gap-2 transition-all group/btn"
              >
                <Copy className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                Use Template
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
