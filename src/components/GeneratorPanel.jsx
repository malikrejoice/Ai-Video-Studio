'use client';

import React, { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useVideoStore, useToast } from '@/lib/store';
import {
  Cpu,
  Download,
  Play,
  RotateCcw,
  Sparkles,
  Upload,
  Wand2,
  X,
} from 'lucide-react';

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const promptIdeas = [
  'Luxury perfume campaign in a rain-soaked city alley, slow motion droplets, chrome reflections',
  'Anime-style night drive through neon streets, dreamy camera drift, cinematic headlights',
  'Editorial product film for a smartwatch, studio shadows, macro glints, premium pacing',
];

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
    backendHealth,
  } = useVideoStore();

  const { addToast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const styleOptions = ['Cinematic', 'Anime', 'Realistic', '3D Render'];
  const durationOptions = ['5s', '10s', '15s'];
  const aspectRatios = ['16:9', '9:16', '1:1'];

  const backendLabel = useMemo(() => {
    if (backendHealth?.mode === 'demo') return 'Demo backend active';
    if (backendHealth?.gpu?.available) return 'GPU backend connected';
    return 'Backend status pending';
  }, [backendHealth]);

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

  return (
    <div className="min-h-screen px-6 py-6 lg:px-8 lg:py-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 grid gap-6 xl:grid-cols-[1.35fr_0.9fr]"
      >
        <div className="glass p-7 lg:p-8">
          <div className="pill pill-warm">
            <Wand2 className="h-4 w-4" />
            Create video
          </div>
          <h1 className="mt-5 text-4xl font-bold text-[#1d2430]">Build something your friends will want to replay.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#5b6472]">
            Start with a cinematic prompt, add references if you have them, then generate a clean preview without leaving the app.
          </p>
        </div>

        <div className="glass-dark p-7 text-white">
          <div className="pill pill-dark">
            <Cpu className="h-4 w-4" />
            {backendLabel}
          </div>
          <p className="mt-5 text-sm leading-7 text-white/75">
            {backendHealth?.gpu?.available
              ? backendHealth.gpu.reason
              : backendHealth?.gpu?.reason || 'Checking generation backend'}
          </p>
          <div className="mt-6 rounded-[1.4rem] border border-white/10 bg-white/6 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/55">What changes later</p>
            <p className="mt-2 text-sm leading-7 text-white/78">
              Your public frontend link stays the same when you upgrade to a GPU host. Only the backend URL changes behind the scenes.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="glass p-6 lg:p-7"
          >
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-semibold text-[#1d2430]">
                Describe the shot
              </label>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6f55]">
                {prompt.trim().length} characters
              </span>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A crisp fashion campaign film inside a glasshouse, slow camera glide, luxurious highlights, editorial feel"
              className="mt-4 h-36 w-full resize-none rounded-[1.5rem] border border-[#1d2430]/8 bg-white/72 px-5 py-4 text-[#1d2430] outline-none transition-all placeholder:text-[#8b95a7] focus:border-[#ec6b2d]/45 focus:bg-white"
            />
            <p className="mt-3 text-sm text-[#6b7280]">
              More detail usually means better motion, stronger lighting, and a more cinematic result.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {promptIdeas.map((idea) => (
                <button
                  key={idea}
                  onClick={() => setPrompt(idea)}
                  className="rounded-full border border-[#1d2430]/8 bg-white/76 px-4 py-2 text-xs font-semibold text-[#364152] transition hover:border-[#ec6b2d]/25 hover:text-[#1d2430]"
                >
                  {idea.slice(0, 64)}...
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass p-6 lg:p-7"
          >
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-semibold text-[#1d2430]">
                Reference images
              </label>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6f55]">
                Optional
              </span>
            </div>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`mt-4 rounded-[1.7rem] border-2 border-dashed p-10 text-center transition-all cursor-pointer ${
                dragActive
                  ? 'border-[#ec6b2d] bg-[#fff4ec]'
                  : 'border-[#1d2430]/12 bg-white/68 hover:border-[#0e7c86]/35 hover:bg-white'
              }`}
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff3eb] text-[#ec6b2d]">
                <Upload className="h-6 w-6" />
              </div>
              <p className="mt-4 text-base font-semibold text-[#1d2430]">
                Drag references here or tap to upload
              </p>
              <p className="mt-2 text-sm text-[#6b7280]">
                Up to 5 images. Great for mood, product framing, or character consistency.
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

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {[...images].map((img, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.84 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group relative aspect-square overflow-hidden rounded-[1.2rem] border border-[#1d2430]/10 bg-white"
                  >
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Preview ${idx}`}
                      className="h-full w-full object-cover"
                    />
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#1d2430]/75 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="glass p-6 lg:p-7"
          >
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6f55] block mb-3">
                  Duration
                </label>
                <div className="flex gap-2">
                  {durationOptions.map((dur) => (
                    <motion.button
                      key={dur}
                      whileHover={{ scale: 1.03 }}
                      onClick={() => setDuration(dur)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                        duration === dur
                          ? 'bg-[#1d2430] text-white'
                          : 'border border-[#1d2430]/10 bg-white/72 text-[#5b6472]'
                      }`}
                    >
                      {dur}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6f55] block mb-3">
                  Aspect ratio
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {aspectRatios.map((ratio) => (
                    <motion.button
                      key={ratio}
                      whileHover={{ scale: 1.03 }}
                      onClick={() => setAspectRatio(ratio)}
                      className={`rounded-[1rem] py-2 text-sm font-semibold transition-all ${
                        aspectRatio === ratio
                          ? 'bg-[#ec6b2d] text-white'
                          : 'border border-[#1d2430]/10 bg-white/72 text-[#5b6472]'
                      }`}
                    >
                      {ratio}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6f55] block mb-3">
                  Style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {styleOptions.map((s) => (
                    <motion.button
                      key={s}
                      whileHover={{ scale: 1.03 }}
                      onClick={() => setStyle(s)}
                      className={`rounded-[1rem] px-3 py-2 text-sm font-semibold transition-all ${
                        style === s
                          ? 'bg-[#0e7c86] text-white'
                          : 'border border-[#1d2430]/10 bg-white/72 text-[#5b6472]'
                      }`}
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.button
            onClick={handleGenerateClick}
            disabled={isGenerating || !prompt.trim()}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`flex w-full items-center justify-center gap-3 rounded-[1.5rem] py-4 text-lg font-bold transition-all ${
              isGenerating || !prompt.trim()
                ? 'cursor-not-allowed bg-[#d3d7de] text-[#7c8595]'
                : 'bg-gradient-to-r from-[#ec6b2d] via-[#f0953a] to-[#0e7c86] text-white glow-accent'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Generating your clip
              </>
            ) : (
              <>
                <Play className="h-5 w-5" fill="white" />
                Generate video
              </>
            )}
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="glass-dark sticky top-8 h-fit p-6 text-white"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-bold">Output preview</h3>
            <div className="pill pill-dark">
              <Sparkles className="h-4 w-4" />
              {generationStatus === 'completed' ? 'Ready' : generationStatus}
            </div>
          </div>

          {errorMessage && (
            <div className="mt-4 rounded-[1.4rem] border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-100">
              {errorMessage}
            </div>
          )}

          {generatedVideo && videoUrl ? (
            <div className="mt-5 space-y-4">
              <div className="rounded-[1.6rem] border border-white/10 bg-white/6 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/55">Latest render</p>
                <p className="mt-2 text-sm font-semibold text-white">{generatedVideo.title}</p>
                <p className="mt-2 text-xs text-white/56">
                  {generatedVideo.duration} • {generatedVideo.aspectRatio} • {generatedVideo.style}
                </p>
                {jobId && (
                  <p className="mt-2 text-xs text-white/45">Job ID: {jobId}</p>
                )}
              </div>

              <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-black">
                <video controls src={videoUrl} className="h-full w-full bg-black" />
              </div>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={videoUrl}
                download
                className="flex w-full items-center justify-center gap-2 rounded-[1.1rem] bg-white px-4 py-3 font-semibold text-[#1d2430]"
              >
                <Download className="h-4 w-4" />
                Download render
              </motion.a>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerateClick}
                disabled={isGenerating}
                className="flex w-full items-center justify-center gap-2 rounded-[1.1rem] border border-white/12 bg-white/8 px-4 py-3 font-semibold text-white disabled:opacity-50"
              >
                <RotateCcw className="h-4 w-4" />
                Regenerate
              </motion.button>
            </div>
          ) : isGenerating ? (
            <div className="mt-5 rounded-[1.6rem] border border-white/10 bg-white/6 p-6">
              <p className="text-sm font-medium text-white">Generating your video preview</p>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#ec6b2d] to-[#0e7c86] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-white/50">
                {progress}% complete
              </p>
            </div>
          ) : (
            <div className="mt-5 rounded-[1.8rem] border border-white/10 bg-white/6 p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-white/10">
                <Play className="h-8 w-8 text-white/82" />
              </div>
              <p className="mt-4 text-base font-semibold text-white">Your rendered clip will appear here.</p>
              <p className="mt-2 text-sm leading-7 text-white/65">
                Pick a style, describe the motion clearly, and you&apos;ll get a playback-ready preview in this panel.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
