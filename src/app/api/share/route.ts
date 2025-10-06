import { NextResponse } from 'next/server';
import mongoose from 'mongoose';



// Initialize MongoDB connection
if (!mongoose.connections[0].readyState) {
  mongoose.connect(process.env.MONGODB_URI!);
}

// Flowchart Schema
const flowchartSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true,
    unique: true,
  },
  data: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 7 * 24 * 60 * 60, // Documents will be automatically deleted after 7 days
  },
});

const Flowchart = mongoose.models.Flowchart || mongoose.model('Flowchart', flowchartSchema);


import dbConnect from '@/lib/dbConnect';


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

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('Error saving flowchart:', error);
    return NextResponse.json(
      { error: 'Failed to save flowchart' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const flowchart = await Flowchart.findOne({ id });

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

