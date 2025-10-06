import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Flowchart } from '@/models/Flowchart';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { topic, id, data } = await request.json();

    if (!topic || !id || !data) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const flowchart = new Flowchart({
      topic,
      id,
      data,
    });

    await flowchart.save();

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error: any) {
    console.error('Error saving flowchart:', error);
    return NextResponse.json(
      { error: 'Failed to save flowchart' },
      { status: 500 }
    );
  }
}