export type FlowchartData = {
  [key: string]: string[];
};

export type SubtopicDetails = {
  topic: string;
  subtopic: string;
  content: string;
};

export interface FlowchartResponse {
  data: FlowchartData;
  error?: string;
}

export interface ShareResponse {
  success: boolean;
  error?: string;
}

declare global {
  var mongoose: {
    conn: typeof import('mongoose') | null;
    promise: Promise<typeof import('mongoose')> | null;
  };
}