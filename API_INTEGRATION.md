# API Integration Guide

This document shows how to integrate real video generation APIs with the UI.

## Current State

The app currently has **mock functionality** - it simulates video generation without a real backend. All data is stored in Zustand (in-memory state).

---

## Ready to Add Backend?

Here's how to integrate with real APIs:

### Option 1: Runway ML API

**Prerequisites:**
- Runway account at [runwayml.com](https://runwayml.com)
- API key

**Installation:**
```bash
npm install runway-sdk
```

**Integration Example:**
```javascript
// src/lib/videoApi.js
import Runway from '@runwayml/sdk';

const runway = new Runway({
  apiKey: process.env.NEXT_PUBLIC_RUNWAY_API_KEY,
});

export async function generateVideo(prompt, duration, aspectRatio) {
  try {
    const task = await runway.tasks.create('gen3', {
      watermark: false,
      prompt: prompt,
      duration: parseInt(duration),
      aspectRatio: aspectRatio,
    });

    // Poll for completion
    while (task.status !== 'DONE') {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const updated = await runway.tasks.retrieve(task.id);
      task.status = updated.status;
    }

    return {
      id: task.id,
      videoUrl: task.output[0],
      title: prompt.substring(0, 50),
    };
  } catch (error) {
    console.error('Video generation failed:', error);
    throw error;
  }
}
```

**Update GeneratorPanel.jsx:**
```javascript
import { generateVideo } from '@/lib/videoApi';

const handleGenerateClick = async () => {
  if (!prompt.trim()) {
    addToast('Please enter a video description', 'error');
    return;
  }

  setIsGenerating(true);
  try {
    const video = await generateVideo(prompt, duration, aspectRatio);
    setGeneratedVideo(video);
    addProject({
      title: video.title,
      thumbnail: '🎬',
      date: 'just now',
      videoUrl: video.videoUrl,
    });
    addToast('Video generated successfully!', 'success');
  } catch (error) {
    addToast('Video generation failed', 'error');
  } finally {
    setIsGenerating(false);
  }
};
```

---

### Option 2: Stability AI Video API

**Installation:**
```bash
npm install @stability-ai/sdk
```

**Integration:**
```javascript
// src/lib/stabilityApi.js
import { Stability } from '@stability-ai/sdk';

const stability = new Stability({
  apiKey: process.env.NEXT_PUBLIC_STABILITY_API_KEY,
});

export async function generateVideoWithStability(prompt, durationSeconds) {
  const response = await stability.video.generate({
    prompt: prompt,
    durationSeconds: parseInt(durationSeconds),
    seedImage: null, // or pass image file
  });

  return {
    id: response.id,
    videoUrl: response.result.url,
  };
}
```

---

### Option 3: Custom Backend with Python

**Backend structure (optional API folder):**
```
├── api/
│   ├── requirements.txt
│   ├── server.py          # FastAPI or Flask
│   └── video_generator.py # Your generation logic
```

**server.py example:**
```python
from fastapi import FastAPI, File, UploadFile
from fastapi.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VideoRequest(BaseModel):
    prompt: str
    duration: str
    aspectRatio: str
    style: str

@app.post("/api/generate-video")
async def generate_video(request: VideoRequest):
    # Your video generation logic here
    # Could use: Runway, Stability, replicate, etc.
    
    return {
        "id": "video_123",
        "videoUrl": "https://...",
        "title": request.prompt[:50],
        "status": "completed"
    }
```

**Frontend API call:**
```javascript
export async function generateVideo(prompt, duration, aspectRatio, style) {
  const response = await fetch('http://localhost:8000/api/generate-video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, duration, aspectRatio, style }),
  });

  if (!response.ok) throw new Error('Generation failed');
  return response.json();
}
```

---

## Database Setup

### Option A: Supabase (PostgreSQL + Auth + Realtime)

**Installation:**
```bash
npm install @supabase/supabase-js
```

**Setup:**
```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Save project
export async function saveProject(userId, project) {
  const { data, error } = await supabase
    .from('projects')
    .insert([
      {
        user_id: userId,
        title: project.title,
        prompt: project.prompt,
        video_url: project.videoUrl,
        created_at: new Date(),
      }
    ]);

  if (error) throw error;
  return data;
}

// Fetch projects
export async function getProjects(userId) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
```

### Option B: Firebase

**Installation:**
```bash
npm install firebase
```

**Setup:**
```javascript
// src/lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ... other config
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

### Option C: MongoDB + NextAuth

**Installation:**
```bash
npm install next-auth mongodb
```

**Setup (.env.local):**
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/db
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

---

## Image Upload to Cloud

### Option A: Supabase Storage

```javascript
export async function uploadImage(file, userId) {
  const fileName = `${userId}/${Date.now()}-${file.name}`;
  
  const { data, error } = await supabase
    .storage
    .from('videos')
    .upload(fileName, file);

  if (error) throw error;
  return supabase.storage.from('videos').getPublicUrl(fileName);
}
```

### Option B: AWS S3

```bash
npm install aws-sdk
```

```javascript
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export async function uploadImage(file) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `uploads/${Date.now()}-${file.name}`,
    Body: file,
  };

  const result = await s3.upload(params).promise();
  return result.Location;
}
```

### Option C: Cloudinary

```bash
npm install next-cloudinary
```

```javascript
import { CldUploadWidget } from 'next-cloudinary';

// In component:
<CldUploadWidget onSuccess={(result) => setImages([...images, result])}>
  {({ open }) => (
    <button onClick={() => open()}>Upload Image</button>
  )}
</CldUploadWidget>
```

---

## Authentication Setup

### NextAuth.js + Supabase

**Installation:**
```bash
npm install next-auth
```

**[...nextauth].js:**
```javascript
import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Create user in database if new
      return true;
    },
  },
};

export default NextAuth(authOptions);
```

---

## Payments Integration

### Stripe

**Installation:**
```bash
npm install @stripe/react-stripe-js stripe
```

**Setup:**
```javascript
// src/lib/stripe.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createCheckoutSession(priceId, userId) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${process.env.NEXTAUTH_URL}/success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/settings`,
    customer_email: userId,
  });
  return session;
}
```

---

## Environment Variables Template

**.env.local:**
```
# AI Video API
NEXT_PUBLIC_RUNWAY_API_KEY=your_key
NEXT_PUBLIC_STABILITY_API_KEY=your_key

# Database
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
MONGODB_URI=your_connection_string

# Authentication
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
GITHUB_ID=your_id
GITHUB_SECRET=your_secret

# Payments
STRIPE_PUBLIC_KEY=your_key
STRIPE_SECRET_KEY=your_key

# AWS/Cloud Storage
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_BUCKET_NAME=your_bucket
```

---

## Testing Integration

**Example test with mock API:**
```javascript
// src/lib/__tests__/videoApi.test.js
import { generateVideo } from '../videoApi';

describe('Video Generation', () => {
  it('should generate a video', async () => {
    const video = await generateVideo(
      'A sunset over mountains',
      '10',
      '16:9'
    );
    
    expect(video).toHaveProperty('id');
    expect(video).toHaveProperty('videoUrl');
  });
});
```

---

## Common Pitfalls

1. **Exposing API keys** - Use `.env.local` and never commit secrets
2. **CORS errors** - Make sure backend allows frontend origin
3. **Rate limiting** - Implement queuing for video generation
4. **Large file uploads** - Use chunked uploads for stability
5. **Storage limits** - Monitor cloud storage usage
6. **Cold starts** - Use serverless with proper timeouts

---

## Next Steps

1. Start with **mock data** (current state) ✅
2. Add **authentication** (NextAuth + Supabase)
3. Set up **database** (Supabase or Firebase)
4. Integrate **video generation API** (Runway or Stability)
5. Add **cloud storage** for videos and images
6. Implement **payments** (Stripe)
7. Add **analytics** (Vercel or PostHog)

---

Need help? Check official docs for each service!
