'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useVideoStore, useToast } from '@/lib/store';
import { Download, Trash2, Play } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">My Projects</h1>
        <p className="text-gray-400">
          {projects.length} video{projects.length !== 1 ? 's' : ''} generated
        </p>
      </motion.div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group glass-dark rounded-lg overflow-hidden hover:border-purple-500/50 transition-all hover:shadow-lg"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gradient-to-br from-purple-500/20 to-cyan-500/20 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  {project.thumbnail}
                </div>

                {/* Overlay on Hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white"
                  >
                    <Play className="w-5 h-5" fill="white" />
                  </motion.button>
                </motion.div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-white font-semibold truncate">
                  {project.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{project.date}</p>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownload(project.title)}
                    className="flex-1 py-2 bg-white/10 border border-white/20 text-white text-sm font-medium rounded-lg hover:bg-white/20 flex items-center justify-center gap-1 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(project.id)}
                    className="px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium rounded-lg hover:bg-red-500/20 flex items-center justify-center transition-all"
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
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center border border-white/10 mb-4">
            <Play className="w-10 h-10 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No Projects Yet</h2>
          <p className="text-gray-400 mb-6">
            Start by creating your first AI-generated video
          </p>
        </motion.div>
      )}
    </div>
  );
}
