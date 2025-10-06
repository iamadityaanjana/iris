import mongoose from 'mongoose';

export interface IFlowchart extends mongoose.Document {
  topic: string;
  id: string;
  data: Record<string, string[]>;
  createdAt: Date;
}

const flowchartSchema = new mongoose.Schema<IFlowchart>({
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

export const Flowchart = mongoose.models.Flowchart || mongoose.model<IFlowchart>('Flowchart', flowchartSchema);