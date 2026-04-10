'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sliders } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your preferences and account</p>
      </motion.div>

      {/* Settings Sections */}
      <div className="max-w-2xl space-y-6">
        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-dark p-6 rounded-lg"
        >
          <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-purple-400" />
            Account
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 block mb-2">
                Email Address
              </label>
              <input
                type="email"
                value="user@example.com"
                readOnly
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 block mb-2">
                Display Name
              </label>
              <input
                type="text"
                value="John Doe"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50"
              />
            </div>

            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Save Changes
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-dark p-6 rounded-lg"
        >
          <h2 className="text-white text-lg font-semibold mb-4">Preferences</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Dark Mode</p>
                <p className="text-sm text-gray-500">Always on</p>
              </div>
              <div className="w-12 h-6 bg-purple-500 rounded-full" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500">Get updates on generation</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Auto-save Drafts</p>
                <p className="text-sm text-gray-500">Save work automatically</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
          </div>
        </motion.div>

        {/* Billing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-dark p-6 rounded-lg"
        >
          <h2 className="text-white text-lg font-semibold mb-4">Billing</h2>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10 mb-4">
            <p className="text-gray-400 text-sm mb-2">Current Plan</p>
            <p className="text-white font-semibold text-lg">Pro - $29/month</p>
            <p className="text-xs text-gray-500 mt-1">Next billing date: May 10, 2026</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-4 py-2 border border-white/20 text-white rounded-lg font-medium hover:bg-white/10 transition-all"
          >
            Manage Subscription
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
