import  { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, Download, ArrowLeft, X, Loader2, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';
import { nanoid } from 'nanoid';



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
  const [loading, setLoading] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const flowchartRef = useRef<HTMLDivElement>(null);


  const handleShare = async () => {
    if (!flowchartData) return;

    try {
      setLoading(true);
      const id = nanoid(10);
      
      const response = await fetch('https://obscure-river-35675-a72663b1ec8d.herokuapp.com/api/flowcharts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic:sessionStorage.getItem('topic'),
          id,
          data: flowchartData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save flowchart');
      }

      const shareUrl = `${window.location.origin}/flowchart?id=${id}`;
      setShareUrl(shareUrl);
      setShareModalOpen(true);
    } catch (error) {
      console.error('Error sharing flowchart:', error);
      alert('Failed to share flowchart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };
  
  useEffect(() => {
    const loadFlowchart = async () => {
      const searchParams = new URLSearchParams(location.search);
      const id = searchParams.get('id');

      if (id) {
        try {
          const response = await fetch(`https://obscure-river-35675-a72663b1ec8d.herokuapp.com/api/flowcharts/${id}`);
          if (response.ok) {
            const data = await response.json();
            setFlowchartData(data.data);
            sessionStorage.setItem('topic',JSON.stringify(data.topic))
            return;
          }
        } catch (error) {
          console.error('Error loading shared flowchart:', error);
        }
      }

      const data = sessionStorage.getItem('flowchartData');
      if (!data) {
        navigate('/');
        return;
      }
      setFlowchartData(JSON.parse(data));
    };

    loadFlowchart();
  }, [navigate, location]);

  const getSubtopicDetails = async (topic: string, subtopic: string) => {
    try {
      
      const Maintopic = sessionStorage.getItem('topic') ;
      const Responses = await fetch('https://obscure-river-35675-a72663b1ec8d.herokuapp.com/get-subtopics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: topic, sub: subtopic , main: Maintopic}),
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
    setLoading(true);
    try {
      const details = await getSubtopicDetails(topic, subtopic);
      // const details = getSubtopicDetails(topic, subtopic);
      setSelectedSubtopic(details);
    } finally {
      setLoading(false);
    }
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

  const renderContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.includes('<a href=')) {
        return (
          <a
            key={index}
            href={line.match(/href="([^"]*)"/)![1]}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors mb-2"
          >
            <p className="text-sm font-medium text-gray-900 font-sora">
              {line.match(/>([^<]*)<\/a>/)![1]}
            </p>
            <p className="text-xs text-gray-500 mt-1 truncate font-sora">
              {line.match(/href="([^"]*)"/)![1]}
            </p>
          </a>
        );
      }
      return (
        <div key={index} className="whitespace-pre-wrap font-sora text-sm text-gray-700">
          {line}
        </div>
      );
    });
  };

  if (!flowchartData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Share Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Share Flowchart</h3>
            <div className="flex justify-center mb-4">
              <QRCodeSVG value={shareUrl} size={200} />
            </div>
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Copy
              </button>
            </div>
            <button
              onClick={() => setShareModalOpen(false)}
              className="w-full px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Sliding Panel */}
      <div 
        className={`fixed right-0 top-0 h-full w-80 sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          selectedSubtopic || loading ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="mt-4 text-gray-600 font-sora">Loading details...</p>
          </div>
        ) : selectedSubtopic && (
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
                {renderContent(selectedSubtopic.content)}
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
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-sm sm:text-base font-sora"
                disabled={loading}
              >
                <Share2 size={18} />
                <span className="hidden sm:inline">Share</span>
              </button>
              <button
                onClick={downloadAsPNG}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-sm sm:text-base font-sora"
              >
                <Download size={18} />
                <span className="hidden sm:inline">Download</span> PNG
              </button>
            </div>
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