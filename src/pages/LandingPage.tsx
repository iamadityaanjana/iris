import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Twitter, AlertCircle } from 'lucide-react';
import {getFlowchart} from '../api/flow.js';

function LandingPage() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const words = e.target.value.trim().split(/\s+/);
    if (words.length <= 20) {
      setTopic(e.target.value);
    }
  };

  const wordCount = topic.trim().split(/\s+/).length;
  const wordsRemaining = 20 - wordCount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await getFlowchart(topic);
      const flowchartData = JSON.parse(response);
      sessionStorage.setItem('flowchartData', JSON.stringify(flowchartData));
      navigate('/flowchart');
    } catch (error) {
      console.error('Error generating flowchart:', error);
      setError('Failed to generate the roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 relative"
      style={{
        backgroundImage: 'url(https://i.postimg.cc/dV27rNxc/download-2.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0  " />
      
      <div className="absolute top-4 sm:top-8 left-4 sm:left-8 z-20">
        <h2 className="text-xl sm:text-2xl font-sora text-white font-semibold">Iris</h2>
      </div>
      
      <div className="relative z-10 w-full max-w-5xl px-4 text-center">
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-serif mb-4 sm:mb-6 black">
          <span className="italic font-light">Roadmaps</span> <span className="font-light">made easy.</span>
        </h1>
        <p className="text-lg sm:text-xl font-sora  mb-8 sm:mb-12 text-black">
          It's your journey, take it with confidence.
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 sm:gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={topic}
            onChange={handleInputChange}
            placeholder="Type any topic to generate roadmap"
            className="w-full flex-1 px-4 sm:px-6 py-3 rounded-full bg-white/90 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-800 placeholder-gray-500 font-sora"
            required
            disabled={loading}
          />
          <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-sm ${wordsRemaining <= 5 ? 'text-red-500' : 'text-gray-500'}`}>
                {wordsRemaining} words left
              </span>
              </div>
              <button
              type="submit"
              disabled={loading || wordCount === 0}
              className={`w-full sm:w-auto px-8 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors font-sora ${(loading || wordCount === 0) ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
          {error && (
            <div className="flex items-center justify-center gap-2 text-red-400 mt-2 font-sora">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </form>
      </div>

      <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 text-black/80 font-sora">
        <a
          href="https://x.com/iamAdityaAnjana"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-white transition-colors text-sm sm:text-base"
        >
          <Twitter size={20} />
          @iamAdityaAnjana
        </a>
      </footer>
    </div>
  );
}

export default LandingPage;