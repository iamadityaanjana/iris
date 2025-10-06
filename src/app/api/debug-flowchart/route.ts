import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'get-flowchart API route is working',
    timestamp: new Date().toISOString(),
    method: 'GET'
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ 
      message: 'get-flowchart POST is working',
      timestamp: new Date().toISOString(),
      method: 'POST',
      receivedBody: body
    });
  } catch (error) {
    return NextResponse.json({ 
      message: 'get-flowchart POST error',
      error: error instanceof Error ? error.message : 'Unknown error',
      method: 'POST'
    }, { status: 400 });
  }
}