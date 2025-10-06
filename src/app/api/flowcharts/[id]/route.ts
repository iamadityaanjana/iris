import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Flowchart } from '@/models/Flowchart';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const flowchart = await Flowchart.findOne({ id: params.id });

    if (!flowchart) {
      return NextResponse.json(
        { error: 'Flowchart not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(flowchart);
  } catch (error: any) {
    console.error('Error fetching flowchart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flowchart' },
      { status: 500 }
    );
  }
}