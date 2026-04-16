'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useVideoStore, useToast } from '@/lib/store';
import { Download, Play, Trash2 } from 'lucide-react';

const artworkFallbacks = [
  '/gallery/sunset-studio.svg',
  '/gallery/ocean-drive.svg',
  '/gallery/forest-frame.svg',
];

export default function ProjectsGrid() {
  const { projects, deleteProject } = useVideoStore();
  const { addToast } = useToast();

  const handleDelete = (id) => {
    deleteProject(id);
    addToast('Project deleted', 'success');
  };

  const handleDownload = (title) => {
    addToast(`Downloading ${title}...`, 'success');
  };

  const getArtwork = (project, idx) => {
    if (typeof project.thumbnail === 'string' && project.thumbnail.startsWith('/')) {
      return project.thumbnail;
    }

    return artworkFallbacks[idx % artworkFallbacks.length];
  };

  return (
    <div className="min-h-screen px-6 py-6 lg:px-8 lg:py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="mb-2 text-4xl font-bold text-[#1d2430]">My Projects</h1>
        <p className="text-[#6b7280]">
          {projects.length} video{projects.length !== 1 ? 's' : ''} generated
        </p>
      </motion.div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group glass overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(29,36,48,0.12)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={getArtwork(project, idx)}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1d2430]/78 via-transparent to-transparent" />

                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-[#1d2430]/32 backdrop-blur-[2px]"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#1d2430] shadow-[0_18px_30px_rgba(29,36,48,0.18)]"
                  >
                    <Play className="w-5 h-5" fill="currentColor" />
                  </motion.button>
                </motion.div>

                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/72">
                    Project preview
                  </p>
                  <h3 className="mt-1 truncate text-lg font-bold text-white">
                    {project.title}
                  </h3>
                </div>
              </div>

              <div className="p-4">
                <p className="mt-1 text-xs text-[#6b7280]">{project.date}</p>

                <div className="mt-4 flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownload(project.title)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#1d2430] py-2 text-sm font-medium text-white transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(project.id)}
                    className="flex items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-500 transition-all hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-[#ec6b2d]/20 to-[#0e7c86]/20">
            <Play className="w-10 h-10 text-[#ec6b2d]" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-[#1d2430]">No Projects Yet</h2>
          <p className="mb-6 text-[#6b7280]">
            Start by creating your first AI-generated video
          </p>
        </motion.div>
      )}
    </div>
  );
}
