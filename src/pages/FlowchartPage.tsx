import  { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Download, ArrowLeft } from 'lucide-react';
import html2canvas from 'html2canvas';


type FlowchartData = {
  [key: string]: string[];
};

function FlowchartPage() {
  const [flowchartData, setFlowchartData] = useState<FlowchartData | null>(null);
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

  const downloadAsPNG = async () => {
    if (!flowchartRef.current) return;
    
    const canvas = await html2canvas(flowchartRef.current);
    const link = document.createElement('a');
    link.download = 'roadmap.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  

  if (!flowchartData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-8">
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
          
          <div className="flex gap-3 sm:gap-4 font-sora w-full sm:w-auto">
            <button
              onClick={downloadAsPNG}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-sm sm:text-base"
            >
              <Download size={20} />
              <span className="hidden sm:inline">Download PNG</span> 
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 overflow-x-auto">
          <div ref={flowchartRef} className="min-w-[800px] sm:min-w-[1000px]">
            <div className="flex flex-col items-center space-y-12 relative">
              <div className="absolute top-0 bottom-0 w-1 bg-indigo-500 left-1/2 transform -translate-x-1/2" />
              
              {Object.entries(flowchartData).map(([topic, subtopics]) => (
                <div key={topic} className="w-full">
                  <div className="relative">
                    <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-300 px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-md border-2 border-yellow-400 z-10">
                      <h2 className="text-base sm:text-lg font-sora font-semibold text-gray-800">{topic}</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:gap-8 pt-12">
                      <div className="space-y-3 sm:space-y-4">
                        {subtopics.slice(0, Math.ceil(subtopics.length / 2)).map((subtopic) => (
                          <div key={subtopic} className="flex items-center justify-end">
                            <div className="bg-orange-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow border border-orange-200 transform hover:scale-105 transition-transform font-sora text-sm sm:text-base">
                              {subtopic}
                            </div>
                            <ChevronRight className="text-blue-400 ml-2" size={16} />
                          </div>
                        ))}
                      </div>
                      <div className="space-y-3 sm:space-y-4">
                        {subtopics.slice(Math.ceil(subtopics.length / 2)).map((subtopic) => (
                          <div key={subtopic} className="flex items-center">
                            <ChevronRight className="text-blue-400 mr-2" size={16} />
                            <div className="bg-orange-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow border border-orange-200 transform hover:scale-105 transition-transform font-sora text-sm sm:text-base">
                              {subtopic}
                            </div>
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
  );
}

export default FlowchartPage;