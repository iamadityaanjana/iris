import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: import.meta.env.VITE_TOGETHER_API_KEY,
  baseURL: 'https://api.together.xyz/v1',
  dangerouslyAllowBrowser: true
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const isValidJSON = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

export const getFlowchart = async (message: string): Promise<string> => {
  let attempts = 0;
  
  while (attempts < MAX_RETRIES) {
    try {
      const response = await client.chat.completions.create({
        model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
        messages: [
          { 
            role: 'user', 
            content: `i want to create a roadmap usnig flowchart on topic "${message}" , give me detailed roadmap of topics and subtopics to master it. return a json object only nothing else. The main topics as parents and other as subtopics.if user enter gibberish topics , return sarcastic topics in same json format the Json object should be in format "
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