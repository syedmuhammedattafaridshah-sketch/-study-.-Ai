import React, { useState, useEffect, useRef } from 'react';
import { Header } from './Header';
import { UploadSection } from './UploadSection';
import { ConfigPanel } from './ConfigPanel';
import { TestPreview } from './TestPreview';
import { HeroSection } from './HeroSection';
import { StudyAIChat } from './StudyAIChat';
import { TutorialOverlay } from './TutorialOverlay';
import { AboutUs } from './AboutUs';
import { AdminPanel } from './AdminPanel';
import { generateTestFromContent } from './geminiService';
import { generatePDF } from './pdfService';
import { Difficulty, FileData, QuestionConfig, TestData, ViewMode, AdminConfig } from './types';

// Matrix Data Stream Loading View
const LoadingView = ({ log }: { log: string[] }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020617] animate-fade-in-up overflow-hidden font-sans">
    {/* Digital Rain Effect Background */}
    <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0)_0%,rgba(34,211,238,0.1)_50%,rgba(0,0,0,0)_100%)] opacity-20 bg-[length:100%_200%] animate-[scan_5s_linear_infinite]"></div>
    <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent animate-[dash_2s_linear_infinite]"></div>
        <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-blue-500/50 to-transparent animate-[dash_3s_linear_infinite]"></div>
        <div className="absolute top-0 left-1/3 w-[1px] h-full bg-gradient-to-b from-transparent via-purple-500/50 to-transparent animate-[dash_4s_linear_infinite]"></div>
        <div className="absolute top-0 right-1/3 w-[1px] h-full bg-gradient-to-b from-transparent via-pink-500/50 to-transparent animate-[dash_2.5s_linear_infinite]"></div>
    </div>

    <div className="relative z-10 w-full max-w-3xl flex flex-col items-center justify-center h-full">
       
       <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
          {/* Central Hexagon */}
          <div className="absolute inset-0 flex items-center justify-center">
             <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow opacity-60">
                 <path d="M50 5 L93 28 L93 72 L50 95 L7 72 L7 28 Z" fill="none" stroke="#22d3ee" strokeWidth="0.5" />
                 <path d="M50 15 L85 33 L85 67 L50 85 L15 67 L15 33 Z" fill="none" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="5 5" />
             </svg>
          </div>
          
          {/* Inner Pulsing Core */}
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-20 h-20 bg-cyan-500/10 rounded-full blur-xl animate-pulse"></div>
             <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_20px_rgba(34,211,238,1)] animate-ping"></div>
          </div>
          
          {/* Orbital Particles */}
          <div className="absolute w-full h-full animate-spin-reverse-slow">
              <div className="absolute top-10 left-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
              <div className="absolute bottom-10 left-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>
          </div>
       </div>

       <div className="text-center space-y-6 relative z-20 backdrop-blur-md p-8 rounded-3xl border border-white/5 bg-black/40 shadow-2xl w-full max-w-lg">
          
          <div className="flex flex-col items-center gap-2">
             <h2 className="text-3xl font-tech font-bold text-white tracking-[0.2em] animate-pulse">
                COMPILING
             </h2>
             <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-500 rounded-full animate-ping"></span>
                Processing Neural Data
             </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden relative">
             <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 animate-[shimmer_2s_infinite] w-full"></div>
          </div>

          <div className="h-24 flex flex-col items-start justify-end overflow-hidden w-full bg-black/50 rounded-lg p-4 font-mono text-[10px] border border-white/5 shadow-inner">
             {log.slice(-4).map((l, i) => (
                <p key={i} className="text-cyan-300/80 animate-fade-in-up w-full truncate border-l-2 border-cyan-500/50 pl-2 mb-1 last:text-white last:font-bold">
                   <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString('en-US',{hour12:false, hour:'2-digit', minute:'2-digit', second:'2-digit'} as any)}]</span>
                   {l}
                </p>
             ))}
          </div>
       </div>
    </div>
  </div>
);

const ConfirmModal = ({ onConfirm, onCancel }: { onConfirm: () => void, onCancel: () => void }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in-up">
     <div className="bg-[#0f172a] border border-cyan-500/30 rounded-3xl p-10 max-w-md w-full shadow-[0_0_80px_rgba(34,211,238,0.15)] relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600"></div>
        <div className="absolute inset-0 bg-circuit opacity-5 pointer-events-none"></div>
        
        <div className="text-center mb-8 relative z-10">
           <div className="w-16 h-16 bg-cyan-900/20 rounded-2xl border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
               </svg>
           </div>
           <h3 className="text-2xl font-tech font-bold text-white mb-2 tracking-wide">CONFIRM DOWNLOAD</h3>
           <p className="text-slate-400 text-sm leading-relaxed">
             The document has been compiled and secured. Proceed to export?
           </p>
        </div>
        
        <div className="flex gap-4 relative z-10">
           <button 
             onClick={onCancel}
             className="flex-1 py-4 px-6 rounded-2xl border border-slate-700 text-slate-400 font-mono text-xs hover:bg-slate-800 hover:text-white transition-colors uppercase tracking-wider"
           >
             Cancel
           </button>
           <button 
             onClick={onConfirm}
             className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold font-mono text-xs shadow-lg hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:scale-[1.02] transition-all uppercase tracking-wider flex items-center justify-center gap-2"
           >
             <span>Proceed</span>
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
               <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
             </svg>
           </button>
        </div>
     </div>
  </div>
);

const ViewToggleFAB = ({ mode, setMode }: { mode: ViewMode, setMode: (m: ViewMode) => void }) => (
    <button
      onClick={() => setMode(mode === 'generator' ? 'chat' : 'generator')}
      className="fixed bottom-8 right-8 z-40 group flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-600 shadow-[0_0_30px_rgba(34,211,238,0.4)] border border-white/20 hover:scale-110 transition-all duration-500 hover:rotate-12 overflow-hidden"
      title={mode === 'generator' ? "Switch to Study AI Chat" : "Switch to Generator"}
    >
      <div className="absolute inset-0 bg-white/20 group-hover:opacity-0 transition-opacity duration-300"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10 transition-transform duration-500">
          {mode === 'generator' ? (
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white drop-shadow-md">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
             </svg>
          ) : (
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white drop-shadow-md">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
             </svg>
          )}
      </div>
    </button>
);

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('generator');
  const [file, setFile] = useState<FileData | null>(null);
  const [textContext, setTextContext] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingLog, setLoadingLog] = useState<string[]>([]);
  const [generatedTest, setGeneratedTest] = useState<TestData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  
  const resultsRef = useRef<HTMLDivElement>(null);

  // Admin Configuration Persistence
  const [adminConfig, setAdminConfig] = useState<AdminConfig>(() => {
    try {
        const saved = localStorage.getItem('study_ai_admin_config');
        return saved ? JSON.parse(saved) : {
            ownerName: "Muhammad Atta Farid Shah",
            ownerBio: "2nd Year Student & Visionary Developer passionate about bridging the gap between artificial intelligence and education.",
            profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
        };
    } catch {
        return {
            ownerName: "Muhammad Atta Farid Shah",
            ownerBio: "2nd Year Student & Visionary Developer passionate about bridging the gap between artificial intelligence and education.",
            profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
        };
    }
  });

  useEffect(() => {
    localStorage.setItem('study_ai_admin_config', JSON.stringify(adminConfig));
  }, [adminConfig]);

  const [config, setConfig] = useState<QuestionConfig>(() => {
    try {
      const saved = localStorage.getItem('study_ai_config');
      return saved ? JSON.parse(saved) : {
        mcqCount: 5,
        shortQCount: 3,
        longQCount: 1, 
        tfCount: 5,
        blankCount: 5,
        essayCount: 1,
        matchCount: 4,
        difficulty: Difficulty.Medium,
        topicFocus: '',
        pdfSubtitle: '',
        examName: '',
        watermarkText: '',
        watermarkOpacity: 0.1
      };
    } catch {
       return {
        mcqCount: 5,
        shortQCount: 3,
        longQCount: 1,
        tfCount: 5,
        blankCount: 5,
        essayCount: 1,
        matchCount: 4,
        difficulty: Difficulty.Medium,
        topicFocus: '',
        pdfSubtitle: '',
        examName: '',
        watermarkText: '',
        watermarkOpacity: 0.1
       };
    }
  });

  useEffect(() => {
    localStorage.setItem('study_ai_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('study_ai_tutorial_seen');
    if (!hasSeenTutorial) {
      setTimeout(() => setShowTutorial(true), 1500); 
      localStorage.setItem('study_ai_tutorial_seen', 'true');
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      setLoadingLog([]);
      return;
    }
    const steps = [
      "Initialising Neural Core...",
      "Encrypting Input Stream...",
      "Analyzing Context Vectors...",
      "Extracting Key Concepts...",
      "Synthesizing Questions...",
      "Verifying Logic Chains...",
      "Formatting Output Structure...",
      "Finalizing Secure Packet..."
    ];
    setLoadingLog([steps[0]]);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < steps.length) {
        setLoadingLog(prev => [...prev.slice(-4), steps[i]]); 
      }
    }, 800);
    return () => clearInterval(interval);
  }, [loading]);

  const handleGenerate = async () => {
    if (!file && !textContext.trim()) {
      setError("NO_INPUT_DETECTED: Please upload a file or enter a text prompt to proceed.");
      return;
    }
    setError(null);
    setLoading(true);
    setGeneratedTest(null);

    try {
      const data = await generateTestFromContent(file, textContext, config);
      setGeneratedTest(data);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "CRITICAL_FAILURE: Neural engine could not process request.");
    } finally {
      setLoading(false);
    }
  };

  const handleTestUpdate = (updatedTest: TestData) => {
    setGeneratedTest(updatedTest);
  };

  const handleDownloadClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmDownload = () => {
    setShowConfirm(false);
    if (generatedTest) {
      generatePDF(generatedTest, config.pdfSubtitle, config.examName, config.watermarkText, config.watermarkOpacity);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-200">
      <Header viewMode={viewMode} setViewMode={setViewMode} adminConfig={adminConfig} />
      
      {/* FAB works to toggle Chat/Gen primarily */}
      {(viewMode === 'generator' || viewMode === 'chat') && (
         <ViewToggleFAB mode={viewMode} setMode={setViewMode} />
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 lg:p-10 space-y-10 relative z-10 pb-24">
        
        {showTutorial && <TutorialOverlay onClose={() => setShowTutorial(false)} />}
        
        {viewMode === 'chat' && (
           <div className="w-full h-full min-h-[80vh] relative animate-fade-in-up">
              <StudyAIChat onClose={() => setViewMode('generator')} />
           </div>
        )}

        {viewMode === 'about' && (
            <AboutUs config={adminConfig} />
        )}

        {viewMode === 'admin' && (
            <AdminPanel config={adminConfig} onUpdateConfig={setAdminConfig} />
        )}

        {viewMode === 'generator' && (
          <div className="animate-fade-in-up">
            <HeroSection />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
              
              <div id="upload-section" className="lg:col-span-4 flex flex-col h-full">
                <UploadSection 
                  file={file} 
                  setFile={setFile} 
                  textContext={textContext} 
                  setTextContext={setTextContext}
                  disabled={loading} 
                />
              </div>
              
              <div className="lg:col-span-8 flex flex-col gap-8">
                <div id="config-panel" className="flex-1">
                  <ConfigPanel 
                    config={config} 
                    setConfig={setConfig} 
                    disabled={loading} 
                  />
                </div>
                
                <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 border-cyan-500 shadow-lg shadow-cyan-900/10 hover:shadow-cyan-500/20 transition-all group backdrop-blur-xl">
                   <div className="flex-1 w-full">
                     <div className="flex items-center gap-3 font-mono text-xs md:text-sm text-cyan-400">
                         <span className="relative flex h-3 w-3">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 ${loading ? 'hidden' : ''}`}></span>
                            <span className={`relative inline-flex rounded-full h-3 w-3 ${loading ? 'bg-amber-500' : 'bg-cyan-500'}`}></span>
                         </span>
                         <span>{loading ? 'STATUS: PROCESSING...' : 'STATUS: READY FOR INITIATION.'}</span>
                     </div>
                   </div>

                   <button
                     id="generate-btn"
                     onClick={handleGenerate}
                     disabled={loading}
                     className={`
                       relative overflow-hidden w-full md:w-auto px-10 py-4 rounded-xl font-tech font-bold tracking-widest uppercase transition-all flex-shrink-0 shadow-xl border border-transparent
                       ${loading 
                         ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                         : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] hover:scale-105 active:scale-95 hover:border-cyan-400/50'}
                     `}
                   >
                     <span className="relative z-10 flex items-center gap-2">
                       {loading ? 'PROCESSING' : 'GENERATE TEST'}
                       {!loading && (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                          </svg>
                       )}
                     </span>
                     {!loading && <div className="absolute inset-0 h-full w-full scale-0 rounded-xl transition-all duration-300 group-hover:scale-100 group-hover:bg-cyan-500/20 mix-blend-overlay"></div>}
                   </button>
                </div>
              </div>
            </div>

            {loading && <LoadingView log={loadingLog} />}

            {error && (
              <div className="bg-red-950/40 border border-red-500/30 text-red-200 px-8 py-6 rounded-2xl flex items-start gap-6 backdrop-blur-md animate-fade-in-up shadow-xl mt-8">
                <div className="p-3 bg-red-900/30 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-red-500">
                      <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                    </svg>
                </div>
                <div>
                   <h4 className="font-tech font-bold text-red-400 mb-2 text-lg">ERROR: GENERATION FAILED</h4>
                   <p className="font-mono text-sm leading-relaxed text-red-200/80">{error}</p>
                </div>
              </div>
            )}

            {generatedTest && (
              <div ref={resultsRef} className="animate-fade-in-up space-y-8 pb-20 pt-8 border-t border-white/10 mt-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                     <h2 className="text-3xl font-tech font-bold text-white text-glow">GENERATED_OUTPUT</h2>
                     <p className="text-cyan-500/60 font-mono text-xs mt-1 tracking-widest uppercase">Review Mode Active • Verify Before Download</p>
                  </div>
                  <button
                    onClick={handleDownloadClick}
                    className="relative overflow-hidden group flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-xl text-sm font-bold font-mono tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] hover:scale-105 hover:bg-cyan-50"
                  >
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent z-10"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 relative z-20 text-cyan-700">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 12.75l-3-3m0 0l3-3m-3 3h7.5" />
                    </svg>
                    <span className="relative z-20 text-cyan-900">DOWNLOAD PDF</span>
                  </button>
                </div>
                
                <div className="relative p-2 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-sm">
                   <TestPreview data={generatedTest} onUpdate={handleTestUpdate} />
                </div>
              </div>
            )}
            
            {showConfirm && (
                <ConfirmModal onConfirm={handleConfirmDownload} onCancel={() => setShowConfirm(false)} />
            )}
          </div>
        )}
      </main>

      {/* Footer Credits */}
      <footer className="w-full text-center py-6 border-t border-white/5 bg-black/40 backdrop-blur-md relative z-10">
         <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-2">
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.3em]">
               System Architected & Created By
            </p>
            <p className="text-sm font-tech font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 tracking-wider">
               MUHAMMAD ATTA FARID SHAH
            </p>
         </div>
      </footer>
    </div>
  );
}

export default App;