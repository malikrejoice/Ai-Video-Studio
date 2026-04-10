import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, duration, aspectRatio, style, images } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
    }

    const pythonServerUrl = process.env.PYTHON_AI_SERVER_URL || 'http://localhost:6000';

    const response = await fetch(`${pythonServerUrl}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        duration,
        aspectRatio,
        style,
        images,
      }),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('AI server generate error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate video from AI server.' },
      { status: 500 }
    );
  }
}
