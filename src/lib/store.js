import { create } from 'zustand';

export const useToast = create((set) => ({
  toasts: [],
  addToast: (message, type = 'success') => {
    const id = Date.now();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 3000);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export const useVideoStore = create((set) => ({
  prompt: '',
  images: [],
  duration: '10s',
  aspectRatio: '16:9',
  style: 'Cinematic',
  isGenerating: false,
  progress: 0,
  jobId: null,
  generationStatus: 'idle',
  videoUrl: null,
  errorMessage: '',
  generatedVideo: null,
  backendHealth: null,
  projects: [
    { id: 1, title: 'Mountain Sunset', thumbnail: '/gallery/sunset-studio.svg', date: '2 days ago' },
    { id: 2, title: 'Ocean Waves', thumbnail: '/gallery/ocean-drive.svg', date: '1 week ago' },
    { id: 3, title: 'Forest Path', thumbnail: '/gallery/forest-frame.svg', date: '2 weeks ago' },
  ],
  setPrompt: (prompt) => set({ prompt }),
  setImages: (images) => set({ images }),
  setDuration: (duration) => set({ duration }),
  setAspectRatio: (aspectRatio) => set({ aspectRatio }),
  setStyle: (style) => set({ style }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setProgress: (progress) => set({ progress }),
  setJobId: (jobId) => set({ jobId }),
  setGenerationStatus: (generationStatus) => set({ generationStatus }),
  setVideoUrl: (videoUrl) => set({ videoUrl }),
  setErrorMessage: (errorMessage) => set({ errorMessage }),
  setGeneratedVideo: (video) => set({ generatedVideo: video }),
  setBackendHealth: (backendHealth) => set({ backendHealth }),
  addProject: (project) =>
    set((state) => ({
      projects: [{ ...project, id: Date.now() }, ...state.projects],
    })),
  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    })),
}));

export const useAppState = create((set) => ({
  currentPage: 'dashboard',
  sidebarOpen: true,
  setCurrentPage: (page) => set({ currentPage: page }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
