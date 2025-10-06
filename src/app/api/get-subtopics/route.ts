import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: process.env.OPENAI_BASE_URL!,
});

export async function POST(request: Request) {
  const { message, sub, main } = await request.json();

  try {
    const response = await client.chat.completions.create({
      model: 'meta-llama/llama-3.3-70b-instruct:free',
      messages: [
        { 
          role: 'user', 
          content: `Provide detailed information about the subtopic "${sub}" under the topic "${message} which is part of "${main}" , be consice , write numbered points with topic to do in it, i don't want to process it more , dont send anything else than thesubtopics to explore the subtopic , just send normal text no highligting/bold . also at the end send 3-4 direct link to the topic  in format <a href="https://example.com/docs">Official Documentation</a> so it can displayed on my site. ".` 
        },
      ],
    });

    const content = response.choices[0].message.content ?? '';
    return new NextResponse(content, {
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: `Error: ${errorMessage}` }, { status: 500 });
  }
}