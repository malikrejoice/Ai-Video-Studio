import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = await params;
    const pythonServerUrl = process.env.PYTHON_AI_SERVER_URL || 'http://localhost:6000';
    
    // In production, we need the public base URL of this Next.js app to build the videoUrl
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host');
    const apiBaseUrl = `${protocol}://${host}`;

    const response = await fetch(`${pythonServerUrl}/status/${jobId}`);
    const data = await response.json();

    if (data.video) {
      data.videoUrl = `${apiBaseUrl}/api/outputs/${data.video}`;
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('AI server status error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch job status from AI server.' },
      { status: 500 }
    );
  }
}
