# Runpod GPU Deployment

Runpod Pods are the best fit for this app because the backend uses long-running generation jobs with polling instead of a tiny single-request inference function.

## What You Need

- a Runpod account
- a GPU Pod
- this repo pushed to GitHub
- the existing Vercel frontend project

## Why Pods Instead of a Simple Endpoint

This backend:

- starts jobs
- renders for a while
- stores outputs
- exposes `/generate`, `/status/<jobId>`, and `/outputs/<filename>`

That maps naturally to a persistent Pod with an exposed HTTP port.

## Recommended Pod Setup

Use:

- a PyTorch or CUDA template
- at least one NVIDIA GPU with enough VRAM for AnimateDiff
- persistent storage if you want outputs and downloaded models to survive restarts

## Build Strategy

This repo already includes:

- `Dockerfile.gpu`
- `requirements.txt`
- `AnimateDiff/requirements.txt`
- `ai_server.py`

You can build from the project root with the included GPU Dockerfile.

## Deploy Steps

1. Create a Runpod Pod from a CUDA or PyTorch base.
2. Clone this repo into the Pod.
3. Build or run the backend container using `Dockerfile.gpu`.
4. Expose port `6000`.
5. Set environment variables:
   - `ANIMATEDIFF_ROOT=/app/AnimateDiff`
   - do not set `DEMO_MODE`
6. Start:

```bash
gunicorn -b 0.0.0.0:6000 ai_server:app
```

## Point The Frontend At Runpod

After the Pod is live, update Vercel:

```bash
PYTHON_AI_SERVER_URL=https://your-runpod-endpoint
```

Then redeploy the frontend.

## First-Run Notes

The backend can auto-download the default public AnimateDiff checkpoints when they are not already present locally.

For faster warm starts, keep these on persistent storage:

- `AnimateDiff/models/DreamBooth_LoRA/`
- `AnimateDiff/models/Motion_Module/`

## Validation Checklist

Check:

1. `GET /health`
2. `POST /generate`
3. `GET /status/<jobId>`
4. output playback through `/outputs/<filename>`

## Important

The Vercel frontend can stay exactly where it is. Only the backend host changes.
