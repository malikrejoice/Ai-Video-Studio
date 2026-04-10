'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useVideoStore, useToast } from '@/lib/store';
import { Upload, X, Play, Download, RotateCcw } from 'lucide-react';

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function GeneratorPanel() {
  const {
    prompt,
    setPrompt,
    images,
    setImages,
    duration,
    setDuration,
    aspectRatio,
    setAspectRatio,
    style,
    setStyle,
    isGenerating,
    setIsGenerating,
    progress,
    setProgress,
    jobId,
    generationStatus,
    setJobId,
    setGenerationStatus,
    videoUrl,
    setVideoUrl,
    errorMessage,
    setErrorMessage,
    generatedVideo,
    setGeneratedVideo,
    addProject,
  } = useVideoStore();

  const { addToast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const styleOptions = ['Cinematic', 'Anime', 'Realistic', '3D Render'];
  const durationOptions = ['5s', '10s', '15s'];
  const aspectRatios = ['16:9', '9:16', '1:1'];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = [...e.dataTransfer.files];
    if (files.length > 5) {
      addToast('Maximum 5 images allowed', 'error');
      return;
    }
    const imageFiles = files.filter((f) => f.type.startsWith('image/'));
    setImages(imageFiles);
    addToast(`${imageFiles.length} image(s) uploaded`, 'success');
  };

  const handleImageUpload = (files) => {
    if (files.length > 5) {
      addToast('Maximum 5 images allowed', 'error');
      return;
    }

    const imageFiles = [...files].filter((f) => f.type.startsWith('image/'));
    setImages(imageFiles);
    addToast(`${imageFiles.length} image(s) uploaded`, 'success');
  };

  const pollVideoStatus = async (jobId, apiUrl) => {
    const maxAttempts = 30;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const statusRes = await fetch(`${apiUrl}/status/${jobId}`);
      const statusData = await statusRes.json();

      if (!statusRes.ok) {
        throw new Error(statusData.error || 'Status poll failed.');
      }

      setGenerationStatus(statusData.status || 'running');
      const progressValue = typeof statusData.progress === 'number' ? statusData.progress : 0;
      setProgress(Math.min(progressValue, 95));

      if (statusData.status === 'completed') {
        return statusData;
      }

      if (statusData.status === 'failed') {
        throw new Error(statusData.error || 'Video generation failed.');
      }

      await wait(2000);
      attempts += 1;
    }

    throw new Error('Video generation timed out. Please try again.');
  };

  const handleGenerateClick = async () => {
    if (prompt.trim().length < 10) {
      const message = 'Please enter a more detailed video description.';
      setErrorMessage(message);
      addToast(message, 'error');
      return;
    }

    setErrorMessage('');
    setIsGenerating(true);
    setProgress(10);
    addToast('Video generation started.', 'success');

    const apiUrl = '/api';

    try {
      const encodedImages = await Promise.all(images.map(toBase64));
      const durationValue = parseInt(duration, 10) || 10;

      const response = await fetch(`${apiUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          duration: durationValue,
          aspectRatio,
          style,
          images: encodedImages,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        const message = data.error || 'Unable to generate video. Try again later.';
        setErrorMessage(message);
        addToast(message, 'error');
        setIsGenerating(false);
        setProgress(0);
        setGenerationStatus('failed');
        return;
      }

      setJobId(data.jobId);
      setGenerationStatus(data.status || 'queued');

      const statusData = await pollVideoStatus(data.jobId, apiUrl);
      const videoPath = statusData.videoUrl || statusData.video;

      setGeneratedVideo({
        title: prompt,
        duration,
        aspectRatio,
        style,
      });
      setVideoUrl(videoPath);
      setProgress(100);
      setGenerationStatus('completed');
      addProject({
        title: prompt.substring(0, 50),
        thumbnail: '🎬',
        date: 'just now',
      });
      addToast('Video generated successfully!', 'success');
    } catch (error) {
      const message = error?.message || 'Failed to generate video';
      setErrorMessage(message);
      setProgress(0);
      setGenerationStatus('failed');
      addToast(message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    handleGenerateClick();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Create Video</h1>
        <p className="text-gray-400">
          Transform your ideas into stunning AI-generated videos
        </p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Panel */}
        <div className="xl:col-span-2 space-y-6">
          {/* Prompt Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-dark p-6"
          >
            <label className="block text-sm font-semibold text-white mb-3">
              Describe your video
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., A cinematic sunset over mountains with flying birds, ultra realistic, 4K quality"
              className="w-full h-32 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              Be descriptive for better results (minimum 10 characters)
            </p>
          </motion.div>

          {/* Image Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-dark p-6"
          >
            <label className="block text-sm font-semibold text-white mb-3">
              Upload Reference Images (Optional)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                dragActive
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-white/20 hover:border-purple-500/50'
              }`}
            >
              <Upload className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-white font-medium mb-1">
                Drag & drop images here
              </p>
              <p className="text-gray-500 text-sm mb-3">
                or click to browse (Max 5 images, up to 25MB each)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) {
                    handleImageUpload(e.target.files);
                  }
                }}
              />
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4 sm:grid-cols-4">
                {[...images].map((img, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative aspect-square rounded-lg bg-white/10 overflow-hidden group"
                  >
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Preview ${idx}`}
                      className="w-full h-full object-cover"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() =>
                        setImages(images.filter((_, i) => i !== idx))
                      }
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-white" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Video Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-dark p-6 space-y-4"
          >
            <h3 className="text-white font-semibold">Video Settings</h3>

            {/* Duration */}
            <div>
              <label className="text-xs font-medium text-gray-400 block mb-3">
                Duration
              </label>
              <div className="flex gap-2">
                {durationOptions.map((dur) => (
                  <motion.button
                    key={dur}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setDuration(dur)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      duration === dur
                        ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                        : 'bg-white/5 text-gray-400 border border-white/10 hover:border-purple-500/50'
                    }`}
                  >
                    {dur}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="text-xs font-medium text-gray-400 block mb-3">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-3 gap-2">
                {aspectRatios.map((ratio) => (
                  <motion.button
                    key={ratio}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setAspectRatio(ratio)}
                    className={`py-2 rounded-lg font-medium text-sm transition-all ${
                      aspectRatio === ratio
                        ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                        : 'bg-white/5 text-gray-400 border border-white/10 hover:border-purple-500/50'
                    }`}
                  >
                    {ratio}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Style Presets */}
            <div>
              <label className="text-xs font-medium text-gray-400 block mb-3">
                Style Preset
              </label>
              <div className="grid grid-cols-2 gap-2">
                {styleOptions.map((s) => (
                  <motion.button
                    key={s}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setStyle(s)}
                    className={`py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                      style === s
                        ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                        : 'bg-white/5 text-gray-400 border border-white/10 hover:border-purple-500/50'
                    }`}
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Generate Button */}
          <motion.button
            onClick={handleGenerateClick}
            disabled={isGenerating || !prompt.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all ${
              isGenerating || !prompt.trim()
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white glow-accent hover:shadow-2xl'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" fill="white" />
                Generate Video
              </>
            )}
          </motion.button>
        </div>

        {/* Output Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-dark p-6 sticky top-24 h-fit"
        >
          <h3 className="text-white font-semibold mb-4">Output</h3>

          {errorMessage && (
            <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
              {errorMessage}
            </div>
          )}

          {generatedVideo && videoUrl ? (
            <div className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-[#0a0e27] p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">Status</p>
                <p className="text-sm text-white font-medium">
                  {generationStatus === 'completed' ? 'Completed' : generationStatus}
                </p>
                {jobId && (
                  <p className="text-xs text-gray-500 mt-1">Job ID: {jobId}</p>
                )}
              </div>
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0a0e27]">
                <video
                  controls
                  src={videoUrl}
                  className="h-full w-full rounded-3xl bg-black"
                />
              </div>

              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="text-xs text-gray-400 mb-1">Generated Video</p>
                <p className="text-sm text-white font-medium truncate">
                  {generatedVideo.title}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {generatedVideo.duration} • {generatedVideo.aspectRatio}
                </p>
              </div>

              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                href={videoUrl}
                download
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 py-2 text-white font-medium hover:shadow-lg transition-all"
              >
                <Download className="w-4 h-4" />
                Download
              </motion.a>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGenerateClick}
                disabled={isGenerating}
                className="w-full py-2 bg-white/10 border border-white/20 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-white/20 transition-all disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4" />
                Regenerate
              </motion.button>
            </div>
          ) : isGenerating ? (
            <div className="rounded-3xl border border-white/10 bg-[#0a0e27] p-8 text-center text-muted">
              <p className="text-sm text-white">Generating your video... Please wait.</p>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center mx-auto mb-3 border border-white/10">
                <Play className="w-8 h-8 text-purple-400" />
              </div>
              <p className="text-gray-400 text-sm">
                Your generated video will appear here
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
