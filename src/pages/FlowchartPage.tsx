import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Download, ArrowLeft, X } from 'lucide-react';
import html2canvas from 'html2canvas';

type FlowchartData = {
  [key: string]: string[];
};

type SubtopicDetails = {
  topic: string;
  subtopic: string;
  content: string;
};

function FlowchartPage() {
  const [flowchartData, setFlowchartData] = useState<FlowchartData | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<SubtopicDetails | null>(null);
  const navigate = useNavigate();
  const flowchartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const data = sessionStorage.getItem('flowchartData');
    if (!data) {
      navigate('/');
      return;
    }
    setFlowchartData(JSON.parse(data));
  }, [navigate]);

  const getSubtopicDetails = async (topic: string, subtopic: string) => {
    try {
      
      
      const Responses = await fetch('https://iris-server-production.up.railway.app/get-subtopics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: topic, sub: subtopic }),
      });

      const responseData = await Responses.text();
      return {
        topic,
        subtopic,
        content: `
• Overview of ${subtopic}
 ${responseData}
  `
      };
    } catch (error) {
      console.error('Error generating subtopic content:', error);
      return {
        topic,
        subtopic,
        content: 'Error loading content'
      };
    }
  };

  const handleSubtopicClick = async (topic: string, subtopic: string) => {
      const details =  getSubtopicDetails(topic, subtopic);
      setSelectedSubtopic(await details);
    };

  const downloadAsPNG = async () => {
    if (!flowchartRef.current) return;

    const canvas = await html2canvas(flowchartRef.current, {
      scrollY: -window.scrollY,
      windowWidth: flowchartRef.current.scrollWidth,
      windowHeight: flowchartRef.current.scrollHeight,
      width: flowchartRef.current.scrollWidth,
      height: flowchartRef.current.scrollHeight,
    });
    
    const link = document.createElement('a');
    link.download = 'roadmap.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  if (!flowchartData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Sliding Panel - Moved to right side */}
      <div 
        className={`fixed right-0 top-0 h-full w-80 sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          selectedSubtopic ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedSubtopic && (
          <div className="h-full flex flex-col">
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 font-sora">{selectedSubtopic.subtopic}</h3>
                  <p className="text-sm text-gray-500 font-sora">Part of {selectedSubtopic.topic}</p>
                </div>
                <button 
                  onClick={() => setSelectedSubtopic(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sora text-sm text-gray-700">{selectedSubtopic.content}</pre>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 w-full sm:w-auto">
              <h2 className="text-xl sm:text-2xl font-sora font-semibold">Iris</h2>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors font-sora"
              >
                <ArrowLeft size={20} />
                Back to Home
              </button>
            </div>
            
            <button
              onClick={downloadAsPNG}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-sm sm:text-base font-sora"
            >
              <Download size={18} />
              <span className="hidden sm:inline">Download</span> PNG
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 overflow-x-auto">
            <div ref={flowchartRef} className="min-w-[300px] w-full max-w-[800px] mx-auto">
              <div className="flex flex-col items-center space-y-12 relative">
                <div className="absolute top-0 bottom-0 w-1 bg-indigo-500 left-1/2 transform -translate-x-1/2" />
                
                {Object.entries(flowchartData).map(([topic, subtopics]) => (
                  <div key={topic} className="w-full">
                    <div className="relative">
                      <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-300 px-3 sm:px-6 py-2 sm:py-3 rounded-lg shadow-md border-2 border-yellow-400 z-10">
                        <h2 className="text-sm sm:text-lg font-sora font-semibold text-gray-800">{topic}</h2>
                      </div>
                      <div className="grid grid-cols-2 gap-2 sm:gap-8 pt-12">
                        <div className="space-y-2 sm:space-y-4">
                          {subtopics.slice(0, Math.ceil(subtopics.length / 2)).map((subtopic) => (
                            <div key={subtopic} className="flex items-center justify-end">
                              <button
                                onClick={() => handleSubtopicClick(topic, subtopic)}
                                className="bg-orange-100 px-2 sm:px-4 py-1 sm:py-2 rounded-lg shadow border border-orange-200 transform hover:scale-105 transition-transform font-sora text-xs sm:text-base text-left"
                              >
                                {subtopic}
                              </button>
                              <ChevronRight className="text-blue-400 ml-2" size={14} />
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2 sm:space-y-4">
                          {subtopics.slice(Math.ceil(subtopics.length / 2)).map((subtopic) => (
                            <div key={subtopic} className="flex items-center">
                              <ChevronRight className="text-blue-400 mr-2" size={14} />
                              <button
                                onClick={() => handleSubtopicClick(topic, subtopic)}
                                className="bg-orange-100 px-2 sm:px-4 py-1 sm:py-2 rounded-lg shadow border border-orange-200 transform hover:scale-105 transition-transform font-sora text-xs sm:text-base text-left"
                              >
                                {subtopic}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlowchartPage;