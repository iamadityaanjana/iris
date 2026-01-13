import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const isValidJSON = (str: string) => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

const getFlowchart = async (message: string) => {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
    baseURL: process.env.OPENAI_BASE_URL!,
  });

  let attempts = 0;
  
  while (attempts < MAX_RETRIES) {
    try {
      const response = await client.chat.completions.create({
        model: 'nvidia/nemotron-3-nano-30b-a3b:free',
        max_tokens: 4000,
        messages: [
          { 
            role: 'user', 
            content: `i want to create a roadmap usnig flowchart on topic "${message}" , give me detailed roadmap of topics and subtopics to master it , assume you are master at at that thing. return a json object only nothing else. The main topics as parents and other as subtopics.if user enter gibberish topics or anything which does not make sense to you, return sarcastic topics in same json format .The Json object should be in format "
{
  "topic 1": [
     "subtopic 1",
    "subtopic 2",
    "subtopic 3",
  and so on
  ],
  "topic 2": [
     "subtopic 1",
    "subtopic 2",
    "subtopic 3",
and so on
    ]}" , return a json object only nothing else` 
          },
        ],
      });
      
      const content = response.choices[0].message.content ?? '';
      
      if (isValidJSON(content)) {
        return content;
      }
      
      console.log(`Attempt ${attempts + 1}: Invalid JSON response, retrying...`);
      attempts++;
      
      if (attempts < MAX_RETRIES) {
        await delay(RETRY_DELAY);
      }
    } catch (error) {
      console.error(`Attempt ${attempts + 1} failed:`, error);
      attempts++;
      
      if (attempts < MAX_RETRIES) {
        await delay(RETRY_DELAY);
      }
    }
  }

  throw new Error('Failed to get valid JSON response after maximum retries');
};

export async function POST(request: Request) {
  const { message } = await request.json();

  if (typeof message !== 'string') {
    return NextResponse.json({ error: 'Invalid request: "message" must be a string' }, { status: 400 });
  }

  try {
    const flowchart = await getFlowchart(message);
    return new NextResponse(flowchart, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: `Error: ${errorMessage}` }, { status: 500 });
  }
}