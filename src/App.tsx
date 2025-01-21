import { Analytics } from '@vercel/analytics/react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import FlowchartPage from './pages/FlowchartPage';
import { SpeedInsights } from '@vercel/speed-insights/react';


function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/flowchart" element={<FlowchartPage />} />
    </Routes>
    <Analytics />
    <SpeedInsights />
    </>
  );
}

export default App;