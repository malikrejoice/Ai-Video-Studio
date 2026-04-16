import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const pythonServerUrl = process.env.PYTHON_AI_SERVER_URL || 'http://localhost:6000';
    const response = await fetch(`${pythonServerUrl}/health`, {
      cache: 'no-store',
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('AI server health error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch AI server health.' },
      { status: 500 }
    );
  }
}
