# AI Video Studio - Professional Web App UI

A modern, professional AI Video Generator Web App built with **Next.js**, **Tailwind CSS**, and **Framer Motion**. Designed to feel like premium AI SaaS products like RunwayML, Kling, and Midjourney.

## 🎨 Features

### Design
- ✨ **Dark Theme** with glassmorphism UI
- 🎭 **Smooth Animations** powered by Framer Motion
- 📱 **Fully Responsive** (mobile, tablet, desktop)
- 🎪 **Modern Gradients** and glow effects
- ⚡ **Smooth Transitions** throughout the app

### Pages & Components

1. **Dashboard**
   - Statistics overview (videos generated, credits used, avg quality)
   - Recent activity feed
   - Quick stats cards with icons

2. **Create Video**
   - Large prompt text area with examples
   - Drag & drop image upload (up to 5 images)
   - Image preview thumbnails
   - Video duration settings (5s, 10s, 15s)
   - Aspect ratio selector (16:9, 9:16, 1:1)
   - Style presets (Cinematic, Anime, Realistic, 3D Render)
   - Big glowing "Generate Video" button
   - Output preview panel with download & regenerate options
   - Sticky output panel on desktop

3. **My Projects**
   - Grid layout of generated videos
   - Hover animations and preview
   - Download & delete options
   - Empty state with clear messaging

4. **Templates**
   - Pre-made video templates (Travel, Product, Anime, 3D, Documentary, Music)
   - Template descriptions and prompts
   - Copy-to-clipboard functionality
   - Organized by category

5. **Settings**
   - Account management
   - User preferences (Dark mode toggle, notifications, auto-save)
   - Billing information
   - Subscription management

### Navigation
- **Sidebar** with collapsible menu (responsive)
- **Top Navbar** with search, credits counter, notifications, and user profile
- **Mobile-friendly** navigation with hamburger menu

### Interactive Elements
- Toast notifications (success/error)
- Loading animations
- Skeleton loaders (ready to implement)
- Progress indicators
- Smooth page transitions
- Hover effects and micro-interactions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Navigate to project directory**
   ```bash
   cd ai-video-studio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   - Navigate to `http://localhost:3000`

### Backend server
The application now uses **Next.js API Routes** located in `src/app/api/`. These handle the proxying to the AI server automatically.

**To run locally for development:**
1. Start the local AI server (Terminal 1):
   ```bash
   venv\Scripts\activate
   npm run ai-server
   ```
2. Start the frontend (Terminal 2):
   ```bash
   npm run dev
   ```
   The frontend will connect to `http://localhost:3000/api` and proxy requests to your AI server.

*(Note: `server.js` is now legacy and no longer required for the application to function).*

### Local AI server
This repo now supports a local Python AI server at `http://localhost:6000`.
- `ai_server.py` runs a Flask service with a queued generation workflow
- `/generate` creates a job and returns a `jobId`
- `/status/<jobId>` polls generation progress and returns the output filename
- `/outputs/<filename>` serves generated MP4 videos
- The Node backend proxies requests and streams the video through `/outputs/<filename>`

`ai_server.py` uses `scripts/animate.py` as a wrapper for your local AnimateDiff CLI.
The wrapper will:
- use `ANIMATEDIFF_CMD` if set
- use `ANIMATEDIFF_ROOT` if set and contains `scripts/animate.py`
- try to run `python -m animatediff` / `python -m animediff` if installed

Before running the Python server, install Python dependencies:
```bash
python -m venv venv
venv\Scripts\activate  # On Windows
python -m pip install -r requirements.txt
```

**Installing AnimateDiff:**

Since AnimateDiff is not available on PyPI, you need to install it manually:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/guoyww/AnimateDiff.git
   cd AnimateDiff
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set the environment variable:**
   ```bash
   # Point to your AnimateDiff installation
   set ANIMATEDIFF_ROOT=C:\path\to\AnimateDiff
   ```

   Or add it to your `.env.local`:
   ```
   ANIMATEDIFF_ROOT=C:\path\to\AnimateDiff
   ```

**Alternative: Use the command directly:**
```bash
set ANIMATEDIFF_CMD=python C:\path\to\AnimateDiff\scripts\animate.py
```

**Demo mode (for testing without AnimateDiff):**
If you want to test the full UI and backend pipeline before installing AnimateDiff, you can use demo mode:
```bash
set DEMO_MODE=1
```
This will generate simple animated text videos instead of AI-generated content, but allows you to test the complete workflow.

**Test your installation:**
```bash
python test_animatediff.py
```

**Quick setup (Windows):**
```bash
setup_animatediff.bat "C:\path\to\AnimateDiff"
```

### Generation flow
1. Frontend sends prompt, duration, style, aspect ratio, and optional reference images to `/generate`
2. Node backend forwards the job to the local Python server
3. Frontend polls `/status/<jobId>` until the job completes
4. A playable MP4 is served via `http://localhost:5000/outputs/<filename>`

### Build for Production
```bash
npm run build
npm start
```

## 📁 Project Structure

```
ai-video-studio/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Main page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   ├── Navbar.jsx          # Top navigation bar
│   │   ├── Dashboard.jsx       # Dashboard page
│   │   ├── GeneratorPanel.jsx  # Video creator
│   │   ├── ProjectsGrid.jsx    # Projects gallery
│   │   ├── TemplatesPage.jsx   # Templates section
│   │   ├── SettingsPage.jsx    # Settings page
│   │   └── ToastContainer.jsx  # Toast notifications
│   └── lib/
│       └── store.js            # Zustand stores (state management)
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
├── tsconfig.json
└── package.json
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS 3
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React
- **Language**: JavaScript/TypeScript

## 🎯 Key Features Breakdown

### Glassmorphism UI
- Semi-transparent cards with backdrop blur
- Elegant gradient borders
- Glow effects on interactive elements

### Dark Theme
- Deep black backgrounds (`#0a0e27`)
- Purple & Cyan accent colors
- High contrast for accessibility
- Smooth color transitions

### Animations
- Page transitions
- Button hover effects
- Drag & drop feedback
- Loading spinners
- Toast animations
- Card entrance animations with staggered delays

### State Management
Uses Zustand for lightweight state management:
- Video generation state
- UI navigation state
- Toast notifications
- Project management

### Responsive Design
- Mobile-first approach
- Hidden sidebar on mobile (hamburger menu)
- Adaptive grid layouts
- Touch-friendly buttons and inputs
- Optimized spacing for all screen sizes

## 📝 Usage Examples

### Creating a Video
1. Navigate to "Create Video"
2. Enter a detailed prompt (e.g., "A cinematic sunset over mountains...")
3. Optionally upload 1-5 reference images
4. Choose duration, aspect ratio, and style
5. Click "Generate Video"
6. Download or regenerate the result

### Managing Projects
1. Go to "My Projects"
2. Hover over any video to see action buttons
3. Download, regenerate, or delete videos
4. Add to favorites (extensible feature)

### Using Templates
1. Navigate to "Templates"
2. Browse different video categories
3. Click "Use Template" to copy the prompt
4. Paste in "Create Video" and customize

## 🔄 Future Enhancements

- [ ] Backend API integration
- [ ] Real video generation with AI models
- [ ] User authentication
- [ ] Database for project persistence
- [ ] Advanced filters and search
- [ ] Video editing timeline
- [ ] Collaboration features
- [ ] Export options (MP4, WebM, GIF)
- [ ] Progress bars with estimated time
- [ ] Video quality preview
- [ ] Watermark customization
- [ ] API rate limiting display
- [ ] Dark/Light theme toggle
- [ ] Keyboard shortcuts
- [ ] Undo/Redo functionality

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```js
colors: {
  accent: {
    purple: '#a855f7',
    cyan: '#06b6d4',
    blue: '#3b82f6',
  }
}
```

### Modify Animations
Edit component files or `globals.css` to adjust:
- Duration
- Delay
- Easing
- Transform effects

### Update Branding
1. Change logo in`Sidebar.jsx`
2. Update app name and description
3. Modify color scheme in Tailwind config
4. Update favicon and metadata in `layout.tsx`

## 📄 License

This project is open source and available for learning and commercial use.

## 🤝 Contributing

Feel free to fork, modify, and enhance this UI template!

---

**Built with ❤️ for modern AI SaaS applications**

Visit the live demo and customize it for your needs!
