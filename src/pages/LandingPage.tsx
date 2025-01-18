import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Twitter } from 'lucide-react';


function LandingPage() {
  const [topic, setTopic] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    
    const Response = {
    };

    // Store the data in sessionStorage
    sessionStorage.setItem('flowchartData', JSON.stringify(Response));
    navigate('/flowchart');
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
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Type any topic to generate roadmap"
            className="w-full flex-1 px-4 sm:px-6 py-3 rounded-full bg-white/90 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-800 placeholder-gray-500 font-sora"
            required
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors font-sora"
          >
            Generate
          </button>
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