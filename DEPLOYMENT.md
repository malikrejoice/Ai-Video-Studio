# Deployment Guide

## Current Status

The app is already deployed in two parts:

- Frontend: Vercel
- Backend: Render

Live endpoints:

- Frontend: `https://ai-video-studio-five-flax.vercel.app`
- Backend health: `https://ai-video-studio-python.onrender.com/health`

The current backend is intentionally running in `demo` mode. This keeps the full product flow online, but it does **not** run real AnimateDiff generation yet.

## Why Real AnimateDiff Is Not Live Yet

Real AnimateDiff requires all of the following:

- a GPU-capable host
- AnimateDiff Python dependencies
- Stable Diffusion checkpoint files
- AnimateDiff motion module checkpoint files

This repository includes the AnimateDiff code wrapper and config structure. The backend can now auto-download the default public motion module and backup DreamBooth checkpoint on a real host, but it still needs a GPU-capable runtime.

## Recommended Production Architecture

Use this split:

1. Vercel for the Next.js frontend
2. A GPU host for the Python generation backend

Recommended GPU hosts:

- RunPod
- Vast.ai
- Paperspace
- any CUDA-capable Linux VM you control

Render is fine for demo mode and API validation, but not the best target for real AnimateDiff inference.

## Frontend Deployment

The frontend lives at the repo root and is already configured for Vercel.

Required environment variable:

```bash
PYTHON_AI_SERVER_URL=https://your-real-backend-url
```

Commands:

```bash
npm install
npm run build
npm start
```

## Demo Backend Deployment

The included `render.yaml` deploys the Flask backend in demo mode:

```yaml
services:
  - type: web
    name: ai-video-studio-python
    env: python
    plan: free
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn -b 0.0.0.0:$PORT ai_server:app
    healthCheckPath: /health
    envVars:
      - key: DEMO_MODE
        value: "1"
```

This is useful for:

- verifying API connectivity
- testing UI generation flow
- validating job polling and output playback

## Real AnimateDiff Backend

To run real generation, you need:

1. a Linux GPU host
2. the AnimateDiff repo dependencies installed
3. `DEMO_MODE` removed
4. optional local model assets placed in:
   - `AnimateDiff/models/DreamBooth_LoRA/`
   - `AnimateDiff/models/Motion_Module/`

The backend will then detect:

- `ANIMATEDIFF_CMD`
- or `ANIMATEDIFF_ROOT`
- or the bundled `AnimateDiff/` directory

The updated wrapper in `scripts/animate.py` now:

- prepares a runtime AnimateDiff config file
- converts generated GIF output into the app's expected output file
- falls back to default public checkpoint filenames so the official AnimateDiff code can auto-download them when missing

## Validate Assets Before Switching Off Demo Mode

Run:

```bash
python scripts/check_animatediff_assets.py
```

If this reports only warnings, the runtime can still bootstrap itself on a real GPU host with internet access.

## Example GPU Host Setup

On a GPU Linux machine:

```bash
git clone https://github.com/malikrejoice/Ai-Video-Studio.git
cd Ai-Video-Studio/ai-video-studio
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install -r AnimateDiff/requirements.txt
```

Optional but recommended: place model checkpoints into:

```text
AnimateDiff/models/DreamBooth_LoRA/
AnimateDiff/models/Motion_Module/
```

Then set environment variables:

```bash
ANIMATEDIFF_ROOT=/path/to/Ai-Video-Studio/ai-video-studio/AnimateDiff
PORT=6000
```

Start the backend:

```bash
gunicorn -b 0.0.0.0:$PORT ai_server:app
```

Then update Vercel:

```bash
PYTHON_AI_SERVER_URL=https://your-gpu-backend-url
```

## Health Endpoint

`/health` now reports the current generation mode:

- `demo`
- `animatediff`
- `custom-command`
- `unconfigured`

When AnimateDiff is selected, it also reports whether required model checkpoints were found.

## Troubleshooting

### Health says `mode: demo`

`DEMO_MODE=1` is still enabled on the backend.

### Health says GPU is unavailable

The current host cannot run the official AnimateDiff pipeline because it requires CUDA. Move the backend to a GPU host.

### Health says `mode: animatediff` and local models are missing

That is acceptable if the host has outbound internet and can auto-download the default public checkpoints on first run.

### Generation fails immediately after turning demo off

Check:

- Python dependencies
- CUDA / GPU availability
- actual checkpoint file presence
- `ANIMATEDIFF_ROOT`
- file permissions on the model directories

### Frontend works but generation never completes

Check:

- `PYTHON_AI_SERVER_URL`
- backend `/health`
- backend logs
- whether the GPU host can actually run AnimateDiff end to end
