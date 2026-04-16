import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Scanner } from './components/Scanner';
import { XRayUpload } from './components/XRayUpload';
import { Features } from './components/Features';
import { SimpleStats } from './components/SimpleStats';
import { Footer } from './components/Footer';


export const Home = ({ onNavigate, onScanComplete }: { onNavigate: (page: string) => void; onScanComplete: (result: any) => void }) => {
  return (
    <>
      <Hero onNavigate={onNavigate} />
      <Scanner />
      <XRayUpload onScanComplete={onScanComplete} />
      <Features />
      <SimpleStats />
    </>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = React.useState('home');
  const [scanData, setScanData] = React.useState<any>(null);
  const [user, setUser] = React.useState<any>(null);

  const handleScanComplete = (result: any) => {
    setScanData(result);
    setCurrentPage('scan-report');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'platform': return <Platform />;
      case 'clinical': return <Clinical />;
      case 'safety': return <Safety />;
      case 'neural': return <NeuralNetwork />;
      case 'login': return <Login onNavigate={handleNavigate} onLogin={handleLogin} />;
      case 'dashboard': return <Dashboard user={user} onNavigate={handleNavigate} onLogout={handleLogout} onScanComplete={handleScanComplete} />;
      case 'scan-report': return <ScanReport scanData={scanData} onNavigate={handleNavigate} />;
      default: return <Home onNavigate={handleNavigate} onScanComplete={handleScanComplete} />;
    }
  };

  return (
    <ThemeProvider>
      <main className="relative min-h-screen bg-white dark:bg-[#02010a] text-zinc-900 dark:text-zinc-100 selection:bg-cyan-500/30 selection:text-white overflow-x-hidden font-sans transition-colors duration-500">
        {/* Global Flare Background Overlay */}
        <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_20%_30%,rgba(6,182,212,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.08)_0%,transparent_50%),radial-gradient(circle_at_60%_20%,rgba(168,85,247,0.04)_0%,transparent_40%)]" />

        {/* High-quality noise texture */}
        <div className="fixed inset-0 z-[100] pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]" />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar onNavigate={handleNavigate} current={currentPage} />
          <div className="flex-grow">
            {renderPage()}
          </div>
          <Footer onNavigate={handleNavigate} />
        </div>
      </main>
    </ThemeProvider>
  );
}

// Imports at the bottom to avoid circular or early access issues in this single file demo style
import { Platform } from './pages/Platform';
import { Clinical } from './pages/Clinical';
import { Safety } from './pages/Safety';
import { NeuralNetwork } from './pages/NeuralNetwork';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ScanReport } from './pages/ScanReport';
import { ThemeProvider } from './context/ThemeContext';
