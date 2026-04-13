import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const pythonServerUrl = process.env.PYTHON_AI_SERVER_URL || 'http://localhost:6000';

    const response = await fetch(`${pythonServerUrl}/outputs/${filename}`);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch video output.' },
        { status: response.status }
      );
    }

    // Forward the content type and length if available
    const contentType = response.headers.get('content-type') || 'video/mp4';
    const contentLength = response.headers.get('content-length');

    const headers = new Headers();
    headers.set('Content-Type', contentType);
    if (contentLength) {
      headers.set('Content-Length', contentLength);
    }

    return new NextResponse(response.body, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error('AI server output proxy error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to proxy AI output file.' },
      { status: 500 }
    );
  }
}
