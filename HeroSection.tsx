import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <div className="w-full mb-8 relative overflow-hidden rounded-xl border border-cyan-900/30 bg-gray-900/30 backdrop-blur-sm">
      <div className="absolute inset-0 bg-circuit opacity-30"></div>
      
      <div className="relative z-10 px-6 py-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Branding & Info */}
        <div className="max-w-xl">
          <h2 className="text-sm font-mono text-cyan-400 mb-2 uppercase tracking-widest">
            <span className="text-cyan-700 mr-2">//</span>System Architecture
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Direct interface established. Upload course material to engage <span className="text-white font-bold">Study AI</span> neural processing. 
            Content is securely piped to the <span className="text-white font-bold">Study AI Neural Core</span> for semantic analysis and assessment generation.
          </p>
        </div>

        {/* Right: Connection Visualization */}
        <div className="flex-1 w-full max-w-md h-24 relative flex items-center justify-between px-4">
           {/* Connecting Line Background */}
           <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-800 -translate-y-1/2 z-0"></div>
           
           {/* Animated Data Packet */}
           <div className="absolute top-1/2 left-0 h-[2px] w-20 bg-gradient-to-r from-transparent via-cyan-400 to-transparent -translate-y-1/2 z-0 animate-scan" style={{animationDuration: '3s'}}></div>

           {/* Node 1: User */}
           <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-600 flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <span className="text-[10px] font-mono text-gray-500 uppercase">Input</span>
           </div>

           {/* Node 2: Study AI */}
           <div className="relative z-10 flex flex-col items-center gap-2 animate-float">
              <div className="w-14 h-14 rounded-full bg-gray-900 border-2 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center justify-center relative">
                 <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping opacity-20"></div>
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-cyan-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                 </svg>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase text-glow">Study AI</span>
           </div>

           {/* Node 3: Core Engine */}
           <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gray-800 border border-blue-500/50 flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-400" fill="currentColor">
                   <path d="M12 2C12 2 10.5 8 6 12C10.5 16 12 22 12 22C12 22 13.5 16 18 12C13.5 8 12 2 12 2Z" />
                </svg>
              </div>
              <span className="text-[10px] font-mono text-blue-400 uppercase">Neural Core</span>
           </div>
        </div>
      </div>
    </div>
  );
};