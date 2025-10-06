'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Download, ArrowLeft, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import type { FlowchartData } from '@/types/flowchart';

export default function SharedFlowchartPage({ params }: { params: { id: string } }) {
  const [flowchartData, setFlowchartData] = useState<FlowchartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFlowchart = async () => {
      try {
        const response = await fetch(`/api/share?id=${params.id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch flowchart');
        }

        setFlowchartData(data.data.data);
      } catch (error) {
        console.error('Error fetching shared flowchart:', error);
        setError('Failed to load the flowchart. It may have expired or been deleted.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlowchart();
  }, [params.id]);

  const handleDownload = async () => {
    if (!flowchartRef.current) return;

    try {
      const canvas = await html2canvas(flowchartRef.current);
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'flowchart.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error downloading flowchart:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  if (error || !flowchartData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-400">Error</h1>
          <p>{error || 'Flowchart not found'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <button
        onClick={() => router.push('/')}
        className="mb-8 flex items-center text-gray-400 hover:text-white"
      >
        <ArrowLeft className="mr-2" size={20} />
        Back to Home
      </button>

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Shared Roadmap</h1>
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition-colors"
          >
            <Download className="inline-block mr-2" size={20} />
            Download
          </button>
        </div>

        <div ref={flowchartRef} className="space-y-6">
          {Object.entries(flowchartData).map(([topic, subtopics]) => (
            <div key={topic} className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">{topic}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subtopics.map((subtopic) => (
                  <div
                    key={subtopic}
                    className="bg-gray-700 rounded-lg p-4 flex items-center justify-between"
                  >
                    <span>{subtopic}</span>
                    <ChevronRight size={20} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );